/* eslint-disable @typescript-eslint/ban-ts-comment */
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { log } from 'console';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { AllExceptionsFilterWithWs } from './filter/allExceptions.filter';
import { TestDto } from './dto/test.dto';

// 默认可以WebSocketGateway(80,options) 这个port 可指定若不指定就是 同样的port 监听
// @WebSocketGateway({
//   transports: ['websocket'],
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// })
@WebSocketGateway(3001)
export class EventsGateway {
  // 直接访问原生的、特定于平台的服务器实例
  @WebSocketServer()
  server: Server;

  // 如果有人发消息 就会触发 这个 handler
  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): any {
    const sendData = { ...data, message: 'Servier return you ' };
    // 1 -------- 如果你使用的是 nest 默认提供的 socket
    // return 不会有效 请看 issues https://github.com/nestjs/nest/issues/11439
    // 处理办法 emit
    // client.emit('message', sendData);
    // from([1, 2, 3, 4])
    //   .pipe(map((data) => data))
    //   .subscribe((res) => {
    //     client.emit('events', res);
    //   });

    // 2 -------- 如果你import { WsAdapter } from '@nestjs/platform-ws';
    //  return 是有效的，且不是emit 而是send string!
    // 另外 返回的数据只有一段string 如果需要实现 nameSpace 需要自己去整 socket.io 则要简单些
    client.send(JSON.stringify(sendData));
    // return JSON.stringify(sendData)
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  // 以下是三个 WebSocketGateway生命周期hook
  afterInit() {
    log('OnGatewayInit');
  }

  handleConnection(client: any) {
    log('OnGatewayConnection');
  }

  handleDisconnect() {
    log('OnGatewayDisconnect');
  }

  // 若你抛error 请使用 这样在 client 收的时候 就能收到，若想优雅请使用 fillter (需要自定义)
  // @SubscribeMessage('errorTest')
  // errDemo(@MessageBody() data: any, @ConnectedSocket() clinet: Socket) {
  //   throw new WsException('Invalid credentials.');
  // }
  @UseFilters(new AllExceptionsFilterWithWs())
  @SubscribeMessage('errorTest')
  errDemo(@MessageBody() data: any, @ConnectedSocket() clinet: Socket) {
    throw new Error('Invalid credentials.');
  }

  // 建议为 ws 自定义一个Pipe 让它 抛出 非http Exception
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('pipData')
  errDemo1(@MessageBody() data: TestDto, @ConnectedSocket() clinet: Socket) {
    clinet.emit('pipData', 'ok..vlidation success');
  }

  // Guards 和普通的一样(不演示了) 建议为 ws 自定义一个 Guards 让它 抛出 非HttpException
  // Interceptor 和普通的一样(不演示了) 建议为 ws 自定义一个 Interceptor 让它 抛出 非HttpException

  // 适配器adapter 先redis 详细见main.ts 试一下把这个消息推到redis

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any) {
    return this.server.to(payload.room).emit('msgToClient', payload);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, room: any): void {
    client.join(room.room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket, room: any): void {
    client.leave(room.room);
    client.emit('leftRoom', room);
  }

  // 再看看 原生Nodejs的ws 请看 handleEvent 2.要点说明 注意 client 需要换成 原生 的ws 且注意把 transports: ['websocket'],  加上

  // 纯手撸一个 adapter
  @SubscribeMessage('myAdapter')
  myAdapter(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    log('data', data);
    client.send('myAdapter', '7777777');
  }
}

import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { log } from 'console';
import { Socket } from 'dgram';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { AllExceptionsFilterWithWs } from './filter/allExceptions.filter';
import { TestDto } from './dto/test.dto';

// 默认可以WebSocketGateway(80,options) 这个port 可指定若不指定就是 同样的port 监听
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
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
    // client.emit('events', { ...data, message: 'Servier return you ' });
    // return data  请不要用return 请看这个 issues https://github.com/nestjs/nest/issues/11439

    // 如果你是 异步 的也可以支持 狐疑 from 是连发Array Item 哈，详见RXJS 更多的也请 参考RXJS
    from([1, 2, 3, 4])
      .pipe(map((data) => data))
      .subscribe((res) => {
        client.emit('events', { data: res, message: 'Servier return you ' });
      });
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  // 以下是三个 WebSocketGateway生命周期hook
  afterInit() {
    log('OnGatewayInit');
  }

  handleConnection() {
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

  // 适配器adapter
  //
}

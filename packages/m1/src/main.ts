import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'cats_queue',
        noAck: false,
        queueOptions: {
          durable: false,
          // 在RabbitMQ中，队列可以被声明为持久化（durable）或非持久化（durable: false）。当队列被声明为持久化时，
          // 它将在RabbitMQ服务器重启后仍然存在。但是，如果队列被声明为非持久化，那么它将在服务器重启后消失。
          // 因此，如果您希望您的队列在服务器重启后仍然存在，您应该将其声明为持久化。
        },
      },
    },
  );
  await app.listen();
}
bootstrap();

import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GRPCController } from './gRPC.controller';
import { KafkaController } from './kafka.controller';
import { grpcClientOptions } from './options';

@Module({
  imports: [],
  // controllers: [AppController],
  controllers: [GRPCController],
  providers: [],
})
export class AppModule {}

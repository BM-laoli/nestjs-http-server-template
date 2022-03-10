import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController], 
  providers: [AppService],  // 声明provider
})
export class AppModule {}

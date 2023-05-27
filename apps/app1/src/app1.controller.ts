import { Controller, Get } from '@nestjs/common';
import { App1Service } from './app1.service';

@Controller()
export class App1Controller {
  constructor(private readonly app1Service: App1Service) {}

  @Get()
  getHello(): string {
    return this.app1Service.getHello();
  }
}

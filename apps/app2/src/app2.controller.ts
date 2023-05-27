import { Controller, Get } from '@nestjs/common';
import { App2Service } from './app2.service';
import { randomText } from '@app/app';
@Controller()
export class App2Controller {
  constructor(private readonly app2Service: App2Service) {}

  @Get()
  getHello(): string {
    return randomText();
  }
}

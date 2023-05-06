import { Controller, Get, Scope } from '@nestjs/common';
import { CarService } from './car.service';

@Controller({
  path: 'car',
  scope: Scope.REQUEST,
})
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  getHello() {
    return this.carService.getHello();
  }

  @Get('/findAll')
  findAll() {
    return this.carService.findAll();
  }
}

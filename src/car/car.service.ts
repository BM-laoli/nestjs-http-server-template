import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CarService {
  getHello(): string {
    return 'Hello Car';
  }
  findAll(): string {
    return 'findAll';
  }
}

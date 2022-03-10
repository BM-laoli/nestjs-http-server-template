import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  getHello(): string {
    return 'tag Hello World!';
  }
}

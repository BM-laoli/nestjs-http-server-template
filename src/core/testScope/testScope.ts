import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestLogger {
  constructor() {
    console.log('RequestLogger init');
  }

  public log(message: string) {
    console.log('message', message);
  }
}

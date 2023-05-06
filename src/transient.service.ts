import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TransientService {
  transientService_method(value: string): string {
    console.log(value);

    return value;
  }
}

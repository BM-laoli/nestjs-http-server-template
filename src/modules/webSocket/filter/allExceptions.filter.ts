import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class AllExceptionsFilterWithWs extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // + 各种花里胡哨的逻辑
    super.catch(exception, host);
  }
}

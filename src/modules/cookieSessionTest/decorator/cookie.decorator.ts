import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const requestVal = Object.entries(request.cookies).length
      ? request.cookies
      : request.signedCookies;
    return data ? requestVal?.[data] : requestVal;
  },
);

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class MyAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //    在这里取metadata中的no-auth，得到的会是一个bool
    const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler());

    const guard = MyAuthGuard.getAuthGuard(noAuth);
    if (noAuth) {
      return true;
    } else {
      return guard.canActivate(context); //    执行所选策略Guard的canActivate方法
    }
  }

  //    根据NoAuth的t/f选择合适的策略Guard
  private static getAuthGuard(noAuth: boolean): IAuthGuard {
    return new (AuthGuard('jwt'))();
  }
}

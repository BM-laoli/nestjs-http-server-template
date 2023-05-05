import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constants/RBAC';
import { ROLES_KEY } from '../decorator/rbac.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1.通过反射获取到装饰器的权限
    // getAllAndOverride读取路由上的metadata getAllAndMerge合并路由上的metadata
    const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('requireRoles info', requireRoles);

    // 2.获取req拿到鉴权后的用户数据
    const req = context.switchToHttp().getRequest();

    // // 3.通过用户数据从数据查询权限
    const user = await Promise.resolve({ roles: [{ id: 1, text: 'admin' }] });
    const roleIds = user.roles.map((item) => item.id);

    // 4.判断用户权限是否为装饰器的权限 的some返回boolean
    const flag = requireRoles.some((role) => roleIds.includes(role));

    return flag;
  }
}

import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/RBAC';

export const ROLES_KEY = 'roles';

// 装饰器Roles SetMetadata将装饰器的值缓存
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

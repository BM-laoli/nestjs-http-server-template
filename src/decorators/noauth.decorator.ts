import { SetMetadata } from '@nestjs/common';

// 三种 一种仅 观察jwt，另一种观察 role ，还有一种啥都不需要
export const NotAuth = () => SetMetadata('no-auth', true);

// src/logical/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // 本地local的策略于jwt关系不大，
    console.log('你要调用我哈------------');
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException({
        code: 401,
        message: '权限验证失败',
        data: null,
        success: false,
      });
    }
    return user;
  }
}

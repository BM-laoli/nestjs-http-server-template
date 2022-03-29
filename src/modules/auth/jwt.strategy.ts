// src/logical/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { CacheService } from '../cache/cache.service';
import { debug } from 'console';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly CacheService: CacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  // JWT验证 - Step 4: 被守卫调用
  async validate(req: Request, payload: any) {
    //  注意 只有通过前面默认的加密验证之后才能进入
    console.log('JWT');
    const originToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    // 只有验证通过之后才会来到这里
    // console.log(`JWT验证 - Step 4: 被守卫调用`);
    const cacheToken = await this.CacheService.get(
      `user-token-${payload.sub}-${payload.username}`,
    );

    //单点登陆验证
    if (cacheToken !== JSON.stringify(originToken)) {
      throw new UnauthorizedException('您账户已经在另一处登陆，请重新登陆');
    }

    return {
      username: payload.username,
    };
  }
}

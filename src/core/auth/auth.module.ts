import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CacheService } from '../cache/cache.service';
import { UserModule } from '../../modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ZKService } from '../zk/zk.service';
import { EnumZkConfigPath, InterZKConfigNest } from '../typings';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (zkService: ZKService) => {
        const { auth } = await zkService.getDataWithJSON<InterZKConfigNest>(
          EnumZkConfigPath.nest,
        );
        return {
          secret: auth.secret,
          signOptions: { expiresIn: '8h' }, // token 过期时效
        };
      },
      inject: [ZKService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CacheService],
  exports: [AuthService],
})
export class AuthModule {}

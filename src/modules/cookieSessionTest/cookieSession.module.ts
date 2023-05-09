import { Module } from '@nestjs/common';
import { CookieSessionController } from './cookieSession.controller';

@Module({
  imports: [],
  controllers: [CookieSessionController],
  providers: [],
})
export class CookieSessionModule {}

import { Module } from '@nestjs/common';
import { CASLController } from './casl.controller';
import { CaslAbilityFactory } from './casAbility.factory';

@Module({
  imports: [],
  controllers: [CASLController],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CASLModule {}

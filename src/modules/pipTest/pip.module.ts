import { Module } from '@nestjs/common';
import { PipController } from './pip.controller';

@Module({
  imports: [],
  controllers: [PipController],
  providers: [],
})
export class PipModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { Cat, CatSchema } from './schemas/cat.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Cat.name,
          schema: CatSchema,
        },
      ],
      'testDB',
    ),
    MongooseModule.forFeature(
      [
        {
          name: Cat.name,
          schema: CatSchema,
        },
      ],
      'testDB2',
    ),
  ],
  controllers: [CatController],
  providers: [CatService],
})
export class CatModule {}

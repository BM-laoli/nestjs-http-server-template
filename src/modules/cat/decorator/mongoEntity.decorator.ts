import { SetMetadata } from '@nestjs/common';

export const MONGO_ENTITY_CLASS = 'MongoEntityClass';
export const MongoEntityClass = (entity: any) =>
  SetMetadata(MONGO_ENTITY_CLASS, entity);

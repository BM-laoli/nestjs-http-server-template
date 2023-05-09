import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipModule } from './modules/pipTest/pip.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core/core.module';
import { CatModule } from './modules/cat/cat.module';
import { PipController } from './modules/pipTest/pip.controller';
import { CacheModule } from './modules/cacheTest/cache.module';
import { SerializationModule } from './modules/serializationTest/serialization.module';
import { QueueModule } from './modules/queueTest/queue.module';
import { FileModule } from './modules/fileTest/file.module';
import { CookieSessionModule } from './modules/cookieSessionTest/cookieSession.module';

@Module({
  imports: [
    CoreModule,
    CatModule,
    PipModule,
    CacheModule,
    SerializationModule,
    QueueModule,
    FileModule,
    CookieSessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

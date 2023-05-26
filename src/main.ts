import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ApiExtraModels, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addSecurity('basic',{
      type:'http',
      scheme:'basic'
    })
    .addBasicAuth()
    .build();
    const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix:false,
  });
  
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

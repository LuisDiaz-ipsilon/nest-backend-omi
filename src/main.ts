import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.enableCors({
    origin: ['http://localhost:4200', 'http://134.255.176.206', 'http://localhost:4200/'],  // Especifica el origen permitido
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  });


  await app.listen(3000);
}
bootstrap();

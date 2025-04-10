import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  
  // Expose the 'public/uploads' folder as static
  app.use('/uploads', express.static(join(__dirname, '..', 'public', 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

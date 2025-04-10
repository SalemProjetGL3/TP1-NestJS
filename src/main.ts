import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { MulterExceptionFilter } from './filters/multer-exception.filter';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Expose the 'public/uploads' folder as static
  app.use('/uploads', express.static(join(__dirname, '..', 'public', 'uploads')));

  // Register the global filter
  // app.useGlobalFilters(new MulterExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

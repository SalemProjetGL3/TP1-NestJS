import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CvService } from '../cv/cv.service';
// Import functions from @ngneat/falso
import { randFirstName, randLastName, randNumber, randJobTitle, randFilePath } from '@ngneat/falso';

async function bootstrap() {
  // Create the standalone application context
  const app = await NestFactory.createApplicationContext(AppModule);
  const cvService = app.get(CvService);

  console.log('Seeding database with CVs...');

  for (let i = 0; i < 10; i++) {
    await cvService.create({
      name: randLastName(), // Use last name for 'name'
      firstname: randFirstName(), // Use first name for 'firstname'
      age: randNumber({ min: 20, max: 60 }),
      cin: randNumber({ length: 8 }).toString(), // Generates an 8-digit numeric string
      job: randJobTitle(),
      path: randFilePath(),
    });
  }

  console.log('CVEEET!');
  await app.close();
}

bootstrap();

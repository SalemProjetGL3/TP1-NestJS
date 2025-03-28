import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
// Import functions from @ngneat/falso
import { randUserName, randEmail, randPassword } from '@ngneat/falso';

async function bootstrap() {
  // Create the standalone application context
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get( UserService );

  console.log('Seeding database with users...');

  for (let i = 0; i < 10; i++) {
    await userService.create({
      username: randUserName(),
      email: randEmail(),
      password: randPassword().join(''),
      role: '',

    });
  }

  console.log('USERS DONE!');
  await app.close();
}

bootstrap();

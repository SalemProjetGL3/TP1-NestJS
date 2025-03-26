import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SkillService } from '../skill/skill.service';
// Import functions from @ngneat/falso
import { randSkill } from '@ngneat/falso';

async function bootstrap() {
  // Create the standalone application context
  const app = await NestFactory.createApplicationContext(AppModule);
  const skillService = app.get( SkillService );

  console.log('Seeding database with Skills...');

  for (let i = 0; i < 10; i++) {
    await skillService.create({
      designation: randSkill(),
    });
  }

  console.log('SKILLLZZZ!');
  await app.close();
}

bootstrap();

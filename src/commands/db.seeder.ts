import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import {
  randFirstName,
  randLastName,
  randNumber,
  randJobTitle,
  randFilePath,
  randSkill,
  randUserName,
  randEmail,
  randPassword,
} from '@ngneat/falso';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';
import { Cv } from '../cv/entities/cv.entity';

// too complicated i know
function getRandomElements(array: any[], min: number, max: number) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return array.sort(() => 0.5 - Math.random()).slice(0, count);
  }

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  // Get repositories
  const userRepository = dataSource.getRepository(User);
  const skillRepository = dataSource.getRepository(Skill);
  const cvRepository = dataSource.getRepository(Cv);

  // SAYA9 
  await cvRepository.delete({});
  await skillRepository.delete({});
  await userRepository.delete({});

  // Seed Users
  console.log('Seeding users...');
  const users: User[] = [];
  for (let i = 0; i < 10; i++) {
    const user = userRepository.create({
      username: randUserName(),
      email: randEmail(),
      password: randPassword().toString(),
    });
    await userRepository.save(user);
    users.push(user);
  }
  console.log('kamalna users');

  // Seed Skills
  console.log('Seeding skills...');
  const skills: Skill[] = [];
  for (let i = 0; i < 10; i++) {
    const skill = skillRepository.create({
      designation: randSkill(),
    });
    await skillRepository.save(skill);
    skills.push(skill);
  }
  console.log('kamlna skills');

  // 3. Seed CVs with relationships
  console.log('Seeding CVs with relationships...');
  for (let i = 0; i < 10; i++) {
    // Randomly select a user and 3-5 skills
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomSkills = getRandomElements(skills, 3, 5);

    const cv = cvRepository.create({
      name: randLastName(),
      firstname: randFirstName(),
      age: randNumber({ min: 20, max: 60 }),
      cin: randNumber({ length: 8 }).toString(),
      job: randJobTitle(),
      path: randFilePath(),
      user: randomUser,
      skills: randomSkills,
    });
    
    await cvRepository.save(cv);
  }
  console.log('CVs done');

  await app.close();
}

bootstrap();
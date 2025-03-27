import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { Cv } from './cv/entities/cv.entity';
import { User } from './user/entities/user.entity';
import { Skill } from './skill/entities/skill.entity';
import { DatabaseType, DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE');

        return {
          type: dbType as DatabaseType, 
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [Cv, User, Skill],
          synchronize: true,
        } as DataSourceOptions;
      },
      inject: [ConfigService],
    }),

    CvModule,
    UserModule,
    SkillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

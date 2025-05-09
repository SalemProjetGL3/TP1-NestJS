import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { join } from 'path';
import { CvModule } from './cv/cv.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { Cv } from './cv/entities/cv.entity';
import { User } from './user/entities/user.entity';
import { Skill } from './skill/entities/skill.entity';
import { DatabaseType, DataSourceOptions } from 'typeorm';
import { CvHistoryModule } from './cv-history/cv-history.module';
import { SseModule } from './sse/sse.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CvHistory } from './cv-history/entities/cv-history.entity';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(), 

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    UploadModule,

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
          entities: [Cv, User, Skill, CvHistory],
          synchronize: true,
        } as DataSourceOptions;
      },
      inject: [ConfigService],
    }),

    CvModule,
    UserModule,
    SkillModule,
    AuthModule,
    CvHistoryModule,
    SseModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

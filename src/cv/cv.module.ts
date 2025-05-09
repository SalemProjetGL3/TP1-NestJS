import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { CvV2Controller } from './cv-v2.controller';
import { AuthUserMiddleware } from '../common/middlewares/auth-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Cv])],
  controllers: [CvController, CvV2Controller],
  providers: [CvService],
})
export class CvModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUserMiddleware).forRoutes(CvV2Controller);
  }
}

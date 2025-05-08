import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { CvV2Controller } from './cv-v2.controller';
import { AuthUserMiddleware } from '../common/middlewares/auth-user.middleware';
import { CvHistory } from 'src/cv-history/entities/cv-history.entity';
import { CvHistoryService } from 'src/cv-history/cv-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cv, CvHistory])],
  controllers: [CvController, CvV2Controller],
  providers: [CvService, CvHistoryService],
})
export class CvModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // On veut que le middleware s’applique seulement sur le CvV2Controller
    consumer.apply(AuthUserMiddleware).forRoutes(CvV2Controller);
    
  }
}

import { Module } from '@nestjs/common';
import { CvHistoryService } from './services/cv-history.service';
import { CvHistoryController } from './cv-history.controller';

@Module({
  providers: [CvHistoryService],
  controllers: [CvHistoryController]
})
export class CvHistoryModule {}

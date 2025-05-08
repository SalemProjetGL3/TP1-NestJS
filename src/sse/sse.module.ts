import { Module } from '@nestjs/common';
import { SseController } from './sse.controller';
import { CvSseRelayService } from './listeners/cv-sse-relay.service'; 

@Module({
  controllers: [SseController],
  providers: [CvSseRelayService],
})
export class SseModule {}

// src/sse/listeners/cv-sse-relay.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CvEventDto } from '../dto/cv-event.dto'; // Uses the simplified DTO
import { cvUpdateSubject } from '../sse.controller';
import { CV_CREATED_EVENT, CV_UPDATED_EVENT, CV_DELETED_EVENT } from '../../common/events/cv.events';

@Injectable()
export class CvSseRelayService {
  private readonly logger = new Logger(CvSseRelayService.name);

  constructor() {
    this.logger.log('CvSseRelayService initialized and listening for CV events.');
  }

  @OnEvent(CV_CREATED_EVENT)
  handleCvCreatedEvent(payload: CvEventDto) { // Payload is now the simplified CvEventDto
    this.logger.log(`Received ${CV_CREATED_EVENT}, relaying to SSE: CV ID ${payload.cvId}`);
    cvUpdateSubject.next(payload);
  }

  @OnEvent(CV_UPDATED_EVENT)
  handleCvUpdatedEvent(payload: CvEventDto) { // Payload is now the simplified CvEventDto
    this.logger.log(`Received ${CV_UPDATED_EVENT}, relaying to SSE: CV ID ${payload.cvId}`);
    cvUpdateSubject.next(payload);
  }

  @OnEvent(CV_DELETED_EVENT)
  handleCvDeletedEvent(payload: CvEventDto) { // Payload is now the simplified CvEventDto
    this.logger.log(`Received ${CV_DELETED_EVENT}, relaying to SSE: CV ID ${payload.cvId}`);
    cvUpdateSubject.next(payload);
  }
}
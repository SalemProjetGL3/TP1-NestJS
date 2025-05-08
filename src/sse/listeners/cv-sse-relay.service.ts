// src/sse/listeners/cv-sse-relay.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CvEventDto } from '../dto/cv-event.dto';
import { cvUpdateSubject } from '../sse.controller'; // Check this path
import { CV_CREATED_EVENT, CV_UPDATED_EVENT, CV_DELETED_EVENT } from '../../common/events/cv.events';

@Injectable()
export class CvSseRelayService {
  private readonly logger = new Logger(CvSseRelayService.name); // Ensure logger is initialized

  constructor() {
    this.logger.log('CvSseRelayService initialized and is listening for CV events.'); // <--- Check this on app start
  }

  @OnEvent(CV_CREATED_EVENT)
  handleCvCreatedEvent(payload: CvEventDto) {
    this.logger.log(`CvSseRelayService: Received internal event [${CV_CREATED_EVENT}] with payload:`, JSON.stringify(payload)); // <--- ADD THIS LOG
    try {
      cvUpdateSubject.next(payload);
      this.logger.debug(`CvSseRelayService: Payload relayed to cvUpdateSubject for [${CV_CREATED_EVENT}].`); // <--- ADD THIS LOG
    } catch (error) {
      this.logger.error(`CvSseRelayService: Error relaying payload for [${CV_CREATED_EVENT}]:`, error); // <--- ADD ERROR LOG
    }
  }

  @OnEvent(CV_UPDATED_EVENT)
  handleCvUpdatedEvent(payload: CvEventDto) {
    this.logger.log(`CvSseRelayService: Received internal event [${CV_UPDATED_EVENT}] with payload:`, JSON.stringify(payload)); // <--- ADD THIS LOG
    try {
      cvUpdateSubject.next(payload);
      this.logger.debug(`CvSseRelayService: Payload relayed to cvUpdateSubject for [${CV_UPDATED_EVENT}].`); // <--- ADD THIS LOG
    } catch (error) {
      this.logger.error(`CvSseRelayService: Error relaying payload for [${CV_UPDATED_EVENT}]:`, error); // <--- ADD ERROR LOG
    }
  }

  @OnEvent(CV_DELETED_EVENT)
  handleCvDeletedEvent(payload: CvEventDto) {
    this.logger.log(`CvSseRelayService: Received internal event [${CV_DELETED_EVENT}] with payload:`, JSON.stringify(payload)); // <--- ADD THIS LOG
    try {
      cvUpdateSubject.next(payload);
      this.logger.debug(`CvSseRelayService: Payload relayed to cvUpdateSubject for [${CV_DELETED_EVENT}].`); // <--- ADD THIS LOG
    } catch (error) {
      this.logger.error(`CvSseRelayService: Error relaying payload for [${CV_DELETED_EVENT}]:`, error); // <--- ADD ERROR LOG
    }
  }
}
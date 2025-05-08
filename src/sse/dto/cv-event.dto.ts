// src/sse/dto/cv-event.dto.ts
import { CvOperationType } from '../../cv-history/entities/cv-history.entity';

export class CvEventDto {
  operationType: CvOperationType; // CREATE, UPDATE, DELETE
  cvId: number;
  cvName?: string;
  performedByUsername: string;
  performedById: number; // ID of the user who performed the action
  cvOwnerId: number; // ID of the user who owns/created the CV
  timestamp: Date;
  details?: any;
}
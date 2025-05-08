// src/cv-history/cv-history.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvHistory, CvOperationType } from './entities/cv-history.entity';
import { User } from '../user/entities/user.entity';
import { Cv } from '../cv/entities/cv.entity';

@Injectable()
export class CvHistoryService {
  constructor(
    @InjectRepository(CvHistory)
    private cvHistoryRepository: Repository<CvHistory>,
  ) {}

  async logOperation(
    cvEntity: Cv | { id: number }, // Can be the full CV or just an object with its ID (e.g., after deletion)
    performedByUser: User,
    operationType: CvOperationType,
    details?: Record<string, any>,
  ): Promise<CvHistory> {
    const historyEntry = this.cvHistoryRepository.create({
      cvAffectedId: cvEntity.id,
      performedBy: performedByUser, // TypeORM should handle setting performedById from this
      performedById: performedByUser.id,
      operationType,
      details,
      // 'cv' relation can be set if the full Cv entity is passed and you want the relation linked
      // but cvAffectedId is the key for tracking.
    });
    // If cvEntity is a full Cv object and not just {id: number}, TypeORM might also link the 'cv' relation
    // For now, focusing on ID tracking.
    if (cvEntity instanceof Cv) {
        historyEntry.cv = cvEntity;
    }

    return this.cvHistoryRepository.save(historyEntry);
  }

  async findAll(options?: { relations?: string[] }): Promise<CvHistory[]> {
    return this.cvHistoryRepository.find({
        relations: options?.relations || ['performedBy', 'cv'], // Load relations by default
        order: { timestamp: 'DESC' }
    });
  }

  async findByCvId(cvId: number, options?: { relations?: string[] }): Promise<CvHistory[]> {
    return this.cvHistoryRepository.find({
      where: { cvAffectedId: cvId },
      relations: options?.relations || ['performedBy'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByUserId(userId: number, options?: { relations?: string[] }): Promise<CvHistory[]> {
    return this.cvHistoryRepository.find({
      where: { performedById: userId },
      relations: options?.relations || ['cv'],
      order: { timestamp: 'DESC' },
    });
  }
}
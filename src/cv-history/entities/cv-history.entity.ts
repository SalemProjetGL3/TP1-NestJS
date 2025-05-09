// src/cv-history/entities/cv-history.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Cv } from '../../cv/entities/cv.entity';

export enum CvOperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity('cv_history')
export class CvHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CvOperationType,
  })
  operationType: CvOperationType;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'performedById' }) // Explicitly name the foreign key column
  performedBy: User;

  @Column({ type: 'int', nullable: true }) // Store performedBy user ID separately
  performedById: number;

  @ManyToOne(() => Cv, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cvId' }) // Explicitly name the foreign key column
  cv: Cv; // The CV entity that was affected, can be null if CV is hard deleted

  @Column({ type: 'int', nullable: true }) // Store CV ID separately
  cvAffectedId: number; // Renamed to avoid conflict with relation name 'cv'

  //@Column({ type: 'jsonb', nullable: true }) // To store details of the change
  //details?: Record<string, any>; // e.g., { oldData: {...}, newData: {...} } or { deletedData: {...} }
}
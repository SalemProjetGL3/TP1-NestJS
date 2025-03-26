import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  designation: string;

  // Many-to-Many: a skill can belong to many CVs
  @ManyToMany(() => Cv, (cv) => cv.skills)
  cvs: Cv[];
}

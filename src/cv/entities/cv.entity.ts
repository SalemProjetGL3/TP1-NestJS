import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';

@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstname: string;

  @Column()
  age: number;

  @Column()
  cin: string; 

  @Column()
  job: string;

  @Column()
  path: string;

  // Many-to-Many: a CV can have many skills
  @ManyToMany(() => Skill, (skill) => skill.cvs, { cascade: true })
  @JoinTable()
  skills: Skill[];

  // Many-to-One: a CV belongs to one user
  @ManyToOne(() => User, (user) => user.cvs, { onDelete: 'SET NULL' })
  user: User;
}

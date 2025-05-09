import { Cv } from 'src/cv/entities/cv.entity';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER
  })
  role: string;

  @Column({ nullable: true })
  cv_path: string;

  @OneToMany(() => Cv, (cv) => cv.user)
  cvs: Cv[];

}

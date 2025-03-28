import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
  // Generate a unique salt for each user
  const salt = crypto.randomBytes(16).toString('hex');
  // Hash password with salt using bcrypt
  const hashedPassword = await bcrypt.hash(createUserDto.password + salt, 12);
  
  let user = this.userRepository.create({
    ...createUserDto,
    password: hashedPassword,
    salt: salt,
  });

  try {
    user = await this.userRepository.save(user); 
  } catch (error) {
    throw new ConflictException('Username or email already exists');
  }
  return user;
}
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateUserDto.password) {
      // Generate new salt and hash password when updating
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(updateUserDto.password + salt, 12);
      
      updateUserDto.password = hashedPassword;
      user.salt = salt;
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
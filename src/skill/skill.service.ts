import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
    constructor(
      @InjectRepository(Skill)
      private skillRepository: Repository<Skill>,
    ) {}
  create(createSkillDto: CreateSkillDto) {
    return 'This action adds a new skill';
  }

  async findAll(): Promise<Skill[]> {
    return this.skillRepository.find();
  }
  

  async findOne(id: number): Promise<Skill> {
    const user = await this.skillRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}

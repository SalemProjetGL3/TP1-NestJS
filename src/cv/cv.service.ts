import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Page } from '../common/classes/page.class';
import { PageMeta } from '../common/classes/page-meta.class';
import { SearchCvDto } from './dto/search-cv.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>
  ){}
  
  async create(createCvDto: CreateCvDto, user): Promise<Cv> {
    const newCv = this.cvRepository.create(createCvDto);
    newCv.user = user; 
    return await this.cvRepository.save(newCv);
  }

  async findAll(searchCvDto : SearchCvDto, user): Promise<Page<Cv>> {
    const query= this.cvRepository.createQueryBuilder('cv');
    if(user.role !== 'admin'){
      query.where('cv.userId = :userId', { userId: user.id });
    }else{
      query.where('cv.userId IS NOT NULL'); // To avoid null userId for admin
    }
    if(searchCvDto.searchString){
      query.andWhere('cv.name LIKE :search OR cv.firstname LIKE :search OR cv.job LIKE :search', 
        {search: `%${searchCvDto.searchString}%`}
      );
    }
    if(searchCvDto.age!==undefined){
      query.andWhere('cv.age = :age', {age: searchCvDto.age});
    } 

    const itemCount = await query.getCount();
    const {entities} = await query
        .skip(searchCvDto.skip)
        .take(searchCvDto.take)
        .getRawAndEntities();
    const pageMeta = new PageMeta(searchCvDto, itemCount);

    return new Page(entities, pageMeta);
  }

  async findOne(id: number, user): Promise<Cv> {
    const whereCondition = user.role !== 'admin' ? { id, user } : { id };
    const cv = await this.cvRepository.findOne({ where: whereCondition });
    if (!cv) {
      throw new NotFoundException(`CV #${id} not found`);
    }
    return cv;
  }
  
  

  async update(id: number, updateCvDto: UpdateCvDto, user): Promise<Cv> {
    const cv = await this.findOne(id, user);
    Object.assign(cv, updateCvDto);
    return this.cvRepository.save(cv);
  }

  async remove(id: number, user): Promise<void> {
    const cv = await this.findOne(id, user);
    await this.cvRepository.remove(cv);
  }
}

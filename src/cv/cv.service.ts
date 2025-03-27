import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Page } from '../common/classes/page.class';
import { PageMeta } from '../common/classes/page-meta.class';
import { SearchCvDto } from './dto/search-cv.dto';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>
  ){}
  
  async create(createCvDto: CreateCvDto): Promise<Cv> {
    const newCv = this.cvRepository.create(createCvDto);
    return await this.cvRepository.save(newCv);
  }

  async findAll(searchCvDto : SearchCvDto): Promise<Page<Cv>> {
    const query= this.cvRepository.createQueryBuilder('cv');
    if(searchCvDto.searchString){
      query.where('cv.name LIKE :search OR cv.firstname LIKE :search OR cv.job LIKE :search', 
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

  async findOne(id: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({ where: { id } });
    if (!cv) {
      throw new NotFoundException(`CV #${id} not found`);
    }
    return cv;
  }

  async update(id: number, updateCvDto: UpdateCvDto): Promise<Cv> {
    const cv = await this.findOne(id);
    Object.assign(cv, updateCvDto);
    return this.cvRepository.save(cv);
  }

  async remove(id: number): Promise<void> {
    const cv = await this.findOne(id);
    await this.cvRepository.remove(cv);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { Cv } from './entities/cv.entity';
import { Page } from '../common/classes/page.class';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { SearchCvDto } from './dto/search-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Body() createCvDto: CreateCvDto) : Promise<Cv> {
    return this.cvService.create(createCvDto);
  }

  @Get()
  findAll(@Query() searchCvDto: SearchCvDto): Promise<Page<Cv>> {
    return this.cvService.findAll(searchCvDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) : Promise<Cv>{
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto) : Promise<Cv> {
    return this.cvService.update(+id, updateCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cvService.remove(+id);
  }
}

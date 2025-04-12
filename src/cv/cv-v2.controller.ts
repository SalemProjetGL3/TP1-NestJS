import { Controller, Get, Post, Patch, Delete, Param, Body, Req, ForbiddenException, Query } from '@nestjs/common';
import { CvService } from './cv.service';
import { User } from 'src/decorators/user.decorator';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { SearchCvDto } from './dto/search-cv.dto';

@Controller({
  path: 'cv',
  version: '2',
})
export class CvV2Controller {
  constructor(private readonly cvService: CvService) {}

  @Get()
  findAll(@Req() req: any, @Query() searchCvDto: SearchCvDto) {
    console.log('User requesting all CVs => userId:', req.user.id);
    console.log('Search CV DTO:', searchCvDto);
    return this.cvService.findAll(searchCvDto, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req: any) {
    const cv = await this.cvService.findOne(+id, req.user);
    return cv;
  }

  @Post()
  async create(@Body() createCvDto: CreateCvDto, @Req() req: any) {
    return this.cvService.create(createCvDto, req.user);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCvDto: UpdateCvDto, @Req() req: any) {
    const cv = await this.cvService.findOne(+id, req.user);
    if (cv.user.id !== req.user.id) {
      throw new ForbiddenException('You are not allowed to update this CV');
    }
    return this.cvService.update(+id, updateCvDto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: any, @User() user) {
    const cv = await this.cvService.findOne(+id,user);
    if (cv.user.id !== req.user.id) {
      throw new ForbiddenException('You are not allowed to delete this CV');
    }
    return this.cvService.remove(+id,user);
  }
}

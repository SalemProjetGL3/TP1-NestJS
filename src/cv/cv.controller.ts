import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { Cv } from './entities/cv.entity';
import { Page } from '../common/classes/page.class';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { SearchCvDto } from './dto/search-cv.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCvDto: CreateCvDto, @User() user) : Promise<Cv> {
    return this.cvService.create(createCvDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() searchCvDto: SearchCvDto, @User() user): Promise<Page<Cv>> {
    return this.cvService.findAll(searchCvDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @User() user) : Promise<Cv>{
    return this.cvService.findOne(+id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto, @User() user) : Promise<Cv> {
    return this.cvService.update(+id, updateCvDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string, @User() user) : Promise<void> {
    return this.cvService.remove(+id, user);
  }
}

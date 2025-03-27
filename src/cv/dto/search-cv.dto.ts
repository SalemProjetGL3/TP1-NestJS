import { IsOptional, IsNumber, IsString } from 'class-validator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

export class SearchCvDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  searchString?: string;

  @IsOptional()
  @IsNumber()
  age?: number;
}
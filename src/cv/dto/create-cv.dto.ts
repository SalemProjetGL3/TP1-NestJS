import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCvDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  cin: string;

  @IsNotEmpty()
  @IsString()
  job: string;

  @IsOptional()
  @IsString()
  path?: string;

  // If you link a CV to a user by userId:
  @IsOptional()
  @IsNumber()
  userId?: number;
}

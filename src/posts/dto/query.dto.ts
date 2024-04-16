import { PaginationDto } from '@/core/dtos/pagination.dto';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PostType } from '../types';

export class PostQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @IsOptional()
  @IsArray()
  sort?: any[];
}

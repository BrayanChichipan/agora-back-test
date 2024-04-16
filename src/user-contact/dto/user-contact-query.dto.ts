import { PaginationDto } from '@/core/dtos/pagination.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UserContactQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  sort?: any[];
}

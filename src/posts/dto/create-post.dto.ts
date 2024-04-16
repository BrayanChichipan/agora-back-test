import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostType } from '../types';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subtitle: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  isPublished: boolean;

  @IsEnum(PostType)
  type: PostType;
}

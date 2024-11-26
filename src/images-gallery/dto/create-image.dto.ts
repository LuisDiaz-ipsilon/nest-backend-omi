// src/images-gallery/dto/create-image.dto.ts
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateImageDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// src/images-gallery/dto/update-image.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateImageDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

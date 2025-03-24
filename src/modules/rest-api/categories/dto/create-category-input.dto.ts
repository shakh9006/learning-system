import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class CreateCategoryInputDto {
  @ApiProperty({ example: 'Travel', description: 'category name' })
  @IsString({ message: 'Must be string' })
  name: string;

  @ApiProperty({ example: 'travel', description: 'category icon' })
  @IsString({ message: 'Must be string' })
  icon: string;

  @ApiProperty({ example: 'false', description: 'visibility for others' })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({ example: 'custom', description: 'Type of category' })
  @IsString({ message: 'Must string' })
  @IsOptional()
  categoryType?: CategoryType;
}

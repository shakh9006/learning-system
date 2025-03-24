import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SystemCreateCategoryDto {
  @ApiProperty({ example: 'Travel', description: 'category name' })
  @IsString({ message: 'Must be string' })
  name: string;
}

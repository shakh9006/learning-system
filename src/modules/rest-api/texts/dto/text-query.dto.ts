import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Levels } from '../../../../common/types/Levels';

export class TextQueryDto {
  @ApiProperty({
    example: '1',
    description: 'Category ID to filter texts by category',
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    example: 'easy',
    description: 'Difficulty level to filter texts (easy, medium, hard)',
    required: false,
    enum: ['easy', 'medium', 'hard']
  })
  @IsOptional()
  @IsString()
  level?: Levels;

  @ApiProperty({
    example: 'completed',
    description: 'Activity status to filter texts (e.g., completed, pending)',
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  activity?: string;
}

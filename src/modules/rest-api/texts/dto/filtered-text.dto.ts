import { ApiProperty } from '@nestjs/swagger';
import { Levels } from '../../../../common/types/Levels';

export class FilteredTextDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the text',
    type: String,
  })
  textId: string;

  @ApiProperty({
    example: 'This is a sample text content for dictation practice.',
    description: 'The content of the text for dictation',
    type: String,
  })
  content: string;

  @ApiProperty({
    example: 'easy',
    description: 'Difficulty level of the text',
    enum: ['easy', 'medium', 'hard'],
  })
  level: Levels;

  @ApiProperty({
    example: 1,
    description:
      'Activity status code (0: not attempted, 1: in progress, 2: completed, etc.)',
    enum: [0, 1, 2, 3, 4, 5],
  })
  activity: 0 | 1 | 2 | 3 | 4 | 5;

  @ApiProperty({
    example: 1,
    description: 'ID of the category to which the text belongs',
    type: Number,
  })
  categoryId: number;
}

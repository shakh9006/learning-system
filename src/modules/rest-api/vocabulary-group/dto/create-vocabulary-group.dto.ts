import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVocabularyGroupDto {
  @ApiProperty({ example: 'Test name', description: 'Group name' })
  @IsString({ message: 'Must be string' })
  name: string;
}

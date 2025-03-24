import { CreateVocabularyInputDto } from './create-vocabulary-input.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateFullVocabularyDto extends CreateVocabularyInputDto {
  @ApiProperty({ example: '1', description: 'Group Id' })
  @IsNumber()
  @IsOptional()
  vocabularyGroupId?: number;
}

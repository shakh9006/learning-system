import { PartialType } from '@nestjs/swagger';
import { CreateVocabularyInputDto } from './create-vocabulary-input.dto';

export class UpdateVocabularyInputDto extends PartialType(
  CreateVocabularyInputDto,
) {}

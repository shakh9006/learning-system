import { CreateVocabularyInputDto } from './create-vocabulary-input.dto';

export class CreateVocabularyDto extends CreateVocabularyInputDto {
  wordFileId: number;
  speaker: string;
  relatedId?: number;
}

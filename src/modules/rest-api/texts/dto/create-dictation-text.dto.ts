import { IBaseTextDto } from './base-text.dto';

export class CreateDictationTextDto extends IBaseTextDto {
  wordCount: number;
  hash: string;
  relatedId?: string;
}

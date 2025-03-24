import { Levels } from '../../../../common/types/Levels';

export class CreateTextDto {
  content: string;
  wordCount: number;
  level: Levels;
  hash: string;
}

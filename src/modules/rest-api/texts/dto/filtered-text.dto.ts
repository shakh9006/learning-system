import { Levels } from '../../../../common/types/Levels';

export class FilteredTextDto {
  textId: number;
  content: string;
  level: Levels;
  activity: 0 | 1 | 2 | 3 | 4 | 5;
  categoryId: number;
}

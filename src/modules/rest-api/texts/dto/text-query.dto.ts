import { IsOptional, IsString } from 'class-validator';
import { Levels } from '../../../../common/types/Levels';

export class TextQueryDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  level?: Levels;

  @IsOptional()
  @IsString()
  activity?: string;
}

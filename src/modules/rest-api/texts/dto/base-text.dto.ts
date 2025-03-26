import { TextLevel, TextType } from '@prisma/client';

export class IBaseTextDto {
  content: string;
  level: TextLevel;
  type: TextType;
}

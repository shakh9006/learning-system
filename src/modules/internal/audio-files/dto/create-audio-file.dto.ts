import { ReadingMode } from '@prisma/client';
export class CreateAudioFileDto {
  speakerId: string;
  readingMode: ReadingMode;
  fileName: string;
  hashedFileName: string;
}

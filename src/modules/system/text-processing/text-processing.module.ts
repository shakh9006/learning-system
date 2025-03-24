import { Module } from '@nestjs/common';
import { TextProcessingService } from './text-processing.service';

@Module({
  providers: [TextProcessingService],
  exports: [TextProcessingService],
})
export class TextProcessingModule {}

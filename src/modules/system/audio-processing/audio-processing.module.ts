import { Module } from '@nestjs/common';
import { AudioProcessingService } from './audio-processing.service';
import { StorageModule } from '../storage/storage.module';
import { AudioFilesModule } from '../../internal/audio-files/audio-files.module';
import { VocabularyAudioFiles } from '@prisma/client';
import { VocabularyAudioFilesModule } from '../../internal/vocabulary-audio-files/vocabulary-audio-files.module';

@Module({
  imports: [StorageModule, AudioFilesModule, VocabularyAudioFilesModule],
  providers: [AudioProcessingService],
  exports: [AudioProcessingService],
})
export class AudioProcessingModule {}

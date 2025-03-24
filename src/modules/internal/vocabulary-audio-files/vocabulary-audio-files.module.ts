import { Module } from '@nestjs/common';
import { VocabularyAudioFilesService } from './vocabulary-audio-files.service';
import { VocabularyAudioFilesRepository } from './vocabulary-audio-files.repository';

@Module({
  providers: [VocabularyAudioFilesService, VocabularyAudioFilesRepository],
  exports: [VocabularyAudioFilesService],
})
export class VocabularyAudioFilesModule {}

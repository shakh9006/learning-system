import { Module } from '@nestjs/common';
import { AudioFilesService } from './audio-files.service';
import { AudioFilesRepository } from './audio-files.repository';

@Module({
  providers: [AudioFilesService, AudioFilesRepository],
  exports: [AudioFilesService],
})
export class AudioFilesModule {}

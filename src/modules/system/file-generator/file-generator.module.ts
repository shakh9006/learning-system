import { Module } from '@nestjs/common';
import { FileGeneratorService } from './file-generator.service';
import { AudioFilesModule } from '../../internal/audio-files/audio-files.module';

@Module({
  providers: [FileGeneratorService],
  exports: [FileGeneratorService],
  imports: [AudioFilesModule],
})
export class FileGeneratorModule {}

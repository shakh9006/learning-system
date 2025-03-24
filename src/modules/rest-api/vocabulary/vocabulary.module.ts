import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyRepository } from './vocabulary.repository';
import { FileGeneratorModule } from '../../system/file-generator/file-generator.module';
import { ChatGtpModule } from '../../system/chat-gtp/chat-gtp.module';
import { VocabularyGroupModule } from '../vocabulary-group/vocabulary-group.module';
import { WorkflowModule } from '../../system/workflow/workflow.module';
import { SettingsModule } from '../settings/settings.module';
import { StorageModule } from '../../system/storage/storage.module';
import { TextsModule } from '../texts/texts.module';

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService, VocabularyRepository],
  imports: [
    FileGeneratorModule,
    VocabularyGroupModule,
    ChatGtpModule,
    WorkflowModule,
    SettingsModule,
    StorageModule,
    TextsModule,
  ],
  exports: [VocabularyService],
})
export class VocabularyModule {}

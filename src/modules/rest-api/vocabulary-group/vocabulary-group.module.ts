import { Module } from '@nestjs/common';
import { VocabularyGroupService } from './vocabulary-group.service';
import { VocabularyGroupController } from './vocabulary-group.controller';
import { VocabularyGroupRepository } from './vocabulary-group.repository';
import { SettingsModule } from '../settings/settings.module';

@Module({
  controllers: [VocabularyGroupController],
  providers: [VocabularyGroupService, VocabularyGroupRepository],
  exports: [VocabularyGroupService],
  imports: [SettingsModule],
})
export class VocabularyGroupModule {}

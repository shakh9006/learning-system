import { Module } from '@nestjs/common';
import { TextsService } from './texts.service';
import { TextsRepository } from './texts.repository';
import { TextsController } from './texts.controller';
import { SettingsModule } from '../settings/settings.module';
import { StorageModule } from '../../system/storage/storage.module';
import { PerformanceModule } from '../../internal/performance/performance.module';

@Module({
  providers: [TextsService, TextsRepository],
  exports: [TextsService],
  controllers: [TextsController],
  imports: [SettingsModule, StorageModule, PerformanceModule],
})
export class TextsModule {}

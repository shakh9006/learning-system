import { Module } from '@nestjs/common';
import { DictationsService } from './dictations.service';
import { DictationsRepository } from './dictations.repository';
import { TextsModule } from '../../rest-api/texts/texts.module';
import { PerformanceModule } from '../performance/performance.module';

@Module({
  imports: [TextsModule, PerformanceModule],
  providers: [DictationsService, DictationsRepository],
  exports: [DictationsService],
})
export class DictationsModule {}

import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { DictationsModule } from '../../internal/dictations/dictations.module';
import { TextsModule } from '../texts/texts.module';
import { PerformanceModule } from '../../internal/performance/performance.module';
import { PointsModule } from '../../internal/points/points.module';
import { AchievementsModule } from '../../internal/achievements/achievements.module';
import { VocabularyModule } from '../vocabulary/vocabulary.module';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  imports: [
    DictationsModule,
    TextsModule,
    PerformanceModule,
    PointsModule,
    AchievementsModule,
    VocabularyModule,
  ],
})
export class SubmissionsModule {}

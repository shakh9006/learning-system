import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsRepository } from './achievements.repository';
import { UserAchievementsModule } from '../user-achievements/user-achievements.module';
import { DictationsModule } from '../dictations/dictations.module';
import { PointsModule } from '../points/points.module';

@Module({
  providers: [AchievementsService, AchievementsRepository],
  exports: [AchievementsService],
  imports: [UserAchievementsModule, DictationsModule, PointsModule],
})
export class AchievementsModule {}

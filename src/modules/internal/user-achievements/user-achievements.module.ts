import { Module } from '@nestjs/common';
import { UserAchievementsService } from './user-achievements.service';
import { UserAchievementsRepository } from './user-achievements.repository';

@Module({
  providers: [UserAchievementsService, UserAchievementsRepository],
  exports: [UserAchievementsService],
})
export class UserAchievementsModule {}

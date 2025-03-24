import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { CategoriesModule } from '../categories/categories.module';
import { WorkflowModule } from '../../system/workflow/workflow.module';
import { AchievementsModule } from '../../internal/achievements/achievements.module';

@Module({
  controllers: [SystemController],
  providers: [SystemService],
  imports: [CategoriesModule, WorkflowModule, AchievementsModule],
})
export class SystemModule {}

import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesRepository } from './exercises.repository';
import { TextsModule } from '../../rest-api/texts/texts.module';
import { PerformanceModule } from '../performance/performance.module';

@Module({
  imports: [TextsModule, PerformanceModule],
  providers: [ExercisesService, ExercisesRepository],
  exports: [ExercisesService],
})
export class ExercisesModule {}

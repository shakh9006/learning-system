import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceRepository } from './performance.repository';

@Module({
  providers: [PerformanceService, PerformanceRepository],
  exports: [PerformanceService],
})
export class PerformanceModule {}

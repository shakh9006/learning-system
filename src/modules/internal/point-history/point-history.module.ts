import { Module } from '@nestjs/common';
import { PointHistoryService } from './point-history.service';
import { PointHistoryRepository } from './point-history.repository';

@Module({
  providers: [PointHistoryService, PointHistoryRepository],
})
export class PointHistoryModule {}

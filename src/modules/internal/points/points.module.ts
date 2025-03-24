import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsRepository } from './points.repository';

@Module({
  providers: [PointsService, PointsRepository],
  exports: [PointsService],
})
export class PointsModule {}

import { Injectable } from '@nestjs/common';
import { PointsRepository } from './points.repository';
import { CreatePointsDto } from './dto/create-points.dto';

@Injectable()
export class PointsService {
  constructor(private readonly pointsRepository: PointsRepository) {}
  async applyPoints(userId: number, pointsData?: CreatePointsDto) {
    return await this.pointsRepository.applyUserPoints(userId, pointsData);
  }
}

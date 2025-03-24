import { Injectable } from '@nestjs/common';
import { PointHistoryRepository } from './point-history.repository';

@Injectable()
export class PointHistoryService {
  constructor(
    private readonly pointHistoryRepository: PointHistoryRepository,
  ) {}
}

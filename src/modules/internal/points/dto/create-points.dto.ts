import { PointsReason } from '@prisma/client';

export class CreatePointsDto {
  newPoints: number;
  reason: PointsReason;
  message?: string;
  textId?: number;
  achievementId?: number;
}

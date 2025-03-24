import { AchievementsType } from '@prisma/client';

export class CreateAchievementDto {
  name: string;
  description: string;
  points: number;
  type: AchievementsType;
}

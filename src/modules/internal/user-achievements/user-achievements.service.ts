import { BadRequestException, Injectable } from '@nestjs/common';
import { UserAchievementsRepository } from './user-achievements.repository';

@Injectable()
export class UserAchievementsService {
  constructor(
    private readonly userAchievementsRepository: UserAchievementsRepository,
  ) {}

  async create(userId: number, achievementId: number) {
    const exist = await this.userAchievementsRepository.findFirst(
      userId,
      achievementId,
    );

    if (exist) {
      throw new BadRequestException('User already has this achievement');
    }

    return await this.userAchievementsRepository.create(userId, achievementId);
  }

  async getUsersAchievements(
    userId: number,
  ): Promise<{ achievementId: number }[]> {
    return await this.userAchievementsRepository.getUsersAchievements(userId);
  }
}

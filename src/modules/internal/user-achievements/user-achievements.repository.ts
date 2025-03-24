import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  UserAchievements as UserAchievement,
} from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UserAchievementsRepository {
  async create(
    userId: number,
    achievementId: number,
  ): Promise<UserAchievement> {
    return await prisma.userAchievements.create({
      data: {
        user: {
          connect: {
            userId,
          },
        },
        achievement: {
          connect: {
            achievementId,
          },
        },
      },
    });
  }

  async findFirst(
    userId: number,
    achievementId: number,
  ): Promise<UserAchievement> {
    return await prisma.userAchievements.findFirst({
      where: {
        userId,
        achievementId,
      },
    });
  }

  async getUsersAchievements(
    userId: number,
  ): Promise<{ achievementId: number }[]> {
    return await prisma.userAchievements.findMany({
      where: {
        userId,
      },
      select: {
        achievementId: true,
      },
    });
  }
}

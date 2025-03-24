import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  Achievements as Achievement,
  UserAchievements as UserAchievement,
} from '@prisma/client';
import { CreateAchievementDto } from './dto/create-achievement.dto';

const prisma = new PrismaClient();

@Injectable()
export class AchievementsRepository {
  async create(createData: CreateAchievementDto): Promise<Achievement> {
    return await prisma.achievements.create({
      data: {
        ...createData,
      },
    });
  }

  async findOne(achievementId: number): Promise<Achievement> {
    return await prisma.achievements.findFirst({
      where: {
        achievementId,
      },
    });
  }

  async findAll(): Promise<Achievement[]> {
    return await prisma.achievements.findMany();
  }

  async createByTransaction(data: any) {
    return await prisma.$transaction(data);
  }
}

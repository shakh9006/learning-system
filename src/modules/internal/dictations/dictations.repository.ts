import { Injectable } from '@nestjs/common';
import { PrismaClient, Dictations as Dictation } from '@prisma/client';
import { CreatePerformanceDto } from '../performance/dto/create-performance.dto';

const prisma = new PrismaClient();

@Injectable()
export class DictationsRepository {
  async create(
    userId: number,
    textId: number,
    performanceData: CreatePerformanceDto,
  ): Promise<Dictation> {
    return await prisma.dictations.create({
      data: {
        user: {
          connect: {
            userId,
          },
        },
        text: {
          connect: {
            textId,
          },
        },
        performance: {
          create: {
            ...performanceData,
          },
        },
      },
      include: {
        performance: true,
      },
    });
  }

  async findAll(userId: number): Promise<Dictation[]> {
    return await prisma.dictations.findMany({
      where: {
        userId,
      },
    });
  }

  async findAllByText(userId: number, textId: number): Promise<Dictation[]> {
    return await prisma.dictations.findMany({
      where: {
        textId,
        userId,
      },
    });
  }

  async findOne(userId: number, textId: number): Promise<Dictation> {
    return await prisma.dictations.findFirst({
      where: {
        userId,
        textId,
      },
      include: {
        performance: true,
      },
    });
  }

  async getUserDictationCount(userId: number): Promise<number> {
    return await prisma.dictations.count({ where: { userId } });
  }
}

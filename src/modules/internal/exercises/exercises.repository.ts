import { Injectable } from '@nestjs/common';
import { PrismaClient, Exercises as Exercise } from '@prisma/client';
import { CreatePerformanceDto } from '../performance/dto/create-performance.dto';

const prisma = new PrismaClient();

@Injectable()
export class ExercisesRepository {
  async create(
    userId: number,
    textId: string,
    performanceData: CreatePerformanceDto,
  ): Promise<Exercise> {
    return await prisma.exercises.create({
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

  async findAll(userId: number): Promise<Exercise[]> {
    return await prisma.exercises.findMany({
      where: {
        userId,
      },
    });
  }

  async findAllByText(userId: number, textId: string): Promise<Exercise[]> {
    return await prisma.exercises.findMany({
      where: {
        textId,
        userId,
      },
    });
  }

  async findOne(userId: number, textId: string): Promise<Exercise> {
    return await prisma.exercises.findFirst({
      where: {
        userId,
        textId,
      },
      include: {
        performance: true,
      },
    });
  }

  async getUserExerciseCount(userId: number): Promise<number> {
    return await prisma.exercises.count({ where: { userId } });
  }
}

import { Injectable } from '@nestjs/common';
import { Performance, PrismaClient } from '@prisma/client';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';

const prisma = new PrismaClient();

@Injectable()
export class PerformanceRepository {
  async create(
    dictationId: number,
    createData: CreatePerformanceDto,
  ): Promise<Performance> {
    return await prisma.performance.create({
      data: {
        ...createData,
        dictation: {
          connect: {
            dictationId,
          },
        },
      },
    });
  }

  async update(
    dictationId: number,
    updateDto: UpdatePerformanceDto,
  ): Promise<Performance> {
    return await prisma.performance.update({
      where: {
        dictationId,
      },
      data: {
        ...(updateDto.totalWords ? { totalWords: updateDto.totalWords } : {}),
        ...(updateDto.correctWords
          ? { correctWords: updateDto.correctWords }
          : {}),
        ...(updateDto.errorsCount
          ? { errorsCount: updateDto.errorsCount }
          : {}),
        ...(updateDto.userInput ? { userInput: updateDto.userInput } : {}),
        ...(updateDto.duration ? { duration: updateDto.duration } : {}),
        ...(updateDto.score ? { score: updateDto.score } : {}),
        ...(updateDto.wpm ? { wpm: updateDto.wpm } : {}),
        ...(updateDto.wpmPenalty ? { wpmPenalty: updateDto.wpmPenalty } : {}),
        ...(updateDto.accuracy ? { accuracy: updateDto.accuracy } : {}),
        ...(updateDto.accuracyPenalty
          ? { accuracyPenalty: updateDto.accuracyPenalty }
          : {}),
      },
    });
  }

  async findAllByDictationId(dictationId: number): Promise<Performance[]> {
    return await prisma.performance.findMany({
      where: {
        dictationId,
      },
    });
  }

  async findFirstByDictationId(dictationId: number): Promise<Performance> {
    return await this.findByDictationId(dictationId);
  }

  async findLastByDictationId(dictationId: number): Promise<Performance> {
    return await this.findByDictationId(dictationId, 'desc');
  }

  private async findByDictationId(
    dictationId: number,
    orderBy: 'asc' | 'desc' = 'asc',
  ): Promise<Performance> {
    const [result] = await prisma.performance.findMany({
      where: {
        dictationId,
      },
      orderBy: [
        {
          performanceId: orderBy,
        },
      ],
      take: 1,
    });

    return result;
  }

  async getDictationAnalytics(textId: number) {
    const performances = await prisma.performance.findMany({
      where: {
        dictation: {
          textId: textId,
        },
      },
      select: {
        score: true,
      },
    });

    const scoreCounts: Record<number, number> = {};
    for (const { score } of performances) {
      scoreCounts[score] = (scoreCounts[score] || 0) + 1;
    }

    return Object.entries(scoreCounts).map(([score, count]) => ({
      score: Number(score),
      count,
    }));
  }

  async getUserPerformanceByText(
    userId: number,
    textId: number,
  ): Promise<Performance | null> {
    const dictation = await prisma.dictations.findFirst({
      where: {
        userId,
        textId,
      },
    });

    if (dictation) {
      return await prisma.performance.findFirst({
        where: {
          dictationId: dictation.dictationId,
        },
      });
    }

    return null;
  }
}

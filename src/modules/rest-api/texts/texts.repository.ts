import { Injectable } from '@nestjs/common';
import { Texts as Text, PrismaClient } from '@prisma/client';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { Levels } from '../../../common/types/Levels';

const prisma = new PrismaClient();

@Injectable()
export class TextsRepository {
  async create(categoryId: number, data: CreateTextDto): Promise<Text> {
    return await prisma.texts.create({
      data: {
        content: data.content,
        wordCount: data.wordCount,
        level: data.level,
        hash: data.hash,
        category: {
          connect: {
            categoryId,
          },
        },
      },
    });
  }

  async update(textId: number, data: UpdateTextDto): Promise<Text> {
    return await prisma.texts.update({
      where: {
        textId,
      },
      data: data,
    });
  }

  async findAll(): Promise<Text[]> {
    return await prisma.texts.findMany({
      include: {
        audioFile: true,
      },
    });
  }

  async findFiltered(filters: {
    level?: Levels;
    category?: string;
  }): Promise<Text[]> {
    let where = {};

    if (filters.category || filters.level) {
      where = {
        ...(filters.category ? { categoryId: +filters.category } : {}),
        ...(filters.level ? { level: filters.level } : {}),
      };
    }

    return await prisma.texts.findMany({
      where: where,
    });
  }

  async findById(textId: number): Promise<Text> {
    return await prisma.texts.findFirst({
      where: {
        textId,
      },
    });
  }

  async getTextData(textId: number, speakerId: string): Promise<Text> {
    return await prisma.texts.findFirst({
      where: {
        textId,
      },
      include: {
        audioFile: {
          where: {
            speakerId,
          },
        },
      },
    });
  }

  async getUserTextPerformance(userId: number, textId: number): Promise<any> {
    return await prisma.dictations.findFirst({
      where: {
        userId,
        textId,
      },
    });
  }

  async findAllUserWords(userId: number) {
    return await prisma.vocabularyGroup.findMany({
      where: {
        userId,
      },
      select: {
        vocabulary: true,
      },
    });
  }
}

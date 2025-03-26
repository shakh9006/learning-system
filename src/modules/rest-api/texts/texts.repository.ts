import { Injectable } from '@nestjs/common';
import { Texts as Text, PrismaClient, TextType } from '@prisma/client';
import { CreateDictationTextDto } from './dto/create-dictation-text.dto';
import { CreateSpeechTextDto } from './dto/create-speech-text.dto';
import { CreateDialogTextDto } from './dto/create-dialog-text.dto';
import { UpdateDictationTextDto } from './dto/update-dictation-text.dto';
import { Levels } from '../../../common/types/Levels';
import { UpdateDialogTextDto } from './dto/update-dialog-text.dto';
import { UpdateSpeechTextDto } from './dto/update-speech-text.dto';

const prisma = new PrismaClient();

@Injectable()
export class TextsRepository {
  async createDictationText(
    categoryId: number,
    data: CreateDictationTextDto,
  ): Promise<Text> {
    return await prisma.texts.create({
      data: {
        content: data.content,
        level: data.level,
        type: data.type,
        category: {
          connect: {
            categoryId,
          },
        },
        dictationMeta: {
          create: {
            hash: data.hash,
            wordCount: data.wordCount,
          },
        },
      },
    });
  }

  async createSpeechText(
    categoryId: number,
    data: CreateSpeechTextDto,
  ): Promise<Text> {
    return await prisma.texts.create({
      data: {
        content: data.content,
        level: data.level,
        type: data.type,
        category: {
          connect: {
            categoryId,
          },
        },
      },
    });
  }

  async createDialogText(
    categoryId: number,
    data: CreateDialogTextDto,
  ): Promise<Text> {
    return await prisma.texts.create({
      data: {
        content: data.content,
        level: data.level,
        type: data.type,
        category: {
          connect: {
            categoryId,
          },
        },
      },
    });
  }

  async updateDictationText(
    textId: string,
    data: UpdateDictationTextDto,
  ): Promise<Text> {
    return await prisma.texts.update({
      where: {
        textId,
      },
      data: {
        ...(data.content ? { content: data.content } : {}),
        ...(data.level ? { level: data.level } : {}),
        dictationMeta: {
          update: {
            ...(data.hash ? { hash: data.hash } : {}),
            ...(data.wordCount ? { wordCount: data.wordCount } : {}),
            ...(data.relatedId ? { relatedId: data.relatedId } : {}),
          },
        },
      },
    });
  }

  async updateDialogText(
    textId: string,
    data: UpdateDialogTextDto,
  ): Promise<Text> {
    return await prisma.texts.update({
      where: {
        textId,
      },
      data: data,
    });
  }

  async updateSpeechText(
    textId: string,
    data: UpdateSpeechTextDto,
  ): Promise<Text> {
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
        dictationMeta: {
          include: {
            audioFile: true,
          },
        },
      },
    });
  }

  async findFiltered(filters: {
    level?: Levels;
    category?: string;
    type?: TextType;
  }): Promise<Text[]> {
    let where = {};

    if (filters.category || filters.level || filters.type) {
      where = {
        ...(filters.category ? { categoryId: +filters.category } : {}),
        ...(filters.level ? { level: filters.level } : {}),
        ...(filters.type ? { type: filters.type } : {}),
      };
    }

    return await prisma.texts.findMany({
      where: where,
      include: {
        dictationMeta: {
          include: {
            audioFile: true,
          },
        },
      },
    });
  }

  async findById(textId: string): Promise<Text> {
    return await prisma.texts.findUnique({
      where: {
        textId,
      },
      include: {
        dictationMeta: {
          include: {
            audioFile: true,
          },
        },
      },
    });
  }

  async getTextData(textId: string, speakerId?: string): Promise<Text> {
    return await prisma.texts.findUnique({
      where: {
        textId,
      },
      ...(speakerId
        ? {
            include: {
              dictationMeta: {
                include: {
                  audioFile: {
                    where: {
                      speakerId,
                    },
                  },
                },
              },
            },
          }
        : {}),
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

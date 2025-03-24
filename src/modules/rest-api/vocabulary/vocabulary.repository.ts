import { Injectable } from '@nestjs/common';
import { Vocabulary, PrismaClient } from '@prisma/client';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

const prisma = new PrismaClient();

@Injectable()
export class VocabularyRepository {
  async create(
    vocabularyGroupId: number,
    data: CreateVocabularyDto & { speaker: string },
  ): Promise<Vocabulary> {
    return await prisma.vocabulary.create({
      data: {
        word: data.word,
        translation: data.translation,
        transcription: data.transcription,
        speaker: data.speaker,
        relatedId: data.relatedId ?? null,
        wordAudioFile: {
          connect: {
            vocabularyAudioFileId: data.wordFileId,
          },
        },
        vocabularyGroup: {
          connect: {
            vocabularyGroupId,
          },
        },
      },
    });
  }

  async update(
    vocabularyId: number,
    vocabularyGroupId: number,
    data: UpdateVocabularyDto,
  ): Promise<Vocabulary> {
    return await prisma.vocabulary.update({
      where: { vocabularyId, vocabularyGroupId },
      data: {
        ...(data.word ? { word: data.word } : {}),
        ...(data.relatedId ? { relatedId: data.relatedId } : {}),
        ...(data.translation ? { translation: data.translation } : {}),
        ...(data.transcription ? { transcription: data.transcription } : {}),
        ...(data.wordFileId
          ? {
              wordAudioFile: {
                connect: {
                  vocabularyAudioFileId: data.wordFileId,
                },
              },
            }
          : {}),
      },
    });
  }

  async delete(
    vocabularyId: number,
    vocabularyGroupId: number,
  ): Promise<Vocabulary> {
    return await prisma.vocabulary.delete({
      where: { vocabularyId, vocabularyGroupId },
    });
  }

  async findAll(
    vocabularyGroupId: number,
    speaker: string,
  ): Promise<Vocabulary[]> {
    return await prisma.vocabulary.findMany({
      where: { vocabularyGroupId, speaker },
      include: {
        wordAudioFile: {
          select: {
            path: true,
          },
        },
      },
    });
  }

  async findOne(
    vocabularyGroupId: number,
    vocabularyId: number,
    speaker: string,
  ): Promise<Vocabulary> {
    return await prisma.vocabulary.findFirst({
      where: {
        vocabularyGroupId,
        vocabularyId,
        speaker,
      },
    });
  }

  async findByRelated(relatedId: number): Promise<Vocabulary> {
    return await prisma.vocabulary.findFirst({
      where: {
        vocabularyId: relatedId,
      },
    });
  }

  async findAllUserWords(userId: number) {
    return await prisma.vocabularyGroup.findMany({
      where: {
        userId,
      },
      select: {
        vocabulary: {
          select: {
            word: true,
          },
        },
      },
    });
  }
}

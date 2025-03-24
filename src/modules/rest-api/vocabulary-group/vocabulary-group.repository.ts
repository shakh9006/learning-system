import { PrismaClient, VocabularyGroup } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateVocabularyGroupDto } from './dto/create-vocabulary-group.dto';
import { UpdateVocabularyGroupDto } from './dto/update-vocabulary-group.dto';

const prisma = new PrismaClient();

@Injectable()
export class VocabularyGroupRepository {
  async findAll(userId: number): Promise<VocabularyGroup[]> {
    return await prisma.vocabularyGroup.findMany({
      where: { userId },
      include: {
        vocabulary: true,
      },
    });
  }

  async findOne(
    userId: number,
    vocabularyGroupId: number,
  ): Promise<VocabularyGroup> {
    return await prisma.vocabularyGroup.findFirst({
      where: { userId, vocabularyGroupId },
    });
  }

  async update(
    userId: number,
    vocabularyGroupId: number,
    data: UpdateVocabularyGroupDto & { slug: string },
  ): Promise<VocabularyGroup> {
    return await prisma.vocabularyGroup.update({
      where: {
        userId,
        vocabularyGroupId,
      },
      data: {
        ...data,
      },
    });
  }

  async delete(
    userId: number,
    vocabularyGroupId: number,
  ): Promise<VocabularyGroup> {
    return await prisma.vocabularyGroup.delete({
      where: {
        vocabularyGroupId,
        userId,
      },
    });
  }

  async create(
    userId: number,
    data: CreateVocabularyGroupDto & { slug: string },
  ): Promise<VocabularyGroup> {
    return await prisma.vocabularyGroup.create({
      data: {
        ...data,
        user: {
          connect: {
            userId,
          },
        },
      },
    });
  }

  async getGeneralGroupId(userId: number): Promise<VocabularyGroup> {
    return await prisma.vocabularyGroup.findFirst({
      where: {
        userId,
        slug: 'general',
      },
    });
  }
}

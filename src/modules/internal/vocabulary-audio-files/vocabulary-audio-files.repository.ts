import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  VocabularyAudioFiles as VocabularyAudioFile,
} from '@prisma/client';
import { CreateVocabularyAudioFileDto } from './dto/create-vocabulary-audio-file.dto';

const prisma = new PrismaClient();

@Injectable()
export class VocabularyAudioFilesRepository {
  async create(
    createData: CreateVocabularyAudioFileDto,
  ): Promise<VocabularyAudioFile> {
    return await prisma.vocabularyAudioFiles.create({
      data: {
        ...createData,
      },
    });
  }

  async findOne(audioFileId: number): Promise<VocabularyAudioFile> {
    return await prisma.vocabularyAudioFiles.findFirst({
      where: {
        vocabularyAudioFileId: audioFileId,
      },
    });
  }
}

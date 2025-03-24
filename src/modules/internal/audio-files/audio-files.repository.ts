import { Injectable } from '@nestjs/common';
import { PrismaClient, AudioFiles as AudioFile } from '@prisma/client';
import { CreateAudioFileDto } from './dto/create-audio-file.dto';

const prisma = new PrismaClient();

@Injectable()
export class AudioFilesRepository {
  async create(
    textId: number,
    createData: CreateAudioFileDto,
  ): Promise<AudioFile> {
    return await prisma.audioFiles.create({
      data: {
        ...createData,
        text: {
          connect: {
            textId,
          },
        },
      },
    });
  }

  async findOne(audioFileId: number): Promise<AudioFile> {
    return await prisma.audioFiles.findFirst({
      where: {
        audioFileId,
      },
    });
  }

  async findOneByText(textId: number): Promise<AudioFile> {
    return await prisma.audioFiles.findFirst({
      where: {
        textId,
      },
    });
  }

  async findOneByFileName(
    textId: number,
    fileName: string,
  ): Promise<AudioFile> {
    return await prisma.audioFiles.findFirst({
      where: {
        fileName,
        textId,
      },
    });
  }
}

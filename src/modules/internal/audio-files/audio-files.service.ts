import { Injectable } from '@nestjs/common';
import { CreateAudioFileDto } from './dto/create-audio-file.dto';
import { AudioFilesRepository } from './audio-files.repository';
import { AudioFiles as AudioFile } from '@prisma/client';

@Injectable()
export class AudioFilesService {
  constructor(private readonly audioFilesRepository: AudioFilesRepository) {}
  async create(
    textId: number,
    createAudioFileDto: CreateAudioFileDto,
  ): Promise<AudioFile> {
    return await this.audioFilesRepository.create(textId, createAudioFileDto);
  }

  async findByFile(textId: number): Promise<AudioFile> {
    return await this.audioFilesRepository.findOneByText(textId);
  }

  async findByFileName(textId: number, fileName: string): Promise<AudioFile> {
    return await this.audioFilesRepository.findOneByFileName(textId, fileName);
  }
}

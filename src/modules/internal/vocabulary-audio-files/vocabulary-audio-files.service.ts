import { Injectable } from '@nestjs/common';
import { VocabularyAudioFiles as VocabularyAudioFile } from '@prisma/client';
import { VocabularyAudioFilesRepository } from './vocabulary-audio-files.repository';
import { CreateVocabularyAudioFileDto } from './dto/create-vocabulary-audio-file.dto';

@Injectable()
export class VocabularyAudioFilesService {
  constructor(
    private readonly vocabularyAudioFilesRepository: VocabularyAudioFilesRepository,
  ) {}
  async create(
    vocabularyAudioFileDto: CreateVocabularyAudioFileDto,
  ): Promise<VocabularyAudioFile> {
    return await this.vocabularyAudioFilesRepository.create(
      vocabularyAudioFileDto,
    );
  }

  async findOne(fileId: number): Promise<VocabularyAudioFile> {
    return await this.vocabularyAudioFilesRepository.findOne(fileId);
  }
}

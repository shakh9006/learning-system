import { BadRequestException, Injectable } from '@nestjs/common';
import { VocabularyRepository } from './vocabulary.repository';
import { Settings, Vocabulary } from '@prisma/client';
import { CreateFullVocabularyDto } from './dto/create-full-vocabulary.dto';
import { VocabularyGroupService } from '../vocabulary-group/vocabulary-group.service';
import { WorkflowService } from '../../system/workflow/workflow.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { GeneratedWordsDto } from './dto/generated-words.dto';
import { SettingsService } from '../settings/settings.service';
import { StorageService } from '../../system/storage/storage.service';
import { TextsService } from '../texts/texts.service';

@Injectable()
export class VocabularyService {
  constructor(
    private readonly vocabularyRepository: VocabularyRepository,
    private readonly vocabularyGroupService: VocabularyGroupService,
    private readonly workFlow: WorkflowService,
    private readonly settingsService: SettingsService,
    private readonly storageService: StorageService,
    private readonly textsService: TextsService,
  ) {}

  async create(
    userId: number,
    createFullVocabularyDto: CreateFullVocabularyDto,
  ): Promise<number> {
    // eslint-disable-next-line prefer-const
    let { vocabularyGroupId, word, generateText } = createFullVocabularyDto;

    if (!vocabularyGroupId) {
      const generalGroup =
        await this.vocabularyGroupService.getGeneralGroupId(userId);
      if (!generalGroup) {
        throw new BadRequestException('GeneralGroupId not found');
      }

      vocabularyGroupId = generalGroup.vocabularyGroupId;
    }

    const vocabularyGroup = await this.vocabularyGroupService.findOne(
      userId,
      vocabularyGroupId,
    );

    if (!vocabularyGroup) {
      throw new BadRequestException(
        `Vocabulary group with id: ${vocabularyGroupId} not found`,
      );
    }

    const result: CreateVocabularyDto[] = await this.workFlow.generateWordData(
      userId,
      word,
      createFullVocabularyDto as unknown as GeneratedWordsDto,
      generateText,
    );

    const ids: number[] = [];
    for (const res of result) {
      const vocabulary = await this.vocabularyRepository.create(
        vocabularyGroupId,
        res,
      );
      ids.push(vocabulary.vocabularyId);
    }

    const [id1, id2] = ids;
    await this.vocabularyRepository.update(id1, vocabularyGroupId, {
      relatedId: id2,
    });

    await this.vocabularyRepository.update(id2, vocabularyGroupId, {
      relatedId: id1,
    });

    return vocabularyGroupId;
  }

  async findAll(userId: number): Promise<Vocabulary[]> {
    return await this.vocabularyRepository.findAll(userId, '');
  }

  async findByGroupId(userId: number, groupId: number): Promise<Vocabulary[]> {
    const group = await this.vocabularyGroupService.findOne(userId, groupId);
    if (!group) {
      throw new BadRequestException(
        `Vocabulary group with id: ${groupId} not found`,
      );
    }

    const speaker: Settings = await this.settingsService.findByKey(
      userId,
      'speakerId',
    );

    const list: any[] = await this.vocabularyRepository.findAll(
      groupId,
      speaker.optionValue,
    );

    const result: Vocabulary[] = [];

    for (const res of list) {
      const wordAudioFilePath = res.wordAudioFile.path as string;
      res.wordAudioFile.path =
        await this.storageService.getPresignedUrl(wordAudioFilePath);
      result.push(res);
    }

    return result;
  }

  async update(
    userId: number,
    vocabularyId: number,
    data: CreateFullVocabularyDto,
  ): Promise<void> {
    const speaker: Settings = await this.settingsService.findByKey(
      userId,
      'speakerId',
    );

    const { vocabularyGroupId } = data;

    const vocabulary: Vocabulary = await this.vocabularyRepository.findOne(
      vocabularyGroupId,
      vocabularyId,
      speaker.optionValue,
    );

    if (!vocabulary) {
      throw new BadRequestException('Vocabulary not found');
    }

    const relatedVocabulary: Vocabulary =
      await this.vocabularyRepository.findByRelated(vocabulary.relatedId);

    if (relatedVocabulary) {
      const result: CreateVocabularyDto[] = await this.workFlow.updateWordData(
        userId,
        data as unknown as GeneratedWordsDto,
        data.generateText,
      );

      for (const res of result) {
        if (res.speaker === vocabulary.speaker) {
          await this.vocabularyRepository.update(
            vocabularyId,
            vocabularyGroupId,
            {
              ...res,
              relatedId: relatedVocabulary.vocabularyId,
            },
          );
        } else if (res.speaker === relatedVocabulary.speaker) {
          await this.vocabularyRepository.update(
            relatedVocabulary.vocabularyId,
            vocabularyGroupId,
            {
              ...res,
              relatedId: vocabulary.vocabularyId,
            },
          );
        }
      }
    }
  }

  async remove(userId: number, vocabularyId: number) {
    const speaker: Settings = await this.settingsService.findByKey(
      userId,
      'speakerId',
    );

    const vocabulary: Vocabulary = await this.vocabularyRepository.findOne(
      userId,
      vocabularyId,
      speaker.optionValue,
    );
    if (!vocabulary) {
      throw new BadRequestException();
    }

    await this.vocabularyRepository.delete(vocabularyId, userId);
    await this.vocabularyRepository.delete(vocabulary.relatedId, userId);
  }

  async userWordsFromText(userId: number, textId: number): Promise<string[]> {
    return await this.textsService.userWordsFromText(userId, textId);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVocabularyGroupDto } from './dto/create-vocabulary-group.dto';
import { UpdateVocabularyGroupDto } from './dto/update-vocabulary-group.dto';
import { VocabularyGroupRepository } from './vocabulary-group.repository';
import { VocabularyGroup } from '@prisma/client';
import generateSlug from '../../../utils/generateSlug';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class VocabularyGroupService {
  constructor(
    private readonly vocabularyGroupRepository: VocabularyGroupRepository,
    private readonly settingsService: SettingsService,
  ) {}

  async create(
    userId: number,
    createVocabularyGroupDto: CreateVocabularyGroupDto,
  ): Promise<VocabularyGroup> {
    const slug = generateSlug(createVocabularyGroupDto.name);
    const data = {
      ...createVocabularyGroupDto,
      slug,
    };

    return await this.vocabularyGroupRepository.create(userId, data);
  }

  async findAll(userId: number): Promise<VocabularyGroup[]> {
    const speakerId = await this.settingsService.findByKey(userId, 'speakerId');

    const result: VocabularyGroup[] = [];
    const vocabularyGroup: any[] =
      await this.vocabularyGroupRepository.findAll(userId);

    // speakerId.optionValue

    for (const vGroup of vocabularyGroup) {
      const vocabularyCount =
        vGroup?.vocabulary?.filter((v) => v.speaker === speakerId.optionValue)
          ?.length || 0;
      const v = {
        ...(vGroup as VocabularyGroup),
        wordsCount: vocabularyCount,
      };

      result.push(v);
    }

    return result;
  }

  async findOne(
    userId: number,
    vocabularyGroupId: number,
  ): Promise<VocabularyGroup | never> {
    const result = await this.vocabularyGroupRepository.findOne(
      userId,
      vocabularyGroupId,
    );

    if (!result) {
      throw new BadRequestException(
        `Vocabulary group with id: ${vocabularyGroupId} does not exist`,
      );
    }

    return result;
  }

  async update(
    userId: number,
    vocabularyGroupId: number,
    updateVocabularyGroupDto: UpdateVocabularyGroupDto,
  ) {
    const result = await this.vocabularyGroupRepository.findOne(
      userId,
      vocabularyGroupId,
    );

    if (!result) {
      throw new BadRequestException(
        `Vocabulary group with id: ${vocabularyGroupId} does not exist`,
      );
    }

    const slug = generateSlug(updateVocabularyGroupDto.name);
    const data = {
      ...updateVocabularyGroupDto,
      slug,
    };

    return await this.vocabularyGroupRepository.update(
      userId,
      vocabularyGroupId,
      data,
    );
  }

  async remove(userId: number, vocabularyGroupId: number) {
    const result = await this.vocabularyGroupRepository.findOne(
      userId,
      vocabularyGroupId,
    );

    if (!result) {
      throw new BadRequestException(
        `Vocabulary group with id: ${vocabularyGroupId} does not exist`,
      );
    }

    return await this.vocabularyGroupRepository.delete(
      userId,
      vocabularyGroupId,
    );
  }

  async createDefaultGroup(userId: number) {
    await this.create(userId, {
      name: 'General',
    });
  }

  async getGeneralGroupId(userId: number) {
    return await this.vocabularyGroupRepository.getGeneralGroupId(userId);
  }
}

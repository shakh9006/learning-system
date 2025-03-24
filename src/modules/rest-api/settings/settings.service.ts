import { Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsRepository } from './settings.repository';
import { Settings, SettingsOptions } from '@prisma/client';
import { SaveSettingDto } from './dto/save-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async findAll(userId: number): Promise<Settings[]> {
    return await this.settingsRepository.findAll(userId);
  }

  async findByKey(
    userId: number,
    optionKey: SettingsOptions,
  ): Promise<Settings> {
    return await this.settingsRepository.findByKey(userId, optionKey);
  }

  async findById(userId: number, settingsId: number): Promise<Settings> {
    return await this.settingsRepository.findById(userId, settingsId);
  }

  async update(
    userId: number,
    settingsId: number,
    updateSettingDto: UpdateSettingDto,
  ) {
    return await this.settingsRepository.update(
      userId,
      settingsId,
      updateSettingDto,
    );
  }

  async save(userId: number, saveSettingDto: SaveSettingDto) {
    const settings = saveSettingDto.settings;
    for (const key in settings) {
      const settingsFromDB = await this.settingsRepository.findByKey(
        userId,
        key as SettingsOptions,
      );

      if (settingsFromDB) {
        const optionValue: string = settings[key];
        const optionName = key as SettingsOptions;
        await this.settingsRepository.update(
          userId,
          settingsFromDB.settingsId,
          {
            optionValue,
            optionName,
          },
        );
      }
    }
  }

  async remove(userId: number, settingsId: number) {
    return await this.settingsRepository.delete(userId, settingsId);
  }

  async setDefaultSettings(userId: number): Promise<void> {
    const settingsOptions: Record<SettingsOptions, string> = {
      speakerId: 'en-US-Studio-Q',
      askAddNewWord: 'yes',
    };

    for (const key in settingsOptions) {
      const optionName = key as SettingsOptions;
      await this.settingsRepository.create(userId, {
        optionName,
        optionValue: settingsOptions[key],
      });
    }
  }
}

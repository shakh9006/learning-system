import { Injectable } from '@nestjs/common';
import { Settings, PrismaClient, SettingsOptions } from '@prisma/client';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

const prisma = new PrismaClient();

@Injectable()
export class SettingsRepository {
  async create(userId: number, data: CreateSettingDto): Promise<Settings> {
    return await prisma.settings.create({
      data: {
        ...data,
        user: {
          connect: {
            userId: userId,
          },
        },
      },
    });
  }

  async update(
    userId: number,
    settingsId: number,
    data: UpdateSettingDto,
  ): Promise<Settings> {
    return await prisma.settings.update({
      where: {
        userId,
        settingsId,
      },
      data: {
        ...data,
      },
    });
  }

  async findAll(userId: number): Promise<Settings[]> {
    return await prisma.settings.findMany({
      where: {
        userId,
      },
    });
  }

  async findByKey(
    userId: number,
    optionName: SettingsOptions,
  ): Promise<Settings> {
    return await prisma.settings.findFirst({
      where: {
        userId,
        optionName,
      },
    });
  }

  async findById(userId: number, settingsId: number): Promise<Settings> {
    return await prisma.settings.findFirst({
      where: {
        userId,
        settingsId,
      },
    });
  }

  async delete(userId: number, settingsId: number): Promise<Settings> {
    return await prisma.settings.delete({
      where: {
        userId,
        settingsId,
      },
    });
  }
}

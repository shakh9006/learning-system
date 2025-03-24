import { IsString } from 'class-validator';
import { SettingsOptions } from '@prisma/client';

export class CreateSettingDto {
  @IsString({ message: 'Must be string' })
  optionName: SettingsOptions;

  @IsString({ message: 'Must be string' })
  optionValue: string;
}

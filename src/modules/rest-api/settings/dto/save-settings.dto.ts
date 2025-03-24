import { SettingsOptions } from '@prisma/client';

export class SaveSettingDto {
  settings: Record<SettingsOptions, string>;
}

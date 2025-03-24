import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsOptions } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { SaveSettingDto } from './dto/save-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: TokensPayload) {
    const result = await this.settingsService.findAll(user.userId);
    return {
      success: true,
      message: `Successfully retrieved all settings`,
      data: result,
    };
  }

  @Get(':key')
  @UseGuards(JwtAuthGuard)
  async findByKey(
    @CurrentUser() user: TokensPayload,
    @Param('key') key: SettingsOptions,
  ) {
    const result = await this.settingsService.findByKey(user.userId, key);

    return {
      success: true,
      message: `Successfully retrieved settings by key`,
      data: result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@CurrentUser() user: TokensPayload, @Param('id') id: string) {
    const result = await this.settingsService.findById(user.userId, +id);

    return {
      success: true,
      message: `Successfully retrieved settings by id`,
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: TokensPayload,
    @Param('id') id: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    const result = await this.settingsService.update(
      user.userId,
      +id,
      updateSettingDto,
    );

    return {
      success: true,
      message: `Successfully updated`,
      data: result,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async save(
    @CurrentUser() user: TokensPayload,
    @Body() saveSettingDto: SaveSettingDto,
  ) {
    const result = await this.settingsService.save(user.userId, saveSettingDto);

    return {
      success: true,
      message: `Successfully updated`,
      data: result,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@CurrentUser() user: TokensPayload, @Param('id') id: string) {
    const result = await this.settingsService.remove(user.userId, +id);

    return {
      success: true,
      message: `Successfully removed`,
      data: result,
    };
  }
}

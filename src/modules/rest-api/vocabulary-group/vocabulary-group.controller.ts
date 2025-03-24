import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VocabularyGroupService } from './vocabulary-group.service';
import { CreateVocabularyGroupDto } from './dto/create-vocabulary-group.dto';
import { UpdateVocabularyGroupDto } from './dto/update-vocabulary-group.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vocabulary-group')
export class VocabularyGroupController {
  constructor(
    private readonly vocabularyGroupService: VocabularyGroupService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: TokensPayload,
    @Body() createVocabularyGroupDto: CreateVocabularyGroupDto,
  ) {
    await this.vocabularyGroupService.create(
      user.userId,
      createVocabularyGroupDto,
    );

    const vocabularyGroupList = await this.vocabularyGroupService.findAll(
      user.userId,
    );

    return {
      success: true,
      message: 'Success',
      data: vocabularyGroupList,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: TokensPayload) {
    const result = await this.vocabularyGroupService.findAll(user.userId);
    return {
      success: true,
      message: 'Success',
      data: result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@CurrentUser() user: TokensPayload, @Param('id') id: number) {
    const result = await this.vocabularyGroupService.findOne(user.userId, +id);
    return {
      success: true,
      message: 'Success',
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: TokensPayload,
    @Param('id') id: number,
    @Body() updateVocabularyGroupDto: UpdateVocabularyGroupDto,
  ) {
    return await this.vocabularyGroupService.update(
      user.userId,
      +id,
      updateVocabularyGroupDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@CurrentUser() user: TokensPayload, @Param('id') id: number) {
    await this.vocabularyGroupService.remove(user.userId, +id);

    const vocabularyGroupList = await this.vocabularyGroupService.findAll(
      user.userId,
    );

    return {
      success: true,
      message: 'Success',
      data: vocabularyGroupList,
    };
  }
}

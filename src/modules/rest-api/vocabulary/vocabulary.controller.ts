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
import { VocabularyService } from './vocabulary.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFullVocabularyDto } from './dto/create-full-vocabulary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Vocabulary')
@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  @ApiOperation({ summary: 'Create Vocabulary' })
  @ApiResponse({ status: 201 })
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: TokensPayload,
    @Body() createVocabularyDto: CreateFullVocabularyDto,
  ) {
    const vocabularyGroupId: number = await this.vocabularyService.create(
      user.userId,
      createVocabularyDto,
    );

    const result = await this.vocabularyService.findByGroupId(
      user.userId,
      vocabularyGroupId,
    );

    return {
      success: true,
      message: 'Retrieved all Vocabularies',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get All Vocabularies' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: TokensPayload, @Param('id') id: number) {
    const result = await this.vocabularyService.findByGroupId(user.userId, +id);

    return {
      success: true,
      message: 'Retrieved all Vocabularies',
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vocabulary by id' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: TokensPayload,
    @Param('id') id: number,
    @Body() updateVocabularyDto: CreateFullVocabularyDto,
  ) {
    await this.vocabularyService.update(user.userId, +id, updateVocabularyDto);

    const result = await this.vocabularyService.findByGroupId(
      user.userId,
      updateVocabularyDto.vocabularyGroupId,
    );

    return {
      success: true,
      message: 'Updated Vocabulary',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vocabulary by id' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  async remove(@CurrentUser() user: TokensPayload, @Param('id') id: number) {
    await this.vocabularyService.remove(user.userId, +id);
  }
}

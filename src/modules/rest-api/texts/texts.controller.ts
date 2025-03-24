import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtRoleGuard } from '../auth/guards/roles.guard';
import { TextsService } from './texts.service';
import { TextQueryDto } from './dto/text-query.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('texts')
export class TextsController {
  constructor(private readonly textsService: TextsService) {}

  @Get('/')
  @UseGuards(JwtRoleGuard)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: TokensPayload,
    @Query() query: TextQueryDto,
  ) {
    const data = await this.textsService.getFilteredTexts(user.userId, query);
    return {
      message: 'Texts retrieved successfully.',
      success: true,
      data,
    };
  }

  @Get(':id')
  @UseGuards(JwtRoleGuard)
  @UseGuards(JwtAuthGuard)
  async findOne(@CurrentUser() user: TokensPayload, @Param('id') id: number) {
    const data = await this.textsService.getTextData(user.userId, +id);
    const { analytics, performance } =
      await this.textsService.getUserTextPerformance(user.userId, +id);

    const words = await this.textsService.userWordsFromText(user.userId, +id);
    return {
      message: 'Text retrieved successfully.',
      success: true,
      data: {
        text: data,
        analytics,
        performance,
        words,
      },
    };
  }
}

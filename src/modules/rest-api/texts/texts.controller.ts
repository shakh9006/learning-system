import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtRoleGuard } from '../auth/guards/roles.guard';
import { TextsService } from './texts.service';
import { TextQueryDto } from './dto/text-query.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Texts')
@ApiBearerAuth()
@Controller('texts')
export class TextsController {
  constructor(private readonly textsService: TextsService) {}

  @ApiOperation({ summary: 'Get all texts with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of texts based on query parameters',
    schema: {
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/FilteredTextDto' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ type: TextQueryDto })
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

  @ApiOperation({ summary: 'Get detailed text data by ID' })
  @ApiResponse({
    status: 200,
    description:
      'Returns text data with analytics, performance, and vocabulary words',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Text not found' })
  @ApiParam({ name: 'id', description: 'Text ID', type: 'string' })
  @Get(':id')
  @UseGuards(JwtRoleGuard)
  @UseGuards(JwtAuthGuard)
  async findOne(@CurrentUser() user: TokensPayload, @Param('id') id: string) {
    const data = await this.textsService.getTextData(user.userId, id);
    const { analytics, performance } =
      await this.textsService.getUserTextPerformance(user.userId, id);

    const words = await this.textsService.userWordsFromText(user.userId, id);
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

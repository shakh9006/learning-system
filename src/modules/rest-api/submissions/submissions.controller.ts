import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CheckSubmissionDto } from './dto/check-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { VocabularyService } from '../vocabulary/vocabulary.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Submissions')
@ApiBearerAuth()
@Controller('submissions')
export class SubmissionsController {
  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly vocabularyService: VocabularyService,
  ) {}

  @ApiOperation({ summary: 'Check user dictation submission' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns performance metrics, analytics, and vocabulary information',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/check')
  @UseGuards(JwtAuthGuard)
  async check(
    @CurrentUser() user: TokensPayload,
    @Body() createSubmissionDto: CheckSubmissionDto,
  ) {
    const performance =
      await this.submissionsService.checkSubmission(createSubmissionDto);

    const analytics = await this.submissionsService.getAnalytics(
      createSubmissionDto.textId,
    );

    const words = await this.vocabularyService.userWordsFromText(
      user.userId,
      createSubmissionDto.textId,
    );

    return {
      success: true,
      message: 'Retrieved submission result',
      data: {
        performance,
        analytics,
        words,
      },
    };
  }

  @ApiOperation({ summary: 'Save dictation submission results' })
  @ApiResponse({ status: 200, description: 'Submission saved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/save')
  @UseGuards(JwtAuthGuard)
  async save(
    @CurrentUser() user: TokensPayload,
    @Body() createSubmissionDto: CheckSubmissionDto,
  ) {
    await this.submissionsService.saveSubmission(
      user.userId,
      createSubmissionDto,
    );

    return {
      success: true,
      message: 'Saved submission result',
    };
  }
}

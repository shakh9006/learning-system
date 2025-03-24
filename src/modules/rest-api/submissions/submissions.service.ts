import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckSubmissionDto } from './dto/check-submission.dto';
import { DictationsService } from '../../internal/dictations/dictations.service';
import { TextsService } from '../texts/texts.service';
import { Texts as Text } from '@prisma/client';
import { PerformanceService } from '../../internal/performance/performance.service';
import { ScoreResult } from '../../internal/dictations/types/score-result.type';
import { CreatePerformanceDto } from '../../internal/performance/dto/create-performance.dto';
import { AchievementsService } from '../../internal/achievements/achievements.service';
import { PointsService } from '../../internal/points/points.service';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly dictationsService: DictationsService,
    private readonly textsService: TextsService,
    private readonly performanceService: PerformanceService,
    private readonly achievementsService: AchievementsService,
    private readonly pointsService: PointsService,
  ) {}

  async checkSubmission(submissionDto: CheckSubmissionDto) {
    const { textId, userInput, duration } = submissionDto;
    const text: Text = await this.textsService.findOne(textId);

    if (!text) {
      throw new BadRequestException(`TextId ${textId} not found`);
    }

    const highlights = this.dictationsService.highlightTextDifferences(
      text.content,
      userInput,
    );

    const mistakes = highlights.filter(
      (highlight) => highlight.type !== 'correct',
    );

    const totalWords: number = text.content.split(' ').length;
    const scoreResult: ScoreResult =
      this.performanceService.calculateFinalScore(
        totalWords,
        mistakes.length,
        duration,
        text.level,
      );

    const performance: CreatePerformanceDto = {
      wpm: scoreResult.wpm,
      score: +scoreResult.finalScore.toFixed(2),
      accuracy: scoreResult.accuracy,
      totalWords,
      errorsCount: mistakes.length,
      correctWords: highlights.length - mistakes.length,
      duration: duration,
      accuracyPenalty: scoreResult.accuracyPenalty,
      wpmPenalty: scoreResult.wpmPenalty,
      userInput,
    };

    return { ...performance, textId };
  }

  async getAnalytics(textId: number) {
    const scores = [...Array(10)].map((_, i) => i + 1);
    const data: { score: number; x: string; y: number }[] = [];

    for (const score of scores) {
      let randomNum: number = 0;
      if (score <= 5) {
        randomNum = Math.random() * (80 - 30) + 30; // Between 30 and 80
      } else if (score <= 7) {
        randomNum = Math.random() * (40 - 25) + 25; // Between 25 and 40
      } else {
        randomNum = Math.random() * (10 - 5) + 5; // Between 5 and 10
      }

      data.push({
        score: score,
        x: `${score}/10`,
        y: Math.floor(randomNum),
      });
    }

    const res = await this.performanceService.getDictationAnalytics(textId);

    for (const analytic of res) {
      const idx = data.findIndex((el) => el.score === analytic.score);
      if (idx !== -1) {
        data[idx].y += analytic.count;
      }
    }

    return data;
  }

  async saveSubmission(userId: number, submissionDto: CheckSubmissionDto) {
    const submissionData = await this.checkSubmission(submissionDto);
    const textId = submissionData.textId;
    delete submissionData.textId;

    const result = await this.dictationsService.create(
      userId,
      textId,
      submissionData,
    );

    await this.pointsService.applyPoints(userId, {
      newPoints: submissionData.score,
      reason: 'task',
      message: 'task completed',
      textId,
    });

    await this.achievementsService.checkAchievements(userId);
    return result;
  }
}

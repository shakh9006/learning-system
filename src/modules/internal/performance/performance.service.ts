import { Injectable } from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { PerformanceRepository } from './performance.repository';
import { Performance } from '@prisma/client';
import { Levels } from '../../../common/types/Levels';
import { ScoreResult } from '../exercises/types/score-result.type';
import { UpdatePerformanceDto } from './dto/update-performance.dto';

@Injectable()
export class PerformanceService {
  constructor(private readonly performanceRepository: PerformanceRepository) {}

  async create(
    dictationId: number,
    createPerformanceDto: CreatePerformanceDto,
  ): Promise<Performance> {
    return await this.performanceRepository.create(
      dictationId,
      createPerformanceDto,
    );
  }

  async update(
    dictationId: number,
    updatePerformanceDto: UpdatePerformanceDto,
  ): Promise<Performance> {
    return await this.performanceRepository.update(
      dictationId,
      updatePerformanceDto,
    );
  }

  async findAll(dictationId: number): Promise<Performance[]> {
    return await this.performanceRepository.findAllByDictationId(dictationId);
  }

  async findFirst(dictationId: number): Promise<Performance> {
    return await this.performanceRepository.findFirstByDictationId(dictationId);
  }

  async findLast(dictationId: number): Promise<Performance> {
    return await this.performanceRepository.findLastByDictationId(dictationId);
  }

  async getDictationAnalytics(textId: string) {
    return await this.performanceRepository.getDictationAnalytics(textId);
  }

  async getUserPerformanceByText(
    userId: number,
    textId: string,
  ): Promise<Performance> {
    return await this.performanceRepository.getUserPerformanceByText(
      userId,
      textId,
    );
  }

  private calculateAccuracy(totalWords: number, mistakes: number): number {
    if (totalWords === 0) return 0;
    return Math.max(0, ((totalWords - mistakes) / totalWords) * 100);
  }

  private calculateWPM(totalWords: number, timeSpent: number): number {
    if (timeSpent === 0) return 0; // Avoid division by zero
    return (totalWords * 60) / timeSpent;
  }

  private getWPMPenalty(
    totalWords: number,
    timeSpent: number,
    level: Levels,
  ): number {
    const pureTimeSpent = level === 'easy' ? 30 : level === 'medium' ? 45 : 60;
    const standardTime = this.calculateWPM(totalWords, pureTimeSpent);
    const extraTime = Math.max(0, Math.floor(timeSpent - standardTime));

    const deduction = level === 'easy' ? 0.1 : level === 'medium' ? 0.2 : 0.3;
    return extraTime * deduction;
  }

  calculateFinalScore(
    totalWords: number,
    mistakeWords: number,
    timeSpent: number,
    difficulty: Levels,
  ): ScoreResult {
    const maxScore =
      difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;

    const accuracy = this.calculateAccuracy(totalWords, mistakeWords);
    const wpm = this.calculateWPM(totalWords, timeSpent);
    const accuracyPenalty = Math.floor(
      Math.max(0, 0.1 * Math.max(100 - accuracy, 0)),
    );

    const wpmPenalty = this.getWPMPenalty(totalWords, timeSpent, difficulty);

    let finalScore = maxScore - accuracyPenalty - wpmPenalty;
    finalScore = Math.max(1, finalScore);

    return {
      accuracy: +accuracy.toFixed(1),
      wpm: +wpm.toFixed(1),
      finalScore: Math.round(finalScore),
      wpmPenalty: +wpmPenalty.toFixed(1),
      accuracyPenalty: accuracyPenalty,
    };
  }
}

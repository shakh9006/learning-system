import { Injectable } from '@nestjs/common';
import { Dictations as Dictation } from '@prisma/client';
import { ExercisesRepository } from './exercises.repository';
import { TextsService } from '../../rest-api/texts/texts.service';
import { PerformanceService } from '../performance/performance.service';
import { CreatePerformanceDto } from '../performance/dto/create-performance.dto';
import { IHighlightType } from './types/highlight.type';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly dictationsRepository: ExercisesRepository,
    private readonly textsService: TextsService,
    private readonly performanceService: PerformanceService,
  ) {}

  async create(
    userId: number,
    textId: number,
    performanceData: CreatePerformanceDto,
  ): Promise<Dictation | never> {
    const text = await this.textsService.findOne(textId);
    if (!text) {
      throw Error('Text not found');
    }

    let dictation: Dictation;
    const existsDictation = await this.findOne(userId, textId);
    if (!existsDictation) {
      dictation = await this.dictationsRepository.create(
        userId,
        textId,
        performanceData,
      );
    } else {
      dictation = existsDictation;
      await this.performanceService.update(
        dictation.dictationId,
        performanceData,
      );
    }

    return dictation;
  }

  async getUserDictationsCount(userId: number): Promise<number> {
    return await this.dictationsRepository.getUserDictationCount(userId);
  }

  async getUserDictationPerformanceByText(userId: number, textId: number) {
    console.log('userId: ', userId);
    console.log('textId: ', textId);
    return;
  }

  async findOne(userId: number, textId: number): Promise<Dictation> {
    return await this.dictationsRepository.findOne(userId, textId);
  }

  highlightTextDifferences(
    originalText: string,
    userInputText: string,
  ): IHighlightType[] {
    const splitWords = (text: string) => text.match(/\b\w+\b|[.,!?;]/g) || [];
    const originalWords = splitWords(originalText);
    const userWords = splitWords(userInputText);
    const result: IHighlightType[] = [];

    let i = 0,
      j = 0;

    while (j < userWords.length) {
      if (i < originalWords.length && originalWords[i] === userWords[j]) {
        result.push({ type: 'correct', word: originalWords[i], idx: i });
        i++;
        j++;
      } else {
        const foundInOriginal: number = originalWords
          .slice(i + 1)
          .indexOf(userWords[j]);
        const foundInUser: number = userWords
          .slice(j + 1)
          .indexOf(originalWords[i]);

        if (
          foundInOriginal !== -1 &&
          (foundInUser === -1 || foundInOriginal < foundInUser)
        ) {
          result.push({
            type: 'missing',
            word: originalWords[i],
            idx: i,
            input: '',
          });
          i++;
        } else if (foundInUser !== -1) {
          result.push({
            type: 'not_exists',
            word: '',
            idx: j,
            input: userWords[j],
          });
          j++;
        } else {
          const wordWithoutPunctuation =
            originalWords[i]?.replace(/[.,!?;]+$/, '') || '';
          const punctuation =
            originalWords[i]?.slice(wordWithoutPunctuation.length) || '';
          const inputWordWithoutPunctuation =
            userWords[j]?.replace(/[.,!?;]+$/, '') || '';

          if (wordWithoutPunctuation === inputWordWithoutPunctuation) {
            result.push({
              type: 'correct',
              word: wordWithoutPunctuation,
              idx: i,
            });
            if (punctuation) {
              result.push({
                type: 'missing',
                word: punctuation,
                idx: i,
                input: '',
              });
            }
          } else {
            result.push({
              type: 'mistake',
              word: originalWords[i] || '',
              idx: i,
              input: userWords[j] || '',
            });
          }
          i++;
          j++;
        }
      }
    }

    while (i < originalWords.length) {
      result.push({
        type: 'missing',
        word: originalWords[i],
        idx: i,
        input: '',
      });
      i++;
    }

    return result;
  }
}

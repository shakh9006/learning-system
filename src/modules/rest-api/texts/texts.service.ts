import { Injectable } from '@nestjs/common';
import { CreateDictationTextDto } from './dto/create-dictation-text.dto';
import { TextsRepository } from './texts.repository';
import { Texts as Text, TextType } from '@prisma/client';
import { GeneratedText } from '../../system/chat-gtp/types/GeneratedText';
import { FilteredTextDto } from './dto/filtered-text.dto';
import { TextQueryDto } from './dto/text-query.dto';
import generateHash from '../../../utils/generateHash';
import { SettingsService } from '../settings/settings.service';
import { StorageService } from '../../system/storage/storage.service';
import { PerformanceService } from '../../internal/performance/performance.service';
import { CreateSpeechTextDto } from './dto/create-speech-text.dto';

@Injectable()
export class TextsService {
  constructor(
    private readonly textsRepository: TextsRepository,
    private readonly settingsService: SettingsService,
    private readonly storageService: StorageService,
    private readonly performanceService: PerformanceService,
  ) {}

  async createDictationText(
    categoryId: number,
    createTextDto: CreateDictationTextDto,
  ): Promise<Text> {
    return await this.textsRepository.createDictationText(
      categoryId,
      createTextDto,
    );
  }

  async createSpeechText(
    categoryId: number,
    createTextDto: CreateSpeechTextDto,
  ): Promise<Text> {
    return await this.textsRepository.createSpeechText(
      categoryId,
      createTextDto,
    );
  }

  async createDialogText(
    categoryId: number,
    createTextDto: CreateSpeechTextDto,
  ): Promise<Text> {
    return await this.textsRepository.createDialogText(
      categoryId,
      createTextDto,
    );
  }

  async findAll(): Promise<Text[]> {
    return this.textsRepository.findAll();
  }

  async getFilteredTexts(
    userId: number,
    filters: TextQueryDto,
  ): Promise<FilteredTextDto[]> {
    const texts: Text[] = await this.textsRepository.findFiltered(filters);

    return texts.map(
      (text): FilteredTextDto => ({
        textId: text.textId,
        activity: 0,
        level: text.level,
        content: text.content.slice(0, 30) + '...',
        categoryId: text.categoryId,
      }),
    );
  }

  async findOne(id: string): Promise<Text> {
    return await this.textsRepository.findById(id);
  }

  async getTextData(userId: number, id: string): Promise<any> {
    const speakerId = await this.settingsService.findByKey(userId, 'speakerId');
    const res = (await this.textsRepository.getTextData(
      id,
      speakerId.optionValue,
    )) as any;

    if (res) {
      const audioFiles = {
        chunk: res?.dictationMeta?.audioFile?.filter(
          (audio) => audio.readingMode === 'chunk',
        ),
        sentences: res?.dictationMeta?.audioFile?.filter(
          (audio) => audio.readingMode === 'sentence',
        ),
        full: res?.dictationMeta?.audioFile?.find(
          (audio) => audio.readingMode === 'full',
        ),
      };

      const data = {
        chunks: [],
        sentences: [],
        full: null,
      };

      for (const audio of audioFiles.chunk) {
        data.chunks.push({
          fileId: audio.audioFileId,
          fileName: audio.fileName,
          path: await this.storageService.getPresignedUrl(
            `${audio.hashedFileName}.mp3`,
          ),
        });
      }

      for (const audio of audioFiles.sentences) {
        data.sentences.push({
          fileId: audio.audioFileId,
          filename: audio.fileName,
          path: await this.storageService.getPresignedUrl(
            `${audio.hashedFileName}.mp3`,
          ),
        });
      }

      data.full = await this.storageService.getPresignedUrl(
        `${audioFiles.full.hashedFileName}.mp3`,
      );

      res.audioFile = data;
    }

    return res || null;
  }

  async getUserTextPerformance(userId: number, textId: string): Promise<any> {
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

    const userPerformance =
      await this.performanceService.getUserPerformanceByText(userId, textId);

    return { analytics: data, performance: userPerformance };
  }

  async userWordsFromText(userId: number, textId: string): Promise<string[]> {
    const text: Text = await this.findOne(textId);
    let words: string[] = [];
    if (text) {
      const articles = ['a', 'an', 'the', 'is', 'are', 'to', 'of'];
      words = text.content?.split(' ');
      words = [...new Set(words)];
      words = words.filter((word) => !articles.includes(word));
    }

    const userWords = await this.textsRepository.findAllUserWords(userId);

    let userWordsList = [];
    for (let i = 0; i < userWords.length; i++) {
      const words = userWords[i];
      if (words?.vocabulary?.length) {
        for (let j = 0; j < words?.vocabulary?.length; j++) {
          const current = words?.vocabulary[j];
          userWordsList = [...new Set([...userWordsList, current.word])];
        }
      }
    }

    userWordsList = userWordsList.map((word) => word.toLowerCase());
    words = words.filter((word) => !userWordsList.includes(word.toLowerCase()));

    return words.map((w) => w.replace(/[^a-zA-Z0-9 ]/g, ''));
  }

  prepareCreateTextData(text: GeneratedText): CreateDictationTextDto {
    return {
      content: text.content,
      wordCount: text.content.split(' ')?.length,
      type: TextType.DICTATION,
      level: text.level,
      hash: generateHash(`${text.content}_${text.speaker}`),
    };
  }
}

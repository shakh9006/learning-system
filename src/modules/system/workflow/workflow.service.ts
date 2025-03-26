import { Injectable } from '@nestjs/common';
import { ChatGtpService } from '../chat-gtp/chat-gtp.service';
import { TextToSpeechService } from '../text-to-speech/text-to-speech.service';
import { Categories as Category } from '@prisma/client';
import { TextsService } from '../../rest-api/texts/texts.service';
import { TextProcessingService } from '../text-processing/text-processing.service';
import { GeneratedText } from '../chat-gtp/types/GeneratedText';
import { CreateDictationTextDto } from '../../rest-api/texts/dto/create-dictation-text.dto';
import { IConvertedResult } from '../../../common/types/ConvertedResult';
import { IConvertToMp3Result } from '../../../common/types/ConvertToMp3Result';
import { AudioProcessingService } from '../audio-processing/audio-processing.service';
import { GeneratedWordsDto } from '../../rest-api/vocabulary/dto/generated-words.dto';
import { CategoriesService } from '../../rest-api/categories/categories.service';
import { SpeakersService } from '../../rest-api/speakers/speakers.service';
import { ISpeechResult } from '../../../common/types/SpeechResult';
import { CreateVocabularyDto } from '../../rest-api/vocabulary/dto/create-vocabulary.dto';
import generateHash from '../../../utils/generateHash';

@Injectable()
export class WorkflowService {
  constructor(
    private readonly chatGptService: ChatGtpService,
    private readonly textToSpeechService: TextToSpeechService,
    private readonly textProcessingService: TextProcessingService,
    private readonly textsService: TextsService,
    private readonly audioProcessingService: AudioProcessingService,
    private readonly categoryService: CategoriesService,
    private readonly speakersService: SpeakersService,
  ) {}

  async generateTextByCategory(
    category: Category,
    count?: number,
  ): Promise<void> {
    const textList: GeneratedText[] =
      await this.chatGptService.generateTextByTopic(category.name, count);

    const speakers = await this.speakersService.findAll();
    const speakersStore: string[] = [];

    for (const speaker of speakers) {
      speakersStore.push(speaker.speakerCode);
    }

    for (const t of textList) {
      await this.textToAudio(t, category, speakersStore);
    }
  }

  async generateWordData(
    userId: number,
    word: string,
    data: GeneratedWordsDto,
    generateText: boolean = false,
  ): Promise<CreateVocabularyDto[]> {
    const category: Category = await this.categoryService.findBySlug(
      userId,
      'vocabulary',
    );

    if (category) {
      const speakers = await this.speakersService.findAll();
      const speakersStore: string[] = [];

      for (const speaker of speakers) {
        speakersStore.push(speaker.speakerCode);
      }

      if (generateText) {
        const textByWord: GeneratedText =
          await this.chatGptService.textByWord(word);

        await this.textToAudio(textByWord, category, speakersStore);
      }

      data = await this.chatGptService.wordsTranslations(
        word,
        data.translation,
      );

      return await this.wordToAudio(data, speakersStore);
    }

    return [];
  }

  async updateWordData(
    userId: number,
    data: GeneratedWordsDto,
    generateText: boolean = false,
  ): Promise<CreateVocabularyDto[]> {
    const category: Category = await this.categoryService.findBySlug(
      userId,
      'vocabulary',
    );

    if (category) {
      const speakers = await this.speakersService.findAll();
      const speakersStore: string[] = [];

      for (const speaker of speakers) {
        speakersStore.push(speaker.speakerCode);
      }

      if (generateText) {
        const textByWord: GeneratedText = await this.chatGptService.textByWord(
          data.word,
        );

        await this.textToAudio(textByWord, category, speakersStore);
      }

      return await this.wordToAudio(data, speakersStore);
    }

    return [];
  }

  private async textToAudio(
    t: GeneratedText,
    category: Category,
    speakers: string[],
  ): Promise<void> {
    const createData: CreateDictationTextDto =
      this.textsService.prepareCreateTextData(t);

    const text = await this.textsService.create(
      category.categoryId,
      createData,
    );

    for (const speaker of speakers) {
      const textData: IConvertedResult =
        this.textProcessingService.convertTextIntoParts(text.content);

      textData.textId = text.textId;
      textData.hash = generateHash(`${textData.text}_${speaker}`);

      const convertedData: IConvertToMp3Result =
        await this.textToSpeechService.convertTextDataToMp3(textData, speaker);

      await this.audioProcessingService.saveAndUploadText(
        convertedData,
        speaker,
      );
    }
  }

  private async wordToAudio(
    wordData: GeneratedWordsDto,
    speakers: string[],
  ): Promise<CreateVocabularyDto[]> {
    const result: CreateVocabularyDto[] = [];

    for (const speaker of speakers) {
      const word: ISpeechResult =
        await this.textToSpeechService.convertWordDataToMp3(
          wordData.word,
          speaker,
        );
      word.hash = generateHash(`${word.content}_${speaker}`);

      const wordFileId: number =
        await this.audioProcessingService.saveAndUploadWord(word);

      result.push({
        word: wordData.word,
        translation: wordData.translation,
        transcription: wordData.transcription,
        wordFileId,
        speaker: speaker,
      });
    }

    return result;
  }
}

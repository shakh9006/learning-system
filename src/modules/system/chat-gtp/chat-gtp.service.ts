import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as process from 'process';
import { GeneratedText } from './types/GeneratedText';
import { RequestData, TextLevel } from './types/TextLevel';
import { GeneratedWordsDto } from '../../rest-api/vocabulary/dto/generated-words.dto';

@Injectable()
export class ChatGtpService {
  private chatGtpClient: OpenAI;

  constructor() {
    this.chatGtpClient = new OpenAI({
      apiKey: process.env.CHAT_GPT_API_KEY,
    });
  }

  async wordsTranslations(
    word: string,
    translation: string,
  ): Promise<GeneratedWordsDto> {
    try {
      const response = await this.chatGtpClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that provides accurate phonetic transcriptions and translations. Your task is to return the response in a strict JSON format when asked.',
          },
          {
            role: 'user',
            content: this.generateWordPrompt(word),
          },
        ],
        temperature: 0,
      });

      const result = response.choices[0].message.content.trim();
      const data = JSON.parse(result || '{}');

      if (data.hasOwnProperty('word')) {
        return { ...data, translation };
      } else {
        await this.wordsTranslations(word, translation);
      }
    } catch (error) {
      console.error('ChatGptService word generating 3rror:', error.message);
      throw error;
    }
  }

  async generateTextByTopic(
    topic: string,
    count: number = 0,
  ): Promise<GeneratedText[]> {
    try {
      const requestData: RequestData = {
        easy: [],
        medium: [],
        hard: [],
      };

      const textLevel: TextLevel = {
        easy: [20, 35],
        medium: [50, 110],
        hard: [160, 350],
      };

      const GENERATE_TEXT_COUNT = count || 5;
      const result: GeneratedText[] = [];

      for (const key in textLevel) {
        const wordsCount = textLevel[key];
        if (!requestData[key]) requestData[key] = [];
        for (let i = 0; i < GENERATE_TEXT_COUNT; i++) {
          requestData[key].push(
            this.chatGtpClient.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: `You are a creative ${topic.toLowerCase()} writer who always provides unique and original ideas.`,
                },
                {
                  role: 'user',
                  content: this.generateTextPrompt(topic, wordsCount),
                },
              ],
              temperature: 1.2,
            }),
          );
        }
      }

      for (const key in requestData) {
        const currentData = requestData[key];
        const responseData = await Promise.all(currentData);

        const d: GeneratedText[] = responseData.map((f): GeneratedText => {
          let content: string = f.choices[0].message;
          if (typeof f.choices[0].message?.hasOwnProperty('content')) {
            content = f.choices[0].message.content;
          }

          return <GeneratedText>{
            level: key,
            content: this.validateText(content),
          };
        });

        d.forEach((t: GeneratedText) => {
          result.push(t);
        });
      }

      console.log(`Generated ${result.length} texts for ${topic} topic`);
      return result;
    } catch (error) {
      console.error('ChatGptService text generating error:', error.message);
      throw error;
    }
  }

  async textByWord(word: string): Promise<GeneratedText> {
    try {
      const response = await this.chatGtpClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a creative ${word.toLowerCase()} writer who always provides unique and original ideas.`,
          },
          {
            role: 'user',
            content: this.generateWordText(word),
          },
        ],
        temperature: 1.2,
      });

      let content: string | { content: string } = response.choices[0].message;
      if (typeof content?.hasOwnProperty('content')) {
        content = content.content;
      }

      content = content.toString();

      return {
        level: 'easy',
        content: this.validateText(content),
      } as GeneratedText;
    } catch (error) {
      console.error(
        'ChatGptService text generating by word error:',
        error.message,
      );
      throw error;
    }
  }

  private generateTextPrompt(topic: string, wordCount: number[]): string {
    const [min, max] = wordCount;
    return `
      Generate unique text about ${topic.toLowerCase()} with a word range of ${min} to ${max} words. Do not use any symbols and do not generate more than ${max} words. Also I do not need to any extra description, for example Here's and etc.
    `;
  }

  private generateWordPrompt(word: string): string {
    return `
      Provide the phonetic transcription of the word '${word}' in English, translate it into Russian, and return only the result in JSON format:
      {word: '${word}', transcription: '<transcription>'}.
      
      Also I do not need to any extra description, for example Here's and etc.
    `;
  }

  private generateWordText(word: string): string {
    return `
      Generate a text of 25-30 words centered around the word '${word}'. Use '${word}' several times in meaningful contexts, exploring its significance in personal, global, or natural settings.
      Do not use any symbols and do not generate more than 30 words. Also I do not need to any extra description, for example Here's and etc.
    `;
  }

  validateText(text: string): string {
    return text
      .replace(/[\n\r]/g, ' ')
      .replace(/\s*\+\s*/g, ' ')
      .replace(/''+/g, '')
      .replace(/^["'](.*)["']$/, '$1')
      .replace(/(?<!\w)'+|'+(?!\w)/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/(\.)(?=\S)/g, '$1 ')
      .trim();
  }
}

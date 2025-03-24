import { Injectable } from '@nestjs/common';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { IConvertedResult } from '../../../common/types/ConvertedResult';
import { ISpeechResult } from '../../../common/types/SpeechResult';
import { IConvertToMp3Result } from '../../../common/types/ConvertToMp3Result';
import sanitizeFilename from '../../../utils/sanitizeFilename';
import generateHash from '../../../utils/generateHash';

@Injectable()
export class TextToSpeechService {
  private client: TextToSpeechClient;

  constructor() {
    this.client = new TextToSpeechClient({
      clientConfig: {
        interfaces: {
          'google.cloud.texttospeech.v1.TextToSpeech': {
            methods: {
              SynthesizeSpeech: {
                timeout_millis: 600000,
              },
            },
          },
        },
      },
    });
  }

  async convertTextToMp3(
    content: string,
    filename: string,
    speaker: string,
  ): Promise<ISpeechResult> {
    return this.retryWithBackoff(
      () => this.googleTextToSpeechApiRequest(content, filename, speaker),
      5,
      600,
    );
  }

  async googleTextToSpeechApiRequest(
    content: string,
    filename: string,
    speaker: string,
  ): Promise<ISpeechResult> {
    let languageCode = 'en-US';
    let ssmlGender = 'MALE';

    if (['ru-RU-Wavenet-C', 'ru-RU-Wavenet-D'].includes(speaker)) {
      languageCode = 'ru-RU';
    }

    if (['ru-RU-Wavenet-C', 'en-US-Studio-O'].includes(speaker)) {
      ssmlGender = 'FEMALE';
    }

    const requestData = {
      input: {
        text: content,
      },
      voice: {
        languageCode,
        ssmlGender,
        name: speaker,
      },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.6 },
    } as any;

    const [response] = await this.client.synthesizeSpeech(requestData);
    return {
      hash: generateHash(`${content}_${speaker}`),
      text: content,
      filename,
      content: response.audioContent,
    } as ISpeechResult;
  }

  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries: number = 5,
    delayMs: number = 1000,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'RESOURCE_EXHAUSTED' && retries > 0) {
        console.warn(`Quota exceeded, retrying after ${delayMs}ms...`);
        await this.sleep(delayMs);
        return this.retryWithBackoff(fn, retries - 1, delayMs * 2);
      }
      throw error;
    }
  }

  async processQueue<T>(
    queue: (() => Promise<T>)[],
    delayMs: number,
  ): Promise<T[]> {
    const results: T[] = [];
    for (const task of queue) {
      results.push(await task());
      await this.sleep(delayMs);
    }

    return results;
  }

  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async convertTextDataToMp3(
    data: IConvertedResult,
    speaker: string,
  ): Promise<IConvertToMp3Result> {
    const chunks: ISpeechResult[] = [];
    const sentences: ISpeechResult[] = [];

    for (const chunk of data.chunks) {
      console.log(`chunk started to request. textId: ${data.textId}`);
      const filename = sanitizeFilename(chunk);
      const result = await this.convertTextToMp3(chunk, filename, speaker);
      chunks.push(result);
      console.log(`chunk got response. textId: ${data.textId}`);
      console.log('-------------------');
      await this.sleep(500);
    }

    for (const sentence of data.sentences) {
      console.log(`sentence started to request. textId: ${data.textId}`);
      const filename = sanitizeFilename(sentence);
      const result = await this.convertTextToMp3(sentence, filename, speaker);
      sentences.push(result);
      console.log(`sentence got response. textId: ${data.textId}`);
      console.log('-------------------');
      await this.sleep(500);
    }

    console.log(`full-text started to request. textId: ${data.textId}`);
    const filename = 'full-text';
    const text = await this.convertTextToMp3(data.text, filename, speaker);
    text.hash = data.hash;
    console.log(`full-text got response. textId: ${data.textId}`);

    return {
      textId: data.textId,
      chunks,
      sentences,
      text,
    };
  }

  async convertWordDataToMp3(
    word: string,
    speaker: string,
    isTranslation = false,
  ): Promise<ISpeechResult> {
    const filename = sanitizeFilename(word);
    if (!isTranslation) {
      return await this.convertTextToMp3(word, filename, speaker);
    } else {
      const customSpeaker =
        speaker === 'en-US-Studio-Q' ? 'ru-RU-Wavenet-D' : 'ru-RU-Wavenet-C';
      return await this.convertTextToMp3(word, filename, customSpeaker);
    }
  }
}

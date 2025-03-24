import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { AudioFilesService } from '../../internal/audio-files/audio-files.service';
import { IConvertToMp3Result } from '../../../common/types/ConvertToMp3Result';
import { ISpeechResult } from '../../../common/types/SpeechResult';
import { SpeechResultWithType } from './types/SpeechResultWithType';
import { VocabularyAudioFilesService } from '../../internal/vocabulary-audio-files/vocabulary-audio-files.service';

@Injectable()
export class AudioProcessingService {
  constructor(
    private readonly storageService: StorageService,
    private readonly audioFileService: AudioFilesService,
    private readonly vocabularyAudioFilesService: VocabularyAudioFilesService,
  ) {}

  async saveAndUploadText(
    convertedTextData: IConvertToMp3Result,
    speaker: string,
  ) {
    const chunks: SpeechResultWithType[] = convertedTextData.chunks.map(
      (i) => ({ ...i, type: 'chunk' }),
    );

    const sentences: SpeechResultWithType[] = convertedTextData.sentences.map(
      (i) => ({
        ...i,
        type: 'sentence',
      }),
    );

    const fullText: SpeechResultWithType = {
      ...convertedTextData.text,
      type: 'full',
    };

    const allFiles = [...chunks, ...sentences, fullText];
    const textId: number = convertedTextData.textId;

    for (const file of allFiles) {
      await this.audioFileService.create(textId, {
        fileName: file.filename,
        hashedFileName: file.hash,
        readingMode: file.type,
        speakerId: speaker,
      });

      await this.storageService.uploadFileToS3(file.hash, file.content);
    }
  }

  async saveAndUploadWord(data: ISpeechResult): Promise<number> {
    const file = await this.vocabularyAudioFilesService.create({
      path: `${data.hash}.mp3`,
    });

    await this.storageService.uploadFileToS3(data.hash, data.content);

    return file.vocabularyAudioFileId;
  }
}

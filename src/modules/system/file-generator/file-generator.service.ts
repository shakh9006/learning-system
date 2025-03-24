import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { FileType } from './types/FileType';
import { AudioFilesService } from '../../internal/audio-files/audio-files.service';
import { CreateAudioFileDto } from '../../internal/audio-files/dto/create-audio-file.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class FileGeneratorService {
  constructor(private readonly audioFilesService: AudioFilesService) {}
  async generateFile(
    textId: number,
    phrases: string[] = [],
  ): Promise<FileType[]> {
    const audioFiles: FileType[] = [];

    for (const phrase of phrases) {
      const fileName: string = this.sanitizeFilename(phrase);
      const file = await this.audioFilesService.findByFileName(
        textId,
        fileName,
      );

      if (file) {
        // Generate file exists then push
        audioFiles.push({
          fileHashPath: file.hashedFileName,
          originalName: fileName,
        });
      } else {
        // create new

        const createData: CreateAudioFileDto = {
          speakerId: uuid(),
          readingMode: 'chunk',
          fileName,
          hashedFileName: await hash(fileName, 10),
        };
        const newFile = await this.audioFilesService.create(textId, createData);
        audioFiles.push({
          fileHashPath: newFile.hashedFileName,
          originalName: fileName,
        });

        // fs.writeFile(outputFilePath, '', async (err) => {
        //   if (!err) {
        //     const mp3 = await openai.audio.speech.create({
        //       model: 'tts-1',
        //       voice: 'fable',
        //       input: phrase,
        //       speed: 0.7,
        //     });
        //     console.log(outputFilePath);
        //     const buffer = Buffer.from(await mp3.arrayBuffer());
        //     await fs.promises.writeFile(outputFilePath, buffer);
        //   }
        // });

        return audioFiles;
      }
    }
  }

  sanitizeFilename(phrase: string) {
    phrase = phrase.replace(/[^\w\s]/gi, '').toLowerCase();
    phrase = phrase.split(' ').join('-');
    return phrase;
  }
}

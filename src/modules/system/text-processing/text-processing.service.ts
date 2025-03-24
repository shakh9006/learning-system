import { Injectable } from '@nestjs/common';
import { IConvertedResult } from '../../../common/types/ConvertedResult';

@Injectable()
export class TextProcessingService {
  convertTextIntoParts(content: string): IConvertedResult {
    const chunks: string[] = this.getChunkedPartsByWords(content);
    const sentences: string[] = this.getSentencedPartsByWords(content);

    return {
      text: content,
      chunks,
      sentences,
    };
  }

  getChunkedPartsByWords(content: string): string[] {
    const words: string[] = content.toLowerCase().split(/\s+/); // Convert to lowercase and split by spaces
    const articles = new Set(['a', 'an', 'the']);
    const chunks: string[] = [];
    let i: number = 0;

    while (i < words.length) {
      const splitWords: string[] = [];
      if (articles.has(words[i + 1]) || articles.has(words[i])) {
        for (let j = i; j < i + 3; j++) {
          splitWords.push(words[j]);
        }
        chunks.push(splitWords.join(' '));
        i += 3;
      } else if (i + 1 < words.length) {
        chunks.push(`${words[i]} ${words[i + 1]}`);
        i += 2;
      } else {
        chunks.push(words[i]);
        i += 1;
      }
    }

    return chunks;
  }

  getSentencedPartsByWords(content: string): string[] {
    return content?.split('.').filter((f) => f);
  }
}

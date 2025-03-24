import { ISpeechResult } from './SpeechResult';

export interface IConvertToMp3Result {
  chunks: ISpeechResult[];
  sentences: ISpeechResult[];
  text: ISpeechResult;
  textId: number;
}

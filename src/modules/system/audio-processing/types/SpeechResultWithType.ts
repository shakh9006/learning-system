import { ISpeechResult } from '../../../../common/types/SpeechResult';

interface ISpeechResultWithType {
  type: 'chunk' | 'full' | 'sentence';
}

export type SpeechResultWithType = ISpeechResult & ISpeechResultWithType;

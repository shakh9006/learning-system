export class CreatePerformanceDto {
  wpm: number;
  accuracy: number;
  totalWords: number;
  correctWords: number;
  errorsCount: number;
  duration: number;
  score: number;
  wpmPenalty: number;
  accuracyPenalty: number;
  userInput: string;
}

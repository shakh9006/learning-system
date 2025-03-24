export interface IHighlightType {
  type: 'missing' | 'correct' | 'not_exists' | 'mistake';
  idx: number;
  word?: string;
  input?: string;
}

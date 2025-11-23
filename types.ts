export enum CalculatorMode {
  STANDARD = 'STANDARD',
  AI = 'AI',
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  type: 'calc' | 'ai';
}

export interface AIResponse {
  answer: string;
  explanation: string;
}

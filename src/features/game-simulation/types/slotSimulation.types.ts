export type SlotVolatility = 'low' | 'medium' | 'high';

export interface SlotGameConfig {
  gameId: string;
  gameSlug: string;
  gameName: string;
  rtp: number;
  volatility: SlotVolatility;
  minBet: number;
  maxBet: number;
  defaultBet: number;
  demoBalance: number;
}

export interface SlotSpinResult {
  roundId: string;
  result: 'win' | 'loss';
  betAmount: number;
  multiplier: number;
  payout: number;
  netResult: number;
  grid: string[][];
  timestamp: string;
}

export interface SlotSessionState {
  config: SlotGameConfig;
  balance: number;
  isSpinning: boolean;
  lastResult: SlotSpinResult | null;
  history: SlotSpinResult[];
  totalWon: number;
  totalBet: number;
}

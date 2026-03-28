export type RouletteBetType = 'number' | 'color' | 'parity' | 'dozen';

export interface RouletteBet {
  type: RouletteBetType;
  value: number | string;
  amount: number;
}

export interface RouletteBetResult extends RouletteBet {
  won: boolean;
  payout: number;
}

export interface RouletteRoundResult {
  roundId: string;
  winningNumber: number;
  winningColor: 'red' | 'black' | 'green';
  bets: RouletteBetResult[];
  totalPayout: number;
  netResult: number;
  timestamp: string;
}

export type RoulettePhase = 'betting' | 'closing' | 'spinning' | 'result';

export interface RouletteSessionState {
  balance: number;
  currentBets: RouletteBet[];
  phase: RoulettePhase;
  countdown: number;
  lastResult: RouletteRoundResult | null;
  history: number[];
  totalWon: number;
  totalBet: number;
}

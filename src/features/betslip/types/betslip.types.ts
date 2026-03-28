// ─── Betslip Mode ─────────────────────────────────────────────────────────────

export type BetslipMode = 'simple' | 'multiple' | 'system';

export const BETSLIP_MODE_LABELS: Record<BetslipMode, string> = {
  simple: 'Simples',
  multiple: 'Múltipla',
  system: 'Sistema',
};

// ─── Selection ────────────────────────────────────────────────────────────────

export interface BetSelection {
  id: string;
  eventId: string;
  eventName: string;
  marketName: string;
  selectionName: string;
  odd: number;
  /** stake individual — usado somente no modo simples */
  stake: number;
  /** Opcional: odds anteriores (para mostrar alteração) */
  previousOdd?: number;
}

// ─── System Combination ────────────────────────────────────────────────────────

export interface SystemCombination {
  label: string;
  count: number;
  totalBets: number;
  stakePerBet: number;
  totalStake: number;
  potentialPayout: number;
}

// ─── Betslip Options ──────────────────────────────────────────────────────────

export interface BetslipOddsOptions {
  acceptAnyOddsChange: boolean;
  acceptOnlyHigherOdds: boolean;
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export interface BetslipSummary {
  selectionCount: number;
  totalOdds: number;
  totalStake: number;
  potentialPayout: number;
}

// ─── Quick Stakes ─────────────────────────────────────────────────────────────

export const QUICK_STAKES = [5, 10, 25, 50] as const;
export type QuickStake = (typeof QUICK_STAKES)[number];

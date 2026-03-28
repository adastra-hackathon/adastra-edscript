import type { BetSelection, BetslipMode, SystemCombination } from '../types/betslip.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Número de combinações de k em n: C(n,k) */
function combinations(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

// ─── Simples ──────────────────────────────────────────────────────────────────

/** Total apostado no modo Simples (soma dos stakes individuais) */
export function calcSimpleTotalStake(selections: BetSelection[]): number {
  return round2(selections.reduce((acc, s) => acc + s.stake, 0));
}

/** Ganho potencial no modo Simples (soma de stake * odd por seleção) */
export function calcSimplePotentialPayout(selections: BetSelection[]): number {
  return round2(selections.reduce((acc, s) => acc + s.stake * s.odd, 0));
}

// ─── Múltipla ─────────────────────────────────────────────────────────────────

/** Cotação acumulada: produto de todas as odds */
export function calcAccumulatedOdds(selections: BetSelection[]): number {
  if (selections.length === 0) return 1;
  const product = selections.reduce((acc, s) => acc * s.odd, 1);
  return round2(product);
}

/** Ganho potencial no modo Múltipla */
export function calcMultiplePotentialPayout(stake: number, selections: BetSelection[]): number {
  return round2(stake * calcAccumulatedOdds(selections));
}

// ─── Sistema ──────────────────────────────────────────────────────────────────

/**
 * Gera combinações para o modo Sistema.
 * Para n seleções, calcula combinações para k = 2 até n-1.
 */
export function calcSystemCombinations(
  selections: BetSelection[],
  stakePerBet: number,
): SystemCombination[] {
  const n = selections.length;
  if (n < 3) return [];

  const results: SystemCombination[] = [];

  for (let k = 2; k < n; k++) {
    const totalBets = combinations(n, k);
    const totalStake = round2(stakePerBet * totalBets);

    // Estimativa de payout: média geométrica das odds k a k
    // Simplificado: multiplicamos a menor combinação possível de k odds
    const sortedOdds = selections.map((s) => s.odd).sort((a, b) => a - b);
    const worstComboOdds = sortedOdds.slice(0, k).reduce((acc, o) => acc * o, 1);
    const bestComboOdds = sortedOdds.slice(n - k).reduce((acc, o) => acc * o, 1);
    const avgComboOdds = (worstComboOdds + bestComboOdds) / 2;
    const potentialPayout = round2(stakePerBet * avgComboOdds * totalBets);

    results.push({
      label: `${k} apostas`,
      count: k,
      totalBets,
      stakePerBet,
      totalStake,
      potentialPayout,
    });
  }

  return results;
}

// ─── Summary builder ──────────────────────────────────────────────────────────

export function buildSummary(
  mode: BetslipMode,
  selections: BetSelection[],
  multipleStake: number,
) {
  if (mode === 'simple') {
    return {
      selectionCount: selections.length,
      totalOdds: 0,
      totalStake: calcSimpleTotalStake(selections),
      potentialPayout: calcSimplePotentialPayout(selections),
    };
  }

  const totalOdds = calcAccumulatedOdds(selections);
  const totalStake = multipleStake;
  const potentialPayout = calcMultiplePotentialPayout(multipleStake, selections);

  return { selectionCount: selections.length, totalOdds, totalStake, potentialPayout };
}

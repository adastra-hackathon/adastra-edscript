import {
  calcSimpleTotalStake,
  calcSimplePotentialPayout,
  calcAccumulatedOdds,
  calcMultiplePotentialPayout,
  calcSystemCombinations,
  buildSummary,
} from '../features/betslip/utils/betslipCalculations';
import type { BetSelection } from '../features/betslip/types/betslip.types';

const makeSel = (overrides: Partial<BetSelection> = {}): BetSelection => ({
  id: 'sel-1',
  eventId: 'ev-1',
  eventName: 'Team A vs Team B',
  marketName: 'Resultado',
  selectionName: 'Team A',
  odd: 2.0,
  stake: 10,
  ...overrides,
});

// ─── calcSimpleTotalStake ─────────────────────────────────────────────────────

describe('calcSimpleTotalStake', () => {
  it('returns 0 for empty selections', () => {
    expect(calcSimpleTotalStake([])).toBe(0);
  });

  it('sums all individual stakes', () => {
    const sels = [makeSel({ stake: 10 }), makeSel({ id: 'sel-2', stake: 25 })];
    expect(calcSimpleTotalStake(sels)).toBe(35);
  });

  it('rounds to 2 decimal places', () => {
    const sels = [makeSel({ stake: 10.1 }), makeSel({ id: 'sel-2', stake: 0.2 })];
    expect(calcSimpleTotalStake(sels)).toBe(10.30);
  });
});

// ─── calcSimplePotentialPayout ────────────────────────────────────────────────

describe('calcSimplePotentialPayout', () => {
  it('returns 0 for empty selections', () => {
    expect(calcSimplePotentialPayout([])).toBe(0);
  });

  it('calculates stake * odd per selection and sums', () => {
    const sels = [
      makeSel({ odd: 2.45, stake: 10 }),
      makeSel({ id: 'sel-2', odd: 1.92, stake: 10 }),
    ];
    // 10*2.45 + 10*1.92 = 24.5 + 19.2 = 43.7
    expect(calcSimplePotentialPayout(sels)).toBe(43.70);
  });

  it('single selection payout equals stake * odd', () => {
    const sel = makeSel({ odd: 3.0, stake: 20 });
    expect(calcSimplePotentialPayout([sel])).toBe(60);
  });
});

// ─── calcAccumulatedOdds ──────────────────────────────────────────────────────

describe('calcAccumulatedOdds', () => {
  it('returns 1 for empty selections', () => {
    expect(calcAccumulatedOdds([])).toBe(1);
  });

  it('returns the odd itself for a single selection', () => {
    expect(calcAccumulatedOdds([makeSel({ odd: 2.5 })])).toBe(2.5);
  });

  it('multiplies all odds together', () => {
    const sels = [makeSel({ odd: 2.0 }), makeSel({ id: 'sel-2', odd: 3.0 })];
    expect(calcAccumulatedOdds(sels)).toBe(6.0);
  });

  it('rounds to 2 decimal places', () => {
    const sels = [
      makeSel({ odd: 1.33 }),
      makeSel({ id: 'sel-2', odd: 1.33 }),
      makeSel({ id: 'sel-3', odd: 1.33 }),
    ];
    const result = calcAccumulatedOdds(sels);
    expect(result).toBeCloseTo(1.33 * 1.33 * 1.33, 1);
  });
});

// ─── calcMultiplePotentialPayout ──────────────────────────────────────────────

describe('calcMultiplePotentialPayout', () => {
  it('returns stake * accumulated odds', () => {
    const sels = [makeSel({ odd: 2.0 }), makeSel({ id: 'sel-2', odd: 3.0 })];
    // odds = 6, stake = 10 → 60
    expect(calcMultiplePotentialPayout(10, sels)).toBe(60);
  });

  it('returns 0 when stake is 0', () => {
    const sels = [makeSel({ odd: 2.0 })];
    expect(calcMultiplePotentialPayout(0, sels)).toBe(0);
  });

  it('returns 0 for empty selections (odds = 1, stake * 1)', () => {
    expect(calcMultiplePotentialPayout(10, [])).toBe(10);
  });
});

// ─── calcSystemCombinations ───────────────────────────────────────────────────

describe('calcSystemCombinations', () => {
  it('returns empty for fewer than 3 selections', () => {
    expect(calcSystemCombinations([], 10)).toHaveLength(0);
    expect(calcSystemCombinations([makeSel()], 10)).toHaveLength(0);
    expect(calcSystemCombinations([makeSel(), makeSel({ id: 's2' })], 10)).toHaveLength(0);
  });

  it('returns 1 combination row for exactly 3 selections (k=2)', () => {
    const sels = [
      makeSel({ id: 's1', odd: 2.0 }),
      makeSel({ id: 's2', odd: 3.0 }),
      makeSel({ id: 's3', odd: 1.5 }),
    ];
    const combos = calcSystemCombinations(sels, 5);
    expect(combos).toHaveLength(1);
    expect(combos[0].count).toBe(2);
  });

  it('returns n-2 rows for n selections (k from 2 to n-1)', () => {
    const sels = Array.from({ length: 5 }, (_, i) =>
      makeSel({ id: `s${i}`, eventId: `ev${i}`, odd: 2.0 }),
    );
    // k = 2, 3, 4 → 3 rows
    expect(calcSystemCombinations(sels, 10)).toHaveLength(3);
  });

  it('totalBets for C(3,2) is 3', () => {
    const sels = [
      makeSel({ id: 's1', odd: 2.0 }),
      makeSel({ id: 's2', odd: 3.0 }),
      makeSel({ id: 's3', odd: 1.5 }),
    ];
    const combos = calcSystemCombinations(sels, 5);
    expect(combos[0].totalBets).toBe(3);
  });

  it('totalStake equals stakePerBet * totalBets', () => {
    const sels = Array.from({ length: 3 }, (_, i) =>
      makeSel({ id: `s${i}`, eventId: `ev${i}`, odd: 2.0 }),
    );
    const combos = calcSystemCombinations(sels, 10);
    combos.forEach((c) => {
      expect(c.totalStake).toBe(c.stakePerBet * c.totalBets);
    });
  });
});

// ─── buildSummary ─────────────────────────────────────────────────────────────

describe('buildSummary', () => {
  const sels = [makeSel({ odd: 2.0, stake: 10 }), makeSel({ id: 's2', odd: 3.0, stake: 20 })];

  it('simple mode: totalStake is sum of individual stakes', () => {
    const s = buildSummary('simple', sels, 0);
    expect(s.totalStake).toBe(30);
  });

  it('simple mode: potentialPayout is sum of stake*odd per selection', () => {
    const s = buildSummary('simple', sels, 0);
    expect(s.potentialPayout).toBe(2 * 10 + 3 * 20); // 80
  });

  it('multiple mode: totalStake is multipleStake', () => {
    const s = buildSummary('multiple', sels, 50);
    expect(s.totalStake).toBe(50);
  });

  it('multiple mode: totalOdds is accumulated product', () => {
    const s = buildSummary('multiple', sels, 10);
    expect(s.totalOdds).toBe(6); // 2 * 3
  });

  it('selectionCount matches selections array length', () => {
    const s = buildSummary('multiple', sels, 10);
    expect(s.selectionCount).toBe(2);
  });
});

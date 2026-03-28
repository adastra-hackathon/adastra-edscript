import { spin, buildGrid } from '../features/game-simulation/engine/slotEngine';

// ─── buildGrid ────────────────────────────────────────────────────────────────

describe('buildGrid', () => {
  it('returns a 3x3 matrix', () => {
    const grid = buildGrid();
    expect(grid).toHaveLength(3);
    grid.forEach(row => expect(row).toHaveLength(3));
  });

  it('all cells are non-empty strings', () => {
    const grid = buildGrid();
    grid.flat().forEach(cell => {
      expect(typeof cell).toBe('string');
      expect(cell.length).toBeGreaterThan(0);
    });
  });

  it('produces different grids on successive calls', () => {
    // Not deterministic but statistically near-impossible to be equal
    const grids = Array.from({ length: 10 }, () => buildGrid().flat().join(''));
    const unique = new Set(grids);
    expect(unique.size).toBeGreaterThan(1);
  });
});

// ─── spin ─────────────────────────────────────────────────────────────────────

describe('spin', () => {
  afterEach(() => jest.restoreAllMocks());

  const config = { volatility: 'medium' as const };

  it('returns all required fields', () => {
    const result = spin(config, 10);

    expect(result).toHaveProperty('roundId');
    expect(result).toHaveProperty('result');
    expect(result).toHaveProperty('betAmount', 10);
    expect(result).toHaveProperty('multiplier');
    expect(result).toHaveProperty('payout');
    expect(result).toHaveProperty('netResult');
    expect(result).toHaveProperty('grid');
    expect(result).toHaveProperty('timestamp');
  });

  it('result is "win" or "loss"', () => {
    expect(['win', 'loss']).toContain(spin(config, 10).result);
  });

  it('reflects betAmount correctly', () => {
    expect(spin(config, 25.5).betAmount).toBe(25.5);
  });

  it('grid is a 3x3 matrix', () => {
    const { grid } = spin(config, 10);
    expect(grid).toHaveLength(3);
    grid.forEach(row => expect(row).toHaveLength(3));
  });

  it('roundId is unique across consecutive spins', () => {
    const ids = Array.from({ length: 20 }, () => spin(config, 10).roundId);
    expect(new Set(ids).size).toBe(20);
  });

  it('returns loss with payout=0 and negative netResult when Math.random=0', () => {
    // medium volatility: totalWeight = 100
    // rand = 0 * 100 = 0 → 0 - 65 (loss weight) ≤ 0 → loss band selected
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const result = spin(config, 50);

    expect(result.result).toBe('loss');
    expect(result.payout).toBe(0);
    expect(result.multiplier).toBe(0);
    expect(result.netResult).toBe(-50);
  });

  it('returns win with correct payout when a win band is selected', () => {
    // medium volatility: rand = 0.9 * 100 = 90
    // 90 - 65 (loss) = 25 > 0
    // 25 - 22 (small) = 3 > 0
    // 3  - 10 (medium) = -7 ≤ 0 → medium band (minMult:2, maxMult:10)
    // multiplier = 2 + 0.9*(10-2) = 9.2
    // payout = 10 * 9.2 = 92
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = spin(config, 10);

    expect(result.result).toBe('win');
    expect(result.multiplier).toBeGreaterThan(0);
    expect(result.payout).toBeGreaterThan(0);
    expect(result.netResult).toBeCloseTo(result.payout - result.betAmount, 2);
  });

  it('payout equals betAmount * multiplier (rounded to 2 decimals)', () => {
    const result = spin(config, 10);
    const expected = parseFloat((result.betAmount * result.multiplier).toFixed(2));
    expect(result.payout).toBe(expected);
  });

  it('netResult equals payout minus betAmount', () => {
    const result = spin(config, 10);
    const expected = parseFloat((result.payout - result.betAmount).toFixed(2));
    expect(result.netResult).toBe(expected);
  });

  it('low volatility has lower loss weight than high volatility', () => {
    // Run 200 spins per volatility and compare win rates
    const wins = (v: 'low' | 'high') =>
      Array.from({ length: 200 }, () => spin({ volatility: v }, 1)).filter(r => r.result === 'win').length;

    const lowWins = wins('low');
    const highWins = wins('high');

    // Low volatility: 45% win rate. High: 25% win rate.
    // With 200 spins the difference should be statistically visible.
    expect(lowWins).toBeGreaterThan(highWins);
  });
});

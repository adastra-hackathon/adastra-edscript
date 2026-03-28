import {
  spinRoulette,
  evaluateBet,
  calculateRound,
} from '../features/game-simulation/engine/rouletteEngine';
import type { RouletteBet } from '../features/game-simulation/types/rouletteSimulation.types';

// RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
// 0 = green | 1 = red | 2 = black | 7 = red | 8 = black

// ─── spinRoulette ─────────────────────────────────────────────────────────────

describe('spinRoulette', () => {
  it('always returns an integer between 0 and 36 (inclusive)', () => {
    for (let i = 0; i < 100; i++) {
      const n = spinRoulette();
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(36);
    }
  });

  it('can produce 0 (zero)', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(spinRoulette()).toBe(0);
    jest.restoreAllMocks();
  });

  it('can produce 36 (max)', () => {
    // floor(0.999 * 37) = floor(36.963) = 36
    jest.spyOn(Math, 'random').mockReturnValue(0.999);
    expect(spinRoulette()).toBe(36);
    jest.restoreAllMocks();
  });
});

// ─── evaluateBet ──────────────────────────────────────────────────────────────

describe('evaluateBet — number bet', () => {
  it('wins when bet number matches winning number', () => {
    const bet: RouletteBet = { type: 'number', value: 7, amount: 10 };
    const result = evaluateBet(bet, 7);
    expect(result.won).toBe(true);
    expect(result.payout).toBe(360); // 10 * (35 + 1)
  });

  it('loses when bet number does not match', () => {
    const bet: RouletteBet = { type: 'number', value: 7, amount: 10 };
    const result = evaluateBet(bet, 17);
    expect(result.won).toBe(false);
    expect(result.payout).toBe(0);
  });

  it('wins on zero when bet is exactly zero', () => {
    const bet: RouletteBet = { type: 'number', value: 0, amount: 5 };
    const result = evaluateBet(bet, 0);
    expect(result.won).toBe(true);
    expect(result.payout).toBe(180); // 5 * 36
  });
});

describe('evaluateBet — color bet', () => {
  it('wins on red when winning number is red (1)', () => {
    const bet: RouletteBet = { type: 'color', value: 'red', amount: 20 };
    const result = evaluateBet(bet, 1);
    expect(result.won).toBe(true);
    expect(result.payout).toBe(40); // 20 * (1 + 1)
  });

  it('wins on black when winning number is black (2)', () => {
    const bet: RouletteBet = { type: 'color', value: 'black', amount: 15 };
    const result = evaluateBet(bet, 2);
    expect(result.won).toBe(true);
    expect(result.payout).toBe(30); // 15 * 2
  });

  it('loses on wrong color', () => {
    const bet: RouletteBet = { type: 'color', value: 'black', amount: 20 };
    const result = evaluateBet(bet, 1); // 1 is red
    expect(result.won).toBe(false);
    expect(result.payout).toBe(0);
  });

  it('loses on zero regardless of color chosen', () => {
    const redBet: RouletteBet = { type: 'color', value: 'red', amount: 10 };
    const blackBet: RouletteBet = { type: 'color', value: 'black', amount: 10 };
    expect(evaluateBet(redBet, 0).won).toBe(false);
    expect(evaluateBet(blackBet, 0).won).toBe(false);
  });
});

describe('evaluateBet — parity bet', () => {
  it('even wins on even number (8)', () => {
    const bet: RouletteBet = { type: 'parity', value: 'even', amount: 10 };
    expect(evaluateBet(bet, 8).won).toBe(true);
  });

  it('odd wins on odd number (7)', () => {
    const bet: RouletteBet = { type: 'parity', value: 'odd', amount: 10 };
    expect(evaluateBet(bet, 7).won).toBe(true);
  });

  it('even loses on odd number', () => {
    const bet: RouletteBet = { type: 'parity', value: 'even', amount: 10 };
    expect(evaluateBet(bet, 7).won).toBe(false);
  });

  it('odd loses on even number', () => {
    const bet: RouletteBet = { type: 'parity', value: 'odd', amount: 10 };
    expect(evaluateBet(bet, 8).won).toBe(false);
  });

  it('loses on zero for both even and odd', () => {
    const even: RouletteBet = { type: 'parity', value: 'even', amount: 10 };
    const odd: RouletteBet = { type: 'parity', value: 'odd', amount: 10 };
    expect(evaluateBet(even, 0).won).toBe(false);
    expect(evaluateBet(odd, 0).won).toBe(false);
  });

  it('payout is amount * 2 on win (1:1)', () => {
    const bet: RouletteBet = { type: 'parity', value: 'even', amount: 25 };
    expect(evaluateBet(bet, 8).payout).toBe(50);
  });
});

describe('evaluateBet — dozen bet', () => {
  it('1-12 wins for numbers 1 through 12', () => {
    const bet: RouletteBet = { type: 'dozen', value: '1-12', amount: 10 };
    expect(evaluateBet(bet, 1).won).toBe(true);
    expect(evaluateBet(bet, 6).won).toBe(true);
    expect(evaluateBet(bet, 12).won).toBe(true);
  });

  it('1-12 loses for numbers outside range', () => {
    const bet: RouletteBet = { type: 'dozen', value: '1-12', amount: 10 };
    expect(evaluateBet(bet, 0).won).toBe(false);
    expect(evaluateBet(bet, 13).won).toBe(false);
  });

  it('13-24 wins for numbers 13 through 24', () => {
    const bet: RouletteBet = { type: 'dozen', value: '13-24', amount: 10 };
    expect(evaluateBet(bet, 13).won).toBe(true);
    expect(evaluateBet(bet, 24).won).toBe(true);
    expect(evaluateBet(bet, 12).won).toBe(false);
    expect(evaluateBet(bet, 25).won).toBe(false);
  });

  it('25-36 wins for numbers 25 through 36', () => {
    const bet: RouletteBet = { type: 'dozen', value: '25-36', amount: 10 };
    expect(evaluateBet(bet, 25).won).toBe(true);
    expect(evaluateBet(bet, 36).won).toBe(true);
    expect(evaluateBet(bet, 24).won).toBe(false);
  });

  it('payout is amount * 3 on win (2:1)', () => {
    const bet: RouletteBet = { type: 'dozen', value: '1-12', amount: 10 };
    expect(evaluateBet(bet, 5).payout).toBe(30); // 10 * (2 + 1)
  });

  it('loses on zero for any dozen', () => {
    ['1-12', '13-24', '25-36'].forEach(value => {
      const bet: RouletteBet = { type: 'dozen', value, amount: 10 };
      expect(evaluateBet(bet, 0).won).toBe(false);
    });
  });
});

// ─── calculateRound ───────────────────────────────────────────────────────────

describe('calculateRound', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns all required fields', () => {
    const bets: RouletteBet[] = [{ type: 'color', value: 'red', amount: 10 }];
    const result = calculateRound(bets);

    expect(result).toHaveProperty('roundId');
    expect(result).toHaveProperty('winningNumber');
    expect(result).toHaveProperty('winningColor');
    expect(result).toHaveProperty('bets');
    expect(result).toHaveProperty('totalPayout');
    expect(result).toHaveProperty('netResult');
    expect(result).toHaveProperty('timestamp');
  });

  it('correctly computes totalPayout for a winning number bet', () => {
    // Mock Math.random = 0 → winningNumber = 0
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const bets: RouletteBet[] = [{ type: 'number', value: 0, amount: 10 }];
    const result = calculateRound(bets);

    expect(result.winningNumber).toBe(0);
    expect(result.winningColor).toBe('green');
    expect(result.totalPayout).toBe(360); // 10 * 36
    expect(result.netResult).toBe(350);   // 360 - 10
  });

  it('netResult is negative when all bets lose', () => {
    // winningNumber = 0 (green), bet on red → loses
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const bets: RouletteBet[] = [{ type: 'color', value: 'red', amount: 50 }];
    const result = calculateRound(bets);

    expect(result.totalPayout).toBe(0);
    expect(result.netResult).toBe(-50);
  });

  it('handles multiple simultaneous bets', () => {
    // winningNumber = 0 → number(0) wins, color(red) loses
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const bets: RouletteBet[] = [
      { type: 'number', value: 0, amount: 10 }, // wins: 360
      { type: 'color', value: 'red', amount: 20 }, // loses: 0
    ];
    const result = calculateRound(bets);

    expect(result.bets).toHaveLength(2);
    expect(result.totalPayout).toBe(360);
    expect(result.netResult).toBe(330); // 360 - (10 + 20)
  });

  it('roundId is unique per round', () => {
    const bets: RouletteBet[] = [{ type: 'color', value: 'red', amount: 10 }];
    const r1 = calculateRound(bets);
    const r2 = calculateRound(bets);
    expect(r1.roundId).not.toBe(r2.roundId);
  });
});

import { getRouletteColor } from '../constants/rouletteColors';
import { ROULETTE_PAYOUTS } from '../constants/roulettePayouts';
import type { RouletteBet, RouletteBetResult, RouletteRoundResult } from '../types/rouletteSimulation.types';

export function spinRoulette(): number {
  return Math.floor(Math.random() * 37); // 0–36
}

export function evaluateBet(bet: RouletteBet, winningNumber: number): RouletteBetResult {
  const winningColor = getRouletteColor(winningNumber);
  let won = false;

  switch (bet.type) {
    case 'number':
      won = bet.value === winningNumber;
      break;
    case 'color':
      won = bet.value === winningColor;
      break;
    case 'parity':
      if (winningNumber === 0) { won = false; break; }
      won = bet.value === 'even' ? winningNumber % 2 === 0 : winningNumber % 2 !== 0;
      break;
    case 'dozen':
      if (winningNumber === 0) { won = false; break; }
      if (bet.value === '1-12')  won = winningNumber >= 1  && winningNumber <= 12;
      if (bet.value === '13-24') won = winningNumber >= 13 && winningNumber <= 24;
      if (bet.value === '25-36') won = winningNumber >= 25 && winningNumber <= 36;
      break;
  }

  const payoutMultiplier = ROULETTE_PAYOUTS[bet.type];
  const payout = won ? bet.amount * (payoutMultiplier + 1) : 0;
  return { ...bet, won, payout };
}

export function calculateRound(bets: RouletteBet[]): RouletteRoundResult {
  const winningNumber = spinRoulette();
  const winningColor = getRouletteColor(winningNumber);
  const evaluatedBets = bets.map(b => evaluateBet(b, winningNumber));
  const totalPayout = evaluatedBets.reduce((sum, b) => sum + b.payout, 0);
  const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);

  return {
    roundId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    winningNumber,
    winningColor,
    bets: evaluatedBets,
    totalPayout,
    netResult: parseFloat((totalPayout - totalBet).toFixed(2)),
    timestamp: new Date().toISOString(),
  };
}

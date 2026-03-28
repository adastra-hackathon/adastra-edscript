import { PROBABILITY_TABLE } from '../constants/slotProbabilities';
import { SLOT_REEL_SYMBOLS } from '../constants/slotSymbols';
import type { SlotGameConfig, SlotSpinResult } from '../types/slotSimulation.types';
import type { SlotVolatility } from '../constants/slotProbabilities';

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickBand(volatility: SlotVolatility) {
  const table = PROBABILITY_TABLE[volatility];
  const totalWeight = table.reduce((sum, b) => sum + b.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const band of table) {
    rand -= band.weight;
    if (rand <= 0) return band;
  }
  return table[0];
}

export function buildGrid(): string[][] {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () =>
      SLOT_REEL_SYMBOLS[Math.floor(Math.random() * SLOT_REEL_SYMBOLS.length)]
    )
  );
}

export function spin(config: SlotGameConfig, betAmount: number): SlotSpinResult {
  const band = pickBand(config.volatility);
  const isWin = band.result !== 'loss';
  const multiplier = isWin
    ? parseFloat(randomBetween(band.minMultiplier, band.maxMultiplier).toFixed(2))
    : 0;
  const payout = parseFloat((betAmount * multiplier).toFixed(2));
  const netResult = parseFloat((payout - betAmount).toFixed(2));

  return {
    roundId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    result: isWin ? 'win' : 'loss',
    betAmount,
    multiplier,
    payout,
    netResult,
    grid: buildGrid(),
    timestamp: new Date().toISOString(),
  };
}

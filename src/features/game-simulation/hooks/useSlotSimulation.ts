import { useState, useCallback, useRef } from 'react';
import { spin } from '../engine/slotEngine';
import type { SlotGameConfig, SlotSpinResult } from '../types/slotSimulation.types';

const MAX_HISTORY = 20;
const SPIN_DURATION_MS = 1500;

export function useSlotSimulation(config: SlotGameConfig) {
  const [balance, setBalance] = useState(config.demoBalance);
  const [betAmount, setBetAmount] = useState(config.defaultBet);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<SlotSpinResult | null>(null);
  const [history, setHistory] = useState<SlotSpinResult[]>([]);
  const spinningRef = useRef(false);

  const doSpin = useCallback(() => {
    if (spinningRef.current || balance < betAmount) return;
    spinningRef.current = true;
    setIsSpinning(true);
    setLastResult(null);

    setBalance(prev => parseFloat((prev - betAmount).toFixed(2)));

    setTimeout(() => {
      const result = spin(config, betAmount);
      if (result.payout > 0) {
        setBalance(prev => parseFloat((prev + result.payout).toFixed(2)));
      }
      setLastResult(result);
      setHistory(prev => [result, ...prev].slice(0, MAX_HISTORY));
      setIsSpinning(false);
      spinningRef.current = false;
    }, SPIN_DURATION_MS);
  }, [balance, betAmount, config]);

  const increaseBet = useCallback(() => {
    setBetAmount(prev => Math.min(parseFloat((prev * 2).toFixed(2)), config.maxBet));
  }, [config.maxBet]);

  const decreaseBet = useCallback(() => {
    setBetAmount(prev => Math.max(parseFloat((prev / 2).toFixed(2)), config.minBet));
  }, [config.minBet]);

  const resetBalance = useCallback(() => {
    setBalance(config.demoBalance);
    setHistory([]);
    setLastResult(null);
  }, [config.demoBalance]);

  return {
    balance,
    betAmount,
    isSpinning,
    lastResult,
    history,
    canSpin: balance >= betAmount && !isSpinning,
    doSpin,
    increaseBet,
    decreaseBet,
    resetBalance,
  };
}

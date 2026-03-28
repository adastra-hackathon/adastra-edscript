import { useState, useCallback, useEffect, useRef } from 'react';
import { calculateRound } from '../engine/rouletteEngine';
import type { RouletteBet, RouletteRoundResult, RoulettePhase } from '../types/rouletteSimulation.types';

const BETTING_DURATION = 15;
const MAX_HISTORY = 10;

export function useRouletteSimulation(initialBalance = 1000) {
  const [balance, setBalance] = useState(initialBalance);
  const [currentBets, setCurrentBets] = useState<RouletteBet[]>([]);
  const [phase, setPhase] = useState<RoulettePhase>('betting');
  const [countdown, setCountdown] = useState(BETTING_DURATION);
  const [lastResult, setLastResult] = useState<RouletteRoundResult | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startNewRound = useCallback(() => {
    setCurrentBets([]);
    setPhase('betting');
    setCountdown(BETTING_DURATION);
    setLastResult(null);
  }, []);

  const closeAndSpin = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('closing');
    setTimeout(() => {
      setPhase('spinning');
      setTimeout(() => {
        setCurrentBets(bets => {
          const result = calculateRound(bets.length > 0 ? bets : []);
          if (result.totalPayout > 0) {
            setBalance(prev => parseFloat((prev + result.totalPayout).toFixed(2)));
          }
          const totalBet = bets.reduce((s, b) => s + b.amount, 0);
          if (totalBet > 0) {
            setBalance(prev => parseFloat((prev - totalBet).toFixed(2)));
          }
          setLastResult(result);
          setHistory(prev => [result.winningNumber, ...prev].slice(0, MAX_HISTORY));
          setPhase('result');
          setTimeout(startNewRound, 4000);
          return bets;
        });
      }, 2000);
    }, 1000);
  }, [startNewRound]);

  useEffect(() => {
    if (phase !== 'betting') return;
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          closeAndSpin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, closeAndSpin]);

  const addBet = useCallback((bet: RouletteBet) => {
    if (phase !== 'betting') return;
    setCurrentBets(prev => {
      const existing = prev.find(b => b.type === bet.type && b.value === bet.value);
      if (existing) {
        return prev.map(b =>
          b.type === bet.type && b.value === bet.value
            ? { ...b, amount: b.amount + bet.amount }
            : b
        );
      }
      return [...prev, bet];
    });
  }, [phase]);

  const clearBets = useCallback(() => {
    if (phase !== 'betting') return;
    setCurrentBets([]);
  }, [phase]);

  const totalBetAmount = currentBets.reduce((s, b) => s + b.amount, 0);

  return {
    balance,
    currentBets,
    totalBetAmount,
    phase,
    countdown,
    lastResult,
    history,
    canBet: phase === 'betting',
    addBet,
    clearBets,
    startNewRound,
  };
}

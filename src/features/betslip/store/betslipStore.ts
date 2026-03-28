import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import type { BetSelection, BetslipMode, BetslipOddsOptions } from '../types/betslip.types';
import {
  calcSimpleTotalStake,
  calcSimplePotentialPayout,
  calcAccumulatedOdds,
  calcMultiplePotentialPayout,
  calcSystemCombinations,
} from '../utils/betslipCalculations';

// ─── State ────────────────────────────────────────────────────────────────────

interface BetslipState {
  mode: BetslipMode;
  selections: BetSelection[];
  /** stake global para Múltipla e Sistema */
  multipleStake: number;
  oddsOptions: BetslipOddsOptions;

  // Derived (computed via selectors)
  // — NOT stored, computed on read

  // Actions
  setMode: (mode: BetslipMode) => void;
  addSelection: (selection: Omit<BetSelection, 'id' | 'stake'>) => void;
  removeSelection: (id: string) => void;
  updateSelectionStake: (id: string, stake: number) => void;
  setMultipleStake: (stake: number) => void;
  setOddsOptions: (options: Partial<BetslipOddsOptions>) => void;
  clearSlip: () => void;
  hasSelection: (eventId: string) => boolean;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBetslipStore = create<BetslipState>()((set, get) => ({
  mode: 'multiple',
  selections: [],
  multipleStake: 10,
  oddsOptions: {
    acceptAnyOddsChange: false,
    acceptOnlyHigherOdds: false,
  },

  setMode: (mode) => set({ mode }),

  addSelection: (selection) =>
    set((s) => {
      // evita duplicata pelo mesmo evento
      if (s.selections.some((sel) => sel.eventId === selection.eventId)) return s;
      const newSel: BetSelection = { ...selection, id: Crypto.randomUUID(), stake: 10 };
      return { selections: [...s.selections, newSel] };
    }),

  removeSelection: (id) =>
    set((s) => ({ selections: s.selections.filter((sel) => sel.id !== id) })),

  updateSelectionStake: (id, stake) =>
    set((s) => ({
      selections: s.selections.map((sel) =>
        sel.id === id ? { ...sel, stake } : sel,
      ),
    })),

  setMultipleStake: (stake) => set({ multipleStake: stake }),

  setOddsOptions: (options) =>
    set((s) => ({ oddsOptions: { ...s.oddsOptions, ...options } })),

  clearSlip: () => set({ selections: [], multipleStake: 10 }),

  hasSelection: (eventId) => get().selections.some((s) => s.eventId === eventId),
}));

// ─── Selectors ────────────────────────────────────────────────────────────────

export function selectTotalStake(state: BetslipState): number {
  if (state.mode === 'simple') return calcSimpleTotalStake(state.selections);
  return state.multipleStake;
}

export function selectPotentialPayout(state: BetslipState): number {
  if (state.mode === 'simple') return calcSimplePotentialPayout(state.selections);
  return calcMultiplePotentialPayout(state.multipleStake, state.selections);
}

export function selectAccumulatedOdds(state: BetslipState): number {
  return calcAccumulatedOdds(state.selections);
}

export function selectSystemCombinations(state: BetslipState) {
  return calcSystemCombinations(state.selections, state.multipleStake);
}

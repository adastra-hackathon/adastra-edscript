import { create } from 'zustand';
import type { GameType, SortOption } from '../features/games/types/games.types';

export interface GameFiltersState {
  type: GameType | undefined;
  search: string;
  providers: string[];
  categories: string[];
  sort: SortOption;
  page: number;
  limit: number;
}

interface GameFiltersActions {
  setType: (type: GameType | undefined) => void;
  setSearch: (search: string) => void;
  toggleProvider: (slug: string) => void;
  setProviders: (slugs: string[]) => void;
  toggleCategory: (slug: string) => void;
  setCategories: (slugs: string[]) => void;
  setSort: (sort: SortOption) => void;
  setPage: (page: number) => void;
  reset: () => void;
  applyFilters: (partial: Partial<Omit<GameFiltersState, 'page'>>) => void;
}

const defaultState: GameFiltersState = {
  type: undefined,
  search: '',
  providers: [],
  categories: [],
  sort: 'default',
  page: 1,
  limit: 20,
};

export const useGameFiltersStore = create<GameFiltersState & GameFiltersActions>((set) => ({
  ...defaultState,

  setType: (type) => set({ type, page: 1 }),

  setSearch: (search) => set({ search, page: 1 }),

  toggleProvider: (slug) =>
    set((state) => ({
      providers: state.providers.includes(slug)
        ? state.providers.filter((s) => s !== slug)
        : [...state.providers, slug],
      page: 1,
    })),

  setProviders: (slugs) => set({ providers: slugs, page: 1 }),

  toggleCategory: (slug) =>
    set((state) => ({
      categories: state.categories.includes(slug)
        ? state.categories.filter((s) => s !== slug)
        : [...state.categories, slug],
      page: 1,
    })),

  setCategories: (slugs) => set({ categories: slugs, page: 1 }),

  setSort: (sort) => set({ sort, page: 1 }),

  setPage: (page) => set({ page }),

  reset: () => set({ ...defaultState }),

  applyFilters: (partial) =>
    set((state) => ({ ...state, ...partial, page: 1 })),
}));

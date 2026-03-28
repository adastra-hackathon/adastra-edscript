import { create } from 'zustand';

interface FavoritesStoreState {
  favoriteIds: Set<string>;
  setFavoriteIds: (ids: string[]) => void;
  toggleLocal: (gameId: string) => void;
  isFavorited: (gameId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStoreState>((set, get) => ({
  favoriteIds: new Set(),
  setFavoriteIds: (ids) => set({ favoriteIds: new Set(ids) }),
  toggleLocal: (gameId) =>
    set(s => {
      const next = new Set(s.favoriteIds);
      if (next.has(gameId)) next.delete(gameId);
      else next.add(gameId);
      return { favoriteIds: next };
    }),
  isFavorited: (gameId) => get().favoriteIds.has(gameId),
}));

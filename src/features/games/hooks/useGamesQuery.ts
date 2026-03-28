import { useQuery } from '@tanstack/react-query';
import { gamesApi } from '../api/gamesApi';
import type { GameFilters } from '../types/games.types';

export const GAMES_KEY = 'games' as const;

export function useGamesQuery(filters: Partial<GameFilters>) {
  return useQuery({
    queryKey: [GAMES_KEY, filters],
    queryFn: () => gamesApi.getGames(filters),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });
}

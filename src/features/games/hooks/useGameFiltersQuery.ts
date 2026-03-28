import { useQuery } from '@tanstack/react-query';
import { gamesApi } from '../api/gamesApi';

export const GAME_FILTERS_KEY = 'game-filters' as const;

export function useGameFiltersQuery() {
  return useQuery({
    queryKey: [GAME_FILTERS_KEY],
    queryFn: gamesApi.getFilters,
    staleTime: 1000 * 60 * 10,
  });
}

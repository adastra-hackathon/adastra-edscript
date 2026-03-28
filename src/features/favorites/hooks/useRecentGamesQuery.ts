import { useQuery } from '@tanstack/react-query';
import { recentGamesApi } from '../api/favoritesApi';
import { useAuthStore } from '../../../store/authStore';
import type { RecentGame } from '../types/favorites.types';

export function useRecentGamesQuery() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return useQuery<RecentGame[]>({
    queryKey: ['recent-games'],
    queryFn: () => recentGamesApi.list(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });
}

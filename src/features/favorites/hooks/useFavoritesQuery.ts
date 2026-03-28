import { useQuery } from '@tanstack/react-query';
import { favoritesApi } from '../api/favoritesApi';
import { useAuthStore } from '../../../store/authStore';
import type { FavoriteGame } from '../types/favorites.types';

export function useFavoritesQuery() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const query = useQuery<FavoriteGame[]>({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

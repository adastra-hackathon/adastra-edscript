import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { favoritesApi } from '../api/favoritesApi';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { useAuthStore } from '../../../store/authStore';
import type { FavoriteGame } from '../types/favorites.types';

/**
 * Carrega os favoritos do usuário e sincroniza com o store local.
 * Chamar uma vez por sessão (ex: HomeScreen, CasinoScreen).
 */
export function useFavoritesSync() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const setFavoriteIds = useFavoritesStore(s => s.setFavoriteIds);

  const { data } = useQuery<FavoriteGame[]>({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setFavoriteIds(data.map(f => f.gameId));
    }
  }, [data, setFavoriteIds]);
}

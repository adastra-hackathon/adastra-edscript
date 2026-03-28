import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../api/favoritesApi';
import { useAuthStore } from '../../../store/authStore';
import { useFavoritesStore } from '../../../store/favoritesStore';

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const toggleLocal = useFavoritesStore(s => s.toggleLocal);

  const addMutation = useMutation({
    mutationFn: (gameId: string) => favoritesApi.add(gameId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    onError: (_err, gameId) => toggleLocal(gameId), // revert on error
  });

  const removeMutation = useMutation({
    mutationFn: (gameId: string) => favoritesApi.remove(gameId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    onError: (_err, gameId) => toggleLocal(gameId), // revert on error
  });

  const toggle = (gameId: string, isFavorited: boolean) => {
    if (!isAuthenticated) return;
    toggleLocal(gameId); // optimistic update
    if (isFavorited) removeMutation.mutate(gameId);
    else addMutation.mutate(gameId);
  };

  return { toggle, isLoading: addMutation.isPending || removeMutation.isPending };
}

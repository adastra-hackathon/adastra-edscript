import { useQuery } from '@tanstack/react-query';
import { gamesApi } from '../../games/api/gamesApi';

export function useGameDetailQuery(slug: string) {
  return useQuery({
    queryKey: ['game', slug],
    queryFn: () => gamesApi.getGameBySlug(slug),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(slug),
  });
}

import { useQuery } from '@tanstack/react-query';
import { sportsApi } from '../api/sportsApi';
import type { SportTab } from '../types/sports.types';

interface SportsMatchesParams {
  sport?: SportTab;
  isLive?: boolean;
}

export function useSportsMatchesQuery(params?: SportsMatchesParams) {
  return useQuery({
    queryKey: ['sports/matches', params?.sport, params?.isLive],
    queryFn: () => sportsApi.getMatches({ sport: params?.sport, isLive: params?.isLive }),
    staleTime: 1000 * 30,
  });
}

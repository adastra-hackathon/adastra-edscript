import { useQuery } from '@tanstack/react-query';
import { homeApi } from '../api/homeApi';

export const HOME_KEY = ['home'] as const;

export function useHomeQuery() {
  return useQuery({
    queryKey: HOME_KEY,
    queryFn: homeApi.getHomeData,
    staleTime: 1000 * 60 * 5,
  });
}

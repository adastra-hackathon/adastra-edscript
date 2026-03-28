import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/authStore';
import { gamingLimitsApi } from '../api/gamingLimitsApi';

export const RESPONSIBLE_GAMING_KEY = ['responsible-gaming'] as const;

export function useResponsibleGamingLimitsQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: RESPONSIBLE_GAMING_KEY,
    queryFn: gamingLimitsApi.getState,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInvalidateResponsibleGaming() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: RESPONSIBLE_GAMING_KEY });
}

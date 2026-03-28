import { useMutation } from '@tanstack/react-query';
import { gamingLimitsApi } from '../api/gamingLimitsApi';
import { useInvalidateResponsibleGaming } from './useResponsibleGamingLimitsQuery';

export function useUpsertBettingLimitMutation() {
  const invalidate = useInvalidateResponsibleGaming();

  return useMutation({
    mutationFn: gamingLimitsApi.upsertBetLimit,
    onSuccess: invalidate,
  });
}

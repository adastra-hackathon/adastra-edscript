import { useMutation } from '@tanstack/react-query';
import { gamingLimitsApi } from '../api/gamingLimitsApi';
import { useInvalidateResponsibleGaming } from './useResponsibleGamingLimitsQuery';

export function useUpsertSessionTimeLimitMutation() {
  const invalidate = useInvalidateResponsibleGaming();

  return useMutation({
    mutationFn: gamingLimitsApi.upsertSessionTimeLimit,
    onSuccess: invalidate,
  });
}

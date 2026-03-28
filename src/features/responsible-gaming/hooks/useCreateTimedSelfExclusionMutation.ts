import { useMutation } from '@tanstack/react-query';
import { gamingLimitsApi } from '../api/gamingLimitsApi';
import { useInvalidateResponsibleGaming } from './useResponsibleGamingLimitsQuery';

export function useCreateTimedSelfExclusionMutation() {
  const invalidate = useInvalidateResponsibleGaming();

  return useMutation({
    mutationFn: gamingLimitsApi.createTimedSelfExclusion,
    onSuccess: invalidate,
  });
}

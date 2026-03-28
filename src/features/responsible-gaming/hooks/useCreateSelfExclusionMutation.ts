import { useMutation } from '@tanstack/react-query';
import { gamingLimitsApi } from '../api/gamingLimitsApi';
import { useInvalidateResponsibleGaming } from './useResponsibleGamingLimitsQuery';

export function useCreateSelfExclusionMutation() {
  const invalidate = useInvalidateResponsibleGaming();

  return useMutation({
    mutationFn: gamingLimitsApi.createSelfExclusion,
    onSuccess: invalidate,
  });
}

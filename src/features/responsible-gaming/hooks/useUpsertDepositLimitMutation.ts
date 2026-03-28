import { useMutation } from '@tanstack/react-query';
import { gamingLimitsApi } from '../api/gamingLimitsApi';
import { useInvalidateResponsibleGaming } from './useResponsibleGamingLimitsQuery';

export function useUpsertDepositLimitMutation() {
  const invalidate = useInvalidateResponsibleGaming();

  return useMutation({
    mutationFn: gamingLimitsApi.upsertDepositLimit,
    onSuccess: invalidate,
  });
}

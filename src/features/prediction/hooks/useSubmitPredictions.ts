import { useState, useCallback } from 'react';
import { predictionService } from '../services/predictionService';
import { usePredictionStore } from '../store/predictionStore';

export function useSubmitPredictions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clearDraft = usePredictionStore((s) => s.clearDraft);

  const submit = useCallback(
    async (roomId: string, predictions: Array<{ eventId: string; optionId: string }>) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await predictionService.submitPredictions(roomId, predictions);
        clearDraft();
        return data.data;
      } catch (e: any) {
        const msg = e?.response?.data?.translatedMessage ?? 'Não foi possível enviar os palpites.';
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [clearDraft],
  );

  return { submit, isLoading, error };
}

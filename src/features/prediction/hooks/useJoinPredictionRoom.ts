import { useState, useCallback } from 'react';
import { predictionService } from '../services/predictionService';
import { usePredictionStore } from '../store/predictionStore';

export function useJoinPredictionRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateRoom = usePredictionStore((s) => s.updateRoom);

  const join = useCallback(async (roomId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await predictionService.join(roomId);
      updateRoom(data.data);
    } catch (e: any) {
      const msg = e?.response?.data?.translatedMessage ?? 'Não foi possível entrar na sala.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [updateRoom]);

  return { join, isLoading, error };
}

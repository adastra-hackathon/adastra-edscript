import { useEffect, useCallback } from 'react';
import { predictionService } from '../services/predictionService';
import { usePredictionStore } from '../store/predictionStore';
import type { PredictionRoomStatus } from '../types/prediction.types';

export function usePredictionRooms(status?: PredictionRoomStatus) {
  const setRooms = usePredictionStore((s) => s.setRooms);
  const setLoading = usePredictionStore((s) => s.setLoading);
  const setError = usePredictionStore((s) => s.setError);
  const rooms = usePredictionStore((s) => s.rooms);
  const isLoading = usePredictionStore((s) => s.isLoading);
  const error = usePredictionStore((s) => s.error);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await predictionService.list(status);
      setRooms(data.data);
    } catch {
      setError('Não foi possível carregar as salas de apostas.');
    } finally {
      setLoading(false);
    }
  }, [status, setRooms, setLoading, setError]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { rooms, isLoading, error, refetch: fetch };
}

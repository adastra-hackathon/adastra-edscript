import { useEffect, useCallback } from 'react';
import { predictionService } from '../services/predictionService';
import { usePredictionStore } from '../store/predictionStore';

export function usePredictionRoom(id: string) {
  const setSelectedRoom = usePredictionStore((s) => s.setSelectedRoom);
  const room = usePredictionStore((s) =>
    s.selectedRoom?.id === id ? s.selectedRoom : s.rooms.find((r) => r.id === id) ?? null,
  );
  const isLoading = usePredictionStore((s) => s.isLoading);
  const setLoading = usePredictionStore((s) => s.setLoading);
  const setError = usePredictionStore((s) => s.setError);
  const error = usePredictionStore((s) => s.error);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await predictionService.getById(id);
      setSelectedRoom(data.data);
    } catch {
      setError('Não foi possível carregar a sala.');
    } finally {
      setLoading(false);
    }
  }, [id, setSelectedRoom, setLoading, setError]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { room, isLoading, error, refetch: fetch };
}

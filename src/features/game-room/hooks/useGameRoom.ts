import { useEffect, useCallback } from 'react';
import { gameRoomService } from '../services/gameRoomService';
import { useGameRoomStore } from '../store/gameRoomStore';

export function useGameRoom(id: string) {
  const setSelectedRoom = useGameRoomStore((s) => s.setSelectedRoom);
  const setLoading = useGameRoomStore((s) => s.setLoading);
  const setError = useGameRoomStore((s) => s.setError);
  const selectedRoom = useGameRoomStore((s) => s.selectedRoom);
  const isLoading = useGameRoomStore((s) => s.isLoading);
  const error = useGameRoomStore((s) => s.error);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await gameRoomService.getById(id);
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

  return { room: selectedRoom, isLoading, error, refetch: fetch };
}

import { useEffect, useCallback } from 'react';
import { gameRoomService } from '../services/gameRoomService';
import { useGameRoomStore } from '../store/gameRoomStore';
import type { GameRoomStatus } from '../types/game-room.types';

export function useGameRooms(status?: GameRoomStatus) {
  const setRooms = useGameRoomStore((s) => s.setRooms);
  const setLoading = useGameRoomStore((s) => s.setLoading);
  const setError = useGameRoomStore((s) => s.setError);
  const rooms = useGameRoomStore((s) => s.rooms);
  const isLoading = useGameRoomStore((s) => s.isLoading);
  const error = useGameRoomStore((s) => s.error);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await gameRoomService.list(status);
      setRooms(data.data);
    } catch {
      setError('Não foi possível carregar as salas.');
    } finally {
      setLoading(false);
    }
  }, [status, setRooms, setLoading, setError]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { rooms, isLoading, error, refetch: fetch };
}

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { gameRoomService } from '../services/gameRoomService';
import { useGameRoomStore } from '../store/gameRoomStore';
import type { AppStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export function useJoinRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateRoom = useGameRoomStore((s) => s.updateRoom);
  const navigation = useNavigation<Nav>();

  async function join(roomId: string) {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await gameRoomService.join(roomId);
      updateRoom(data.data);
      navigation.navigate('GameRoomLobby', { roomId });
    } catch (e: any) {
      const msg = e?.response?.data?.translatedMessage ?? 'Não foi possível entrar na sala.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return { join, isLoading, error };
}

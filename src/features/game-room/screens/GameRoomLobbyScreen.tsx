import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { useAuth } from '../../../core/hooks/useAuth';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { spacing } from '../../../core/theme';
import { useGameRoom } from '../hooks/useGameRoom';
import { PlayerList } from '../components/PlayerList';
import { PrizePoolCard } from '../components/PrizePoolCard';
import { gameRoomService } from '../services/gameRoomService';
import { useGameRoomStore } from '../store/gameRoomStore';
import { formatCurrency } from '../utils/gameRoomCalculations';
import { GAME_ROOM_STATUS_LABELS, GAME_ROOM_STATUS_COLORS } from '../types/game-room.types';
import type { AppStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Props = NativeStackScreenProps<AppStackParamList, 'GameRoomLobby'>;

const POLL_INTERVAL_MS = 5000;

export const GameRoomLobbyScreen = memo(function GameRoomLobbyScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const { roomId } = route.params;

  const { isAuthenticated } = useProtectedRoute({ pendingRoute: { stack: 'App', screen: 'GameRoomLobby' } });
  const { user } = useAuth();
  const { room, isLoading, refetch } = useGameRoom(roomId);
  const updateRoom = useGameRoomStore((s) => s.updateRoom);
  const initSimulation = useGameRoomStore((s) => s.initSimulation);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll while WAITING
  useEffect(() => {
    if (room?.status === 'WAITING') {
      pollRef.current = setInterval(refetch, POLL_INTERVAL_MS);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [room?.status, refetch]);

  // Navigate to game when IN_PROGRESS
  useEffect(() => {
    if (room?.status === 'IN_PROGRESS') {
      navigation.replace('GameRoomGame', { roomId });
    }
  }, [room?.status, navigation, roomId]);

  const [isAddingBots, setIsAddingBots] = useState(false);

  const handleAddBots = useCallback(async () => {
    if (!room) return;
    setIsAddingBots(true);
    try {
      const { data } = await gameRoomService.addBots(room.id, 3);
      updateRoom(data.data);
    } catch (e: any) {
      const msg = e?.response?.data?.translatedMessage ?? 'Não foi possível adicionar bots.';
      Alert.alert('Erro', msg);
    } finally {
      setIsAddingBots(false);
    }
  }, [room, updateRoom]);

  const handleStart = useCallback(async () => {
    if (!room) return;
    try {
      const { data } = await gameRoomService.start(room.id);
      updateRoom(data.data);
      const myPlayer = data.data.players.find((p) => p.userId === user?.id);
      if (myPlayer) initSimulation(myPlayer.initialBalance);
      navigation.replace('GameRoomGame', { roomId });
    } catch (e: any) {
      const msg = e?.response?.data?.translatedMessage ?? 'Não foi possível iniciar a sala.';
      Alert.alert('Erro', msg);
    }
  }, [room, user, updateRoom, initSimulation, navigation, roomId]);

  if (!isAuthenticated) return null;

  const isHost = room?.hostId === user?.id;
  const isSimulation = room?.isSimulation ?? false;
  const canStart = isHost && room?.status === 'WAITING' && (room?.players.length ?? 0) >= 2;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <AppText style={{ color: colors.textSecondary, fontSize: 20 }}>‹</AppText>
        </TouchableOpacity>
        <AppText variant="h2" color={colors.textPrimary}>Lobby</AppText>
        {room && (
          <View style={[styles.badge, { backgroundColor: GAME_ROOM_STATUS_COLORS[room.status] + '22' }]}>
            <AppText style={[styles.badgeText, { color: GAME_ROOM_STATUS_COLORS[room.status] }]}>
              {GAME_ROOM_STATUS_LABELS[room.status]}
            </AppText>
          </View>
        )}
      </View>

      {isLoading && !room ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.secondary} />
        </View>
      ) : room ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Room info */}
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <InfoRow label="Entrada" value={formatCurrency(room.entryAmount)} colors={colors} />
            <InfoRow label="Jogadores" value={`${room.players.length}/${room.maxPlayers}`} colors={colors} />
            <InfoRow label="Duração" value={`${room.duration / 60} min`} colors={colors} />
          </View>

          {/* Prize Pool */}
          <PrizePoolCard prizePool={room.prizePool || room.entryAmount * room.players.length} />

          {/* Players */}
          <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Jogadores ({room.players.length}/{room.maxPlayers})
          </AppText>
          <PlayerList players={room.players} />

          {/* Host actions */}
          {isHost && room.status === 'WAITING' && (
            <View style={styles.hostSection}>
              {isSimulation && (
                <Button
                  label={isAddingBots ? 'Adicionando...' : 'Simular Jogadores (+3)'}
                  onPress={handleAddBots}
                  loading={isAddingBots}
                  disabled={isAddingBots || room.players.length >= room.maxPlayers}
                  variant="outline"
                  style={{ marginBottom: spacing[3] }}
                />
              )}
              {!canStart && (
                <AppText style={{ color: colors.textTertiary, fontSize: 12, textAlign: 'center', marginBottom: spacing[3] }}>
                  Aguardando mais jogadores (mínimo 2)
                </AppText>
              )}
              <Button
                label="Iniciar Sala"
                onPress={handleStart}
                variant="secondary"
                disabled={!canStart}
              />
            </View>
          )}

          {/* Non-host waiting message */}
          {!isHost && room.status === 'WAITING' && (
            <View style={styles.waitingMsg}>
              <ActivityIndicator color={colors.secondary} size="small" style={{ marginBottom: spacing[2] }} />
              <AppText style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center' }}>
                Aguardando o host iniciar a sala...
              </AppText>
            </View>
          )}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
});

function InfoRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={infoStyles.row}>
      <AppText style={[infoStyles.label, { color: colors.textSecondary }]}>{label}</AppText>
      <AppText style={[infoStyles.value, { color: colors.textPrimary }]}>{value}</AppText>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[2] },
  label: { fontSize: 13, fontFamily: 'Inter-Regular' },
  value: { fontSize: 13, fontFamily: 'Inter-Medium' },
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  backBtn: { padding: spacing[1] },
  badge: { paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 20 },
  badgeText: { fontSize: 12, fontFamily: 'Inter-SemiBold' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[8] },
  infoCard: { borderRadius: 12, padding: spacing[4] },
  sectionTitle: { fontSize: 12, fontFamily: 'Inter-SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  hostSection: { marginTop: spacing[2] },
  waitingMsg: { alignItems: 'center', paddingVertical: spacing[4] },
});

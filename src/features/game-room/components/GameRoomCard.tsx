import React from 'react';
import { View, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { formatCurrency } from '../utils/gameRoomCalculations';
import { GAME_ROOM_STATUS_LABELS, GAME_ROOM_STATUS_COLORS } from '../types/game-room.types';
import type { GameRoom } from '../types/game-room.types';

interface Props {
  room: GameRoom;
  onPress: () => void;
  onJoin?: () => void;
  isParticipant?: boolean;
  userId?: string;
}

export function GameRoomCard({ room, onPress, onJoin, isParticipant, userId }: Props) {
  const { colors } = useAppTheme();

  const handleCopyId = () => {
    Clipboard.setString(room.id);
    Alert.alert('Copiado!', 'ID da sala copiado para a área de transferência.');
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        isParticipant && { borderWidth: 1, borderColor: colors.secondary + '44' },
      ]}
      activeOpacity={0.8}
    >
      {/* ID row with copy button */}
      <TouchableOpacity onPress={handleCopyId} style={styles.idRow} activeOpacity={0.6}>
        <AppText style={[styles.roomId, { color: colors.textTertiary }]}>
          #{room.id.slice(0, 8).toUpperCase()}
        </AppText>
        <AppText style={[styles.copyIcon, { color: colors.textTertiary }]}>⎘</AppText>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: GAME_ROOM_STATUS_COLORS[room.status] + '22' }]}>
            <AppText style={[styles.badgeText, { color: GAME_ROOM_STATUS_COLORS[room.status] }]}>
              {GAME_ROOM_STATUS_LABELS[room.status]}
            </AppText>
          </View>
          {room.isSimulation && (
            <View style={[styles.badge, { backgroundColor: '#A78BFA22' }]}>
              <AppText style={[styles.badgeText, { color: '#A78BFA' }]}>Demo</AppText>
            </View>
          )}
          {isParticipant && (
            <View style={[styles.badge, { backgroundColor: colors.secondary + '22' }]}>
              <AppText style={[styles.badgeText, { color: colors.secondary }]}>Sua sala</AppText>
            </View>
          )}
        </View>
        <AppText style={[styles.prize, { color: colors.secondary }]}>
          {formatCurrency(room.prizePool || room.entryAmount * room.players.length)}
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText style={[styles.label, { color: colors.textSecondary }]}>Entrada</AppText>
        <AppText style={[styles.value, { color: colors.textPrimary }]}>{formatCurrency(room.entryAmount)}</AppText>
      </View>

      <View style={styles.row}>
        <AppText style={[styles.label, { color: colors.textSecondary }]}>Jogadores</AppText>
        <AppText style={[styles.value, { color: colors.textPrimary }]}>
          {room.players.length}/{room.maxPlayers}
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText style={[styles.label, { color: colors.textSecondary }]}>Duração</AppText>
        <AppText style={[styles.value, { color: colors.textPrimary }]}>{room.duration / 60} min</AppText>
      </View>

      {/* Win/loss result for finished rooms */}
      {isParticipant && room.status === 'FINISHED' && userId && (() => {
        const myPlayer = room.players.find((p) => p.userId === userId);
        const isWinner = room.winnerId === userId;
        const profit = myPlayer?.profit ?? null;
        return (
          <View style={[styles.resultRow, { backgroundColor: isWinner ? '#38E67D22' : '#FF6B6B22', borderColor: isWinner ? '#38E67D' : '#FF6B6B' }]}>
            <AppText style={[styles.resultLabel, { color: isWinner ? '#38E67D' : '#FF6B6B' }]}>
              {isWinner ? '🏆 Vencedor' : '❌ Perdedor'}
            </AppText>
            {profit !== null && (
              <AppText style={[styles.resultProfit, { color: isWinner ? '#38E67D' : '#FF6B6B' }]}>
                {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
              </AppText>
            )}
          </View>
        );
      })()}

      {/* Participant: show follow button */}
      {isParticipant && (room.status === 'WAITING' || room.status === 'IN_PROGRESS') && (
        <TouchableOpacity
          onPress={onPress}
          style={[styles.actionButton, { backgroundColor: colors.secondary + '22', borderWidth: 1, borderColor: colors.secondary }]}
          activeOpacity={0.8}
        >
          <AppText style={[styles.actionText, { color: colors.secondary }]}>
            {room.status === 'IN_PROGRESS' ? 'Continuar Jogo' : 'Acompanhar'}
          </AppText>
        </TouchableOpacity>
      )}

      {/* Non-participant: show join button */}
      {!isParticipant && room.status === 'WAITING' && onJoin && (
        <TouchableOpacity
          onPress={onJoin}
          style={[styles.actionButton, { backgroundColor: colors.secondary }]}
          activeOpacity={0.8}
        >
          <AppText style={[styles.actionText, { color: colors.background }]}>Entrar na Sala</AppText>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: 16, marginBottom: 12 },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  roomId: { fontSize: 12, fontFamily: 'Inter-Medium' },
  copyIcon: { fontSize: 13 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontFamily: 'Inter-SemiBold' },
  prize: { fontSize: 18, fontFamily: 'Inter-Bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 13, fontFamily: 'Inter-Regular' },
  value: { fontSize: 13, fontFamily: 'Inter-Medium' },
  actionButton: { borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  actionText: { fontSize: 14, fontFamily: 'Inter-SemiBold' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, marginTop: 12 },
  resultLabel: { fontSize: 13, fontFamily: 'Inter-SemiBold' },
  resultProfit: { fontSize: 13, fontFamily: 'Inter-Bold' },
});

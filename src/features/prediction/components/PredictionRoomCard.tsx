import React from 'react';
import { View, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { formatCurrency } from '../../game-room/utils/gameRoomCalculations';
import { PREDICTION_STATUS_LABELS, PREDICTION_STATUS_COLORS } from '../types/prediction.types';
import type { PredictionRoom } from '../types/prediction.types';

interface Props {
  room: PredictionRoom;
  onPress: () => void;
  onJoin?: () => void;
  isParticipant?: boolean;
  userId?: string;
}

export function PredictionRoomCard({ room, onPress, onJoin, isParticipant, userId }: Props) {
  const { colors } = useAppTheme();

  const handleCopyId = () => {
    Clipboard.setString(room.id);
    Alert.alert('Copiado!', 'ID da sala copiado para a área de transferência.');
  };

  const readyCount = room.players.filter((p) => p.status === 'READY').length;
  const statusColor = PREDICTION_STATUS_COLORS[room.status];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        isParticipant && { borderWidth: 1, borderColor: '#A78BFA44' },
      ]}
      activeOpacity={0.8}
    >
      {/* ID row */}
      <TouchableOpacity onPress={handleCopyId} style={styles.idRow} activeOpacity={0.6}>
        <AppText style={[styles.idText, { color: colors.textTertiary }]}>
          #{room.id.slice(0, 8).toUpperCase()}
        </AppText>
        <AppText style={[styles.copyIcon, { color: colors.textTertiary }]}>⎘</AppText>
      </TouchableOpacity>

      {/* Badges */}
      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: statusColor + '22' }]}>
          <AppText style={[styles.badgeText, { color: statusColor }]}>
            {PREDICTION_STATUS_LABELS[room.status]}
          </AppText>
        </View>
        {room.isSimulation && (
          <View style={[styles.badge, { backgroundColor: '#A78BFA22' }]}>
            <AppText style={[styles.badgeText, { color: '#A78BFA' }]}>Demo</AppText>
          </View>
        )}
        {isParticipant && (
          <View style={[styles.badge, { backgroundColor: '#A78BFA22' }]}>
            <AppText style={[styles.badgeText, { color: '#A78BFA' }]}>Participando</AppText>
          </View>
        )}
      </View>

      {/* Title + Prize */}
      <View style={styles.titleRow}>
        <AppText style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {room.title}
        </AppText>
        <AppText style={[styles.prize, { color: '#A78BFA' }]}>
          {formatCurrency(room.prizePool || room.entryAmount * room.players.length)}
        </AppText>
      </View>

      {/* Info rows */}
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
        <AppText style={[styles.label, { color: colors.textSecondary }]}>Eventos</AppText>
        <AppText style={[styles.value, { color: colors.textPrimary }]}>{room.events.length}</AppText>
      </View>
      {room.status === 'IN_PROGRESS' && (
        <View style={styles.row}>
          <AppText style={[styles.label, { color: colors.textSecondary }]}>Prontos</AppText>
          <AppText style={[styles.value, { color: '#38E67D' }]}>
            {readyCount}/{room.players.length}
          </AppText>
        </View>
      )}

      {/* Win/loss for finished rooms */}
      {isParticipant && room.status === 'FINISHED' && userId && (() => {
        const isWinner = room.winnerId === userId;
        const myPlayer = room.players.find((p) => p.userId === userId);
        return (
          <View style={[styles.resultRow, { backgroundColor: isWinner ? '#38E67D22' : '#FF6B6B22', borderColor: isWinner ? '#38E67D' : '#FF6B6B' }]}>
            <AppText style={[styles.resultLabel, { color: isWinner ? '#38E67D' : '#FF6B6B' }]}>
              {isWinner ? '🏆 Vencedor' : '❌ Perdedor'}
            </AppText>
            {myPlayer?.score !== undefined && (
              <AppText style={[styles.resultScore, { color: isWinner ? '#38E67D' : '#FF6B6B' }]}>
                {myPlayer.score}/{room.events.length} acertos
              </AppText>
            )}
          </View>
        );
      })()}

      {/* Action buttons */}
      {isParticipant && (room.status === 'WAITING' || room.status === 'IN_PROGRESS') && (
        <TouchableOpacity
          onPress={onPress}
          style={[styles.actionButton, { backgroundColor: '#A78BFA22', borderWidth: 1, borderColor: '#A78BFA' }]}
          activeOpacity={0.8}
        >
          <AppText style={[styles.actionText, { color: '#A78BFA' }]}>
            {room.status === 'IN_PROGRESS' ? 'Enviar Palpites' : 'Acompanhar'}
          </AppText>
        </TouchableOpacity>
      )}

      {!isParticipant && room.status === 'WAITING' && onJoin && (
        <TouchableOpacity
          onPress={onJoin}
          style={[styles.actionButton, { backgroundColor: '#A78BFA' }]}
          activeOpacity={0.8}
        >
          <AppText style={[styles.actionText, { color: '#fff' }]}>Entrar na Sala</AppText>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: 16, marginBottom: 12 },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  idText: { fontSize: 11, fontFamily: 'Inter-Medium' },
  copyIcon: { fontSize: 13 },
  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontFamily: 'Inter-SemiBold' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 15, fontFamily: 'Inter-SemiBold', flex: 1, marginRight: 8 },
  prize: { fontSize: 18, fontFamily: 'Inter-Bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 13, fontFamily: 'Inter-Regular' },
  value: { fontSize: 13, fontFamily: 'Inter-Medium' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10 },
  resultLabel: { fontSize: 13, fontFamily: 'Inter-SemiBold' },
  resultScore: { fontSize: 13, fontFamily: 'Inter-Bold' },
  actionButton: { borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  actionText: { fontSize: 14, fontFamily: 'Inter-SemiBold' },
});

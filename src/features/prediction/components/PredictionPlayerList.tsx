import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { PREDICTION_PLAYER_STATUS_LABELS, PREDICTION_PLAYER_STATUS_COLORS } from '../types/prediction.types';
import type { PredictionRoomPlayer } from '../types/prediction.types';

interface Props {
  players: PredictionRoomPlayer[];
  winnerId?: string | null;
  totalEvents?: number;
  showResults?: boolean;
}

export function PredictionPlayerList({ players, winnerId, totalEvents, showResults }: Props) {
  const { colors } = useAppTheme();

  const sorted = [...players].sort((a, b) => {
    if (showResults && a.position !== null && b.position !== null) return a.position - b.position;
    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {sorted.map((player, index) => {
        const isWinner = player.userId === winnerId;
        const displayName = player.displayName ?? `#${player.userId.slice(0, 6).toUpperCase()}`;
        const statusColor = PREDICTION_PLAYER_STATUS_COLORS[player.status];

        return (
          <View
            key={player.id}
            style={[
              styles.row,
              index < sorted.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              isWinner && { backgroundColor: '#38E67D11' },
            ]}
          >
            {/* Position / rank */}
            <View style={styles.position}>
              {showResults && player.position !== null ? (
                <AppText style={[styles.posText, { color: isWinner ? '#38E67D' : colors.textTertiary }]}>
                  #{player.position}
                </AppText>
              ) : (
                <AppText style={[styles.posText, { color: colors.textTertiary }]}>
                  {index + 1}
                </AppText>
              )}
            </View>

            {/* Name + status */}
            <View style={styles.info}>
              <View style={styles.nameRow}>
                {isWinner && <AppText style={styles.trophy}>🏆 </AppText>}
                <AppText style={[styles.name, { color: colors.textPrimary }]}>{displayName}</AppText>
                {player.isBot && (
                  <View style={[styles.botTag, { backgroundColor: '#A78BFA22' }]}>
                    <AppText style={[styles.botText, { color: '#A78BFA' }]}>Bot</AppText>
                  </View>
                )}
              </View>
              {!showResults && (
                <View style={[styles.statusTag, { backgroundColor: statusColor + '22' }]}>
                  <AppText style={[styles.statusText, { color: statusColor }]}>
                    {PREDICTION_PLAYER_STATUS_LABELS[player.status]}
                  </AppText>
                </View>
              )}
            </View>

            {/* Score or predictions progress */}
            {showResults ? (
              <AppText style={[styles.score, { color: isWinner ? '#38E67D' : colors.textPrimary }]}>
                {player.score}{totalEvents ? `/${totalEvents}` : ''} ✓
              </AppText>
            ) : totalEvents ? (
              <AppText style={[styles.progress, { color: colors.textTertiary }]}>
                {player.predictions.length}/{totalEvents}
              </AppText>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  position: { width: 28, alignItems: 'center' },
  posText: { fontSize: 13, fontFamily: 'Inter-Bold' },
  info: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  trophy: { fontSize: 13 },
  name: { fontSize: 13, fontFamily: 'Inter-SemiBold' },
  botTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  botText: { fontSize: 10, fontFamily: 'Inter-SemiBold' },
  statusTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusText: { fontSize: 11, fontFamily: 'Inter-Medium' },
  score: { fontSize: 13, fontFamily: 'Inter-Bold' },
  progress: { fontSize: 12, fontFamily: 'Inter-Regular' },
});

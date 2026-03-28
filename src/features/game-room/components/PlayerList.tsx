import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { formatCurrency } from '../utils/gameRoomCalculations';
import type { GameRoomPlayer } from '../types/game-room.types';

interface Props {
  players: GameRoomPlayer[];
  winnerId?: string | null;
  showResults?: boolean;
}

function PlayerRow({ player, isWinner, showResults, colors }: {
  player: GameRoomPlayer;
  isWinner: boolean;
  showResults: boolean;
  colors: ReturnType<typeof useAppTheme>['colors'];
}) {
  const profitColor = player.profit !== null
    ? player.profit >= 0 ? colors.secondary : colors.error
    : colors.textSecondary;

  return (
    <View style={[
      styles.row,
      { backgroundColor: isWinner ? colors.secondary + '18' : 'transparent', borderRadius: 8 },
    ]}>
      <View style={styles.position}>
        <AppText style={[styles.positionText, { color: isWinner ? colors.secondary : colors.textTertiary }]}>
          {player.position ?? '—'}
        </AppText>
      </View>
      <View style={styles.info}>
        <AppText style={[styles.userId, { color: colors.textPrimary }]} numberOfLines={1}>
          {player.isBot
            ? (player.displayName ?? 'Bot')
            : player.userId.slice(0, 8) + '...'}
        </AppText>
        {player.isBot && (
          <AppText style={[styles.botTag, { color: colors.textTertiary }]}>Bot</AppText>
        )}
      </View>
      {showResults && player.profit !== null && (
        <AppText style={[styles.profit, { color: profitColor }]}>
          {player.profit >= 0 ? '+' : ''}{formatCurrency(player.profit)}
        </AppText>
      )}
    </View>
  );
}

export function PlayerList({ players, winnerId, showResults = false }: Props) {
  const { colors } = useAppTheme();

  return (
    <FlatList
      data={players}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <PlayerRow
          player={item}
          isWinner={item.userId === winnerId}
          showResults={showResults}
          colors={colors}
        />
      )}
      ListEmptyComponent={
        <AppText style={[styles.empty, { color: colors.textTertiary }]}>Nenhum jogador ainda.</AppText>
      }
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, marginBottom: 4 },
  position: { width: 28, alignItems: 'center' },
  positionText: { fontSize: 14, fontFamily: 'Inter-Bold' },
  info: { flex: 1, marginLeft: 8 },
  userId: { fontSize: 13, fontFamily: 'Inter-Regular' },
  botTag: { fontSize: 10, fontFamily: 'Inter-Regular' },
  profit: { fontSize: 13, fontFamily: 'Inter-SemiBold' },
  empty: { fontSize: 13, textAlign: 'center', paddingVertical: 16 },
});

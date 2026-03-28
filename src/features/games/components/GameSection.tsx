import React, { memo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { spacing } from '../../../core/theme';
import { GameCard } from './GameCard';
import type { Game } from '../types/games.types';

interface Props {
  title: string;
  games: Game[];
  isLoading?: boolean;
  onSeeAllPress?: () => void;
  onGamePress?: (game: Game) => void;
}

export const GameSection = memo(function GameSection({
  title,
  games,
  isLoading,
  onSeeAllPress,
  onGamePress,
}: Props) {
  const { colors } = useAppTheme();

  const handleGamePress = useCallback(
    (game: Game) => onGamePress?.(game),
    [onGamePress]
  );

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.accent, { backgroundColor: colors.secondary }]} />
          <AppText variant="h3" color={colors.textPrimary}>
            {title}
          </AppText>
        </View>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
            <AppText variant="caption" color={colors.secondary}>
              Ver todos
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Game cards horizontal scroll */}
      {isLoading ? (
        <ActivityIndicator color={colors.secondary} style={styles.loader} />
      ) : games.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: colors.surfaceOverlay }]}>
          <AppText variant="bodyMd" color={colors.textSecondary}>
            Nenhum jogo disponível no momento.
          </AppText>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPress={handleGamePress}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  accent: {
    width: 3,
    height: 18,
    borderRadius: 2,
  },
  loader: {
    marginVertical: spacing[6],
  },
  empty: {
    marginHorizontal: spacing[5],
    paddingVertical: spacing[6],
    borderRadius: 10,
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
});

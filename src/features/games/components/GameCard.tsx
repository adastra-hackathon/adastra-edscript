import React, { memo, useCallback } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { borderRadius, spacing } from '../../../core/theme';
import { gamesMapper } from '../mappers/gamesMapper';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { useToggleFavorite } from '../../favorites/hooks/useToggleFavorite';
import { useAuthStore } from '../../../store/authStore';
import type { Game } from '../types/games.types';

const CARD_WIDTH = 140;
const CARD_HEIGHT = 190;
const IMAGE_HEIGHT = 130;

interface Props {
  game: Game;
  onPress?: (game: Game) => void;
}

export const GameCard = memo(function GameCard({ game, onPress }: Props) {
  const { colors } = useAppTheme();
  const badge = gamesMapper.getBadge(game);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isFavorited = useFavoritesStore(s => s.isFavorited(game.id));
  const { toggle } = useToggleFavorite();

  const handleFavoritePress = useCallback(() => {
    toggle(game.id, isFavorited);
  }, [game.id, isFavorited, toggle]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => onPress?.(game)}
      activeOpacity={0.85}
      accessibilityLabel={game.name}
      accessibilityRole="button"
    >
      {/* Game image */}
      <View style={styles.imageWrapper}>
        {game.imageUrl ? (
          <Image
            source={{ uri: game.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.backgroundSecondary }]} />
        )}

        {/* Badge */}
        {badge && (
          <View
            style={[
              styles.badge,
              { backgroundColor: badge === 'POPULAR' ? colors.warning : colors.secondary },
            ]}
          >
            <AppText variant="caption" color="#000" style={styles.badgeText}>
              {badge === 'POPULAR' ? 'POPULARES' : 'NOVO'}
            </AppText>
          </View>
        )}

        {/* Favorite button — só exibe se autenticado */}
        {isAuthenticated && (
          <TouchableOpacity
            style={[
              styles.favoriteBtn,
              { backgroundColor: isFavorited ? '#e8333388' : '#00000066' },
            ]}
            onPress={handleFavoritePress}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityLabel={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <AppText style={styles.heartIcon}>
              {isFavorited ? '❤️' : '🤍'}
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Game name */}
      <View style={styles.footer}>
        <AppText
          variant="caption"
          color={colors.textPrimary}
          numberOfLines={1}
          style={styles.name}
        >
          {game.name}
        </AppText>
        <AppText variant="caption" color={colors.textTertiary} numberOfLines={1}>
          {game.provider.name}
        </AppText>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: spacing[1.5],
    left: spacing[1.5],
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[1.5],
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  favoriteBtn: {
    position: 'absolute',
    top: spacing[1.5],
    right: spacing[1.5],
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 13,
    lineHeight: 16,
  },
  footer: {
    flex: 1,
    paddingHorizontal: spacing[2],
    paddingTop: spacing[1.5],
    gap: 2,
  },
  name: {
    fontWeight: '600',
  },
});

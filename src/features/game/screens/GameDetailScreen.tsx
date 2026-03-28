import React, { memo, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { spacing, borderRadius } from '../../../core/theme';
import { AppText } from '../../../components/ui/AppText';
import { useGameDetailQuery } from '../hooks/useGameDetailQuery';
import { useAuthStore } from '../../../store/authStore';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { useToggleFavorite } from '../../favorites/hooks/useToggleFavorite';
import { apiClient } from '../../../core/api';
import type { PublicStackParamList } from '../../../navigation/types';

const RECENT_WINS = [
  { name: 'Car***os', amount: 'R$ 4.250,00' },
  { name: 'Mar***ia', amount: 'R$ 2.780,00' },
  { name: 'Jo***o', amount: 'R$ 1.920,00' },
];

function getCharacteristics(gameName: string): string[] {
  const name = gameName.toLowerCase();
  const chips: string[] = ['Wild x3', 'Scatter'];
  if (name.includes('dragon') || name.includes('fury') || name.includes('fire')) {
    chips.push('Free Spins', 'Jackpot', 'Bonus Buy');
  } else if (name.includes('roulette') || name.includes('roleta')) {
    chips.push('Multi-Bet', 'Statistics');
  } else if (name.includes('blackjack')) {
    chips.push('Double Down', 'Split');
  } else {
    chips.push('Free Spins', 'Jackpot');
  }
  return chips;
}

export const GameDetailScreen = memo(function GameDetailScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList>>();
  const route = useRoute<RouteProp<PublicStackParamList, 'GameDetail'>>();
  const { slug, gameId } = route.params;

  const { data: game, isLoading } = useGameDetailQuery(slug);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isFavorited = useFavoritesStore(s => s.isFavorited(gameId));
  const { toggle } = useToggleFavorite();

  useEffect(() => {
    if (!isAuthenticated || !gameId) return;
    apiClient.post('/me/recent-games', { gameId }).catch(() => null);
  }, [isAuthenticated, gameId]);

  const handleFavoriteToggle = useCallback(() => {
    toggle(gameId, isFavorited);
  }, [toggle, gameId, isFavorited]);

  const handlePlayDemo = useCallback(() => {
    navigation.navigate('GameSimulation', { slug, gameId, mode: 'demo' });
  }, [navigation, slug, gameId]);

  const handlePlayReal = useCallback(() => {
    navigation.navigate('GameSimulation', { slug, gameId, mode: 'real' });
  }, [navigation, slug, gameId]);

  if (isLoading || !game) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.secondary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const characteristics = getCharacteristics(game.name);
  const rtpDisplay = game.rtp ? `${game.rtp.toFixed(1)}%` : 'N/A';
  const volatilityDisplay = game.volatility ?? 'Média';
  const minBetDisplay = game.minBet != null
    ? game.minBet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 0,20';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <AppText variant="h3" color={colors.textPrimary}>{'←'}</AppText>
        </TouchableOpacity>
        <AppText variant="h3" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
          {game.name}
        </AppText>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <AppText variant="bodyMd" color={colors.textSecondary}>{'⎘'}</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFavoriteToggle} style={styles.headerBtn}>
            <AppText variant="bodyMd" color={isFavorited ? '#e74c3c' : colors.textSecondary}>
              {isFavorited ? '♥' : '♡'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Game image */}
        <View style={styles.imageContainer}>
          {game.imageUrl ? (
            <Image source={{ uri: game.imageUrl }} style={styles.gameImage} resizeMode="cover" />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]} />
          )}
        </View>

        <View style={styles.content}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <View style={styles.titleInfo}>
              <AppText variant="h2" color={colors.textPrimary}>{game.name}</AppText>
              <AppText variant="bodySm" color={colors.textSecondary}>{game.provider.name}</AppText>
            </View>
            {(game.isPopular || game.isNew) && (
              <View style={[
                styles.badge,
                { backgroundColor: game.isPopular ? '#f39c12' : colors.secondary },
              ]}>
                <AppText variant="caption" color="#000" style={styles.badgeText}>
                  {game.isPopular ? 'POPULAR' : 'NOVO'}
                </AppText>
              </View>
            )}
          </View>

          {/* Stats row */}
          <View style={[styles.statsRow, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
            <View style={styles.statItem}>
              <AppText variant="caption" color={colors.textSecondary}>RTP</AppText>
              <AppText variant="bodySm" color={colors.secondary} style={styles.statValue}>{rtpDisplay}</AppText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <AppText variant="caption" color={colors.textSecondary}>Volatilidade</AppText>
              <AppText variant="bodySm" color={colors.textPrimary} style={styles.statValue}>{volatilityDisplay}</AppText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <AppText variant="caption" color={colors.textSecondary}>Aposta Mín.</AppText>
              <AppText variant="bodySm" color={colors.textPrimary} style={styles.statValue}>{minBetDisplay}</AppText>
            </View>
          </View>

          {/* Jackpot section */}
          {game.isPopular && (
            <View style={[styles.jackpotCard, { backgroundColor: colors.surface, borderColor: '#f39c12', borderRadius: borderRadius.lg }]}>
              <View style={styles.jackpotHeader}>
                <AppText variant="bodyMd" color="#f39c12">🏆</AppText>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.jackpotLabel}>Jackpot Atual</AppText>
              </View>
              <AppText variant="h2" color="#f39c12" style={styles.jackpotValue}>R$ 1.247.350</AppText>
              <AppText variant="caption" color={colors.textTertiary}>Atualizado há 2 min</AppText>
            </View>
          )}

          {/* Sobre o Jogo */}
          <View style={styles.section}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Sobre o Jogo</AppText>
            <AppText variant="bodyMd" color={colors.textSecondary} style={styles.description}>
              {game.description ?? `${game.name} é um dos jogos mais emocionantes da ${game.provider.name}. Com gráficos impressionantes e mecânicas inovadoras, proporciona uma experiência única a cada rodada. Explore recursos especiais e conquiste grandes prêmios.`}
            </AppText>
          </View>

          {/* Vitórias Recentes */}
          <View style={styles.section}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Vitórias Recentes</AppText>
            {RECENT_WINS.map((win, index) => (
              <View
                key={index}
                style={[styles.winRow, { backgroundColor: colors.surface, borderRadius: borderRadius.md }]}
              >
                <AppText variant="bodyMd" color={colors.textSecondary}>{win.name}</AppText>
                <AppText variant="bodyMd" color={colors.secondary} style={styles.winAmount}>{win.amount}</AppText>
              </View>
            ))}
          </View>

          {/* Características */}
          <View style={styles.section}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Características</AppText>
            <View style={styles.chipsRow}>
              {characteristics.map((chip, i) => (
                <View
                  key={i}
                  style={[styles.chip, { backgroundColor: colors.surfaceOverlay, borderColor: colors.border, borderRadius: borderRadius.full }]}
                >
                  <AppText variant="caption" color={colors.textSecondary}>{chip}</AppText>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom buttons */}
      <View style={[styles.bottomButtons, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={handlePlayDemo}
          style={[styles.demoButton, { borderColor: colors.secondary, borderRadius: borderRadius.lg }]}
          activeOpacity={0.8}
        >
          <AppText variant="bodyMd" color={colors.secondary} style={styles.buttonText}>Jogar Demo</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePlayReal}
          style={[styles.realButton, { backgroundColor: colors.secondary, borderRadius: borderRadius.lg }]}
          activeOpacity={0.8}
        >
          <AppText variant="bodyMd" color="#000" style={styles.buttonText}>Jogar Agora</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  headerBtn: {
    padding: spacing[2],
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
  },
  scroll: { flex: 1 },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing[4],
    gap: spacing[4],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleInfo: {
    flex: 1,
    gap: 4,
  },
  badge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    marginLeft: spacing[3],
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing[4],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  jackpotCard: {
    padding: spacing[4],
    borderWidth: 1,
    gap: spacing[2],
  },
  jackpotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  jackpotLabel: {
    fontWeight: '600',
  },
  jackpotValue: {
    fontWeight: '700',
  },
  section: {
    gap: spacing[3],
  },
  sectionTitle: {
    fontWeight: '700',
  },
  description: {
    lineHeight: 22,
  },
  winRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  winAmount: {
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderWidth: 1,
  },
  bottomPadding: {
    height: spacing[4],
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: spacing[4],
    gap: spacing[3],
    borderTopWidth: 1,
  },
  demoButton: {
    flex: 1,
    borderWidth: 1.5,
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  realButton: {
    flex: 1,
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '700',
  },
});

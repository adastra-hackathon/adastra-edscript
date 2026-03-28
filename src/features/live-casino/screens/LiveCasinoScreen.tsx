import React, { memo, useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { spacing, borderRadius } from '../../../core/theme';
import { AppText } from '../../../components/ui/AppText';
import { BottomTabBar } from '../../../components/navigation/BottomTabBar';
import { BOTTOM_TABS } from '../../../navigation/bottomTabsConfig';
import { useGamesQuery } from '../../games/hooks/useGamesQuery';
import { useFavoritesSync } from '../../favorites/hooks/useFavoritesSync';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { useToggleFavorite } from '../../favorites/hooks/useToggleFavorite';
import { useAuthStore } from '../../../store/authStore';
import type { PublicStackParamList } from '../../../navigation/types';
import type { Game } from '../../games/types/games.types';

type LiveCategory = 'Todos' | 'Blackjack' | 'Roleta' | 'Baccarat' | 'Poker';

const LIVE_CATEGORIES: LiveCategory[] = ['Todos', 'Blackjack', 'Roleta', 'Baccarat', 'Poker'];

const CATEGORY_FILTER_MAP: Record<LiveCategory, string | undefined> = {
  Todos: undefined,
  Blackjack: 'blackjack',
  Roleta: 'roulette',
  Baccarat: 'baccarat',
  Poker: 'poker',
};

interface LiveGameCardProps {
  game: Game;
  onPress: (game: Game) => void;
}

const LiveGameCard = memo(function LiveGameCard({ game, onPress }: LiveGameCardProps) {
  const { colors } = useAppTheme();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isFavorited = useFavoritesStore(s => s.isFavorited(game.id));
  const { toggle } = useToggleFavorite();

  const minBet = game.minBet != null
    ? game.minBet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 1,00';
  const maxBet = game.maxBet != null
    ? game.maxBet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 5.000,00';

  return (
    <TouchableOpacity
      style={[styles.liveCard, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}
      onPress={() => onPress(game)}
      activeOpacity={0.85}
    >
      <View style={styles.liveCardImage}>
        {game.imageUrl ? (
          <Image source={{ uri: game.imageUrl }} style={styles.liveCardImg} resizeMode="cover" />
        ) : (
          <View style={[styles.liveCardImgPlaceholder, { backgroundColor: colors.background }]} />
        )}
        <View style={[styles.liveBadge, { backgroundColor: '#e74c3c', borderRadius: borderRadius.sm }]}>
          <AppText variant="caption" color="#fff" style={styles.liveBadgeText}>AO VIVO</AppText>
        </View>
        {isAuthenticated && (
          <TouchableOpacity
            style={[styles.favoriteBtn, { backgroundColor: isFavorited ? '#e8333388' : '#00000066' }]}
            onPress={() => toggle(game.id, isFavorited)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityLabel={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <AppText style={styles.heartIcon}>{isFavorited ? '❤️' : '🤍'}</AppText>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.liveCardBody}>
        <AppText variant="bodyMd" color={colors.textPrimary} style={styles.liveCardName} numberOfLines={1}>
          {game.name}
        </AppText>
        {game.dealerName && (
          <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
            {game.dealerName}
          </AppText>
        )}
        <View style={styles.liveCardMeta}>
          {game.playersCount != null && (
            <View style={styles.playersRow}>
              <View style={[styles.greenDot, { backgroundColor: colors.secondary }]} />
              <AppText variant="caption" color={colors.textSecondary}>{game.playersCount}</AppText>
            </View>
          )}
          <AppText variant="caption" color={colors.textTertiary}>
            {minBet} – {maxBet}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export const LiveCasinoScreen = memo(function LiveCasinoScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList>>();
  const [activeCategory, setActiveCategory] = useState<LiveCategory>('Todos');

  useFavoritesSync();

  const categorySlug = CATEGORY_FILTER_MAP[activeCategory];
  const { data } = useGamesQuery({
    type: 'LIVE_CASINO',
    categories: categorySlug ? [categorySlug] : undefined,
    limit: 20,
  });

  const games = data?.games ?? [];
  const featuredGame = games.find(g => g.isPopular) ?? games[0];

  const handleGamePress = useCallback((game: Game) => {
    navigation.navigate('LiveTableDetail', { slug: game.slug, gameId: game.id });
  }, [navigation]);

  const renderGame = useCallback(({ item }: { item: Game }) => (
    <LiveGameCard game={item} onPress={handleGamePress} />
  ), [handleGamePress]);

  const featuredMinBet = featuredGame?.minBet != null
    ? featuredGame.minBet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 1,00';
  const featuredMaxBet = featuredGame?.maxBet != null
    ? featuredGame.maxBet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 5.000,00';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <AppText variant="h2" color={colors.textPrimary} style={styles.headerTitle}>Ao Vivo</AppText>
        <TouchableOpacity style={styles.headerBtn}>
          <AppText variant="bodyMd" color={colors.textSecondary}>🔍</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Featured live game */}
        {featuredGame && (
          <View style={[styles.featuredCard, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}>
            {featuredGame.imageUrl && (
              <Image source={{ uri: featuredGame.imageUrl }} style={styles.featuredImage} resizeMode="cover" />
            )}
            <View style={[styles.featuredOverlay, { borderRadius: borderRadius.lg }]}>
              <View style={styles.featuredTop}>
                <View style={[styles.liveBadge, { backgroundColor: '#e74c3c', borderRadius: borderRadius.sm }]}>
                  <AppText variant="caption" color="#fff" style={styles.liveBadgeText}>AO VIVO</AppText>
                </View>
                {featuredGame.playersCount != null && (
                  <View style={styles.playersRow}>
                    <View style={[styles.greenDot, { backgroundColor: colors.secondary }]} />
                    <AppText variant="caption" color="#fff">{featuredGame.playersCount} jogadores</AppText>
                  </View>
                )}
              </View>
              <View style={styles.featuredBottom}>
                <AppText variant="h2" color="#fff" style={styles.featuredName}>{featuredGame.name}</AppText>
                {featuredGame.dealerName && (
                  <AppText variant="caption" color="rgba(255,255,255,0.8)">{featuredGame.dealerName}</AppText>
                )}
                <AppText variant="caption" color="rgba(255,255,255,0.6)" style={styles.featuredBetRange}>
                  {featuredMinBet} – {featuredMaxBet}
                </AppText>
                <TouchableOpacity
                  onPress={() => handleGamePress(featuredGame)}
                  style={[styles.featuredBtn, { backgroundColor: colors.secondary, borderRadius: borderRadius.lg }]}
                >
                  <AppText variant="bodyMd" color="#000" style={styles.featuredBtnText}>Apostar agora →</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {LIVE_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.tab,
                {
                  backgroundColor: activeCategory === cat ? colors.secondary : colors.surface,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <AppText
                variant="bodySm"
                color={activeCategory === cat ? '#000' : colors.textSecondary}
                style={styles.tabText}
              >
                {cat}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {['Mesa', 'Limite', 'Ao Vivo', 'Idioma'].map(filter => (
            <View
              key={filter}
              style={[styles.filterChip, { backgroundColor: colors.surfaceOverlay, borderColor: colors.border, borderRadius: borderRadius.full }]}
            >
              <AppText variant="caption" color={colors.textSecondary}>{filter}</AppText>
            </View>
          ))}
        </ScrollView>

        {/* Games list */}
        <View style={styles.gamesSection}>
          <View style={styles.sectionHeader}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>
              {activeCategory === 'Todos' ? 'Todos os Jogos' : activeCategory}
            </AppText>
            <TouchableOpacity>
              <AppText variant="bodySm" color={colors.secondary}>Ver todos</AppText>
            </TouchableOpacity>
          </View>
          <FlatList
            data={games}
            renderItem={renderGame}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            ListEmptyComponent={
              <AppText variant="bodySm" color={colors.textTertiary} style={styles.emptyText}>
                Nenhum jogo encontrado
              </AppText>
            }
          />
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      <BottomTabBar tabs={BOTTOM_TABS} />
    </SafeAreaView>
  );
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
  headerTitle: { fontWeight: '700' },
  headerBtn: { padding: spacing[2] },
  scroll: { flex: 1 },
  featuredCard: {
    margin: spacing[4],
    height: 240,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: spacing[4],
    justifyContent: 'space-between',
  },
  featuredTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  featuredBottom: { gap: spacing[2] },
  featuredName: { fontWeight: '700' },
  featuredBetRange: {},
  featuredBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    marginTop: spacing[2],
  },
  featuredBtnText: { fontWeight: '700' },
  liveBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  liveBadgeText: { fontWeight: '700', fontSize: 9, letterSpacing: 0.5 },
  playersRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  greenDot: { width: 6, height: 6, borderRadius: 3 },
  tabsScroll: { flexGrow: 0 },
  tabsContent: { paddingHorizontal: spacing[4], gap: spacing[2] },
  tab: { paddingHorizontal: spacing[4], paddingVertical: spacing[2] },
  tabText: { fontWeight: '600' },
  filterScroll: { flexGrow: 0, marginTop: spacing[3] },
  filterContent: { paddingHorizontal: spacing[4], gap: spacing[2] },
  filterChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderWidth: 1,
  },
  gamesSection: { padding: spacing[4] },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: { fontWeight: '700' },
  columnWrapper: { gap: spacing[3], marginBottom: spacing[3] },
  liveCard: {
    flex: 1,
    overflow: 'hidden',
  },
  liveCardImage: { height: 110, position: 'relative', overflow: 'hidden' },
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
  heartIcon: { fontSize: 13, lineHeight: 16 },
  liveCardImg: { width: '100%', height: '100%' },
  liveCardImgPlaceholder: { width: '100%', height: '100%' },
  liveCardBody: { padding: spacing[3], gap: 4 },
  liveCardName: { fontWeight: '600' },
  liveCardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: spacing[4] },
  bottomPad: { height: spacing[4] },
});

import React, { memo, useCallback, useEffect, useState } from 'react';
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
import { useAuthStore } from '../../../store/authStore';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { useFavoritesQuery } from '../hooks/useFavoritesQuery';
import { useRecentGamesQuery } from '../hooks/useRecentGamesQuery';
import type { FavoriteGame, RecentGame } from '../types/favorites.types';
import type { PublicStackParamList } from '../../../navigation/types';

type FavTab = 'Cassino' | 'Ao Vivo';

const FAV_TABS: FavTab[] = ['Cassino', 'Ao Vivo'];

interface FavGameCardProps {
  item: FavoriteGame;
  onPress: (item: FavoriteGame) => void;
}

const FavGameCard = memo(function FavGameCard({ item, onPress }: FavGameCardProps) {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      style={[styles.favCard, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      <View style={styles.favCardImage}>
        {item.game.imageUrl ? (
          <Image source={{ uri: item.game.imageUrl }} style={styles.favCardImg} resizeMode="cover" />
        ) : (
          <View style={[styles.favCardImgPlaceholder, { backgroundColor: colors.background }]} />
        )}
      </View>
      <View style={styles.favCardBody}>
        <AppText variant="caption" color={colors.textTertiary} numberOfLines={1}>
          {item.game.provider.name}
        </AppText>
        <AppText variant="bodySm" color={colors.textPrimary} numberOfLines={1} style={styles.favCardName}>
          {item.game.name}
        </AppText>
        <AppText variant="caption" color={colors.secondary}>RTP 96%</AppText>
      </View>
    </TouchableOpacity>
  );
});

interface ProviderGroup {
  name: string;
  slug: string;
  count: number;
}

function groupByProvider(favorites: FavoriteGame[]): ProviderGroup[] {
  const map = new Map<string, ProviderGroup>();
  for (const fav of favorites) {
    const { slug, name } = fav.game.provider;
    const existing = map.get(slug);
    if (existing) {
      existing.count++;
    } else {
      map.set(slug, { name, slug, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export const FavoritesScreen = memo(function FavoritesScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList>>();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { setFavoriteIds } = useFavoritesStore();

  const [activeTab, setActiveTab] = useState<FavTab>('Cassino');

  const { data: favorites, isLoading: favLoading } = useFavoritesQuery();
  const { data: recentGames } = useRecentGamesQuery();

  // Sync favorite IDs to store for optimistic UI
  useEffect(() => {
    if (favorites) {
      setFavoriteIds(favorites.map(f => f.gameId));
    }
  }, [favorites, setFavoriteIds]);

  const filteredFavorites = (favorites ?? []).filter(f =>
    activeTab === 'Cassino' ? f.game.type === 'CASINO' : f.game.type === 'LIVE_CASINO'
  );

  const providerGroups = groupByProvider(filteredFavorites);

  const handleGamePress = useCallback((item: FavoriteGame) => {
    navigation.navigate('GameDetail', { slug: item.game.slug, gameId: item.game.id });
  }, [navigation]);

  const handleLoginPress = useCallback(() => {
    navigation.navigate('Auth' as any, { screen: 'Login' } as any);
  }, [navigation]);

  const renderFavGame = useCallback(({ item }: { item: FavoriteGame }) => (
    <FavGameCard item={item} onPress={handleGamePress} />
  ), [handleGamePress]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <AppText variant="h2" color={colors.textPrimary} style={styles.headerTitle}>Favoritos</AppText>
        </View>
        <View style={styles.unauthContainer}>
          <AppText variant="h3" color={colors.textPrimary} style={styles.unauthTitle}>
            Seus favoritos aguardam
          </AppText>
          <AppText variant="bodyMd" color={colors.textSecondary} style={styles.unauthSubtitle}>
            Faça login para ver e gerenciar seus jogos favoritos
          </AppText>
          <TouchableOpacity
            onPress={handleLoginPress}
            style={[styles.loginBtn, { backgroundColor: colors.secondary, borderRadius: borderRadius.lg }]}
          >
            <AppText variant="bodyMd" color="#000" style={styles.loginBtnText}>Fazer Login</AppText>
          </TouchableOpacity>
        </View>
        <BottomTabBar tabs={BOTTOM_TABS} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <AppText variant="h2" color={colors.textPrimary} style={styles.headerTitle}>Favoritos</AppText>
        <View style={styles.headerRight}>
          {filteredFavorites.length > 0 && (
            <View style={[styles.countBadge, { backgroundColor: '#e74c3c', borderRadius: borderRadius.full }]}>
              <AppText variant="caption" color="#fff" style={styles.countBadgeText}>
                {filteredFavorites.length}
              </AppText>
            </View>
          )}
          <TouchableOpacity style={styles.headerBtn}>
            <AppText variant="bodyMd" color={colors.textSecondary}>🔍</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsRow, { borderBottomColor: colors.border }]}>
        {FAV_TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                isActive && [styles.tabActive, { backgroundColor: colors.secondary, borderRadius: borderRadius.full }],
              ]}
            >
              <AppText
                variant="bodySm"
                color={isActive ? '#000' : colors.textSecondary}
                style={styles.tabText}
              >
                {tab}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Recently Played */}
        {recentGames && recentGames.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>
                Jogados Recentemente
              </AppText>
              <TouchableOpacity>
                <AppText variant="caption" color={colors.textTertiary}>Limpar</AppText>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentChipsRow}
            >
              {(recentGames as RecentGame[]).map(rg => (
                <TouchableOpacity
                  key={rg.id}
                  onPress={() => navigation.navigate('GameDetail', { slug: rg.game.slug, gameId: rg.game.id })}
                  style={[
                    styles.recentChip,
                    {
                      backgroundColor: colors.surfaceOverlay,
                      borderColor: colors.border,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
                    {rg.game.name}
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Meus Favoritos */}
        <View style={styles.section}>
          <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>
            Meus Favoritos ♥
          </AppText>
          {favLoading ? (
            <AppText variant="bodySm" color={colors.textTertiary}>Carregando...</AppText>
          ) : filteredFavorites.length === 0 ? (
            <View style={styles.emptyState}>
              <AppText variant="bodyMd" color={colors.textTertiary} style={styles.emptyText}>
                Nenhum favorito ainda. Explore os jogos e adicione seus preferidos!
              </AppText>
            </View>
          ) : (
            <FlatList
              data={filteredFavorites}
              renderItem={renderFavGame}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Provedores Favoritos */}
        {providerGroups.length > 0 && (
          <View style={styles.section}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>
              Provedores Favoritos
            </AppText>
            <View style={styles.providersGrid}>
              {providerGroups.slice(0, 6).map(pg => (
                <View
                  key={pg.slug}
                  style={[styles.providerCard, { backgroundColor: colors.surface, borderRadius: borderRadius.lg }]}
                >
                  <View style={[styles.providerCircle, { backgroundColor: colors.background, borderRadius: borderRadius.full }]}>
                    <AppText variant="bodySm" color={colors.secondary} style={styles.providerInitial}>
                      {pg.name[0].toUpperCase()}
                    </AppText>
                  </View>
                  <AppText variant="caption" color={colors.textPrimary} numberOfLines={1} style={styles.providerName}>
                    {pg.name}
                  </AppText>
                  <AppText variant="caption" color={colors.textTertiary}>{pg.count} jogos</AppText>
                </View>
              ))}
            </View>
          </View>
        )}

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
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  countBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: { fontWeight: '700', fontSize: 11 },
  headerBtn: { padding: spacing[2] },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
    borderBottomWidth: 1,
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  tabActive: {},
  tabText: { fontWeight: '600' },
  scroll: { flex: 1 },
  section: {
    padding: spacing[4],
    gap: spacing[3],
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontWeight: '700' },
  recentChipsRow: { gap: spacing[2] },
  recentChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderWidth: 1,
    maxWidth: 140,
  },
  columnWrapper: { gap: spacing[3], marginBottom: spacing[3] },
  favCard: { flex: 1, overflow: 'hidden' },
  favCardImage: { height: 110 },
  favCardImg: { width: '100%', height: '100%' },
  favCardImgPlaceholder: { width: '100%', height: '100%' },
  favCardBody: { padding: spacing[3], gap: 4 },
  favCardName: { fontWeight: '600' },
  emptyState: { paddingVertical: spacing[6], alignItems: 'center' },
  emptyText: { textAlign: 'center' },
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  providerCard: {
    width: '30%',
    alignItems: 'center',
    padding: spacing[3],
    gap: spacing[2],
  },
  providerCircle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInitial: { fontWeight: '700', fontSize: 18 },
  providerName: { fontWeight: '600', textAlign: 'center' },
  unauthContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
    gap: spacing[4],
  },
  unauthTitle: { fontWeight: '700', textAlign: 'center' },
  unauthSubtitle: { textAlign: 'center', lineHeight: 22 },
  loginBtn: {
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    marginTop: spacing[2],
  },
  loginBtnText: { fontWeight: '700' },
  bottomPad: { height: spacing[4] },
});

import React, { memo, useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { BottomTabBar } from '../../../components/navigation/BottomTabBar';
import { BOTTOM_TABS } from '../../../navigation/bottomTabsConfig';
import { spacing, borderRadius } from '../../../core/theme';
import { useGamesQuery } from '../../games/hooks/useGamesQuery';
import { GameSection } from '../../games/components/GameSection';
import { GameFiltersSheet } from '../../games/components/GameFiltersSheet';
import { useGameFiltersStore } from '../../../store/gameFiltersStore';
import { gamesMapper } from '../../games/mappers/gamesMapper';
import { useFavoritesSync } from '../../favorites/hooks/useFavoritesSync';
import type { PublicStackParamList } from '../../../navigation/types';
import type { Game } from '../../games/types/games.types';

const CATEGORY_TABS = [
  { label: 'Todos', slug: '' },
  { label: 'Slots', slug: 'video-slots' },
  { label: 'Blackjack', slug: 'blackjack' },
  { label: 'Roleta', slug: 'roleta' },
  { label: 'Fortune', slug: 'fortune' },
  { label: 'Crash', slug: 'crash-games' },
];

const FILTER_CHIPS = ['Provedor', 'Popularidade', 'Novidades', 'RTP'];

export const CasinoScreen = memo(function CasinoScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<PublicStackParamList>>();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeFilterChip, setActiveFilterChip] = useState<string | null>('Novidades');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersStore = useGameFiltersStore();

  useFavoritesSync();
  const activeCategory = CATEGORY_TABS[activeCategoryIndex];
  const categoryFilter = activeCategory.slug ? [activeCategory.slug] : [];

  const popularQuery = useGamesQuery({ type: 'CASINO', categories: ['populares'], sort: 'default', limit: 6, page: 1 });
  const newQuery = useGamesQuery({ type: 'CASINO', categories: ['novo'], sort: 'new', limit: 6, page: 1 });
  const allQuery = useGamesQuery({
    type: 'CASINO',
    categories: categoryFilter.length > 0 ? categoryFilter : filtersStore.categories,
    ...gamesMapper.storeToQuery(filtersStore),
    limit: 20,
  });

  // Jackpot: first popular game
  const jackpotGame = popularQuery.data?.games[0];

  const handleGamePress = useCallback((game: Game) => {
    navigation.navigate('GameDetail', { slug: game.slug, gameId: game.id });
  }, [navigation]);

  const handleSeeAll = useCallback(() => {
    // Already on this screen, just scroll
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <AppText variant="h3" color={colors.textPrimary}>Cassino</AppText>
        <TouchableOpacity onPress={() => setFiltersOpen(true)} style={styles.searchBtn}>
          <AppText variant="bodyMd" color={colors.textSecondary}>🔍</AppText>
        </TouchableOpacity>
      </View>

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsContainer, { borderBottomColor: colors.border }]}
        contentContainerStyle={styles.tabsContent}
      >
        {CATEGORY_TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab.label}
            onPress={() => setActiveCategoryIndex(i)}
            style={[
              styles.tab,
              activeCategoryIndex === i && { borderBottomColor: colors.secondary, borderBottomWidth: 2 },
            ]}
          >
            <AppText
              variant="bodySm"
              color={activeCategoryIndex === i ? colors.secondary : colors.textSecondary}
            >
              {tab.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTER_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip}
            onPress={() => setActiveFilterChip(activeFilterChip === chip ? null : chip)}
            style={[
              styles.filterChip,
              { borderColor: activeFilterChip === chip ? colors.secondary : colors.border },
              activeFilterChip === chip && { backgroundColor: colors.secondary },
            ]}
          >
            <AppText
              variant="caption"
              color={activeFilterChip === chip ? '#000' : colors.textSecondary}
            >
              {chip}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Jackpot destaque */}
        {jackpotGame && (
          <TouchableOpacity
            style={[styles.jackpotCard, { backgroundColor: '#1a2e4a' }]}
            onPress={() => handleGamePress(jackpotGame)}
            activeOpacity={0.85}
          >
            <View style={styles.jackpotLeft}>
              <AppText variant="caption" color={colors.secondary} style={styles.jackpotLabel}>
                JACKPOT PROGRESSIVO
              </AppText>
              <AppText variant="h3" color={colors.textPrimary}>{jackpotGame.name}</AppText>
              <AppText variant="h2" color={colors.secondary}>R$ 1.247.350</AppText>
              <TouchableOpacity
                style={[styles.jackpotBtn, { backgroundColor: colors.secondary }]}
                onPress={() => handleGamePress(jackpotGame)}
              >
                <AppText variant="bodySm" color="#000">Jogar Agora →</AppText>
              </TouchableOpacity>
            </View>
            <AppText style={styles.jackpotIcon}>🏆</AppText>
          </TouchableOpacity>
        )}

        {/* Mais Jogados */}
        <GameSection
          title="Mais Jogados"
          games={popularQuery.data?.games ?? []}
          isLoading={popularQuery.isPending}
          onSeeAllPress={handleSeeAll}
          onGamePress={handleGamePress}
        />

        {/* Novidades */}
        <GameSection
          title="Novidades"
          games={newQuery.data?.games ?? []}
          isLoading={newQuery.isPending}
          onSeeAllPress={handleSeeAll}
          onGamePress={handleGamePress}
        />

        {/* Todos / por categoria */}
        {activeCategoryIndex > 0 && (
          <GameSection
            title={activeCategory.label}
            games={allQuery.data?.games ?? []}
            isLoading={allQuery.isPending}
            onGamePress={handleGamePress}
          />
        )}

        {allQuery.isPending && activeCategoryIndex === 0 && (
          <ActivityIndicator color={colors.secondary} style={styles.loader} />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <BottomTabBar tabs={BOTTOM_TABS} />

      <GameFiltersSheet
        visible={filtersOpen}
        initialFilters={{ sort: filtersStore.sort, providers: filtersStore.providers, categories: filtersStore.categories }}
        onApply={(f) => filtersStore.applyFilters(f)}
        onClose={() => setFiltersOpen(false)}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchBtn: { padding: spacing[2] },
  tabsContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[2],
  },
  tab: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  filtersRow: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  content: {
    gap: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  jackpotCard: {
    marginHorizontal: spacing[5],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jackpotLeft: { flex: 1, gap: spacing[2] },
  jackpotLabel: { letterSpacing: 0.5 },
  jackpotBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    marginTop: spacing[2],
  },
  jackpotIcon: { fontSize: 48 },
  loader: { marginVertical: spacing[6] },
  bottomPadding: { height: spacing[6] },
});

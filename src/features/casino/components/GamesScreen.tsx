import React, { memo, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import { useGamesQuery } from '../../games/hooks/useGamesQuery';
import { useGameFiltersStore } from '../../../store/gameFiltersStore';
import { useGameSearch } from '../../games/hooks/useGameSearch';
import { gamesMapper } from '../../games/mappers/gamesMapper';
import { GameCard } from '../../games/components/GameCard';
import { GameFiltersSheet } from '../../games/components/GameFiltersSheet';
import { SearchBar } from '../../home/components/SearchBar';
import { useFavoritesSync } from '../../favorites/hooks/useFavoritesSync';
import type { GameType, Game } from '../../games/types/games.types';

const NUM_COLUMNS = 3;
const COLUMN_GAP = spacing[2];

interface Props {
  type: GameType;
  title: string;
}

export const GamesScreen = memo(function GamesScreen({ type, title }: Props) {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);

  useFavoritesSync();
  const filtersStore = useGameFiltersStore();
  const activeFilterCount =
    filtersStore.providers.length +
    filtersStore.categories.length +
    (filtersStore.sort !== 'default' ? 1 : 0);

  const { value: searchValue, setValue: setSearchValue } = useGameSearch(
    useCallback((v: string) => filtersStore.setSearch(v), [filtersStore])
  );

  const query = useGamesQuery({
    type,
    ...gamesMapper.storeToQuery(filtersStore),
    limit: 60,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleGamePress = useCallback((_game: Game) => {
    // TODO: navigate to game
  }, []);

  const handleLoadMore = useCallback(() => {
    if (query.data && filtersStore.page < query.data.totalPages) {
      filtersStore.setPage(filtersStore.page + 1);
    }
  }, [query.data, filtersStore]);

  const renderItem = useCallback(
    ({ item }: { item: Game }) => (
      <View style={styles.cardWrapper}>
        <GameCard game={item} onPress={handleGamePress} />
      </View>
    ),
    [handleGamePress]
  );

  const keyExtractor = useCallback((item: Game) => item.id, []);

  const ListFooter = () =>
    query.isFetching && query.data ? (
      <ActivityIndicator color={colors.secondary} style={styles.loadMore} />
    ) : null;

  const ListEmpty = () =>
    !query.isPending ? (
      <View style={styles.empty}>
        <AppText variant="bodyMd" color={colors.textSecondary}>
          Nenhum jogo encontrado.
        </AppText>
        {activeFilterCount > 0 && (
          <TouchableOpacity
            onPress={() => filtersStore.reset()}
            style={[styles.clearBtn, { borderColor: colors.secondary }]}
          >
            <AppText variant="caption" color={colors.secondary}>
              Limpar filtros
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    ) : null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Voltar"
        >
          <AppText variant="bodyMd" color={colors.textSecondary}>‹</AppText>
        </TouchableOpacity>
        <AppText variant="h3" color={colors.textPrimary}>{title}</AppText>
        <View style={styles.backBtn} />
      </View>

      {/* Search + filter */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchValue}
          onChangeText={setSearchValue}
          onFilterPress={() => setFiltersOpen(true)}
          activeFilterCount={activeFilterCount}
        />
      </View>

      {/* Results count */}
      {query.data && (
        <AppText variant="caption" color={colors.textTertiary} style={styles.count}>
          {query.data.total.toLocaleString('pt-BR')} jogos
        </AppText>
      )}

      {/* Game grid */}
      {query.isPending && !query.data ? (
        <ActivityIndicator color={colors.secondary} style={styles.loader} />
      ) : (
        <FlatList
          data={query.data?.games ?? []}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={ListEmpty}
        />
      )}

      <GameFiltersSheet
        visible={filtersOpen}
        initialFilters={{
          sort: filtersStore.sort,
          providers: filtersStore.providers,
          categories: filtersStore.categories,
        }}
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
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  searchWrapper: {
    paddingVertical: spacing[3],
  },
  count: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[2],
  },
  loader: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing[5] - COLUMN_GAP / 2,
    paddingBottom: spacing[12],
    gap: spacing[3],
  },
  row: {
    gap: COLUMN_GAP,
  },
  cardWrapper: {
    flex: 1,
  },
  loadMore: {
    paddingVertical: spacing[6],
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing[12],
    gap: spacing[3],
  },
  clearBtn: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
});

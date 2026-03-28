import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { useAuth } from '../../../core/hooks/useAuth';
import { TopNav } from '../../../components/navigation/TopNav';
import { BottomTabBar } from '../../../components/navigation/BottomTabBar';
import { SideMenu } from '../../../components/navigation/SideMenu';
import { BOTTOM_TABS } from '../../../navigation/bottomTabsConfig';
import { spacing } from '../../../core/theme';
import { ResponsibleGamingGate } from '../../responsible-gaming';
import { ProfileModal } from '../../profile/components/ProfileModal';
import { useProfileMenu } from '../../profile/hooks/useProfileMenu';
import { useHomeQuery } from '../hooks/useHomeQuery';
import { useGamesQuery } from '../../games/hooks/useGamesQuery';
import { useGameFiltersStore } from '../../../store/gameFiltersStore';
import { useGameSearch } from '../../games/hooks/useGameSearch';
import { gamesMapper } from '../../games/mappers/gamesMapper';
import { BannerCarousel } from '../components/BannerCarousel';
import { HomeShortcuts } from '../components/HomeShortcuts';
import { SearchBar } from '../components/SearchBar';
import { GameSection } from '../../games/components/GameSection';
import { GameFiltersSheet } from '../../games/components/GameFiltersSheet';
import { useFavoritesSync } from '../../favorites/hooks/useFavoritesSync';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, PublicStackParamList } from '../../../navigation/types';
import type { Banner } from '../types/home.types';
import type { Game } from '../../games/types/games.types';
import {
  HomeIcon,
  BookmarkIcon,
  GiftIcon,
  HistoryIcon,
  HeadsetIcon,
  GearIcon,
} from '../../../components/icons';

const ICON_SIZE = 20;
const ICON_COLOR_ACTIVE = '#0D1829';
const ICON_COLOR_INACTIVE = '#8899B0';

function formatBalance(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const HomeScreen = memo(function HomeScreen() {
  const { colors } = useAppTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList & PublicStackParamList>>();
  const route = useRoute();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtersStore = useGameFiltersStore();
  const activeFilterCount =
    filtersStore.providers.length +
    filtersStore.categories.length +
    (filtersStore.sort !== 'default' ? 1 : 0);

  const { value: searchValue, setValue: setSearchValue } = useGameSearch(
    useCallback((v: string) => filtersStore.setSearch(v), [filtersStore])
  );

  useFavoritesSync();
  const homeQuery = useHomeQuery();
  const casinoQuery = useGamesQuery({
    type: 'CASINO',
    ...gamesMapper.storeToQuery(filtersStore),
  });
  const liveQuery = useGamesQuery({
    type: 'LIVE_CASINO',
    ...gamesMapper.storeToQuery(filtersStore),
  });

  const nav = useCallback(
    (screen: string) => navigation.navigate('App', { screen } as any),
    [navigation]
  );

  const { viewModel: profileViewModel } = useProfileMenu({
    onAccountPress: () => nav('Account'),
    onBetsPress: () => nav('Bets'),
    onTournamentsPress: () => nav('Tournaments'),
    onMissionsPress: () => nav('Missions'),
    onShopPress: () => {},
    onBonusPress: () => {},
    onTransactionsPress: () => nav('Transactions'),
  });

  const handleBannerPress = useCallback(
    (banner: Banner) => {
      if (banner.redirectType === 'screen' && banner.redirectValue) {
        nav(banner.redirectValue);
      }
    },
    [nav]
  );

  const handleShortcutPress = useCallback(
    (shortcut: { redirectType: string | null; redirectValue: string | null }) => {
      if (shortcut.redirectType === 'screen' && shortcut.redirectValue) {
        nav(shortcut.redirectValue);
      }
    },
    [nav]
  );

  const handleGamePress = useCallback((game: Game) => {
    navigation.navigate('GameDetail', { slug: game.slug, gameId: game.id });
  }, [navigation]);

  const handleLoginPress = useCallback(() => {
    navigation.navigate('Auth', { screen: 'Login' });
  }, [navigation]);

  const handleRegisterPress = useCallback(() => {
    navigation.navigate('Auth', { screen: 'Register' });
  }, [navigation]);

  const topNavUser = user
    ? { name: user.name, avatar: user.avatarUrl, balance: formatBalance(user.balance) }
    : undefined;

  const menuUser = user
    ? { name: user.name, email: user.email, avatar: user.avatarUrl, balance: user.balance, level: 'Bronze' }
    : undefined;

  const menuItems = [
    {
      label: 'Início',
      icon: <HomeIcon size={ICON_SIZE} color={route.name === 'Home' ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE} />,
      onPress: () => setMenuOpen(false),
      active: route.name === 'Home',
    },
    {
      label: 'Tutoriais',
      icon: <BookmarkIcon size={ICON_SIZE} color={ICON_COLOR_INACTIVE} />,
      onPress: () => setMenuOpen(false),
    },
    {
      label: 'Promoções e Bônus',
      icon: <GiftIcon size={ICON_SIZE} color={ICON_COLOR_INACTIVE} />,
      onPress: () => setMenuOpen(false),
    },
    {
      label: 'Histórico de transações',
      icon: <HistoryIcon size={ICON_SIZE} color={ICON_COLOR_INACTIVE} />,
      onPress: () => {
        setMenuOpen(false);
        if (isAuthenticated) navigation.navigate('App', { screen: 'Transactions' });
      },
    },
    {
      label: 'Suporte',
      icon: <HeadsetIcon size={ICON_SIZE} color={ICON_COLOR_INACTIVE} />,
      onPress: () => setMenuOpen(false),
    },
    {
      label: 'Configurações',
      icon: <GearIcon size={ICON_SIZE} color={ICON_COLOR_INACTIVE} />,
      onPress: () => {
        setMenuOpen(false);
        if (isAuthenticated) navigation.navigate('App', { screen: 'Settings' });
      },
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <TopNav
        isAuthenticated={isAuthenticated}
        user={topNavUser}
        onMenuPress={() => setMenuOpen(true)}
        onLoginPress={handleLoginPress}
        onRegisterPress={handleRegisterPress}
        onProfilePress={isAuthenticated ? () => setProfileModalOpen(true) : undefined}
        onNotificationPress={isAuthenticated ? () => navigation.navigate('App', { screen: 'Notifications' } as any) : undefined}
        onSettingsPress={isAuthenticated ? () => navigation.navigate('App', { screen: 'Settings' } as any) : undefined}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Banners */}
        {homeQuery.data && homeQuery.data.banners.length > 0 && (
          <BannerCarousel
            banners={homeQuery.data.banners}
            onPress={handleBannerPress}
          />
        )}

        {/* Shortcuts */}
        {homeQuery.data && homeQuery.data.shortcuts.length > 0 && (
          <HomeShortcuts
            shortcuts={homeQuery.data.shortcuts}
            onPress={handleShortcutPress}
          />
        )}

        {/* Search + filters */}
        <SearchBar
          value={searchValue}
          onChangeText={setSearchValue}
          onFilterPress={() => setFiltersOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Cassino */}
        <GameSection
          title="Cassino"
          games={casinoQuery.data?.games ?? []}
          isLoading={casinoQuery.isPending && !casinoQuery.data}
          onSeeAllPress={() => nav('Casino')}
          onGamePress={handleGamePress}
        />

        {/* Cassino ao Vivo */}
        <GameSection
          title="Cassino ao Vivo"
          games={liveQuery.data?.games ?? []}
          isLoading={liveQuery.isPending && !liveQuery.data}
          onSeeAllPress={() => nav('LiveCasino')}
          onGamePress={handleGamePress}
        />
      </ScrollView>

      <BottomTabBar tabs={BOTTOM_TABS} />

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={menuUser}
        onDepositPress={() => {
          setMenuOpen(false);
          if (isAuthenticated) navigation.navigate('App', { screen: 'Deposit' });
        }}
        menuItems={menuItems}
        onLogoutPress={() => {
          setMenuOpen(false);
          logout();
        }}
      />

      <ResponsibleGamingGate />

      <ProfileModal
        visible={profileModalOpen}
        viewModel={profileViewModel}
        onClose={() => setProfileModalOpen(false)}
        onDepositPress={() => nav('Deposit')}
        onProfilePress={() => nav('Account')}
        onLogoutPress={() => {
          setProfileModalOpen(false);
          logout();
        }}
      />

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
  scroll: { flex: 1 },
  content: {
    paddingVertical: spacing[4],
    gap: spacing[5],
    paddingBottom: spacing[16],
  },
});

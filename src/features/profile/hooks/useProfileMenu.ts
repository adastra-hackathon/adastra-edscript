import React, { useCallback, useMemo } from 'react';
import {
  GearIcon,
  WalletIcon,
  HistoryIcon,
  GiftIcon,
  BookmarkIcon,
  FavsIcon,
} from '../../../components/icons';
import { useMyProfile } from './useMyProfile';
import { profileMapper } from '../mappers/profileMapper';
import type { ProfileMenuViewModel } from '../types/profile.types';

const ICON_SIZE = 20;

interface UseProfileMenuOptions {
  onAccountPress: () => void;
  onBetsPress: () => void;
  onTournamentsPress: () => void;
  onMissionsPress: () => void;
  onShopPress: () => void;
  onBonusPress: () => void;
  onTransactionsPress: () => void;
}

export function useProfileMenu({
  onAccountPress,
  onBetsPress,
  onTournamentsPress,
  onMissionsPress,
  onShopPress,
  onBonusPress,
  onTransactionsPress,
}: UseProfileMenuOptions): {
  viewModel: ProfileMenuViewModel | null;
  isLoading: boolean;
} {
  const { query } = useMyProfile();

  const buildActions = useCallback(
    () => [
      { id: 'account', label: 'Minha Conta', icon: React.createElement(GearIcon, { size: ICON_SIZE }), onPress: onAccountPress },
      { id: 'bets', label: 'Bilhetes', icon: React.createElement(BookmarkIcon, { size: ICON_SIZE }), onPress: onBetsPress },
      { id: 'tournaments', label: 'Torneios', icon: React.createElement(FavsIcon, { size: ICON_SIZE }), onPress: onTournamentsPress },
      { id: 'missions', label: 'Missões', icon: React.createElement(GiftIcon, { size: ICON_SIZE }), onPress: onMissionsPress },
      { id: 'shop', label: 'Loja', icon: React.createElement(WalletIcon, { size: ICON_SIZE }), onPress: onShopPress },
      { id: 'bonus', label: 'Meus bônus', icon: React.createElement(GiftIcon, { size: ICON_SIZE }), onPress: onBonusPress },
      { id: 'transactions', label: 'Histórico de transações', icon: React.createElement(HistoryIcon, { size: ICON_SIZE }), onPress: onTransactionsPress },
    ],
    [onAccountPress, onBetsPress, onTournamentsPress, onMissionsPress, onShopPress, onBonusPress, onTransactionsPress],
  );

  const viewModel = useMemo<ProfileMenuViewModel | null>(() => {
    if (!query.data) return null;
    return profileMapper.toMenuViewModel(query.data, buildActions());
  }, [query.data, buildActions]);

  return { viewModel, isLoading: query.isPending };
}

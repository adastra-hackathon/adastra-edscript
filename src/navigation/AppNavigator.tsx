import React, { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';

import { BetsScreen } from '../features/bets/screens/BetsScreen';
import { WalletScreen } from '../features/wallet/screens/WalletScreen';
import { ProfileScreen } from '../features/user/screens/ProfileScreen';
import { AccountScreen } from '../features/profile/screens/AccountScreen';
import { TransactionsScreen } from '../features/wallet/screens/TransactionsScreen';
import { MissionsScreen } from '../features/missions/screens/MissionsScreen';
import { TournamentsScreen } from '../features/tournaments/screens/TournamentsScreen';
import { SettingsScreen } from '../features/user/screens/SettingsScreen';
import { DepositScreen } from '../features/wallet/screens/DepositScreen';
import { WithdrawScreen } from '../features/wallet/screens/WithdrawScreen';
import { NotificationsScreen } from '../features/notifications/screens/NotificationsScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

/**
 * AppStack — todas as telas requerem autenticação.
 * A verificação de auth é feita no RootNavigator e em useProtectedRoute.
 */
export const AppNavigator = memo(function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Bets" component={BetsScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Deposit" component={DepositScreen} />
      <Stack.Screen name="Withdraw" component={WithdrawScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="Missions" component={MissionsScreen} />
      <Stack.Screen name="Tournaments" component={TournamentsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
});

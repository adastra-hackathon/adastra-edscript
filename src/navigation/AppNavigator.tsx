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
import { GameRoomModeScreen } from '../features/game-room/screens/GameRoomModeScreen';
import { GameRoomListScreen } from '../features/game-room/screens/GameRoomListScreen';
import { CreateGameRoomScreen } from '../features/game-room/screens/CreateGameRoomScreen';
import { GameRoomLobbyScreen } from '../features/game-room/screens/GameRoomLobbyScreen';
import { GameRoomGameScreen } from '../features/game-room/screens/GameRoomGameScreen';
import { GameRoomResultScreen } from '../features/game-room/screens/GameRoomResultScreen';
import { PredictionRoomListScreen } from '../features/prediction/screens/PredictionRoomListScreen';
import { CreatePredictionRoomScreen } from '../features/prediction/screens/CreatePredictionRoomScreen';
import { PredictionRoomLobbyScreen } from '../features/prediction/screens/PredictionRoomLobbyScreen';
import { PredictionRoomResultScreen } from '../features/prediction/screens/PredictionRoomResultScreen';

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
      {/* Salas Competitivas */}
      <Stack.Screen name="GameRoomMode" component={GameRoomModeScreen} />
      {/* Modo Duelo */}
      <Stack.Screen name="GameRoomList" component={GameRoomListScreen} />
      <Stack.Screen name="GameRoomCreate" component={CreateGameRoomScreen} />
      <Stack.Screen name="GameRoomLobby" component={GameRoomLobbyScreen} />
      <Stack.Screen name="GameRoomGame" component={GameRoomGameScreen} />
      <Stack.Screen name="GameRoomResult" component={GameRoomResultScreen} />
      {/* Modo Apostas */}
      <Stack.Screen name="PredictionRoomList" component={PredictionRoomListScreen} />
      <Stack.Screen name="PredictionRoomCreate" component={CreatePredictionRoomScreen} />
      <Stack.Screen name="PredictionRoomLobby" component={PredictionRoomLobbyScreen} />
      <Stack.Screen name="PredictionRoomResult" component={PredictionRoomResultScreen} />
    </Stack.Navigator>
  );
});

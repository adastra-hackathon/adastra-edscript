import React, { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PublicStackParamList } from './types';

import { HomeScreen } from '../features/home/screens/HomeScreen';
import { CasinoScreen } from '../features/casino/screens/CasinoScreen';
import { LiveCasinoScreen } from '../features/live-casino/screens/LiveCasinoScreen';
import { SportsScreen } from '../features/sports/screens/SportsScreen';
import { FavoritesScreen } from '../features/favorites/screens/FavoritesScreen';
import { GameDetailScreen } from '../features/game/screens/GameDetailScreen';
import { GameSimulationScreen } from '../features/game-simulation/screens/GameSimulationScreen';
import { LiveTableDetailScreen } from '../features/live-casino/screens/LiveTableDetailScreen';

const Stack = createNativeStackNavigator<PublicStackParamList>();

/**
 * Stack público — todas as telas acessíveis sem autenticação.
 *
 * Telas com BottomTabBar: cada uma renderiza <BottomTabBar tabs={BOTTOM_TABS} />
 * diretamente no seu layout.
 *
 * Telas sem BottomTabBar (detalhes, etc.): adicionar como Stack.Screen aqui
 * e não renderizar o componente.
 */
export const PublicNavigator = memo(function PublicNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Casino" component={CasinoScreen} />
      <Stack.Screen name="LiveCasino" component={LiveCasinoScreen} />
      <Stack.Screen name="Sports" component={SportsScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} />
      <Stack.Screen name="GameSimulation" component={GameSimulationScreen} />
      <Stack.Screen name="LiveTableDetail" component={LiveTableDetailScreen} />
    </Stack.Navigator>
  );
});

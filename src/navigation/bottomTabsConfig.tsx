import React from 'react';
import type { TabConfig } from '../components/navigation/BottomTabBar';
import { CasinoIcon, LiveIcon, HomeIcon, SportsIcon, FavsIcon } from '../components/icons';

/**
 * Configuração das tabs da bottom tab bar.
 * Importe em cada tela que deve exibir o BottomTabBar.
 *
 * Uso:
 *   import { BOTTOM_TABS } from '../../../navigation/bottomTabsConfig';
 *   <BottomTabBar tabs={BOTTOM_TABS} />
 */
export const BOTTOM_TABS: TabConfig[] = [
  {
    name: 'Casino',
    label: 'Cassino',
    icon: (color) => <CasinoIcon size={22} color={color} />,
  },
  {
    name: 'LiveCasino',
    label: 'Ao Vivo',
    icon: (color) => <LiveIcon size={22} color={color} />,
  },
  {
    name: 'Home',
    label: 'Início',
    icon: (color) => <HomeIcon size={22} color={color} />,
  },
  {
    name: 'Sports',
    label: 'Esportes',
    icon: (color) => <SportsIcon size={22} color={color} />,
  },
  {
    name: 'Favorites',
    label: 'Favs',
    icon: (color) => <FavsIcon size={22} color={color} />,
  },
];

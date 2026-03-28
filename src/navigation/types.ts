import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ─── Public Stack (telas acessíveis sem autenticação) ────────────────────────

/**
 * Todas as telas públicas em um stack plano.
 * Telas que exibem BottomTabBar importam o componente diretamente.
 * Telas de detalhe (sem tab bar) são adicionadas aqui e não renderizam o componente.
 */
export type PublicStackParamList = {
  // Telas com BottomTabBar
  Home: undefined;
  Casino: undefined;
  LiveCasino: undefined;
  Sports: undefined;
  Favorites: undefined;
  // Telas sem BottomTabBar
  GameDetail: { slug: string; gameId: string };
  GameSimulation: { slug: string; gameId: string; mode: 'demo' | 'real' };
  LiveTableDetail: { slug: string; gameId: string };
};

// ─── Auth Stack ──────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// ─── App Stack (rotas protegidas) ────────────────────────────────────────────

export type AppStackParamList = {
  Bets: undefined;
  BetDetail: { id: string };
  Wallet: undefined;
  Deposit: undefined;
  Withdraw: undefined;
  Profile: undefined;
  Account: undefined;
  Transactions: undefined;
  Missions: undefined;
  Tournaments: undefined;
  Settings: undefined;
  Notifications: undefined;
};

// ─── Root Stack ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Public: NavigatorScreenParams<PublicStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

// ─── Pending Route (para redirect pós-login) ─────────────────────────────────

export type PendingRoute = {
  stack: keyof RootStackParamList;
  screen: string;
  params?: Record<string, unknown>;
};

// ─── Screen Props Helpers ────────────────────────────────────────────────────

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

export type PublicStackScreenProps<T extends keyof PublicStackParamList> =
  NativeStackScreenProps<PublicStackParamList, T>;

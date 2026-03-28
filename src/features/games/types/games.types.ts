export type GameType = 'CASINO' | 'LIVE_CASINO';
export type SortOption = 'default' | 'a-z' | 'new';

export interface GameProvider {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  gameCount: number;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  type: GameType;
  isPopular: boolean;
  isNew: boolean;
  sortOrder: number;
  provider: { id: string; name: string; slug: string };
  categories: Array<{ id: string; name: string; slug: string }>;
  description?: string | null;
  rtp?: number | null;
  volatility?: string | null;
  minBet?: number | null;
  maxBet?: number | null;
  dealerName?: string | null;
  playersCount?: number | null;
}

export interface GameDetail extends Game {
  description: string | null;
  rtp: number | null;
  volatility: string | null;
  minBet: number | null;
  maxBet: number | null;
  dealerName: string | null;
  playersCount: number | null;
}

export interface PaginatedGames {
  games: Game[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GameFilters {
  type?: GameType;
  search?: string;
  providers: string[];
  categories: string[];
  sort: SortOption;
  page: number;
  limit: number;
}

export interface GameFiltersData {
  providers: GameProvider[];
  categories: GameCategory[];
}

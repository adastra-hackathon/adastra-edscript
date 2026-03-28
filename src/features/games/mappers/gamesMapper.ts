import type { Game, GameFilters } from '../types/games.types';
import type { GameFiltersState } from '../../../store/gameFiltersStore';

export const gamesMapper = {
  /**
   * Convert store state to API query params.
   * Does NOT include `type` — the caller passes type explicitly per section
   * so it doesn't get overridden by the spread.
   */
  storeToQuery(state: GameFiltersState): Omit<Partial<GameFilters>, 'type'> {
    return {
      search: state.search || undefined,
      providers: state.providers,
      categories: state.categories,
      sort: state.sort,
      page: state.page,
      limit: state.limit,
    };
  },

  /** Returns badge label for a game card, priority: Popular > Novo */
  getBadge(game: Game): 'POPULAR' | 'NOVO' | null {
    if (game.isPopular) return 'POPULAR';
    if (game.isNew) return 'NOVO';
    return null;
  },

  /** Returns readable game type label */
  typeLabel(type: 'CASINO' | 'LIVE_CASINO'): string {
    return type === 'CASINO' ? 'Cassino' : 'Cassino ao Vivo';
  },
};

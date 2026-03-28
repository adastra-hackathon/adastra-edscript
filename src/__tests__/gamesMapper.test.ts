import { gamesMapper } from '../features/games/mappers/gamesMapper';
import type { Game } from '../features/games/types/games.types';
import type { GameFiltersState } from '../store/gameFiltersStore';

const makeGame = (overrides: Partial<Game> = {}): Game => ({
  id: 'game-1',
  name: 'Fortune Ox',
  slug: 'fortune-ox',
  imageUrl: 'https://example.com/img.jpg',
  type: 'CASINO',
  isPopular: false,
  isNew: false,
  sortOrder: 1,
  provider: { id: 'p-1', name: 'PG Soft', slug: 'pg-soft' },
  categories: [],
  ...overrides,
});

const makeStore = (overrides: Partial<GameFiltersState> = {}): GameFiltersState => ({
  search: '',
  providers: [],
  categories: [],
  sort: 'default',
  page: 1,
  limit: 20,
  setSearch: jest.fn(),
  setPage: jest.fn(),
  applyFilters: jest.fn(),
  reset: jest.fn(),
  ...overrides,
} as unknown as GameFiltersState);

// ─── storeToQuery ─────────────────────────────────────────────────────────────

describe('gamesMapper.storeToQuery', () => {
  it('returns undefined search when store search is empty string', () => {
    const result = gamesMapper.storeToQuery(makeStore({ search: '' }));
    expect(result.search).toBeUndefined();
  });

  it('returns search string when store has a search value', () => {
    const result = gamesMapper.storeToQuery(makeStore({ search: 'fortune' }));
    expect(result.search).toBe('fortune');
  });

  it('passes through providers array', () => {
    const result = gamesMapper.storeToQuery(makeStore({ providers: ['pg-soft', 'pragmatic'] }));
    expect(result.providers).toEqual(['pg-soft', 'pragmatic']);
  });

  it('passes through categories array', () => {
    const result = gamesMapper.storeToQuery(makeStore({ categories: ['populares'] }));
    expect(result.categories).toEqual(['populares']);
  });

  it('passes through sort, page and limit', () => {
    const result = gamesMapper.storeToQuery(makeStore({ sort: 'a-z', page: 3, limit: 10 }));
    expect(result.sort).toBe('a-z');
    expect(result.page).toBe(3);
    expect(result.limit).toBe(10);
  });

  it('does NOT include type field (caller sets type explicitly)', () => {
    const result = gamesMapper.storeToQuery(makeStore());
    expect(result).not.toHaveProperty('type');
  });

  it('returns empty providers and categories as empty arrays', () => {
    const result = gamesMapper.storeToQuery(makeStore({ providers: [], categories: [] }));
    expect(result.providers).toEqual([]);
    expect(result.categories).toEqual([]);
  });
});

// ─── getBadge ─────────────────────────────────────────────────────────────────

describe('gamesMapper.getBadge', () => {
  it('returns "POPULAR" for popular games', () => {
    expect(gamesMapper.getBadge(makeGame({ isPopular: true }))).toBe('POPULAR');
  });

  it('returns "NOVO" for new games', () => {
    expect(gamesMapper.getBadge(makeGame({ isNew: true }))).toBe('NOVO');
  });

  it('returns null when game is neither popular nor new', () => {
    expect(gamesMapper.getBadge(makeGame())).toBeNull();
  });

  it('prioritises POPULAR over NOVO when both are true', () => {
    expect(gamesMapper.getBadge(makeGame({ isPopular: true, isNew: true }))).toBe('POPULAR');
  });
});

// ─── typeLabel ────────────────────────────────────────────────────────────────

describe('gamesMapper.typeLabel', () => {
  it('returns "Cassino" for CASINO type', () => {
    expect(gamesMapper.typeLabel('CASINO')).toBe('Cassino');
  });

  it('returns "Cassino ao Vivo" for LIVE_CASINO type', () => {
    expect(gamesMapper.typeLabel('LIVE_CASINO')).toBe('Cassino ao Vivo');
  });
});

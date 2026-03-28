import {
  calcPrizePool,
  calcWinnerPrize,
  calcPlatformFee,
  calcProfit,
  formatCurrency,
  canJoinRoom,
} from '../features/game-room/utils/gameRoomCalculations';
import type { GameRoom } from '../features/game-room/types/game-room.types';

const makeRoom = (overrides: Partial<GameRoom> = {}): GameRoom => ({
  id: 'room-1',
  hostId: 'user-host',
  gameId: 'game-1',
  entryAmount: 10,
  maxPlayers: 4,
  status: 'WAITING',
  startAt: null,
  duration: 300,
  prizePool: 0,
  platformFee: 0,
  winnerId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  players: [],
  ...overrides,
});

// ─── calcPrizePool ────────────────────────────────────────────────────────────

describe('calcPrizePool', () => {
  it('returns entryAmount * playerCount', () => {
    expect(calcPrizePool(10, 4)).toBe(40);
  });

  it('returns 0 for 0 players', () => {
    expect(calcPrizePool(50, 0)).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    expect(calcPrizePool(1.333, 3)).toBe(3.99);
  });
});

// ─── calcWinnerPrize ──────────────────────────────────────────────────────────

describe('calcWinnerPrize', () => {
  it('returns 99% of prizePool', () => {
    expect(calcWinnerPrize(100)).toBe(99);
  });

  it('returns 0 for 0 prizePool', () => {
    expect(calcWinnerPrize(0)).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    expect(calcWinnerPrize(10)).toBe(9.9);
  });
});

// ─── calcPlatformFee ──────────────────────────────────────────────────────────

describe('calcPlatformFee', () => {
  it('returns 1% of prizePool', () => {
    expect(calcPlatformFee(100)).toBe(1);
  });

  it('winner prize + platform fee equals prizePool', () => {
    const pool = 200;
    expect(calcWinnerPrize(pool) + calcPlatformFee(pool)).toBeCloseTo(pool, 5);
  });
});

// ─── calcProfit ───────────────────────────────────────────────────────────────

describe('calcProfit', () => {
  it('returns positive for gain', () => {
    expect(calcProfit(150, 100)).toBe(50);
  });

  it('returns negative for loss', () => {
    expect(calcProfit(80, 100)).toBe(-20);
  });

  it('returns 0 when equal', () => {
    expect(calcProfit(100, 100)).toBe(0);
  });
});

// ─── formatCurrency ───────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats value as BRL', () => {
    const result = formatCurrency(100);
    expect(result).toContain('100');
    expect(result).toMatch(/R\$|BRL/);
  });

  it('formats zero correctly', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });
});

// ─── canJoinRoom ──────────────────────────────────────────────────────────────

describe('canJoinRoom', () => {
  it('returns canJoin: true when all conditions met', () => {
    const room = makeRoom({ status: 'WAITING', maxPlayers: 4, players: [] });
    expect(canJoinRoom(room, 'user-1', 50)).toEqual({ canJoin: true });
  });

  it('returns canJoin: false when room is not WAITING', () => {
    const room = makeRoom({ status: 'IN_PROGRESS' });
    const result = canJoinRoom(room, 'user-1', 100);
    expect(result.canJoin).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it('returns canJoin: false when room is full', () => {
    const room = makeRoom({
      maxPlayers: 2,
      players: [
        { id: 'p1', roomId: 'room-1', userId: 'user-a', initialBalance: 10, finalBalance: null, profit: null, position: null, joinedAt: '' },
        { id: 'p2', roomId: 'room-1', userId: 'user-b', initialBalance: 10, finalBalance: null, profit: null, position: null, joinedAt: '' },
      ],
    });
    const result = canJoinRoom(room, 'user-new', 100);
    expect(result.canJoin).toBe(false);
    expect(result.reason).toContain('cheia');
  });

  it('returns canJoin: false when user already joined', () => {
    const room = makeRoom({
      players: [
        { id: 'p1', roomId: 'room-1', userId: 'user-1', initialBalance: 10, finalBalance: null, profit: null, position: null, joinedAt: '' },
      ],
    });
    const result = canJoinRoom(room, 'user-1', 100);
    expect(result.canJoin).toBe(false);
    expect(result.reason).toContain('já entrou');
  });

  it('returns canJoin: false when balance insufficient', () => {
    const room = makeRoom({ entryAmount: 50, players: [] });
    const result = canJoinRoom(room, 'user-1', 20);
    expect(result.canJoin).toBe(false);
    expect(result.reason).toContain('Saldo');
  });
});

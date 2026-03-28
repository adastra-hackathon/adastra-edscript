import { act } from 'react';
import { useGameRoomStore } from '../features/game-room/store/gameRoomStore';
import type { GameRoom } from '../features/game-room/types/game-room.types';

const makeRoom = (overrides: Partial<GameRoom> = {}): GameRoom => ({
  id: 'room-1',
  hostId: 'host-1',
  gameId: 'game-1',
  entryAmount: 10,
  maxPlayers: 4,
  status: 'WAITING',
  startAt: null,
  duration: 300,
  prizePool: 40,
  platformFee: 0.4,
  winnerId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  players: [],
  ...overrides,
});

beforeEach(() => {
  const store = useGameRoomStore.getState();
  act(() => {
    store.setRooms([]);
    store.setSelectedRoom(null);
    store.setLoading(false);
    store.setError(null);
    store.resetSimulation();
  });
});

// ─── setRooms / setSelectedRoom ───────────────────────────────────────────────

describe('setRooms', () => {
  it('replaces the rooms list', () => {
    const rooms = [makeRoom({ id: 'r1' }), makeRoom({ id: 'r2' })];
    act(() => useGameRoomStore.getState().setRooms(rooms));
    expect(useGameRoomStore.getState().rooms).toHaveLength(2);
  });
});

describe('setSelectedRoom', () => {
  it('sets selectedRoom', () => {
    const room = makeRoom();
    act(() => useGameRoomStore.getState().setSelectedRoom(room));
    expect(useGameRoomStore.getState().selectedRoom?.id).toBe('room-1');
  });

  it('clears selectedRoom when null', () => {
    act(() => {
      useGameRoomStore.getState().setSelectedRoom(makeRoom());
      useGameRoomStore.getState().setSelectedRoom(null);
    });
    expect(useGameRoomStore.getState().selectedRoom).toBeNull();
  });
});

// ─── updateRoom ───────────────────────────────────────────────────────────────

describe('updateRoom', () => {
  it('updates a room in the list', () => {
    const room = makeRoom({ id: 'r1', status: 'WAITING' });
    act(() => useGameRoomStore.getState().setRooms([room]));

    const updated = makeRoom({ id: 'r1', status: 'IN_PROGRESS' });
    act(() => useGameRoomStore.getState().updateRoom(updated));

    expect(useGameRoomStore.getState().rooms[0].status).toBe('IN_PROGRESS');
  });

  it('updates selectedRoom when ids match', () => {
    const room = makeRoom({ id: 'r1', status: 'WAITING' });
    act(() => {
      useGameRoomStore.getState().setRooms([room]);
      useGameRoomStore.getState().setSelectedRoom(room);
    });

    const updated = makeRoom({ id: 'r1', status: 'FINISHED' });
    act(() => useGameRoomStore.getState().updateRoom(updated));

    expect(useGameRoomStore.getState().selectedRoom?.status).toBe('FINISHED');
  });

  it('does not affect selectedRoom when ids differ', () => {
    const roomA = makeRoom({ id: 'rA' });
    const roomB = makeRoom({ id: 'rB', status: 'WAITING' });
    act(() => {
      useGameRoomStore.getState().setRooms([roomA, roomB]);
      useGameRoomStore.getState().setSelectedRoom(roomA);
    });

    const updatedB = makeRoom({ id: 'rB', status: 'FINISHED' });
    act(() => useGameRoomStore.getState().updateRoom(updatedB));

    expect(useGameRoomStore.getState().selectedRoom?.id).toBe('rA');
  });
});

// ─── Simulation ───────────────────────────────────────────────────────────────

describe('initSimulation', () => {
  it('sets simulationBalance and clears rounds', () => {
    act(() => {
      useGameRoomStore.getState().recordRound({ bet: 5, outcome: 'win', multiplier: 2, balanceAfter: 105 });
      useGameRoomStore.getState().initSimulation(200);
    });
    const state = useGameRoomStore.getState();
    expect(state.simulationBalance).toBe(200);
    expect(state.simulationRounds).toHaveLength(0);
  });
});

describe('recordRound', () => {
  it('appends the round and updates balance', () => {
    act(() => useGameRoomStore.getState().initSimulation(100));
    act(() => useGameRoomStore.getState().recordRound({ bet: 10, outcome: 'win', multiplier: 2, balanceAfter: 110 }));

    const state = useGameRoomStore.getState();
    expect(state.simulationRounds).toHaveLength(1);
    expect(state.simulationBalance).toBe(110);
  });

  it('accumulates multiple rounds', () => {
    act(() => {
      useGameRoomStore.getState().initSimulation(100);
      useGameRoomStore.getState().recordRound({ bet: 10, outcome: 'win', multiplier: 2, balanceAfter: 110 });
      useGameRoomStore.getState().recordRound({ bet: 10, outcome: 'loss', multiplier: 0, balanceAfter: 100 });
    });
    expect(useGameRoomStore.getState().simulationRounds).toHaveLength(2);
    expect(useGameRoomStore.getState().simulationBalance).toBe(100);
  });
});

describe('resetSimulation', () => {
  it('resets balance and rounds to initial state', () => {
    act(() => {
      useGameRoomStore.getState().initSimulation(500);
      useGameRoomStore.getState().recordRound({ bet: 50, outcome: 'loss', multiplier: 0, balanceAfter: 450 });
      useGameRoomStore.getState().resetSimulation();
    });
    const state = useGameRoomStore.getState();
    expect(state.simulationBalance).toBe(0);
    expect(state.simulationRounds).toHaveLength(0);
  });
});

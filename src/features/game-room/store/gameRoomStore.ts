import { create } from 'zustand';
import type { GameRoom } from '../types/game-room.types';

interface SimulationRound {
  bet: number;
  outcome: 'win' | 'loss';
  multiplier: number;
  balanceAfter: number;
}

interface GameRoomState {
  rooms: GameRoom[];
  selectedRoom: GameRoom | null;
  isLoading: boolean;
  error: string | null;

  simulationBalance: number;
  simulationRounds: SimulationRound[];

  setRooms: (rooms: GameRoom[]) => void;
  setSelectedRoom: (room: GameRoom | null) => void;
  updateRoom: (room: GameRoom) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  initSimulation: (initialBalance: number) => void;
  recordRound: (round: SimulationRound) => void;
  resetSimulation: () => void;
}

export const useGameRoomStore = create<GameRoomState>()((set) => ({
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,
  simulationBalance: 0,
  simulationRounds: [],

  setRooms: (rooms) => set({ rooms }),
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  updateRoom: (room) =>
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === room.id ? room : r)),
      selectedRoom: state.selectedRoom?.id === room.id ? room : state.selectedRoom,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  initSimulation: (initialBalance) => set({ simulationBalance: initialBalance, simulationRounds: [] }),
  recordRound: (round) =>
    set((state) => ({
      simulationBalance: round.balanceAfter,
      simulationRounds: [...state.simulationRounds, round],
    })),
  resetSimulation: () => set({ simulationBalance: 0, simulationRounds: [] }),
}));

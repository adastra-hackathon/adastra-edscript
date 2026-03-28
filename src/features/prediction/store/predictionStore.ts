import { create } from 'zustand';
import type { PredictionRoom } from '../types/prediction.types';

interface PredictionState {
  rooms: PredictionRoom[];
  selectedRoom: PredictionRoom | null;
  isLoading: boolean;
  error: string | null;

  // Local draft: eventId → optionId before confirming
  draftPredictions: Record<string, string>;

  setRooms: (rooms: PredictionRoom[]) => void;
  setSelectedRoom: (room: PredictionRoom | null) => void;
  updateRoom: (room: PredictionRoom) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDraftPrediction: (eventId: string, optionId: string) => void;
  clearDraft: () => void;
}

export const usePredictionStore = create<PredictionState>()((set) => ({
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,
  draftPredictions: {},

  setRooms: (rooms) => set({ rooms }),
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  updateRoom: (room) =>
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === room.id ? room : r)),
      selectedRoom: state.selectedRoom?.id === room.id ? room : state.selectedRoom,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setDraftPrediction: (eventId, optionId) =>
    set((state) => ({ draftPredictions: { ...state.draftPredictions, [eventId]: optionId } })),
  clearDraft: () => set({ draftPredictions: {} }),
}));

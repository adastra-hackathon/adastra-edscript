import { apiClient } from '../../../core/api';
import type { GameRoom, CreateGameRoomPayload, FinishGameRoomPayload } from '../types/game-room.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const gameRoomService = {
  list: (status?: string) =>
    apiClient.get<ApiResponse<GameRoom[]>>('/game-rooms', { params: status ? { status } : undefined }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<GameRoom>>(`/game-rooms/${id}`),

  create: (payload: CreateGameRoomPayload) =>
    apiClient.post<ApiResponse<GameRoom>>('/game-rooms', payload),

  join: (id: string) =>
    apiClient.post<ApiResponse<GameRoom>>(`/game-rooms/${id}/join`),

  start: (id: string) =>
    apiClient.post<ApiResponse<GameRoom>>(`/game-rooms/${id}/start`),

  finish: (id: string, payload: FinishGameRoomPayload) =>
    apiClient.post<ApiResponse<GameRoom>>(`/game-rooms/${id}/finish`, payload),

  addBots: (id: string, count: number) =>
    apiClient.post<ApiResponse<GameRoom>>(`/game-rooms/${id}/add-bots`, { count }),
};

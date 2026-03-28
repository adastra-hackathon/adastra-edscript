import { apiClient } from '../../../core/api';
import type { PredictionRoom, PredictionRoomPlayer, CreatePredictionRoomPayload, FinishPredictionRoomPayload } from '../types/prediction.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const predictionService = {
  list: (status?: string) =>
    apiClient.get<ApiResponse<PredictionRoom[]>>('/prediction-rooms', { params: status ? { status } : undefined }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<PredictionRoom>>(`/prediction-rooms/${id}`),

  create: (payload: CreatePredictionRoomPayload) =>
    apiClient.post<ApiResponse<PredictionRoom>>('/prediction-rooms', payload),

  join: (id: string) =>
    apiClient.post<ApiResponse<PredictionRoom>>(`/prediction-rooms/${id}/join`),

  start: (id: string) =>
    apiClient.post<ApiResponse<PredictionRoom>>(`/prediction-rooms/${id}/start`),

  submitPredictions: (id: string, predictions: Array<{ eventId: string; optionId: string }>) =>
    apiClient.post<ApiResponse<PredictionRoomPlayer>>(`/prediction-rooms/${id}/predict`, { predictions }),

  finish: (id: string, payload: FinishPredictionRoomPayload) =>
    apiClient.post<ApiResponse<PredictionRoom>>(`/prediction-rooms/${id}/finish`, payload),
};

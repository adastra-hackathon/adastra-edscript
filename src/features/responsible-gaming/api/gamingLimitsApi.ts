import { apiClient } from '../../../core/api';
import type { ResponsibleGamingState } from '../types/responsibleGaming.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const gamingLimitsApi = {
  getState: async (): Promise<ResponsibleGamingState> => {
    const { data } = await apiClient.get<ApiResponse<ResponsibleGamingState>>('/responsible-gaming');
    return data.data;
  },

  upsertBetLimit: async (payload: {
    dailyAmount: number | null;
    weeklyAmount: number | null;
    monthlyAmount: number | null;
    reason: string | null;
  }): Promise<void> => {
    await apiClient.patch('/responsible-gaming/limits/bet', payload);
  },

  upsertDepositLimit: async (payload: {
    dailyAmount: number | null;
    weeklyAmount: number | null;
    monthlyAmount: number | null;
    reason: string | null;
  }): Promise<void> => {
    await apiClient.patch('/responsible-gaming/limits/deposit', payload);
  },

  upsertSessionTimeLimit: async (payload: {
    dailyMinutes: number | null;
    weeklyMinutes: number | null;
    monthlyMinutes: number | null;
    reason: string | null;
  }): Promise<void> => {
    await apiClient.patch('/responsible-gaming/limits/session-time', payload);
  },

  resetLimit: async (type: 'BET_AMOUNT' | 'DEPOSIT_AMOUNT' | 'TIME_ON_SITE'): Promise<void> => {
    await apiClient.delete(`/responsible-gaming/limits/${type}`);
  },

  createTimedSelfExclusion: async (payload: {
    untilDate: string;
    reason: string | null;
  }): Promise<void> => {
    await apiClient.post('/responsible-gaming/self-exclusion/temporary', payload);
  },

  createSelfExclusion: async (payload: {
    duration: string | null;
    reason: string | null;
  }): Promise<void> => {
    await apiClient.post('/responsible-gaming/self-exclusion', payload);
  },
};

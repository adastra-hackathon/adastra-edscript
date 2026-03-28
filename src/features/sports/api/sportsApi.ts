import { apiClient } from '../../../core/api';

export const sportsApi = {
  getMatches: (params?: { sport?: string; isLive?: boolean }) =>
    apiClient.get('/sports/matches', { params }).then(r => r.data.data),
};

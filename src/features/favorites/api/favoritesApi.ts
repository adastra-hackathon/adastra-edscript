import { apiClient } from '../../../core/api';

export const favoritesApi = {
  list: () => apiClient.get('/me/favorites').then(r => r.data.data),
  add: (gameId: string) => apiClient.post('/me/favorites', { gameId }).then(r => r.data),
  remove: (gameId: string) => apiClient.delete(`/me/favorites/${gameId}`).then(r => r.data),
};

export const recentGamesApi = {
  list: () => apiClient.get('/me/recent-games').then(r => r.data.data),
  track: (gameId: string) => apiClient.post('/me/recent-games', { gameId }).then(r => r.data),
};

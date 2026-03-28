import { apiClient } from '../../../core/api';
import type { PaginatedGames, GameFilters, GameFiltersData, GameDetail } from '../types/games.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

function buildQueryParams(filters: Partial<GameFilters>): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};

  if (filters.type) params['type'] = filters.type;
  if (filters.search) params['search'] = filters.search;
  if (filters.providers?.length) params['providers'] = filters.providers;
  if (filters.categories?.length) params['categories'] = filters.categories;
  if (filters.sort && filters.sort !== 'default') params['sort'] = filters.sort;
  if (filters.page) params['page'] = String(filters.page);
  if (filters.limit) params['limit'] = String(filters.limit);

  return params;
}

export const gamesApi = {
  getGames: async (filters: Partial<GameFilters>): Promise<PaginatedGames> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedGames>>('/games', {
      params: buildQueryParams(filters),
      paramsSerializer: {
        // Serialize arrays as repeated keys: providers=pg-soft&providers=evolution
        indexes: null,
      },
    });
    return data.data;
  },

  getFilters: async (): Promise<GameFiltersData> => {
    const { data } = await apiClient.get<ApiResponse<GameFiltersData>>('/games/filters');
    return data.data;
  },

  getGameBySlug: async (slug: string): Promise<GameDetail> => {
    const { data } = await apiClient.get<ApiResponse<GameDetail>>(`/games/${slug}`);
    return data.data;
  },
};

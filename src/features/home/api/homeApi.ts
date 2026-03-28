import { apiClient } from '../../../core/api';
import type { HomeData, Banner, HomeShortcut } from '../types/home.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const homeApi = {
  getHomeData: async (): Promise<HomeData> => {
    const { data } = await apiClient.get<ApiResponse<HomeData>>('/home');
    return data.data;
  },

  getBanners: async (): Promise<Banner[]> => {
    const { data } = await apiClient.get<ApiResponse<Banner[]>>('/home/banners');
    return data.data;
  },

  getShortcuts: async (): Promise<HomeShortcut[]> => {
    const { data } = await apiClient.get<ApiResponse<HomeShortcut[]>>('/home/shortcuts');
    return data.data;
  },
};

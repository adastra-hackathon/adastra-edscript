import { apiClient } from '../../../core/api';
import type { ProfileDto, NotificationPrefsDto, ApiResponse } from '../../user/types/user.dto';
import type { EditProfileFormValues, ChangePasswordFormValues, NotificationPrefsFormValues } from '../types/profile.types';

export const profileApi = {
  getProfile: async (): Promise<ProfileDto> => {
    const { data } = await apiClient.get<ApiResponse<ProfileDto>>('/profile');
    return data.data;
  },

  updateProfile: async (payload: Partial<EditProfileFormValues>): Promise<ProfileDto> => {
    const { data } = await apiClient.patch<ApiResponse<ProfileDto>>('/profile', payload);
    return data.data;
  },

  changePassword: async (payload: ChangePasswordFormValues): Promise<void> => {
    await apiClient.patch('/profile/password', payload);
  },

  getNotificationPrefs: async (): Promise<NotificationPrefsDto> => {
    const { data } = await apiClient.get<ApiResponse<NotificationPrefsDto>>('/profile/notifications');
    return data.data;
  },

  updateNotificationPrefs: async (payload: Partial<NotificationPrefsFormValues>): Promise<NotificationPrefsDto> => {
    const { data } = await apiClient.patch<ApiResponse<NotificationPrefsDto>>('/profile/notifications', payload);
    return data.data;
  },
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/authStore';
import { profileApi } from '../api/profileApi';
import { profileMapper } from '../mappers/profileMapper';
import type { EditProfileFormValues, ChangePasswordFormValues, NotificationPrefsFormValues } from '../types/profile.types';

export const PROFILE_QUERY_KEY = ['profile', 'me'] as const;
export const NOTIF_PREFS_QUERY_KEY = ['profile', 'notifications'] as const;

export function useMyProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // Sync to Zustand when fresh data arrives
  if (query.data && user) {
    const dto = query.data;
    const balance = parseFloat(dto.wallet.balance);
    if (
      user.fullName !== dto.fullName ||
      user.email !== dto.email ||
      user.balance !== balance
    ) {
      setUser({
        ...user,
        fullName: dto.fullName,
        name: dto.fullName,
        displayName: dto.displayName,
        email: dto.email,
        level: dto.level,
        avatarUrl: dto.avatarUrl,
        balance,
      });
    }
  }

  const updateProfile = useMutation({
    mutationFn: (values: Partial<EditProfileFormValues>) =>
      profileApi.updateProfile(profileMapper.editFormToRequest(values as EditProfileFormValues)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });

  const changePassword = useMutation({
    mutationFn: (values: ChangePasswordFormValues) => profileApi.changePassword(values),
  });

  return { query, updateProfile, changePassword };
}

export function useNotificationPrefs() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: NOTIF_PREFS_QUERY_KEY,
    queryFn: profileApi.getNotificationPrefs,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10,
  });

  const update = useMutation({
    mutationFn: (values: Partial<NotificationPrefsFormValues>) =>
      profileApi.updateNotificationPrefs(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIF_PREFS_QUERY_KEY }),
  });

  return { query, update };
}

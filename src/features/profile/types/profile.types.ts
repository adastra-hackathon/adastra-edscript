import type { ReactNode } from 'react';

export interface ProfileMenuAction {
  id: string;
  label: string;
  icon: ReactNode;
  onPress: () => void;
}

export interface ProfileMenuViewModel {
  fullName: string;
  email: string;
  initials: string;
  levelLabel: string;
  balanceFormatted: string;
  avatarUrl?: string;
  actions: ProfileMenuAction[];
}

export interface EditProfileFormValues {
  fullName: string;
  displayName: string;
  phone: string;
  gender: string;
  address: string;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationPrefsFormValues {
  emailOnDeposit: boolean;
  emailOnWithdrawal: boolean;
  checkIntervalMinutes: number | null;
}

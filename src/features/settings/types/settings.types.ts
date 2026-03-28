export type ThemeOption = 'dark' | 'light' | 'system';
export type HistoryLayoutOption = 'cards' | 'list';
export type CurrencyOption = 'BRL' | 'USD' | 'EUR';

export interface NotificationSettings {
  pushPromotions: boolean;
  pushResultAlerts: boolean;
  pushReminders: boolean;
  emailPromotions: boolean;
  emailWeeklySummary: boolean;
  smsImportant: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  biometricLock: boolean;
}

export interface DisplaySettings {
  theme: ThemeOption;
  historyLayout: HistoryLayoutOption;
  currency: CurrencyOption;
  showTips: boolean;
}

export interface SettingsState {
  notifications: NotificationSettings;
  security: SecuritySettings;
  display: DisplaySettings;
}

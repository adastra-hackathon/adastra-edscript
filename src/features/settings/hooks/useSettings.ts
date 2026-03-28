import { useState, useCallback, useRef } from 'react';
import type {
  SettingsState,
  NotificationSettings,
  SecuritySettings,
  DisplaySettings,
} from '../types/settings.types';

const DEFAULT_SETTINGS: SettingsState = {
  notifications: {
    pushPromotions: true,
    pushResultAlerts: true,
    pushReminders: false,
    emailPromotions: true,
    emailWeeklySummary: false,
    smsImportant: false,
  },
  security: {
    twoFactorAuth: false,
    biometricLock: false,
  },
  display: {
    theme: 'dark',
    historyLayout: 'cards',
    currency: 'BRL',
    showTips: true,
  },
};

export interface UseSettingsReturn {
  settings: SettingsState;
  updateNotifications: (key: keyof NotificationSettings, value: boolean) => void;
  updateSecurity: (key: keyof SecuritySettings, value: boolean) => void;
  updateDisplay: <K extends keyof DisplaySettings>(key: K, value: DisplaySettings[K]) => void;
  isSaving: boolean;
  hasChanges: boolean;
  saveSettings: () => Promise<void>;
}

/**
 * Gerencia estado de configurações.
 * Preparado para integração com API — trocar saveSettings para chamada real.
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const savedRef = useRef<SettingsState>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  const updateNotifications = useCallback(
    (key: keyof NotificationSettings, value: boolean) => {
      setSettings(s => ({ ...s, notifications: { ...s.notifications, [key]: value } }));
      setHasChanges(true);
    },
    []
  );

  const updateSecurity = useCallback(
    (key: keyof SecuritySettings, value: boolean) => {
      setSettings(s => ({ ...s, security: { ...s.security, [key]: value } }));
      setHasChanges(true);
    },
    []
  );

  const updateDisplay = useCallback(
    <K extends keyof DisplaySettings>(key: K, value: DisplaySettings[K]) => {
      setSettings(s => ({ ...s, display: { ...s.display, [key]: value } }));
      setHasChanges(true);
    },
    []
  );

  const saveSettings = useCallback(async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    try {
      // TODO: await settingsApi.save(settings);
      await new Promise(resolve => setTimeout(resolve, 600));
      savedRef.current = settings;
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, [settings, hasChanges]);

  return {
    settings,
    updateNotifications,
    updateSecurity,
    updateDisplay,
    isSaving,
    hasChanges,
    saveSettings,
  };
}

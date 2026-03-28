import { renderHook, act } from '@testing-library/react-native';
import { useSettings } from '../features/settings/hooks/useSettings';

describe('useSettings', () => {
  describe('initial state', () => {
    it('returns default notification settings', () => {
      const { result } = renderHook(() => useSettings());
      const { notifications } = result.current.settings;

      expect(notifications.pushPromotions).toBe(true);
      expect(notifications.pushResultAlerts).toBe(true);
      expect(notifications.pushReminders).toBe(false);
      expect(notifications.emailPromotions).toBe(true);
      expect(notifications.emailWeeklySummary).toBe(false);
      expect(notifications.smsImportant).toBe(false);
    });

    it('returns default security settings', () => {
      const { result } = renderHook(() => useSettings());
      const { security } = result.current.settings;

      expect(security.twoFactorAuth).toBe(false);
      expect(security.biometricLock).toBe(false);
    });

    it('returns default display settings', () => {
      const { result } = renderHook(() => useSettings());
      const { display } = result.current.settings;

      expect(display.theme).toBe('dark');
      expect(display.historyLayout).toBe('cards');
      expect(display.currency).toBe('BRL');
      expect(display.showTips).toBe(true);
    });

    it('starts with hasChanges = false', () => {
      const { result } = renderHook(() => useSettings());
      expect(result.current.hasChanges).toBe(false);
    });

    it('starts with isSaving = false', () => {
      const { result } = renderHook(() => useSettings());
      expect(result.current.isSaving).toBe(false);
    });
  });

  describe('updateNotifications', () => {
    it('toggles a notification setting', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateNotifications('pushReminders', true);
      });

      expect(result.current.settings.notifications.pushReminders).toBe(true);
    });

    it('sets hasChanges to true after update', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateNotifications('smsImportant', true);
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it('does not affect other notification fields', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateNotifications('smsImportant', true);
      });

      expect(result.current.settings.notifications.pushPromotions).toBe(true);
      expect(result.current.settings.notifications.emailPromotions).toBe(true);
    });
  });

  describe('updateSecurity', () => {
    it('enables 2FA', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateSecurity('twoFactorAuth', true);
      });

      expect(result.current.settings.security.twoFactorAuth).toBe(true);
    });

    it('enables biometric lock', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateSecurity('biometricLock', true);
      });

      expect(result.current.settings.security.biometricLock).toBe(true);
      expect(result.current.hasChanges).toBe(true);
    });

    it('does not affect notification settings', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateSecurity('twoFactorAuth', true);
      });

      expect(result.current.settings.notifications.pushPromotions).toBe(true);
    });
  });

  describe('updateDisplay', () => {
    it('toggles showTips', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateDisplay('showTips', false);
      });

      expect(result.current.settings.display.showTips).toBe(false);
      expect(result.current.hasChanges).toBe(true);
    });

    it('updates currency', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateDisplay('currency', 'USD');
      });

      expect(result.current.settings.display.currency).toBe('USD');
    });

    it('does not affect other display fields', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateDisplay('showTips', false);
      });

      expect(result.current.settings.display.theme).toBe('dark');
      expect(result.current.settings.display.currency).toBe('BRL');
    });
  });

  describe('saveSettings', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('does nothing when hasChanges is false', async () => {
      const { result } = renderHook(() => useSettings());

      await act(async () => {
        await result.current.saveSettings();
      });

      expect(result.current.isSaving).toBe(false);
      expect(result.current.hasChanges).toBe(false);
    });

    it('sets isSaving to true during save, then false after', async () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateNotifications('smsImportant', true);
      });

      let savePromise: Promise<void>;
      act(() => {
        savePromise = result.current.saveSettings();
      });

      expect(result.current.isSaving).toBe(true);

      await act(async () => {
        jest.runAllTimers();
        await savePromise;
      });

      expect(result.current.isSaving).toBe(false);
    });

    it('resets hasChanges to false after successful save', async () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateSecurity('twoFactorAuth', true);
      });

      expect(result.current.hasChanges).toBe(true);

      await act(async () => {
        const promise = result.current.saveSettings();
        jest.runAllTimers();
        await promise;
      });

      expect(result.current.hasChanges).toBe(false);
    });
  });
});

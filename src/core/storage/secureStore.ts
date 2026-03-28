import * as SecureStore from 'expo-secure-store';

// ─── Storage genérico ────────────────────────────────────────────────────────

export const storage = {
  getString: (key: string): Promise<string | null> =>
    SecureStore.getItemAsync(key),

  getBoolean: async (key: string): Promise<boolean | undefined> => {
    const value = await SecureStore.getItemAsync(key);
    if (value === null) return undefined;
    return value === 'true';
  },

  set: (key: string, value: string | boolean | number): Promise<void> =>
    SecureStore.setItemAsync(key, String(value)),

  delete: (key: string): Promise<void> =>
    SecureStore.deleteItemAsync(key),
};

// ─── Auth storage (tokens) ───────────────────────────────────────────────────

export const tokenStorage = {
  getAccessToken: (): Promise<string | null> =>
    SecureStore.getItemAsync('access_token'),

  setAccessToken: (token: string): Promise<void> =>
    SecureStore.setItemAsync('access_token', token),

  getRefreshToken: (): Promise<string | null> =>
    SecureStore.getItemAsync('refresh_token'),

  setRefreshToken: (token: string): Promise<void> =>
    SecureStore.setItemAsync('refresh_token', token),

  clearTokens: (): Promise<void[]> =>
    Promise.all([
      SecureStore.deleteItemAsync('access_token'),
      SecureStore.deleteItemAsync('refresh_token'),
    ]),
};

// ─── Adapter Zustand persist (async) ────────────────────────────────────────

export const zustandStorage = {
  getItem: (key: string): Promise<string | null> =>
    SecureStore.getItemAsync(key),

  setItem: (key: string, value: string): Promise<void> =>
    SecureStore.setItemAsync(key, value),

  removeItem: (key: string): Promise<void> =>
    SecureStore.deleteItemAsync(key),
};

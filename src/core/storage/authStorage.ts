/**
 * Camada de storage dedicada para autenticação.
 * Desacoplada da implementação concreta — troque apenas este arquivo
 * para migrar de expo-secure-store para MMKV ou qualquer outra solução.
 */
import { tokenStorage } from './secureStore';

export const authStorage = {
  getAccessToken: (): Promise<string | null> =>
    tokenStorage.getAccessToken(),

  setAccessToken: (token: string): Promise<void> =>
    tokenStorage.setAccessToken(token),

  getRefreshToken: (): Promise<string | null> =>
    tokenStorage.getRefreshToken(),

  setRefreshToken: (token: string): Promise<void> =>
    tokenStorage.setRefreshToken(token),

  clearAll: (): Promise<void[]> =>
    tokenStorage.clearTokens(),
};

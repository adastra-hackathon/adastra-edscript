/**
 * Interface assíncrona de storage.
 * Implementada pelo SecureStore — compatível com expo-secure-store.
 */
export interface IStorage {
  getString(key: string): Promise<string | null>;
  getBoolean(key: string): Promise<boolean | undefined>;
  set(key: string, value: string | boolean | number): Promise<void>;
  delete(key: string): Promise<void>;
}

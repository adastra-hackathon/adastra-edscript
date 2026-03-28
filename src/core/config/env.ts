/**
 * Configuração centralizada de ambiente.
 * Usa variáveis EXPO_PUBLIC_* definidas no .env
 * Troque apenas aqui para alternar entre local, dev e produção.
 */
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
  environment: (process.env.EXPO_PUBLIC_ENV ?? 'development') as 'development' | 'production' | 'test',
  isDev: (process.env.EXPO_PUBLIC_ENV ?? 'development') === 'development',
} as const;

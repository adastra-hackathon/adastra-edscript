import { create } from 'zustand';
import { tokenStorage } from '../core/storage';

export interface User {
  id: string;
  /** Nome completo vindo do backend */
  fullName: string;
  /** Alias de compatibilidade com componentes existentes */
  name: string;
  displayName?: string;
  email: string;
  role: string;
  status?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  level?: string;
  avatarUrl?: string;
  /** Saldo — atualizado pelo módulo de carteira */
  balance: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (user, accessToken, refreshToken) => {
    await tokenStorage.setAccessToken(accessToken);
    await tokenStorage.setRefreshToken(refreshToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await tokenStorage.clearTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));

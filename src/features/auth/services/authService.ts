import { apiClient } from '../../../core/api';
import type {
  LoginRequestDto,
  RegisterRequestDto,
  AuthResponseDto,
  ApiResponse,
} from '../types/auth.dto';
import type { User } from '../../../store/authStore';

interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

function normalizeUser(dto: AuthResponseDto['user']): User {
  return {
    id: dto.id,
    fullName: dto.fullName,
    name: dto.fullName, // alias de compatibilidade
    email: dto.email,
    role: dto.role,
    balance: 0, // atualizado pelo módulo de carteira
  };
}

export const authService = {
  login: async (payload: LoginRequestDto): Promise<AuthResult> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponseDto>>('/auth/login', payload);
    console.log('Login successful:', data.data);
    const { user, accessToken, refreshToken } = data.data;
    return { user: normalizeUser(user), accessToken, refreshToken };
  },

  register: async (payload: RegisterRequestDto): Promise<AuthResult> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponseDto>>('/auth/register', payload);
    const { user, accessToken, refreshToken } = data.data;
    return { user: normalizeUser(user), accessToken, refreshToken };
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<{
      id: string;
      fullName: string;
      displayName?: string;
      email: string;
      role: string;
      status: string;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
      level?: string;
      avatarUrl?: string;
      createdAt: string;
    }>>('/auth/me');

    const u = data.data;
    return {
      id: u.id,
      fullName: u.fullName,
      name: u.fullName,
      displayName: u.displayName,
      email: u.email,
      role: u.role,
      status: u.status,
      isEmailVerified: u.isEmailVerified,
      isPhoneVerified: u.isPhoneVerified,
      level: u.level,
      avatarUrl: u.avatarUrl,
      balance: 0,
    };
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
  },
};

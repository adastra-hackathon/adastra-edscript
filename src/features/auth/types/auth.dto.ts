// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface LoginRequestDto {
  /** E-mail ou CPF */
  identifier: string;
  password: string;
}

export interface RegisterRequestDto {
  fullName: string;
  displayName?: string;
  email: string;
  cpf: string;
  phone: string;
  /** Formato esperado pelo backend: YYYY-MM-DD */
  birthDate: string;
  password: string;
  acceptBonus?: boolean;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface AuthUserDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}

export interface RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}

/** Envelope padrão de resposta da API */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
}

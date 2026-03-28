export interface UserDto {
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
}

export interface ProfileDto extends UserDto {
  cpf: string;
  phone: string;
  birthDate: string;
  gender?: string;
  address?: string;
  points: number;
  wallet: {
    balance: string;
    bonusBalance: string;
    currency: string;
  };
  editableFields: string[];
}

export interface NotificationPrefsDto {
  emailOnDeposit: boolean;
  emailOnWithdrawal: boolean;
  checkIntervalMinutes: number | null;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
}

export type GamingLimitType = 'BET_AMOUNT' | 'DEPOSIT_AMOUNT' | 'TIME_ON_SITE';
export type ExclusionType = 'TIMED' | 'AUTO';
export type AutoPeriod = '3_MONTHS' | '6_MONTHS' | '1_YEAR' | '2_YEARS' | 'PERMANENT';

export interface GamingLimitDto {
  type: GamingLimitType;
  dailyLimit: number | null;
  weeklyLimit: number | null;
  monthlyLimit: number | null;
  reason: string | null;
  lastActivityAt: string | null;
  updatedAt: string;
}

export interface ExclusionDto {
  type: ExclusionType;
  excludeUntil: string | null;
  autoPeriod: AutoPeriod | null;
  reason: string | null;
  lastActivityAt: string | null;
  updatedAt: string;
}

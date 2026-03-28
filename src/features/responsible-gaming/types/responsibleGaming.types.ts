export type SelfExclusionType = 'TIMED' | 'AUTO';
export type SelfExclusionDuration = '3_MONTHS' | '6_MONTHS' | '1_YEAR' | '2_YEARS' | 'PERMANENT';

export interface BetLimitData {
  dailyAmount: number | null;
  weeklyAmount: number | null;
  monthlyAmount: number | null;
  reason: string | null;
  updatedAt: string;
}

export interface DepositLimitData {
  dailyAmount: number | null;
  weeklyAmount: number | null;
  monthlyAmount: number | null;
  reason: string | null;
  updatedAt: string;
}

export interface SessionTimeLimitData {
  dailyMinutes: number | null;
  weeklyMinutes: number | null;
  monthlyMinutes: number | null;
  reason: string | null;
  updatedAt: string;
}

export interface SelfExclusionData {
  type: SelfExclusionType;
  untilDate: string | null;
  duration: SelfExclusionDuration | null;
  isActive: boolean;
  reason: string | null;
  updatedAt: string;
}

export interface ResponsibleGamingState {
  betLimit: BetLimitData | null;
  depositLimit: DepositLimitData | null;
  sessionTimeLimit: SessionTimeLimitData | null;
  selfExclusion: SelfExclusionData | null;
}

// Form value types (strings from inputs, before parsing)
export interface AmountLimitFormValues {
  daily: string;
  weekly: string;
  monthly: string;
  reason: string;
}

export interface SessionTimeLimitFormValues {
  daily: string;
  weekly: string;
  monthly: string;
  reason: string;
}

export interface TimedExclusionFormValues {
  untilDate: string;
  reason: string;
}

export interface SelfExclusionFormValues {
  duration: SelfExclusionDuration | '';
  reason: string;
}

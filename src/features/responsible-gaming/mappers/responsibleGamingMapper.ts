import type {
  ResponsibleGamingState,
  BetLimitData,
  DepositLimitData,
  SessionTimeLimitData,
} from '../types/responsibleGaming.types';
import type { BettingLimitFormValues } from '../schemas/bettingLimitSchema';
import type { DepositLimitFormValues } from '../schemas/depositLimitSchema';
import type { SessionTimeLimitFormValues } from '../schemas/sessionTimeLimitSchema';
import type { TimedExclusionFormValues } from '../schemas/timedExclusionSchema';
import type { SelfExclusionFormValues } from '../schemas/selfExclusionSchema';

function parseAmount(raw: string | undefined): number | null {
  if (!raw || raw.trim() === '') return null;
  const num = parseFloat(raw.replace(',', '.'));
  return isNaN(num) ? null : num;
}

function parseMinutes(raw: string | undefined): number | null {
  if (!raw || raw.trim() === '') return null;
  const num = parseInt(raw, 10);
  return isNaN(num) ? null : num;
}

function formatAmount(value: number | null): string {
  return value !== null ? String(value) : '';
}

function formatMinutes(value: number | null): string {
  return value !== null ? String(value) : '';
}

export const responsibleGamingMapper = {
  // response → initial form values
  toAmountLimitForm(data: BetLimitData | DepositLimitData | null): BettingLimitFormValues {
    return {
      daily: formatAmount(data?.dailyAmount ?? null),
      weekly: formatAmount(data?.weeklyAmount ?? null),
      monthly: formatAmount(data?.monthlyAmount ?? null),
      reason: data?.reason ?? '',
    };
  },

  toSessionTimeLimitForm(data: SessionTimeLimitData | null): SessionTimeLimitFormValues {
    return {
      daily: formatMinutes(data?.dailyMinutes ?? null),
      weekly: formatMinutes(data?.weeklyMinutes ?? null),
      monthly: formatMinutes(data?.monthlyMinutes ?? null),
      reason: data?.reason ?? '',
    };
  },

  // form → API payload (clean numeric values, no masks)
  betLimitToPayload(values: BettingLimitFormValues) {
    return {
      dailyAmount: parseAmount(values.daily),
      weeklyAmount: parseAmount(values.weekly),
      monthlyAmount: parseAmount(values.monthly),
      reason: values.reason?.trim() || null,
    };
  },

  depositLimitToPayload(values: DepositLimitFormValues) {
    return {
      dailyAmount: parseAmount(values.daily),
      weeklyAmount: parseAmount(values.weekly),
      monthlyAmount: parseAmount(values.monthly),
      reason: values.reason?.trim() || null,
    };
  },

  sessionTimeLimitToPayload(values: SessionTimeLimitFormValues) {
    return {
      dailyMinutes: parseMinutes(values.daily),
      weeklyMinutes: parseMinutes(values.weekly),
      monthlyMinutes: parseMinutes(values.monthly),
      reason: values.reason?.trim() || null,
    };
  },

  timedExclusionToPayload(values: TimedExclusionFormValues) {
    const date = new Date(values.untilDate);
    date.setHours(23, 59, 59, 0);
    return {
      untilDate: date.toISOString(),
      reason: values.reason?.trim() || null,
    };
  },

  selfExclusionToPayload(values: SelfExclusionFormValues) {
    return {
      duration: values.duration || null,
      reason: values.reason?.trim() || null,
    };
  },

  // response → card display values
  formatBetLimitCard(data: BetLimitData | null) {
    if (!data) return null;
    return {
      daily: data.dailyAmount !== null ? `R$ ${data.dailyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null,
      weekly: data.weeklyAmount !== null ? `R$ ${data.weeklyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null,
      monthly: data.monthlyAmount !== null ? `R$ ${data.monthlyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null,
    };
  },

  formatDepositLimitCard(data: DepositLimitData | null) {
    if (!data) return null;
    return {
      daily: data.dailyAmount !== null ? `R$ ${data.dailyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null,
      weekly: data.weeklyAmount !== null ? `R$ ${data.weeklyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null,
      monthly: data.monthlyAmount !== null ? `R$ ${data.monthlyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null,
    };
  },

  formatSessionTimeLimitCard(data: SessionTimeLimitData | null) {
    if (!data) return null;
    return {
      daily: data.dailyMinutes !== null ? `${data.dailyMinutes} min` : null,
      weekly: data.weeklyMinutes !== null ? `${data.weeklyMinutes} min` : null,
      monthly: data.monthlyMinutes !== null ? `${data.monthlyMinutes} min` : null,
    };
  },

  formatStateForCards(state: ResponsibleGamingState) {
    return {
      betLimit: this.formatBetLimitCard(state.betLimit),
      depositLimit: this.formatDepositLimitCard(state.depositLimit),
      sessionTimeLimit: this.formatSessionTimeLimitCard(state.sessionTimeLimit),
      selfExclusion: state.selfExclusion,
    };
  },
};

import type { ProfileDto, NotificationPrefsDto } from '../../user/types/user.dto';
import type {
  ProfileMenuViewModel,
  EditProfileFormValues,
  NotificationPrefsFormValues,
} from '../types/profile.types';

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatBalance(amount: string, currency: string): string {
  const value = parseFloat(amount);
  return value.toLocaleString('pt-BR', { style: 'currency', currency });
}

const levelLabels: Record<string, string> = {
  BRONZE: 'Bronze',
  PRATA: 'Prata',
  OURO: 'Ouro',
  DIAMANTE: 'Diamante',
  VIP: 'VIP',
};

export const profileMapper = {
  toMenuViewModel(
    dto: ProfileDto,
    actions: ProfileMenuViewModel['actions'],
  ): ProfileMenuViewModel {
    return {
      fullName: dto.fullName,
      email: dto.email,
      initials: getInitials(dto.fullName),
      levelLabel: levelLabels[dto.level ?? 'BRONZE'] ?? dto.level ?? 'Bronze',
      balanceFormatted: formatBalance(dto.wallet.balance, dto.wallet.currency),
      avatarUrl: dto.avatarUrl,
      actions,
    };
  },

  toEditFormValues(dto: ProfileDto): EditProfileFormValues {
    return {
      fullName: dto.fullName,
      displayName: dto.displayName ?? '',
      phone: dto.phone,
      gender: dto.gender ?? '',
      address: dto.address ?? '',
    };
  },

  toNotificationFormValues(dto: NotificationPrefsDto): NotificationPrefsFormValues {
    return {
      emailOnDeposit: dto.emailOnDeposit,
      emailOnWithdrawal: dto.emailOnWithdrawal,
      checkIntervalMinutes: dto.checkIntervalMinutes,
    };
  },

  editFormToRequest(values: EditProfileFormValues): Partial<EditProfileFormValues> {
    const payload: Partial<EditProfileFormValues> = {};
    if (values.fullName) payload.fullName = values.fullName;
    if (values.displayName) payload.displayName = values.displayName;
    if (values.phone) payload.phone = values.phone;
    if (values.gender) payload.gender = values.gender;
    if (values.address) payload.address = values.address;
    return payload;
  },
};

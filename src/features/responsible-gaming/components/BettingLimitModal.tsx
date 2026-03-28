import React, { memo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Input } from '../../../components/ui/Input';
import { LimitModalShell } from './LimitModalShell';
import { ResponsibleGamingInfoBox } from './ResponsibleGamingInfoBox';
import { bettingLimitSchema, type BettingLimitFormValues } from '../schemas/bettingLimitSchema';
import { responsibleGamingMapper } from '../mappers/responsibleGamingMapper';
import { useUpsertBettingLimitMutation } from '../hooks/useUpsertBettingLimitMutation';
import { useInvalidateResponsibleGaming } from '../hooks/useResponsibleGamingLimitsQuery';
import { gamingLimitsApi } from '../api/gamingLimitsApi';
import type { BetLimitData } from '../types/responsibleGaming.types';
import { spacing } from '../../../core/theme';

const INFO_LINES = [
  { text: 'Defina seus limites de cassino e apostas esportivas', type: 'warning' as const },
  { text: 'Limite de aposta em cassino', type: 'warning' as const },
  { text: 'Se a Autoimposição de Limites estiver ativada, não é possível aumentá-la. Entre em contato com nosso suporte.', type: 'muted' as const },
];

interface Props {
  visible: boolean;
  current: BetLimitData | null;
  lastActivityAt?: string | null;
  onClose: () => void;
}

export const BettingLimitModal = memo(function BettingLimitModal({
  visible,
  current,
  lastActivityAt,
  onClose,
}: Props) {
  const { colors } = useAppTheme();
  const mutation = useUpsertBettingLimitMutation();
  const invalidate = useInvalidateResponsibleGaming();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<BettingLimitFormValues>({
    resolver: zodResolver(bettingLimitSchema),
    defaultValues: responsibleGamingMapper.toAmountLimitForm(current),
  });

  useEffect(() => {
    if (visible) reset(responsibleGamingMapper.toAmountLimitForm(current));
  }, [visible, current, reset]);

  const onSave = handleSubmit(async (values) => {
    await mutation.mutateAsync(responsibleGamingMapper.betLimitToPayload(values));
    onClose();
  });

  const onReset = async () => {
    await gamingLimitsApi.resetLimit('BET_AMOUNT');
    invalidate();
    onClose();
  };

  return (
    <LimitModalShell
      visible={visible}
      title="Limite de aposta"
      onClose={onClose}
      onSave={onSave}
      onReset={onReset}
      isLoading={mutation.isPending}
    >
      <AppText variant="caption" color={colors.textTertiary}>
        Data da última aposta:{' '}
        {lastActivityAt ? new Date(lastActivityAt).toLocaleDateString('pt-BR') : '—'}
      </AppText>

      <View style={styles.fields}>
        <AppText variant="labelSm" color={colors.textSecondary}>Diário</AppText>
        <Controller control={control} name="daily" render={({ field }) => (
          <Input
            placeholder="Valor em R$"
            keyboardType="numeric"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.daily?.message}
          />
        )} />

        <AppText variant="labelSm" color={colors.textSecondary}>Semana</AppText>
        <Controller control={control} name="weekly" render={({ field }) => (
          <Input
            placeholder="Valor em R$"
            keyboardType="numeric"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.weekly?.message}
          />
        )} />

        <AppText variant="labelSm" color={colors.textSecondary}>Mensal</AppText>
        <Controller control={control} name="monthly" render={({ field }) => (
          <Input
            placeholder="Valor em R$"
            keyboardType="numeric"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.monthly?.message}
          />
        )} />

        <AppText variant="labelSm" color={colors.textSecondary}>Razão</AppText>
        <Controller control={control} name="reason" render={({ field }) => (
          <Input
            placeholder="Descreva o motivo..."
            multiline
            numberOfLines={3}
            value={field.value}
            onChangeText={field.onChange}
            style={styles.textarea}
          />
        )} />
      </View>

      <ResponsibleGamingInfoBox lines={INFO_LINES} />
    </LimitModalShell>
  );
});

const styles = StyleSheet.create({
  fields: { gap: spacing[2] },
  textarea: { height: 80, textAlignVertical: 'top', paddingTop: spacing[3] },
});

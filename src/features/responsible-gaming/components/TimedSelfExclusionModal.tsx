import React, { memo, useEffect } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { borderRadius, spacing } from '../../../core/theme';
import { timedExclusionSchema, type TimedExclusionFormValues } from '../schemas/timedExclusionSchema';
import { responsibleGamingMapper } from '../mappers/responsibleGamingMapper';
import { useCreateTimedSelfExclusionMutation } from '../hooks/useCreateTimedSelfExclusionMutation';
import type { SelfExclusionData } from '../types/responsibleGaming.types';

interface Props {
  visible: boolean;
  current: SelfExclusionData | null;
  onClose: () => void;
}

export const TimedSelfExclusionModal = memo(function TimedSelfExclusionModal({
  visible,
  current,
  onClose,
}: Props) {
  const { colors } = useAppTheme();
  const mutation = useCreateTimedSelfExclusionMutation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<TimedExclusionFormValues>({
    resolver: zodResolver(timedExclusionSchema),
    defaultValues: { untilDate: '', reason: '' },
  });

  useEffect(() => {
    if (visible) reset({ untilDate: '', reason: '' });
  }, [visible, reset]);

  const onSave = handleSubmit(async (values) => {
    await mutation.mutateAsync(responsibleGamingMapper.timedExclusionToPayload(values));
    onClose();
  });

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose} accessibilityViewIsModal>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.headerTitle}>
              Exclusão por tempo determinado
            </AppText>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceOverlay }]} accessibilityLabel="Fechar">
              <AppText variant="bodyMd" color={colors.textSecondary}>✕</AppText>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} bounces={false} keyboardShouldPersistTaps="handled">
            {/* Date picker input */}
            <View style={styles.fields}>
              <Controller
                control={control}
                name="untilDate"
                render={({ field }) => (
                  <View style={[styles.dateInput, { backgroundColor: colors.inputBackground, borderColor: errors.untilDate ? colors.error : colors.inputBorder }]}>
                    <AppText variant="caption" color={colors.textTertiary} style={styles.calendarIcon}>📅</AppText>
                    <TextInput
                      placeholder="Selecione a data"
                      placeholderTextColor={colors.inputPlaceholder}
                      value={field.value}
                      onChangeText={field.onChange}
                      style={[styles.dateTextInput, { color: colors.inputText }]}
                    />
                  </View>
                )}
              />
              {errors.untilDate && (
                <AppText variant="caption" color={colors.error}>{errors.untilDate.message}</AppText>
              )}

              <AppText variant="labelSm" color={colors.textSecondary}>Razão</AppText>
              <Controller control={control} name="reason" render={({ field }) => (
                <Input placeholder="Descreva o motivo..." multiline numberOfLines={3} value={field.value} onChangeText={field.onChange} style={styles.textarea} />
              )} />
            </View>

            {/* Danger warning */}
            <View style={[styles.warningBox, { backgroundColor: colors.errorBackground, borderColor: colors.error }]}>
              <AppText variant="caption" color={colors.error} style={styles.warningIcon}>⚠</AppText>
              <AppText variant="caption" color={colors.error} style={styles.warningText}>
                Antes de se autoexcluir, certifique-se de sacar seu saldo, após a autoexclusão, você perderá o acesso a conta e não será possível realizar nenhum tipo de movimentação financeira.
              </AppText>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            {mutation.isPending ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Button label="Guardar" onPress={onSave} variant="primary" size="sm" />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing[5] },
  card: { width: '100%', borderRadius: borderRadius['2xl'], maxHeight: '88%', overflow: 'hidden', zIndex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[5], paddingTop: spacing[5], paddingBottom: spacing[3] },
  headerTitle: { flex: 1, marginRight: spacing[2] },
  closeBtn: { width: 28, height: 28, borderRadius: borderRadius.full, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: spacing[5], paddingBottom: spacing[4], gap: spacing[3] },
  fields: { gap: spacing[2] },
  dateInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: borderRadius.md, height: 52, paddingHorizontal: spacing[3] },
  calendarIcon: { marginRight: spacing[2] },
  dateTextInput: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular' },
  textarea: { height: 80, textAlignVertical: 'top', paddingTop: spacing[3] },
  warningBox: { flexDirection: 'row', borderWidth: 1, borderRadius: borderRadius.md, padding: spacing[3], gap: spacing[2] },
  warningIcon: { marginTop: 1 },
  warningText: { flex: 1, lineHeight: 18 },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: spacing[5], paddingVertical: spacing[4] },
});

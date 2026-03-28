import React, { memo, useEffect, useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { borderRadius, spacing } from '../../../core/theme';
import {
  selfExclusionSchema,
  SELF_EXCLUSION_DURATION_OPTIONS,
  type SelfExclusionFormValues,
} from '../schemas/selfExclusionSchema';
import { responsibleGamingMapper } from '../mappers/responsibleGamingMapper';
import { useCreateSelfExclusionMutation } from '../hooks/useCreateSelfExclusionMutation';
import type { SelfExclusionData } from '../types/responsibleGaming.types';

interface Props {
  visible: boolean;
  current: SelfExclusionData | null;
  onClose: () => void;
  onWithdrawPress: () => void;
}

export const SelfExclusionModal = memo(function SelfExclusionModal({
  visible,
  current,
  onClose,
  onWithdrawPress,
}: Props) {
  const { colors } = useAppTheme();
  const mutation = useCreateSelfExclusionMutation();
  const [pickerOpen, setPickerOpen] = useState(false);

  const { control, handleSubmit, reset, setValue, watch } = useForm<SelfExclusionFormValues>({
    resolver: zodResolver(selfExclusionSchema),
    defaultValues: { duration: '', reason: '' },
  });

  const selectedDuration = watch('duration');

  useEffect(() => {
    if (visible) reset({ duration: '', reason: '' });
  }, [visible, reset]);

  const onSave = handleSubmit(async (values) => {
    await mutation.mutateAsync(responsibleGamingMapper.selfExclusionToPayload(values));
    onClose();
  });

  const selectedLabel =
    SELF_EXCLUSION_DURATION_OPTIONS.find((o) => o.value === selectedDuration)?.label ??
    'Sem limites aplicados.';

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose} accessibilityViewIsModal>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.headerTitle}>Auto Exclusão</AppText>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceOverlay }]} accessibilityLabel="Fechar">
              <AppText variant="bodyMd" color={colors.textSecondary}>✕</AppText>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} bounces={false} keyboardShouldPersistTaps="handled">
            {/* Duration picker */}
            <View style={styles.fields}>
              <TouchableOpacity
                onPress={() => setPickerOpen(!pickerOpen)}
                style={[styles.picker, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
                activeOpacity={0.8}
              >
                <AppText variant="bodyMd" color={selectedDuration ? colors.textPrimary : colors.inputPlaceholder} style={styles.pickerLabel}>
                  {selectedLabel}
                </AppText>
                <AppText variant="bodyMd" color={colors.textSecondary}>▾</AppText>
              </TouchableOpacity>

              {pickerOpen && (
                <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  {SELF_EXCLUSION_DURATION_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => {
                        setValue('duration', opt.value as any);
                        setPickerOpen(false);
                      }}
                      style={[styles.dropdownItem, { borderBottomColor: colors.divider }]}
                      activeOpacity={0.7}
                    >
                      <AppText variant="bodyMd" color={opt.value === selectedDuration ? colors.secondary : colors.textPrimary}>
                        {opt.label}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <AppText variant="labelSm" color={colors.textSecondary}>Razão</AppText>
              <Controller control={control} name="reason" render={({ field }) => (
                <Input placeholder="Descreva o motivo..." multiline numberOfLines={3} value={field.value ?? ''} onChangeText={field.onChange} style={styles.textarea} />
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
              <View style={styles.btnRow}>
                <Button label="Sacar saldo" onPress={onWithdrawPress} variant="outline" size="sm" fullWidth={false} style={styles.btn} />
                <Button label="Guardar" onPress={onSave} variant="primary" size="sm" fullWidth={false} style={styles.btn} />
              </View>
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
  picker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderRadius: borderRadius.md, height: 52, paddingHorizontal: spacing[4] },
  pickerLabel: { flex: 1 },
  dropdown: { borderWidth: 1, borderRadius: borderRadius.md, overflow: 'hidden' },
  dropdownItem: { paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomWidth: StyleSheet.hairlineWidth },
  textarea: { height: 80, textAlignVertical: 'top', paddingTop: spacing[3] },
  warningBox: { flexDirection: 'row', borderWidth: 1, borderRadius: borderRadius.md, padding: spacing[3], gap: spacing[2] },
  warningIcon: { marginTop: 1 },
  warningText: { flex: 1, lineHeight: 18 },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: spacing[5], paddingVertical: spacing[4] },
  btnRow: { flexDirection: 'row', gap: spacing[3] },
  btn: { flex: 1 },
});

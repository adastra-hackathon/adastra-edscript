import React, { memo } from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';

interface BetslipActionsProps {
  onSubmit: () => void;
  onShare: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export const BetslipActions = memo(function BetslipActions({
  onSubmit,
  onShare,
  isSubmitting,
  canSubmit,
}: BetslipActionsProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      {/* Primary — Inserir Apostas */}
      <TouchableOpacity
        onPress={onSubmit}
        disabled={!canSubmit || isSubmitting}
        activeOpacity={0.85}
        style={[
          styles.primaryBtn,
          { backgroundColor: colors.secondary, opacity: canSubmit && !isSubmitting ? 1 : 0.5 },
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={colors.textOnSecondary} />
        ) : (
          <>
            <AppText variant="buttonMd" color={colors.textOnSecondary}>
              ⊙ Inserir Apostas
            </AppText>
          </>
        )}
      </TouchableOpacity>

      {/* Secondary — Compartilhar */}
      <TouchableOpacity
        onPress={onShare}
        activeOpacity={0.75}
        style={[styles.shareBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
      >
        <AppText variant="buttonMd" color={colors.textSecondary}>
          ⬆ Compartilhar
        </AppText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  primaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    height: 52,
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

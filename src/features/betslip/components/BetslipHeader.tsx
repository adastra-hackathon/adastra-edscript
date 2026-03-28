import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import { ChevronLeftIcon } from '../../../components/icons';

interface BetslipHeaderProps {
  selectionCount: number;
  onBack: () => void;
  onClear: () => void;
  canClear: boolean;
}

export const BetslipHeader = memo(function BetslipHeader({
  selectionCount,
  onBack,
  onClear,
  canClear,
}: BetslipHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      {/* Back */}
      <TouchableOpacity
        onPress={onBack}
        hitSlop={8}
        style={[styles.iconBtn, { backgroundColor: colors.surfaceElevated }]}
        activeOpacity={0.7}
      >
        <ChevronLeftIcon size={20} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Title + badge */}
      <View style={styles.titleRow}>
        <AppText variant="h3" color={colors.textPrimary}>
          Bilhete
        </AppText>
        {selectionCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <AppText variant="caption" color={colors.textOnSecondary}>
              {selectionCount}
            </AppText>
          </View>
        )}
      </View>

      {/* Clear */}
      <TouchableOpacity
        onPress={onClear}
        disabled={!canClear}
        activeOpacity={0.7}
        style={[styles.clearBtn, { borderColor: colors.error, opacity: canClear ? 1 : 0.3 }]}
      >
        <AppText variant="labelSm" color={colors.error}>
          🗑 Limpar
        </AppText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    gap: spacing[3],
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[1.5],
  },
  clearBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
});

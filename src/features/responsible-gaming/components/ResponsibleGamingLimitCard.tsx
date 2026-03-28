import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { borderRadius, spacing } from '../../../core/theme';

interface LimitRow {
  label: string;
  value: string | null;
}

interface Props {
  title: string;
  rows: LimitRow[];
  buttonLabel?: string;
  buttonVariant?: 'default' | 'danger';
  onPress: () => void;
}

export const ResponsibleGamingLimitCard = memo(function ResponsibleGamingLimitCard({
  title,
  rows,
  buttonLabel = 'Estabelecer limites',
  buttonVariant = 'default',
  onPress,
}: Props) {
  const { colors } = useAppTheme();

  const btnBg = buttonVariant === 'danger' ? colors.errorBackground : colors.surface;
  const btnBorder = buttonVariant === 'danger' ? colors.error : colors.border;
  const btnTextColor = buttonVariant === 'danger' ? colors.error : colors.textPrimary;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.left}>
        <AppText variant="labelLg" color={colors.textPrimary} style={styles.title}>
          {title}
        </AppText>
        {rows.map((row, i) => (
          <AppText key={i} variant="caption" color={colors.textSecondary} style={styles.row}>
            <AppText variant="caption" color={colors.textSecondary}>{row.label}  </AppText>
            <AppText variant="caption" color={row.value ? colors.secondary : colors.textTertiary}>
              {row.value ?? 'Sem limite aplicado'}
            </AppText>
          </AppText>
        ))}
      </View>

      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.btn, { backgroundColor: btnBg, borderColor: btnBorder }]}
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
      >
        {buttonVariant === 'danger' && (
          <AppText variant="caption" color={colors.error}>⊘ </AppText>
        )}
        <AppText variant="labelSm" color={btnTextColor} style={styles.btnText}>
          {buttonLabel}
        </AppText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    gap: spacing[3],
  },
  left: {
    flex: 1,
    gap: spacing[1],
  },
  title: {
    marginBottom: spacing[0.5],
  },
  row: {
    lineHeight: 18,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minWidth: 90,
  },
  btnText: {
    textAlign: 'center',
  },
});

import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';

export interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

/**
 * Linha individual de configuração: ícone + label + valor/ação opcional.
 * Exibe chevron automaticamente quando há `onPress` e nenhum `rightElement`.
 */
export const SettingsItem = memo(function SettingsItem({
  icon,
  label,
  value,
  onPress,
  rightElement,
  destructive = false,
}: SettingsItemProps) {
  const { colors } = useAppTheme();
  const labelColor = destructive ? '#e74c3c' : colors.textPrimary;

  const content = (
    <View style={styles.row}>
      <View style={styles.iconSlot}>{icon}</View>
      <AppText variant="bodyMd" color={labelColor} style={styles.label}>
        {label}
      </AppText>
      <View style={styles.right}>
        {rightElement ?? (
          <>
            {value && (
              <AppText variant="bodySm" color={colors.textSecondary} style={styles.value}>
                {value}
              </AppText>
            )}
            {onPress && (
              <AppText variant="bodyMd" color={colors.textTertiary} style={styles.chevron}>
                ›
              </AppText>
            )}
          </>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.65}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
});

/**
 * Caixa colorida de ícone — estilo iOS settings.
 */
export const SettingsIconBox = memo(function SettingsIconBox({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.iconBox, { backgroundColor: color }]}>
      {children}
    </View>
  );
});

/**
 * Divisor fino entre itens dentro de um SettingsGroupCard.
 */
export const ItemDivider = memo(function ItemDivider() {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.border, marginLeft: spacing[5] + 32 + spacing[3] },
      ]}
    />
  );
});

/**
 * Label de sub-seção dentro de um grupo (ex: "PUSH / APP").
 */
export const SettingsSubLabel = memo(function SettingsSubLabel({ label }: { label: string }) {
  const { colors } = useAppTheme();
  return (
    <AppText
      variant="caption"
      color={colors.textTertiary}
      style={styles.subLabel}
    >
      {label}
    </AppText>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    minHeight: 52,
  },
  iconSlot: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  label: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  value: {
    maxWidth: 120,
    textAlign: 'right',
  },
  chevron: {
    fontSize: 20,
    lineHeight: 22,
    marginLeft: spacing[1],
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  subLabel: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[1],
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';

interface PixDepositCardProps {
  pixKey: string;
  onCopyKey: () => void;
  copied: boolean;
}

export const PixDepositCard = memo(function PixDepositCard({
  pixKey,
  onCopyKey,
  copied,
}: PixDepositCardProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
      {/* QR Code placeholder */}
      <View style={[styles.qrBox, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
        <AppText variant="labelSm" color={colors.textTertiary}>
          QR Code Pix
        </AppText>
        <View style={styles.qrGrid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.qrCell,
                {
                  backgroundColor: i % 3 === 0 || i === 4 ? colors.textPrimary : 'transparent',
                  opacity: 0.15,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <AppText variant="caption" color={colors.textSecondary} style={styles.instruction}>
        Escaneie o QR Code ou copie a chave abaixo para pagar via Pix
      </AppText>

      {/* Pix key row */}
      <View style={[styles.keyRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AppText variant="bodyMd" color={colors.textSecondary} style={styles.keyText} numberOfLines={1}>
          {pixKey}
        </AppText>
        <TouchableOpacity
          onPress={onCopyKey}
          activeOpacity={0.75}
          style={[styles.copyBtn, { backgroundColor: copied ? colors.successBackground : colors.primaryLight }]}
        >
          <AppText variant="labelSm" color={copied ? colors.success : colors.primary}>
            {copied ? 'Copiado!' : 'Copiar'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[5],
    gap: spacing[4],
    alignItems: 'center',
  },
  qrBox: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: spacing[3],
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 60,
    gap: 4,
  },
  qrCell: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  instruction: {
    textAlign: 'center',
    lineHeight: 18,
  },
  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
  keyText: {
    flex: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  copyBtn: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
});

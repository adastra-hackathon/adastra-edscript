import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Input } from '../../../components/ui/Input';
import { spacing, borderRadius } from '../../../core/theme';
import type { PixKeyType } from '../types/wallet.types';
import { PIX_KEY_TYPE_LABELS, PIX_KEY_TYPE_PLACEHOLDERS } from '../types/wallet.types';

interface PixWithdrawFormProps {
  pixKeyType: PixKeyType;
  onSelectKeyType: (type: PixKeyType) => void;
  pixKey: string;
  onPixKeyChange: (key: string) => void;
  pixKeyError?: string;
}

const KEY_TYPES: PixKeyType[] = ['cpf', 'email', 'phone', 'random'];

export const PixWithdrawForm = memo(function PixWithdrawForm({
  pixKeyType,
  onSelectKeyType,
  pixKey,
  onPixKeyChange,
  pixKeyError,
}: PixWithdrawFormProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <AppText variant="labelMd" color={colors.textSecondary} style={styles.label}>
        Tipo de chave Pix
      </AppText>

      <View style={styles.keyTypeGrid}>
        {KEY_TYPES.map((type) => {
          const isActive = type === pixKeyType;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => onSelectKeyType(type)}
              activeOpacity={0.75}
              style={[
                styles.keyTypeChip,
                {
                  backgroundColor: isActive ? colors.primaryLight : colors.backgroundSecondary,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
            >
              <AppText
                variant="labelSm"
                color={isActive ? colors.primary : colors.textSecondary}
              >
                {PIX_KEY_TYPE_LABELS[type]}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <Input
        label="Chave Pix"
        value={pixKey}
        onChangeText={onPixKeyChange}
        placeholder={PIX_KEY_TYPE_PLACEHOLDERS[pixKeyType]}
        error={pixKeyError}
        autoCapitalize="none"
        keyboardType={pixKeyType === 'phone' ? 'phone-pad' : 'default'}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[4],
  },
  label: {},
  keyTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  keyTypeChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
  },
});

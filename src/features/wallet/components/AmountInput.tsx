import React, { memo } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
}

export const AmountInput = memo(function AmountInput({
  value,
  onChangeText,
  error,
  label = 'Valor',
}: AmountInputProps) {
  const { colors } = useAppTheme();

  const borderColor = error ? colors.error : colors.inputBorder;

  return (
    <View style={styles.wrapper}>
      {label && (
        <AppText variant="labelMd" color={colors.textSecondary} style={styles.label}>
          {label}
        </AppText>
      )}
      <View
        style={[
          styles.container,
          { backgroundColor: colors.inputBackground, borderColor },
        ]}
      >
        <AppText variant="h3" color={colors.textSecondary} style={styles.prefix}>
          R$
        </AppText>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0,00"
          placeholderTextColor={colors.inputPlaceholder}
          style={[styles.input, { color: colors.inputText }]}
          maxLength={10}
        />
      </View>
      {error && (
        <AppText variant="caption" color={colors.error} style={styles.error}>
          {error}
        </AppText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  label: { marginBottom: spacing[1.5] },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    height: 56,
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  prefix: {
    lineHeight: 24,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    includeFontPadding: false,
  },
  error: { marginTop: spacing[1], marginLeft: spacing[1] },
});

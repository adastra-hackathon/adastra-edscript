import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';

interface StakeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export const StakeInput = memo(function StakeInput({
  value,
  onChangeText,
  onClear,
  placeholder = '0,00',
}: StakeInputProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
      <AppText variant="labelMd" color={colors.textSecondary} style={styles.prefix}>
        R$
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholder={placeholder}
        placeholderTextColor={colors.inputPlaceholder}
        style={[styles.input, { color: colors.inputText }]}
        maxLength={10}
      />
      {value.length > 0 && onClear && (
        <TouchableOpacity onPress={onClear} hitSlop={8} style={styles.clearBtn} activeOpacity={0.7}>
          <AppText variant="labelMd" color={colors.textTertiary}>×</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    paddingHorizontal: spacing[3],
    height: 44,
    gap: spacing[1],
  },
  prefix: {
    lineHeight: 20,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    includeFontPadding: false,
  },
  clearBtn: {
    paddingLeft: spacing[2],
  },
});

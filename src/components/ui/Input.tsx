import React, { memo, useState, useCallback, forwardRef } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from './AppText';
import { spacing, borderRadius } from '../../core/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  onRightIconPress?: () => void;
}

export const Input = memo(
  forwardRef<TextInput, InputProps>(function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  onRightIconPress,
  style,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...rest
}, ref) {
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocusProp?.({} as any);
  }, [onFocusProp]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlurProp?.({} as any);
  }, [onBlurProp]);

  const borderColor = isFocused
    ? colors.inputBorderFocus
    : error
    ? colors.error
    : colors.inputBorder;

  return (
    <View style={[styles.wrapper, containerStyle]}>
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
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <TextInput
          ref={ref}
          style={[
            styles.input,
            { color: colors.inputText },
            leftIcon ? styles.inputWithLeft : undefined,
            rightIcon ? styles.inputWithRight : undefined,
            style,
          ]}
          placeholderTextColor={colors.inputPlaceholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.icon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {(error || hint) && (
        <AppText
          variant="caption"
          color={error ? colors.error : colors.textTertiary}
          style={styles.hint}
        >
          {error ?? hint}
        </AppText>
      )}
    </View>
  );
}),
);

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  label: { marginBottom: spacing[1.5] },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    height: 52,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing[4],
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    includeFontPadding: false,
  },
  inputWithLeft: { paddingLeft: spacing[2] },
  inputWithRight: { paddingRight: spacing[2] },
  icon: {
    paddingHorizontal: spacing[3],
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: { marginTop: spacing[1], marginLeft: spacing[1] },
});

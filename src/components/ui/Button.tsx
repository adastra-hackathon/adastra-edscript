import React, { memo, useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from './AppText';
import { borderRadius, spacing } from '../../core/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = memo(function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const { colors } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  }, [scale]);

  const variantStyles = getVariantStyles(variant, colors);
  const sizeStyles = sizeMap[size];
  const isDisabled = disabled || loading;

  return (
    <Animated.View style={{ transform: [{ scale }], width: fullWidth ? '100%' : undefined }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
        style={[
          styles.base,
          sizeStyles.container,
          variantStyles.container,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variantStyles.activityColor} />
        ) : (
          <>
            {leftIcon}
            <AppText
              variant={size === 'sm' ? 'buttonSm' : size === 'lg' ? 'buttonLg' : 'buttonMd'}
              style={[variantStyles.text, sizeStyles.text, textStyle]}
            >
              {label}
            </AppText>
            {rightIcon}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

function getVariantStyles(variant: ButtonVariant, colors: ReturnType<typeof useAppTheme>['colors']) {
  switch (variant) {
    case 'primary':
      return {
        container: { backgroundColor: colors.primary } as ViewStyle,
        text: { color: colors.textOnPrimary } as TextStyle,
        activityColor: colors.textOnPrimary,
      };
    case 'secondary':
      return {
        container: { backgroundColor: colors.secondary } as ViewStyle,
        text: { color: colors.textOnSecondary } as TextStyle,
        activityColor: colors.textOnSecondary,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        } as ViewStyle,
        text: { color: colors.primary } as TextStyle,
        activityColor: colors.primary,
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' } as ViewStyle,
        text: { color: colors.textPrimary } as TextStyle,
        activityColor: colors.textPrimary,
      };
    case 'danger':
      return {
        container: { backgroundColor: colors.errorBackground } as ViewStyle,
        text: { color: colors.error } as TextStyle,
        activityColor: colors.error,
      };
  }
}

const sizeMap: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  xs: {
    container: { height: 32, paddingHorizontal: spacing[2], borderRadius: borderRadius.sm },
    text: {},
  },
  sm: {
    container: { height: 36, paddingHorizontal: spacing[3], borderRadius: borderRadius.sm },
    text: {},
  },
  md: {
    container: { height: 48, paddingHorizontal: spacing[4], borderRadius: borderRadius.md },
    text: {},
  },
  lg: {
    container: { height: 56, paddingHorizontal: spacing[6], borderRadius: borderRadius.lg },
    text: {},
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

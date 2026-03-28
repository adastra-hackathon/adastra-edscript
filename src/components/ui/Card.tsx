import React, { memo, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, type ViewStyle } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { borderRadius, shadow, spacing } from '../../core/theme';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
}

export const Card = memo(function Card({
  children,
  variant = 'default',
  onPress,
  style,
  padding = 4,
}: CardProps) {
  const { colors, isDark } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  }, [scale]);

  const variantStyle = getVariantStyle(variant, colors);
  const shadowStyle = !isDark && variant === 'elevated' ? shadow.md : undefined;

  const content = (
    <View style={[styles.inner, variantStyle, { padding: spacing[padding] }, shadowStyle, style]}>
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {content}
      </TouchableOpacity>
    </Animated.View>
  );
});

function getVariantStyle(
  variant: CardVariant,
  colors: ReturnType<typeof useAppTheme>['colors'],
): ViewStyle {
  switch (variant) {
    case 'default':
      return { backgroundColor: colors.surface };
    case 'elevated':
      return { backgroundColor: colors.surfaceElevated };
    case 'outlined':
      return { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border };
    case 'flat':
      return { backgroundColor: 'transparent' };
  }
}

const styles = StyleSheet.create({
  inner: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});

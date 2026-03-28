import React, { memo } from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { typography } from '../../core/theme';

type TypographyVariant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Componente presentacional de texto.
 * Aplica automaticamente a variante tipográfica e a cor do tema atual.
 */
export const AppText = memo(function AppText({
  variant = 'bodyMd',
  color,
  align,
  style,
  children,
  ...rest
}: AppTextProps) {
  const { colors } = useAppTheme();

  return (
    <Text
      style={[
        styles.base,
        typography[variant],
        { color: color ?? colors.textPrimary },
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
});

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

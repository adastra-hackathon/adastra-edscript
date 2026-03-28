import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from '../ui/AppText';
import { borderRadius, spacing } from '../../core/theme';

interface Props {
  onLoginPress?: () => void;
  onRegisterPress?: () => void;
}

export const AuthActions = memo(function AuthActions({ onLoginPress, onRegisterPress }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onLoginPress}
        style={[styles.loginBtn, { borderColor: colors.secondary }]}
        activeOpacity={0.7}
      >
        <AppText variant="buttonSm" style={{ color: colors.secondary, letterSpacing: 0.5 }}>
          LOGIN
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onRegisterPress}
        style={[styles.registerBtn, { backgroundColor: colors.secondary }]}
        activeOpacity={0.8}
      >
        <AppText variant="buttonSm" style={{ color: colors.textOnSecondary, letterSpacing: 0.5 }}>
          CADASTRE-SE
        </AppText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  loginBtn: {
    height: 36,
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtn: {
    height: 36,
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { spacing } from '../../core/theme';
import { MenuButton } from './MenuButton';
import { AuthActions } from './AuthActions';
import { UserSection } from './UserSection';

const logo = require('../../assets/images/logos/logo.png');

interface User {
  name?: string;
  avatar?: string;
  balance?: string;
}

interface Props {
  isAuthenticated: boolean;
  user?: User;
  onMenuPress: () => void;
  onLoginPress?: () => void;
  onRegisterPress?: () => void;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
  rightActions?: React.ReactNode;
}

/**
 * TopNav — componente reutilizável de navegação superior.
 * Não contém lógica de autenticação nem acessa stores diretamente.
 * Todo estado vem via props.
 *
 * Uso:
 *   const { isAuthenticated, user } = useAuth();
 *   <TopNav isAuthenticated={isAuthenticated} user={user} onMenuPress={openDrawer} />
 */
export const TopNav = memo(function TopNav({
  isAuthenticated,
  user,
  onMenuPress,
  onLoginPress,
  onRegisterPress,
  onProfilePress,
  onNotificationPress,
  onSettingsPress,
  rightActions,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      {/* Esquerda: menu */}
      <MenuButton onPress={onMenuPress} />

      {/* Logo */}
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      {/* Espaçador */}
      <View style={styles.spacer} />

      {/* Direita: ações customizadas ou padrão por estado */}
      {rightActions ?? (
        isAuthenticated && user ? (
          <UserSection
            user={user}
            onProfilePress={onProfilePress}
            onNotificationPress={onNotificationPress}
            onSettingsPress={onSettingsPress}
          />
        ) : (
          <AuthActions
            onLoginPress={onLoginPress}
            onRegisterPress={onRegisterPress}
          />
        )
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: {
    height: 36,
    width: 120,
  },
  spacer: {
    flex: 1,
  },
});

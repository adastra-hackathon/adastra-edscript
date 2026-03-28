import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { SettingsGroupCard } from './SettingsGroupCard';
import { spacing } from '../../../core/theme';

interface Props {
  title: string;
  children: React.ReactNode;
}

/**
 * Seção de configurações: título uppercase + card agrupador.
 * Puramente apresentacional.
 */
export const SettingsSection = memo(function SettingsSection({ title, children }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <AppText
        variant="caption"
        color={colors.textTertiary}
        style={styles.title}
      >
        {title}
      </AppText>
      <SettingsGroupCard>{children}</SettingsGroupCard>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  title: {
    paddingHorizontal: spacing[1],
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});

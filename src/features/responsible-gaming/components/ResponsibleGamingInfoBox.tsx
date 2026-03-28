import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { borderRadius, spacing } from '../../../core/theme';

interface InfoLine {
  text: string;
  type: 'info' | 'warning' | 'muted';
}

interface Props {
  lines: InfoLine[];
}

export const ResponsibleGamingInfoBox = memo(function ResponsibleGamingInfoBox({ lines }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.infoBackground, borderColor: colors.info }]}>
      <AppText variant="caption" color={colors.info} style={styles.title}>
        ℹ Informação
      </AppText>
      {lines.map((line, i) => (
        <AppText
          key={i}
          variant="caption"
          color={line.type === 'warning' ? colors.warning : line.type === 'info' ? colors.info : colors.textSecondary}
          style={styles.line}
        >
          {line.type !== 'muted' ? '⚠ ' : ''}{line.text}
        </AppText>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    gap: spacing[1],
  },
  title: {
    fontWeight: '600',
    marginBottom: spacing[0.5],
  },
  line: {
    lineHeight: 18,
  },
});

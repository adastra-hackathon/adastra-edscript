import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { spacing } from '../../core/theme';

interface Props {
  marginHorizontal?: number;
  marginVertical?: number;
}

export const Divider = memo(function Divider({ marginHorizontal, marginVertical }: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.divider },
        marginHorizontal !== undefined && { marginHorizontal },
        marginVertical !== undefined && { marginVertical },
      ]}
    />
  );
});

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginHorizontal: spacing[5],
  },
});

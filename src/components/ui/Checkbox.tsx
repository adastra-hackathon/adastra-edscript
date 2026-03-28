import React, { memo, useCallback } from 'react';
import { TouchableOpacity, View, StyleSheet, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from './AppText';
import { borderRadius, spacing } from '../../core/theme';

interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string | React.ReactNode;
  error?: string;
  style?: ViewStyle;
}

export const Checkbox = memo(function Checkbox({ checked, onChange, label, error, style }: CheckboxProps) {
  const { colors } = useAppTheme();

  const handlePress = useCallback(() => {
    onChange(!checked);
  }, [checked, onChange]);

  return (
    <View style={style}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.row}
      >
        <View
          style={[
            styles.box,
            {
              backgroundColor: checked ? colors.secondary : 'transparent',
              borderColor: error ? colors.error : checked ? colors.secondary : colors.border,
            },
          ]}
        >
          {checked && (
            <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
              <Path
                d="M2 6L5 9L10 3"
                stroke={colors.textOnSecondary}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>

        {label && (
          <View style={styles.labelContainer}>
            {typeof label === 'string' ? (
              <AppText variant="bodySm" color={colors.textSecondary}>
                {label}
              </AppText>
            ) : (
              label
            )}
          </View>
        )}
      </TouchableOpacity>

      {error && (
        <AppText variant="caption" color={colors.error} style={styles.errorText}>
          {error}
        </AppText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.xs,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  labelContainer: {
    flex: 1,
  },
  errorText: {
    marginTop: spacing[1],
    marginLeft: spacing[8],
  },
});

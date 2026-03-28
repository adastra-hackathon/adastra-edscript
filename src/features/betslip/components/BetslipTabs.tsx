import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import type { BetslipMode } from '../types/betslip.types';
import { BETSLIP_MODE_LABELS } from '../types/betslip.types';

interface BetslipTabsProps {
  active: BetslipMode;
  onSelect: (mode: BetslipMode) => void;
}

const MODES: BetslipMode[] = ['simple', 'multiple', 'system'];

export const BetslipTabs = memo(function BetslipTabs({ active, onSelect }: BetslipTabsProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      {MODES.map((mode) => {
        const isActive = mode === active;
        return (
          <TouchableOpacity
            key={mode}
            onPress={() => onSelect(mode)}
            activeOpacity={0.75}
            style={styles.tab}
          >
            <AppText
              variant="labelMd"
              color={isActive ? colors.secondary : colors.textTertiary}
              style={[
                styles.label,
                isActive && { fontFamily: 'Inter-Bold' },
              ]}
            >
              {BETSLIP_MODE_LABELS[mode]}
            </AppText>
            {isActive && (
              <View style={[styles.indicator, { backgroundColor: colors.secondary }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[3],
    position: 'relative',
  },
  label: {},
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: spacing[4],
    right: spacing[4],
    height: 2,
    borderRadius: borderRadius.full,
  },
});

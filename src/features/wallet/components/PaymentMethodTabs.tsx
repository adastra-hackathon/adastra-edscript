import React, { memo, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import type { PaymentMethod } from '../types/wallet.types';
import { PAYMENT_METHOD_LABELS } from '../types/wallet.types';

interface PaymentMethodTabsProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const METHODS: PaymentMethod[] = ['pix', 'credit', 'debit', 'boleto'];

export const PaymentMethodTabs = memo(function PaymentMethodTabs({
  selected,
  onSelect,
}: PaymentMethodTabsProps) {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {METHODS.map((method) => {
        const isActive = method === selected;
        return (
          <Tab
            key={method}
            label={PAYMENT_METHOD_LABELS[method]}
            isActive={isActive}
            onPress={() => onSelect(method)}
            activeColor={colors.primary}
            inactiveColor={colors.border}
            activeTextColor={colors.primary}
            inactiveTextColor={colors.textSecondary}
            bgActive={colors.primaryLight}
            bgInactive={colors.backgroundSecondary}
          />
        );
      })}
    </ScrollView>
  );
});

interface TabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
  activeTextColor: string;
  inactiveTextColor: string;
  bgActive: string;
  bgInactive: string;
}

const Tab = memo(function Tab({
  label,
  isActive,
  onPress,
  activeColor,
  inactiveColor,
  activeTextColor,
  inactiveTextColor,
  bgActive,
  bgInactive,
}: TabProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.tab,
        {
          backgroundColor: isActive ? bgActive : bgInactive,
          borderColor: isActive ? activeColor : inactiveColor,
        },
      ]}
    >
      <AppText
        variant="labelMd"
        color={isActive ? activeTextColor : inactiveTextColor}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingVertical: spacing[1],
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
  },
});

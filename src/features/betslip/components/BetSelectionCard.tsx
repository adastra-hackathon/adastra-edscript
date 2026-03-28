import React, { memo, useCallback, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import { StakeInput } from './StakeInput';
import { QuickStakeChips } from './QuickStakeChips';
import type { BetSelection, BetslipMode } from '../types/betslip.types';

interface BetSelectionCardProps {
  selection: BetSelection;
  mode: BetslipMode;
  onRemove: (id: string) => void;
  onStakeChange: (id: string, stake: number) => void;
}

export const BetSelectionCard = memo(function BetSelectionCard({
  selection,
  mode,
  onRemove,
  onStakeChange,
}: BetSelectionCardProps) {
  const { colors } = useAppTheme();
  const [stakeText, setStakeText] = useState(String(selection.stake));

  const handleStakeText = useCallback(
    (text: string) => {
      setStakeText(text);
      const v = parseFloat(text.replace(',', '.'));
      if (!isNaN(v) && v > 0) onStakeChange(selection.id, v);
    },
    [selection.id, onStakeChange],
  );

  const handleChip = useCallback(
    (amount: number) => {
      setStakeText(String(amount));
      onStakeChange(selection.id, amount);
    },
    [selection.id, onStakeChange],
  );

  const handleClearStake = useCallback(() => {
    setStakeText('');
  }, []);

  const hasOddChange = selection.previousOdd != null && selection.previousOdd !== selection.odd;
  const oddWentUp = hasOddChange && selection.odd > (selection.previousOdd ?? 0);
  const oddColor = hasOddChange ? (oddWentUp ? colors.success : colors.error) : colors.secondary;

  const quickValue = QUICK_VALUES.includes(selection.stake) ? selection.stake : undefined;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Top row: checkbox + event info + odd + remove */}
      <View style={styles.topRow}>
        {/* Checkbox visual */}
        <View style={[styles.checkbox, { backgroundColor: colors.secondary, borderColor: colors.secondary }]}>
          <AppText variant="caption" color={colors.textOnSecondary}>✓</AppText>
        </View>

        {/* Event info */}
        <View style={styles.eventInfo}>
          <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
            {selection.eventName}
          </AppText>
          <AppText variant="labelMd" color={colors.textPrimary} numberOfLines={1}>
            {selection.selectionName}
          </AppText>
          <View style={[styles.marketTag, { backgroundColor: colors.surfaceElevated }]}>
            <AppText variant="caption" color={colors.textTertiary}>
              {selection.marketName}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {' '}{selection.selectionName}
            </AppText>
          </View>
        </View>

        {/* Odd */}
        <View style={styles.oddBlock}>
          {hasOddChange && (
            <AppText variant="caption" color={colors.textTertiary} style={styles.prevOdd}>
              {selection.previousOdd?.toFixed(2)}
            </AppText>
          )}
          <AppText variant="h3" color={oddColor}>
            {hasOddChange && (oddWentUp ? '→' : '→')}{selection.odd.toFixed(2)}
          </AppText>
        </View>

        {/* Remove */}
        <TouchableOpacity
          onPress={() => onRemove(selection.id)}
          hitSlop={8}
          style={[styles.removeBtn, { backgroundColor: colors.surfaceElevated }]}
          activeOpacity={0.7}
        >
          <AppText variant="labelSm" color={colors.textTertiary}>×</AppText>
        </TouchableOpacity>
      </View>

      {/* Stake input — only visible in Simples mode */}
      {mode === 'simple' && (
        <View style={styles.stakeBlock}>
          <AppText variant="labelSm" color={colors.textTertiary} style={styles.stakeLabel}>
            Valor
          </AppText>
          <View style={styles.stakeRow}>
            <View style={styles.stakeInput}>
              <StakeInput
                value={stakeText}
                onChangeText={handleStakeText}
                onClear={handleClearStake}
              />
            </View>
            <QuickStakeChips activeValue={quickValue} onSelect={handleChip} />
          </View>
        </View>
      )}
    </View>
  );
});

const QUICK_VALUES = [5, 10, 25, 50];

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  eventInfo: {
    flex: 1,
    gap: spacing[0.5],
  },
  marketTag: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.xs,
    marginTop: spacing[1],
  },
  oddBlock: {
    alignItems: 'flex-end',
    gap: spacing[0.5],
  },
  prevOdd: {
    textDecorationLine: 'line-through',
  },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stakeBlock: {
    gap: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: spacing[3],
  },
  stakeLabel: {},
  stakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  stakeInput: {
    width: 120,
  },
});

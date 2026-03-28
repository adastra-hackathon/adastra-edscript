import React, { memo, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing } from '../../../core/theme';
import { StakeInput } from './StakeInput';
import { QuickStakeChips } from './QuickStakeChips';
import { QUICK_STAKES } from '../types/betslip.types';

interface MultipleStakeSectionProps {
  stake: number;
  onChange: (stake: number) => void;
}

export const MultipleStakeSection = memo(function MultipleStakeSection({
  stake,
  onChange,
}: MultipleStakeSectionProps) {
  const { colors } = useAppTheme();
  const [text, setText] = useState(String(stake));

  const handleText = useCallback(
    (t: string) => {
      setText(t);
      const v = parseFloat(t.replace(',', '.'));
      if (!isNaN(v) && v > 0) onChange(v);
    },
    [onChange],
  );

  const handleChip = useCallback(
    (amount: number) => {
      setText(String(amount));
      onChange(amount);
    },
    [onChange],
  );

  const handleClear = useCallback(() => setText(''), []);

  const quickValue = (QUICK_STAKES as readonly number[]).includes(stake) ? stake : undefined;

  return (
    <View style={styles.wrapper}>
      <AppText variant="labelSm" color={colors.textTertiary} style={styles.label}>
        VALOR DA APOSTA
      </AppText>
      <View style={styles.row}>
        <View style={styles.inputWrap}>
          <StakeInput value={text} onChangeText={handleText} onClear={handleClear} />
        </View>
        <QuickStakeChips activeValue={quickValue} onSelect={handleChip} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[3],
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  inputWrap: {
    width: 120,
  },
});

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import type { PredictionEvent } from '../types/prediction.types';

interface Props {
  event: PredictionEvent;
  selectedOptionId?: string;
  onSelect?: (optionId: string) => void;
  readonly?: boolean;
  showResult?: boolean;
}

export function PredictionEventItem({ event, selectedOptionId, onSelect, readonly, showResult }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppText style={[styles.title, { color: colors.textPrimary }]}>{event.title}</AppText>
      {event.description ? (
        <AppText style={[styles.description, { color: colors.textSecondary }]}>{event.description}</AppText>
      ) : null}

      <View style={styles.options}>
        {event.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = showResult && event.correctOptionId === option.id;
          const isWrong = showResult && isSelected && event.correctOptionId && event.correctOptionId !== option.id;

          let borderColor: string = colors.border;
          let bgColor: string = 'transparent';
          let textColor: string = colors.textPrimary;

          if (isCorrect) {
            borderColor = '#38E67D';
            bgColor = '#38E67D22';
            textColor = '#38E67D';
          } else if (isWrong) {
            borderColor = '#FF6B6B';
            bgColor = '#FF6B6B22';
            textColor = '#FF6B6B';
          } else if (isSelected) {
            borderColor = '#A78BFA';
            bgColor = '#A78BFA22';
            textColor = '#A78BFA';
          }

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => !readonly && onSelect?.(option.id)}
              disabled={readonly}
              style={[styles.option, { borderColor, backgroundColor: bgColor }]}
              activeOpacity={0.7}
            >
              <View style={styles.optionInner}>
                <View style={[styles.radio, { borderColor, backgroundColor: isSelected || isCorrect ? borderColor : 'transparent' }]}>
                  {(isSelected || isCorrect) && <View style={styles.radioInner} />}
                </View>
                <AppText style={[styles.optionText, { color: textColor }]}>{option.label}</AppText>
                {isCorrect && <AppText style={styles.resultIcon}>✓</AppText>}
                {isWrong && <AppText style={styles.resultIcon}>✗</AppText>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: 14, marginBottom: 10 },
  title: { fontSize: 14, fontFamily: 'Inter-SemiBold', marginBottom: 4 },
  description: { fontSize: 12, fontFamily: 'Inter-Regular', marginBottom: 10 },
  options: { gap: 8 },
  option: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  optionInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  optionText: { flex: 1, fontSize: 13, fontFamily: 'Inter-Medium' },
  resultIcon: { fontSize: 14, fontFamily: 'Inter-Bold' },
});

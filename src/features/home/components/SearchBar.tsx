import React, { memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { borderRadius, spacing } from '../../../core/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  activeFilterCount?: number;
  placeholder?: string;
}

export const SearchBar = memo(function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  activeFilterCount = 0,
  placeholder = 'Pesquisar jogos...',
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Search input */}
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder },
        ]}
      >
        <AppText variant="bodyMd" color={colors.textTertiary}>🔍</AppText>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <AppText variant="caption" color={colors.textTertiary}>✕</AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter button */}
      <TouchableOpacity
        onPress={onFilterPress}
        style={[
          styles.filterBtn,
          {
            backgroundColor: activeFilterCount > 0 ? colors.secondary : colors.inputBackground,
            borderColor: activeFilterCount > 0 ? colors.secondary : colors.inputBorder,
          },
        ]}
        accessibilityLabel="Filtros"
      >
        <AppText variant="bodyMd" color={activeFilterCount > 0 ? '#000' : colors.textSecondary}>
          ⚙
        </AppText>
        {activeFilterCount > 0 && (
          <View style={[styles.badge, { backgroundColor: '#000' }]}>
            <AppText variant="caption" color={colors.secondary} style={styles.badgeText}>
              {activeFilterCount}
            </AppText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[4],
    height: 46,
    gap: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
});

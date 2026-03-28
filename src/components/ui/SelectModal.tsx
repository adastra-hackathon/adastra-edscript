import React, { memo, useState, useMemo, useCallback } from 'react';
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from './AppText';
import { spacing, borderRadius } from '../../core/theme';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface Props {
  options: SelectOption[];
  value: string | null;
  onChange: (option: SelectOption) => void;
  placeholder?: string;
  title?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  style?: ViewStyle;
}

export const SelectModal = memo(function SelectModal({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  title = 'Selecionar',
  searchPlaceholder = 'Buscar...',
  loading = false,
  style,
}: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const selected = options.find((o) => o.value === value) ?? null;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.sublabel?.toLowerCase().includes(q),
    );
  }, [options, search]);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onChange(option);
      setVisible(false);
      setSearch('');
    },
    [onChange],
  );

  const handleClose = useCallback(() => {
    setVisible(false);
    setSearch('');
  }, []);

  return (
    <>
      {/* Trigger */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[styles.trigger, { backgroundColor: colors.surface, borderColor: colors.border }, style]}
        activeOpacity={0.7}
      >
        <AppText
          style={[
            styles.triggerText,
            { color: selected ? colors.textPrimary : colors.textTertiary },
          ]}
          numberOfLines={1}
        >
          {loading ? 'Carregando...' : (selected?.label ?? placeholder)}
        </AppText>
        <AppText style={{ color: colors.textTertiary, fontSize: 16 }}>›</AppText>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.background, paddingBottom: insets.bottom + spacing[4] },
            ]}
          >
            {/* Header */}
            <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
              <AppText variant="h2" color={colors.textPrimary}>{title}</AppText>
              <TouchableOpacity onPress={handleClose} activeOpacity={0.7} style={styles.closeBtn}>
                <AppText style={{ color: colors.textSecondary, fontSize: 18 }}>✕</AppText>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <AppText style={{ color: colors.textTertiary, marginRight: spacing[2] }}>🔍</AppText>
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.textTertiary}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
                  <AppText style={{ color: colors.textTertiary, fontSize: 16 }}>✕</AppText>
                </TouchableOpacity>
              )}
            </View>

            {/* List */}
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.option,
                      { borderBottomColor: colors.border },
                      isSelected && { backgroundColor: colors.secondary + '18' },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <AppText style={[styles.optionLabel, { color: isSelected ? colors.secondary : colors.textPrimary }]}>
                        {item.label}
                      </AppText>
                      {item.sublabel && (
                        <AppText style={[styles.optionSublabel, { color: colors.textTertiary }]}>
                          {item.sublabel}
                        </AppText>
                      )}
                    </View>
                    {isSelected && (
                      <AppText style={{ color: colors.secondary, fontSize: 16 }}>✓</AppText>
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <AppText style={{ color: colors.textTertiary, fontSize: 13 }}>
                    Nenhum resultado para "{search}"
                  </AppText>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 48,
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
  },
  closeBtn: { padding: spacing[1] },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing[4],
    marginBottom: spacing[2],
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    paddingVertical: spacing[1],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: { fontSize: 14, fontFamily: 'Inter-Medium' },
  optionSublabel: { fontSize: 11, fontFamily: 'Inter-Regular', marginTop: 2 },
  empty: { padding: spacing[6], alignItems: 'center' },
});

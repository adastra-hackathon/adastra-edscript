import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { borderRadius, spacing } from '../../../core/theme';
import { useGameFiltersQuery } from '../hooks/useGameFiltersQuery';
import type { SortOption } from '../types/games.types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.88;

type LocalFilters = {
  sort: SortOption;
  providers: string[];
  categories: string[];
};

interface Props {
  visible: boolean;
  initialFilters: LocalFilters;
  onApply: (filters: LocalFilters) => void;
  onClose: () => void;
}

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: 'Padrão', value: 'default' },
  { label: 'A-Z', value: 'a-z' },
  { label: 'Novidades', value: 'new' },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

const SectionTitle = memo(function SectionTitle({ label }: { label: string }) {
  const { colors } = useAppTheme();
  return (
    <AppText variant="labelMd" color={colors.textSecondary} style={styles.sectionLabel}>
      {label}
    </AppText>
  );
});

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}

const FilterChip = memo(function FilterChip({ label, selected, onPress, color }: ChipProps) {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          borderColor: selected ? (color ?? colors.secondary) : colors.border,
          backgroundColor: selected ? `${color ?? colors.secondary}22` : 'transparent',
        },
      ]}
    >
      <AppText
        variant="caption"
        color={selected ? (color ?? colors.secondary) : colors.textSecondary}
        style={styles.chipText}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
});

interface CategoryRowProps {
  icon: string | null;
  name: string;
  count: number;
  selected: boolean;
  onPress: () => void;
}

const CategoryRow = memo(function CategoryRow({ icon, name, count, selected, onPress }: CategoryRowProps) {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.categoryRow,
        { borderBottomColor: colors.divider },
        selected && { backgroundColor: `${colors.secondary}11` },
      ]}
    >
      <View style={[styles.categoryIcon, { backgroundColor: selected ? `${colors.secondary}33` : colors.surfaceOverlay }]}>
        <AppText variant="caption">{icon ?? '🎮'}</AppText>
      </View>
      <AppText
        variant="bodyMd"
        color={selected ? colors.secondary : colors.textPrimary}
        style={styles.categoryName}
      >
        {name}
      </AppText>
      <AppText variant="caption" color={colors.textTertiary}>
        {count.toLocaleString()}
      </AppText>
    </TouchableOpacity>
  );
});

// ── Main Sheet ─────────────────────────────────────────────────────────────────

export const GameFiltersSheet = memo(function GameFiltersSheet({
  visible,
  initialFilters,
  onApply,
  onClose,
}: Props) {
  const { colors } = useAppTheme();
  const filtersQuery = useGameFiltersQuery();

  const [local, setLocal] = useState<LocalFilters>(initialFilters);
  const slideAnim = useState(() => new Animated.Value(SHEET_HEIGHT))[0];

  // Guardamos initialFilters num ref para ler o valor atual na abertura
  // sem colocá-lo como dependência do efeito (evita reset ao re-render do pai).
  const initialFiltersRef = useRef(initialFilters);
  initialFiltersRef.current = initialFilters;

  const prevVisibleRef = useRef(false);

  useEffect(() => {
    const wasVisible = prevVisibleRef.current;
    prevVisibleRef.current = visible;

    if (visible && !wasVisible) {
      // Só reseta filtros locais quando o sheet ABRE (visible: false → true)
      setLocal(initialFiltersRef.current);
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }).start();
    } else if (!visible && wasVisible) {
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const toggleProvider = useCallback((slug: string) => {
    setLocal((prev) => ({
      ...prev,
      providers: prev.providers.includes(slug)
        ? prev.providers.filter((s) => s !== slug)
        : [...prev.providers, slug],
    }));
  }, []);

  const toggleCategory = useCallback((slug: string) => {
    setLocal((prev) => ({
      ...prev,
      categories: prev.categories.includes(slug)
        ? prev.categories.filter((s) => s !== slug)
        : [...prev.categories, slug],
    }));
  }, []);

  const handleApply = useCallback(() => {
    onApply(local);
    onClose();
  }, [local, onApply, onClose]);

  const handleReset = useCallback(() => {
    setLocal({ sort: 'default', providers: [], categories: [] });
  }, []);

  if (!visible) return null;

  const providerColorMap: Record<string, string> = {
    evolution: '#1a2e4a',
    ezugi: '#e07b2a',
    'pragmatic-play': '#e02a2a',
    'pg-soft': '#2a5ae0',
    playtech: '#6a2ae0',
    blueprint: '#2a9e6a',
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Handle */}
          <View style={styles.handleRow}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
            <AppText variant="h3" color={colors.textPrimary}>Filtros</AppText>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceOverlay }]}
              accessibilityLabel="Fechar filtros"
            >
              <AppText variant="bodyMd" color={colors.textSecondary}>✕</AppText>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Sort ──────────────────────────────────────────── */}
            <SectionTitle label="Ordenar Por" />
            <View style={styles.chipRow}>
              {SORT_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.value}
                  label={opt.label}
                  selected={local.sort === opt.value}
                  onPress={() => setLocal((p) => ({ ...p, sort: opt.value }))}
                />
              ))}
            </View>

            {/* ── Providers ─────────────────────────────────────── */}
            <SectionTitle label="Lista de Provedores" />
            <View style={styles.chipRow}>
              {filtersQuery.data?.providers.map((p) => (
                <FilterChip
                  key={p.slug}
                  label={p.name}
                  selected={local.providers.includes(p.slug)}
                  onPress={() => toggleProvider(p.slug)}
                  color={providerColorMap[p.slug]}
                />
              ))}
            </View>

            {/* ── Categories ────────────────────────────────────── */}
            <SectionTitle label="Categorias" />
            <View style={[styles.categoryList, { borderTopColor: colors.divider }]}>
              {filtersQuery.data?.categories.map((c) => (
                <CategoryRow
                  key={c.slug}
                  icon={c.icon}
                  name={c.name}
                  count={c.gameCount}
                  selected={local.categories.includes(c.slug)}
                  onPress={() => toggleCategory(c.slug)}
                />
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            <Button
              label="✓  Aplicar Filtros"
              onPress={handleApply}
              variant="secondary"
              size="lg"
              fullWidth
            />
            {(local.providers.length > 0 || local.categories.length > 0 || local.sort !== 'default') && (
              <TouchableOpacity onPress={handleReset} style={styles.resetBtn} activeOpacity={0.7}>
                <AppText variant="bodyMd" color={colors.textSecondary}>Limpar filtros</AppText>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    height: SHEET_HEIGHT,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: spacing[2],
    paddingBottom: spacing[1],
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    gap: spacing[3],
  },
  sectionLabel: {
    marginTop: spacing[2],
    marginBottom: spacing[1],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[1.5],
  },
  chipText: {
    fontWeight: '500',
  },
  categoryList: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3.5],
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing[3],
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[6],
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing[2],
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
});

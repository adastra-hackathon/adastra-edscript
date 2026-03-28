import React, { memo } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { borderRadius, spacing } from '../../../core/theme';
import type { HomeShortcut } from '../types/home.types';

const CIRCLE_SIZE = 72;

interface Props {
  shortcuts: HomeShortcut[];
  onPress?: (shortcut: HomeShortcut) => void;
}

export const HomeShortcuts = memo(function HomeShortcuts({ shortcuts, onPress }: Props) {
  const { colors } = useAppTheme();

  if (shortcuts.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {shortcuts.map((shortcut) => (
        <TouchableOpacity
          key={shortcut.id}
          style={styles.item}
          onPress={() => onPress?.(shortcut)}
          activeOpacity={0.75}
          accessibilityLabel={shortcut.title}
        >
          <View
            style={[styles.circle, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
          >
            {shortcut.imageUrl ? (
              <Image
                source={{ uri: shortcut.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <AppText variant="h3">🎮</AppText>
            )}
          </View>
          <AppText
            variant="caption"
            color={colors.textPrimary}
            style={styles.label}
            numberOfLines={2}
          >
            {shortcut.title}
          </AppText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  item: {
    alignItems: 'center',
    gap: spacing[1.5],
    width: CIRCLE_SIZE + 8,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    textAlign: 'center',
    lineHeight: 14,
  },
});

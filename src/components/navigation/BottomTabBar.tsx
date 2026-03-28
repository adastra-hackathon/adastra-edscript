import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from '../ui/AppText';
import { borderRadius, spacing } from '../../core/theme';

export type TabConfig = {
  name: string;
  label: string;
  icon: (color: string) => React.ReactNode;
};

interface Props {
  tabs: TabConfig[];
}

/**
 * Componente reutilizável de tab bar.
 * Cada tela que quer exibir a tab bar deve renderizá-lo diretamente.
 * Usa useRoute() para detectar a tab ativa e useNavigation() para navegar.
 */
export const BottomTabBar = memo(function BottomTabBar({ tabs }: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: Math.max(insets.bottom, spacing[2]),
        },
      ]}
    >
      {tabs.map((tab) => {
        const isFocused = route.name === tab.name;
        const color = isFocused ? colors.tabBarActive : colors.tabBarInactive;

        const onPress = () => {
          if (!isFocused) {
            navigation.dispatch(CommonActions.navigate({ name: tab.name }));
          }
        };

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
          >
            <View
              style={[
                styles.iconBox,
                isFocused && { borderColor: colors.tabBarActive },
              ]}
            >
              {tab.icon(color)}
            </View>

            <AppText
              variant="caption"
              style={[
                styles.label,
                {
                  color,
                  fontFamily: isFocused ? 'Inter-Bold' : 'Inter-Medium',
                },
              ]}
            >
              {tab.label.toUpperCase()}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: spacing[2],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[1],
  },
  iconBox: {
    width: 52,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
});

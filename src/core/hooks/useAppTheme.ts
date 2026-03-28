import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme';
import { useThemeStore } from '../../store/themeStore';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const { mode } = useThemeStore();

  const resolvedScheme = mode === 'system' ? systemScheme : mode;
  const theme = resolvedScheme === 'dark' ? darkTheme : lightTheme;

  return { theme, isDark: theme.dark, colors: theme.colors };
}

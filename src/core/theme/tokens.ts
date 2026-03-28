import { palette } from './colors';

// ─── Light Theme ────────────────────────────────────────────────────────────

export const lightTheme = {
  dark: false,

  colors: {
    // Brand
    primary: palette.blue500,
    primaryLight: palette.blue100,
    primaryDark: palette.blue700,

    secondary: palette.green500,
    secondaryLight: palette.green100,
    secondaryDark: palette.green700,

    // Gradient endpoints
    gradientStart: palette.blue500,
    gradientEnd: palette.green500,

    // Backgrounds
    background: palette.white,
    backgroundSecondary: palette.gray50,
    backgroundTertiary: palette.gray100,
    backgroundQuaternary: palette.gray100,

    // Surfaces (cards, modals, sheets)
    surface: palette.white,
    surfaceElevated: palette.gray50,
    surfaceOverlay: 'rgba(0,0,0,0.04)',

    // Text
    textPrimary: palette.gray900,
    textSecondary: palette.gray600,
    textTertiary: palette.gray400,
    textInverse: palette.white,
    textOnPrimary: palette.white,
    textOnSecondary: palette.dark300,

    // Borders / Dividers
    border: palette.gray200,
    borderStrong: palette.gray300,
    divider: palette.gray100,

    // Interactive
    interactive: palette.blue500,
    interactiveHover: palette.blue600,
    interactivePressed: palette.blue700,
    interactiveDisabled: palette.gray300,

    // Semantic
    error: palette.error,
    errorBackground: palette.errorLight,
    warning: palette.warning,
    warningBackground: palette.warningLight,
    success: palette.success,
    successBackground: palette.successLight,
    info: palette.info,
    infoBackground: palette.infoLight,

    // Navigation / Tab bar
    tabBarBackground: palette.white,
    tabBarBorder: palette.gray200,
    tabBarActive: palette.blue500,
    tabBarInactive: palette.gray400,

    // Input
    inputBackground: palette.gray50,
    inputBorder: palette.gray300,
    inputBorderFocus: palette.blue500,
    inputPlaceholder: palette.gray400,
    inputText: palette.gray900,

    // Icons
    iconPrimary: palette.gray700,
    iconSecondary: palette.gray400,
    iconActive: palette.blue500,

    // Misc
    skeleton: palette.gray200,
    overlay: 'rgba(0,0,0,0.5)',
    shadow: 'rgba(0,0,0,0.08)',
  },
} as const;

// ─── Dark Theme ─────────────────────────────────────────────────────────────

export const darkTheme = {
  dark: true,

  colors: {
    // Brand (cores de marca ficam iguais no dark)
    primary: palette.blue500,
    primaryLight: palette.blue900,
    primaryDark: palette.blue300,

    secondary: palette.green500,
    secondaryLight: palette.green900,
    secondaryDark: palette.green300,

    // Gradient endpoints
    gradientStart: palette.blue500,
    gradientEnd: palette.green500,

    // Backgrounds (UI escuro da tela de menu)
    background: palette.dark300,        // #0D1829
    backgroundSecondary: palette.dark400,
    backgroundTertiary: palette.dark500,
    backgroundQuaternary: palette.dark600,

    // Surfaces
    surface: palette.dark200,           // #111F35
    surfaceElevated: palette.dark100,   // #162240
    surfaceOverlay: 'rgba(255,255,255,0.04)',

    // Text
    textPrimary: palette.white,
    textSecondary: '#8899B0',
    textTertiary: '#4A6285',
    textInverse: palette.gray900,
    textOnPrimary: palette.white,
    textOnSecondary: palette.dark300,

    // Borders / Dividers
    border: palette.dark50,             // #1A2B3C
    borderStrong: '#253B52',
    divider: '#1A2550',

    // Interactive
    interactive: palette.green500,
    interactiveHover: palette.green400,
    interactivePressed: palette.green600,
    interactiveDisabled: palette.dark50,

    // Semantic
    error: '#FF6B6B',
    errorBackground: 'rgba(239,68,68,0.15)',
    warning: '#FBBF24',
    warningBackground: 'rgba(245,158,11,0.15)',
    success: palette.green500,
    successBackground: 'rgba(56,230,125,0.15)',
    info: '#60A5FA',
    infoBackground: 'rgba(59,130,246,0.15)',

    // Navigation / Tab bar
    tabBarBackground: palette.dark200,
    tabBarBorder: palette.dark50,
    tabBarActive: palette.green500,
    tabBarInactive: '#4A6285',

    // Input
    inputBackground: palette.dark200,
    inputBorder: palette.dark50,
    inputBorderFocus: palette.green500,
    inputPlaceholder: '#4A6285',
    inputText: palette.white,

    // Icons
    iconPrimary: '#8899B0',
    iconSecondary: '#4A6285',
    iconActive: palette.green500,

    // Misc
    skeleton: palette.dark100,
    overlay: 'rgba(0,0,0,0.7)',
    shadow: 'rgba(0,0,0,0.4)',
  },
} as const;

export type Theme = typeof lightTheme;
export type ThemeColors = typeof lightTheme.colors;

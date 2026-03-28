/**
 * AdastraEdscript — Design Tokens: Colors
 * Brand palette: Blue #023397 | Green #38E67D
 */

export const palette = {
  // Brand
  blue100: '#E6EEFF',
  blue200: '#B3C8FF',
  blue300: '#809EFF',
  blue400: '#4D74FF',
  blue500: '#023397', // primary brand blue
  blue600: '#012880',
  blue700: '#011D69',
  blue800: '#011252',
  blue900: '#00083B',

  green100: '#E8FDF3',
  green200: '#B8F7D8',
  green300: '#88F1BD',
  green400: '#58EBA2',
  green500: '#38E67D', // primary brand green
  green600: '#20C963',
  green700: '#169C4C',
  green800: '#0D6F37',
  green900: '#054221',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',

  gray50: '#F8F9FA',
  gray100: '#F1F3F5',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#868E96',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',

  // Dark surfaces (UI escuro da tela de menu)
  dark50: '#1A2B3C',
  dark100: '#162240',
  dark200: '#111F35',
  dark300: '#0D1829',
  dark400: '#0A1020',
  dark500: '#070B17',
  dark600: '#1E2233',

  // Semantic
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  success: '#10B981',
  successLight: '#D1FAE5',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  transparent: 'transparent',
} as const;

export type PaletteKey = keyof typeof palette;

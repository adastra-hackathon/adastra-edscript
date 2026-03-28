export const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
} as const;

export const lineHeight = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

export const typography = {
  // Display
  displayLg: { fontFamily: fontFamily.bold, fontSize: fontSize['5xl'], lineHeight: fontSize['5xl'] * lineHeight.tight },
  displayMd: { fontFamily: fontFamily.bold, fontSize: fontSize['4xl'], lineHeight: fontSize['4xl'] * lineHeight.tight },
  displaySm: { fontFamily: fontFamily.bold, fontSize: fontSize['3xl'], lineHeight: fontSize['3xl'] * lineHeight.snug },

  // Headings
  h1: { fontFamily: fontFamily.bold, fontSize: fontSize['2xl'], lineHeight: fontSize['2xl'] * lineHeight.snug },
  h2: { fontFamily: fontFamily.bold, fontSize: fontSize.xl, lineHeight: fontSize.xl * lineHeight.snug },
  h3: { fontFamily: fontFamily.semiBold, fontSize: fontSize.lg, lineHeight: fontSize.lg * lineHeight.normal },
  h4: { fontFamily: fontFamily.semiBold, fontSize: fontSize.md, lineHeight: fontSize.md * lineHeight.normal },

  // Body
  bodyLg: { fontFamily: fontFamily.regular, fontSize: fontSize.lg, lineHeight: fontSize.lg * lineHeight.normal },
  bodyMd: { fontFamily: fontFamily.regular, fontSize: fontSize.md, lineHeight: fontSize.md * lineHeight.normal },
  bodySm: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, lineHeight: fontSize.sm * lineHeight.normal },

  // Labels
  labelLg: { fontFamily: fontFamily.medium, fontSize: fontSize.md, lineHeight: fontSize.md * lineHeight.normal },
  labelMd: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, lineHeight: fontSize.sm * lineHeight.normal },
  labelSm: { fontFamily: fontFamily.medium, fontSize: fontSize.xs, lineHeight: fontSize.xs * lineHeight.normal },

  // Caption
  caption: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, lineHeight: fontSize.xs * lineHeight.relaxed },

  // Button
  buttonLg: { fontFamily: fontFamily.semiBold, fontSize: fontSize.lg, lineHeight: fontSize.lg * lineHeight.tight },
  buttonMd: { fontFamily: fontFamily.semiBold, fontSize: fontSize.md, lineHeight: fontSize.md * lineHeight.tight },
  buttonSm: { fontFamily: fontFamily.semiBold, fontSize: fontSize.sm, lineHeight: fontSize.sm * lineHeight.tight },
} as const;

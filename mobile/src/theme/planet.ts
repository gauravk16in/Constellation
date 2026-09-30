import { colors, fontFamilies, radius, spacing } from '@/theme';

// Deliberately fixed illustration inks: muted/light and dark-system-bar safe.
export const planetInk = {
  landingWash: '#E0E9E3',
  sky: '#CDE5EF', cloud: '#FAF6EB', distant: '#AAC9AE', grass: '#719D7C',
  grassLight: '#A8BF87', grassDark: '#416B58', earth: '#C79B82', earthDark: '#AB806B',
  river: '#8FBCCB', riverLight: '#D1E4DF', paper: '#FFF5DC', fold: '#E7DCC2',
  coral: '#DA8576', sage: '#9ABA98', blue: '#8EBCD2', ink: colors.onboardingInk,
};
export const bridgeColors = { coral: planetInk.coral, sage: planetInk.sage, sky: planetInk.blue };
export const planetStyles = {
  page: { flex: 1, backgroundColor: colors.onboardingCanvas },
  content: { padding: spacing.six, gap: spacing.four, width: '100%' as const, maxWidth: 620, alignSelf: 'center' as const },
  title: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 28, lineHeight: 34 },
  prompt: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 23, lineHeight: 29 },
  body: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 16, lineHeight: 23 },
  caption: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.semibold, fontSize: 13, lineHeight: 19 },
  label: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 15, lineHeight: 21 },
  row: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: spacing.two, alignItems: 'center' as const },
  section: { gap: spacing.three },
  surface: { backgroundColor: colors.onboardingSurface, borderRadius: radius.medium, borderCurve: 'continuous' as const, padding: spacing.four, gap: spacing.three },
  chip: { minHeight: 48, minWidth: 48, borderRadius: radius.medium, borderCurve: 'continuous' as const, borderWidth: 1, borderColor: colors.onboardingLine, paddingHorizontal: spacing.three, paddingVertical: spacing.three, justifyContent: 'center' as const, alignItems: 'center' as const, backgroundColor: colors.onboardingSurface },
  selected: { borderColor: colors.onboardingInk, backgroundColor: colors.domainMake },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.45 },
} as const;

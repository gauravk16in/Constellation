export const typography = {
  eyebrow: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  display: {
    fontSize: 42,
    lineHeight: 47,
    fontWeight: '700',
    letterSpacing: -1.25,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  label: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
} as const;

export type TypographyVariant = keyof typeof typography;

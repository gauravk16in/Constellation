export { colors } from './colors';
export { spacing } from './spacing';
export { typography, type TypographyVariant } from './typography';

export const fontFamilies = {
  regular: 'Quicksand_400Regular',
  semibold: 'Quicksand_600SemiBold',
  bold: 'Quicksand_700Bold',
} as const;

export const radius = {
  small: 12,
  medium: 20,
  large: 32,
  pill: 9999,
} as const;

export const motion = {
  quick: 140,
  standard: 240,
  deliberate: 420,
} as const;

export const shadows = {
  soft: {
    elevation: 2,
    shadowColor: '#172033',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
} as const;

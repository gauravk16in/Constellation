import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors, radius } from '@/theme';

type ProtectedStarArtworkProps = {
  compact?: boolean;
};

export function ProtectedStarArtwork({ compact = false }: ProtectedStarArtworkProps) {
  return (
    <View
      accessibilityLabel="A warm star held safely inside two protective orbits"
      accessibilityRole="image"
      style={[styles.frame, compact && styles.frameCompact]}
    >
      <Svg height="100%" viewBox="0 0 112 112" width="100%">
        <Circle
          cx="56"
          cy="56"
          fill="none"
          opacity="0.7"
          r="37"
          stroke={colors.onboardingGlow}
          strokeDasharray="2.5 6"
          strokeWidth="2"
        />
        <Path
          d="M28 44 C35 23 61 16 80 31"
          fill="none"
          stroke={colors.onboardingInk}
          strokeLinecap="round"
          strokeWidth="3"
        />
        <Path
          d="M84 39 C92 61 79 87 55 91 C39 94 24 84 19 70"
          fill="none"
          stroke={colors.onboardingInk}
          strokeLinecap="round"
          strokeWidth="3"
        />
        <Circle cx="28" cy="44" fill={colors.onboardingInk} r="3.5" />
        <Circle cx="84" cy="39" fill={colors.onboardingInk} r="3.5" />
        <Path
          d="M56 34 L61 48 L75 53 L61 58 L56 72 L51 58 L37 53 L51 48 Z"
          fill={colors.starlight}
        />
        <Circle cx="56" cy="53" fill={colors.starlight} opacity="0.2" r="24" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.onboardingSurface,
    borderCurve: 'continuous',
    borderRadius: radius.pill,
    boxShadow: '0 16px 38px rgba(56, 38, 70, 0.11)',
    height: 112,
    padding: 4,
    width: 112,
  },
  frameCompact: {
    height: 88,
    width: 88,
  },
});

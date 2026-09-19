import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';

import { colors } from '@/theme';

type RoseSignalArtworkProps = {
  resolved?: boolean;
  size?: 'compact' | 'large';
};

export function RoseSignalArtwork({ resolved = false, size = 'large' }: RoseSignalArtworkProps) {
  const width = size === 'large' ? 304 : 220;
  const signal = resolved ? colors.starlight : colors.onboardingLine;
  const compassNeedle = resolved ? colors.starlight : colors.onboardingInkMuted;

  return (
    <View
      accessibilityLabel={resolved
        ? 'The Nature Compass needle points toward a restored gold Rose Signal and a new star.'
        : 'An incomplete Nature Compass is connected to an unlit rose outline.'}
      accessibilityRole="image"
      style={[styles.frame, { width }]}
    >
      <Svg height="100%" viewBox="0 0 304 214" width="100%">
        <Path d="M100 108C142 81 171 78 208 92" fill="none" stroke={signal} strokeDasharray="4 9" strokeLinecap="round" strokeWidth="3" />

        <G>
          <Circle cx="82" cy="112" fill={colors.onboardingSurface} r="53" stroke={colors.onboardingInk} strokeWidth="3" />
          <Path d="M82 50A62 62 0 0 1 136 83" fill="none" stroke={colors.domainNatureInk} strokeLinecap="round" strokeWidth="5" />
          <Path d="M30 141A62 62 0 0 1 31 84" fill="none" stroke={colors.domainNatureInk} strokeLinecap="round" strokeWidth="5" />
          <Circle cx="82" cy="112" fill={colors.domainNature} r="11" stroke={colors.onboardingInk} strokeWidth="2.5" />
          <Path d={resolved ? 'M82 112L120 88' : 'M82 112L64 85'} fill="none" stroke={compassNeedle} strokeLinecap="round" strokeWidth="6" />
          <Circle cx="82" cy="112" fill={colors.onboardingInk} r="4" />
          <Line x1="82" y1="64" x2="82" y2="72" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="2.5" />
          <Line x1="82" y1="152" x2="82" y2="160" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="2.5" />
        </G>

        <G>
          <Path d="M232 106C231 132 226 153 218 175" fill="none" stroke={colors.domainNatureInk} strokeLinecap="round" strokeWidth="5" />
          <Path d="M227 137C208 127 199 135 202 147C213 151 222 147 227 137Z" fill={colors.domainNature} stroke={colors.domainNatureInk} strokeLinejoin="round" strokeWidth="2.5" />
          <Path d="M225 123L239 115L227 113" fill={colors.onboardingSurface} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="2.5" />
          <Path d="M231 106C211 101 203 88 211 75C221 58 243 59 251 75C269 72 280 89 269 103C262 112 245 114 231 106Z" fill={resolved ? colors.starlight : colors.onboardingSurface} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="3" />
          <Path d="M231 105C222 96 223 83 233 78C244 80 250 89 247 101C243 106 237 108 231 105Z" fill={resolved ? colors.starlightPressed : colors.domainNature} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="2.5" />
          <Circle cx="236" cy="94" fill={colors.onboardingInk} r="3.5" />
        </G>

        {resolved ? (
          <G>
            <Path d="M151 50L156 62L169 63L159 72L162 85L151 78L140 85L143 72L133 63L146 62Z" fill={colors.starlight} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="2" />
            <Line x1="151" y1="37" x2="151" y2="29" stroke={colors.starlight} strokeLinecap="round" strokeWidth="3" />
            <Line x1="174" y1="51" x2="181" y2="47" stroke={colors.starlight} strokeLinecap="round" strokeWidth="3" />
            <Line x1="128" y1="51" x2="121" y2="47" stroke={colors.starlight} strokeLinecap="round" strokeWidth="3" />
          </G>
        ) : null}
      </Svg>
    </View>
  );
}

export function RoseSafetyArtwork() {
  return (
    <View accessibilityLabel="A rose diagram with a flower, two leaves, a stem, and a pointed prickle on the stem." accessibilityRole="image" style={styles.safetyFrame}>
      <Svg height="164" viewBox="0 0 280 164" width="100%">
        <Path d="M143 65C142 98 137 122 130 151" fill="none" stroke={colors.domainNatureInk} strokeLinecap="round" strokeWidth="6" />
        <Path d="M138 109C110 95 96 106 101 124C116 130 132 124 138 109Z" fill={colors.domainNature} stroke={colors.domainNatureInk} strokeLinejoin="round" strokeWidth="3" />
        <Path d="M140 90C164 76 181 86 179 104C163 111 149 105 140 90Z" fill={colors.domainNature} stroke={colors.domainNatureInk} strokeLinejoin="round" strokeWidth="3" />
        <Path d="M139 91L165 78L141 76" fill={colors.onboardingSurface} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="3" />
        <Path d="M143 66C119 62 110 45 119 29C131 7 159 8 168 28C191 24 204 44 190 61C180 73 158 76 143 66Z" fill={colors.onboardingSurface} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="3.5" />
        <Path d="M143 65C132 56 133 40 145 34C159 36 166 48 161 61C156 67 149 69 143 65Z" fill={colors.domainNature} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="3" />
        <Circle cx="148" cy="52" fill={colors.onboardingInk} r="4" />
        <Circle cx="165" cy="79" fill={colors.onboardingSurface} r="12" stroke={colors.onboardingInk} strokeWidth="2.5" />
        <Path d="M159 73L171 85M171 73L159 85" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="2.5" />
        <Path d="M177 79H224" fill="none" stroke={colors.onboardingInkMuted} strokeDasharray="3 6" strokeLinecap="round" strokeWidth="2.5" />
        <Path d="M225 73L238 79L225 85" fill="none" stroke={colors.onboardingInkMuted} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', aspectRatio: 304 / 214, justifyContent: 'center', maxWidth: '100%' },
  safetyFrame: { alignSelf: 'center', maxWidth: 360, width: '100%' },
});

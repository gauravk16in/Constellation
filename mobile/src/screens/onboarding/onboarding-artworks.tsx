import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { OnboardingArtworkFrame } from '@/screens/onboarding/onboarding-artwork-frame';
import { colors, fontFamilies } from '@/theme';

type ArtworkProps = {
  compact?: boolean;
};

function GoldNode({ x, y, radius = 5 }: { x: number; y: number; radius?: number }) {
  return (
    <G>
      <Circle cx={x} cy={y} fill={colors.starlight} opacity={0.2} r={radius * 3.5} />
      <Circle cx={x} cy={y} fill={colors.starlight} r={radius} />
    </G>
  );
}

export function ContextCompassArtwork({ compact = false }: ArtworkProps) {
  return (
    <OnboardingArtworkFrame caption="right now, made for you" compact={compact}>
      <Svg
        accessibilityLabel="Time, weather, interests, and company orbit one recommended moment"
        accessibilityRole="image"
        height="100%"
        viewBox="0 0 260 260"
        width="100%"
      >
        <Circle cx="130" cy="130" fill="none" r="79" stroke={colors.onboardingGlow} strokeDasharray="2 7" strokeWidth="2" />
        <Circle cx="130" cy="130" fill="none" r="48" stroke={colors.onboardingLine} strokeWidth="1.5" />
        <Line stroke={colors.onboardingInk} strokeWidth="2" x1="130" x2="65" y1="130" y2="78" />
        <Line stroke={colors.onboardingInk} strokeWidth="2" x1="130" x2="199" y1="130" y2="72" />
        <Line stroke={colors.onboardingInk} strokeWidth="2" x1="130" x2="207" y1="130" y2="180" />
        <Line stroke={colors.onboardingInk} strokeWidth="2" x1="130" x2="61" y1="130" y2="188" />

        <GoldNode radius={7} x={130} y={130} />
        <Circle cx="65" cy="78" fill={colors.onboardingInk} r="5" />
        <Circle cx="199" cy="72" fill={colors.onboardingInk} r="5" />
        <Circle cx="207" cy="180" fill={colors.onboardingInk} r="5" />
        <Circle cx="61" cy="188" fill={colors.onboardingInk} r="5" />
        <Path d="M130 101 L135 114 L148 119 L135 124 L130 137 L125 124 L112 119 L125 114 Z" fill={colors.starlight} />

        <SvgText fill={colors.onboardingInkMuted} fontFamily={fontFamilies.semibold} fontSize="11" letterSpacing="0.8" x="34" y="60">TIME</SvgText>
        <SvgText fill={colors.onboardingInkMuted} fontFamily={fontFamilies.semibold} fontSize="11" letterSpacing="0.8" x="181" y="53">WEATHER</SvgText>
        <SvgText fill={colors.onboardingInkMuted} fontFamily={fontFamilies.semibold} fontSize="11" letterSpacing="0.8" x="188" y="207">TOGETHER</SvgText>
        <SvgText fill={colors.onboardingInkMuted} fontFamily={fontFamilies.semibold} fontSize="11" letterSpacing="0.8" x="25" y="213">INTERESTS</SvgText>
      </Svg>
    </OnboardingArtworkFrame>
  );
}

export function RealWorldDoorwayArtwork({ compact = false }: ArtworkProps) {
  return (
    <OnboardingArtworkFrame caption="the phone points; you go" compact={compact}>
      <Svg
        accessibilityLabel="A phone opening into paths for making, exploring, helping, and moving"
        accessibilityRole="image"
        height="100%"
        viewBox="0 0 260 260"
        width="100%"
      >
        <Path d="M130 109 L62 55" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="2.2" />
        <Path d="M130 109 L205 48" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="2.2" />
        <Path d="M130 109 L215 137" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="2.2" />
        <Path d="M130 109 L48 143" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="2.2" />
        <GoldNode x={62} y={55} />
        <GoldNode x={205} y={48} />
        <GoldNode x={215} y={137} />
        <GoldNode x={48} y={143} />

        <Rect fill={colors.onboardingInk} height="119" rx="22" width="86" x="87" y="96" />
        <Rect fill={colors.onboardingCanvas} height="87" rx="14" width="70" x="95" y="104" />
        <Rect fill={colors.onboardingSurface} height="5" rx="2.5" width="24" x="118" y="200" />
        <Path d="M130 117 L135 130 L148 135 L135 140 L130 153 L125 140 L112 135 L125 130 Z" fill={colors.starlight} />
        <Path d="M118 169 L130 181 L148 160" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />

        <SvgText fill={colors.onboardingInkMuted} fontFamily={fontFamilies.semibold} fontSize="10.5" letterSpacing="0.7" x="38" y="36">MAKE</SvgText>
        <SvgText fill={colors.onboardingInkMuted} fontFamily={fontFamilies.semibold} fontSize="10.5" letterSpacing="0.7" x="188" y="28">EXPLORE</SvgText>
        <SvgText fill={colors.onboardingInkMuted} fontFamily={fontFamilies.semibold} fontSize="10.5" letterSpacing="0.7" x="211" y="164">HELP</SvgText>
        <SvgText fill={colors.onboardingInkMuted} fontFamily={fontFamilies.semibold} fontSize="10.5" letterSpacing="0.7" x="23" y="170">MOVE</SvgText>
      </Svg>
    </OnboardingArtworkFrame>
  );
}

export function GrowingMapArtwork({ compact = false }: ArtworkProps) {
  return (
    <OnboardingArtworkFrame caption="no two constellations grow the same" compact={compact}>
      <Svg
        accessibilityLabel="A unique constellation branching as experiences are completed"
        accessibilityRole="image"
        height="100%"
        viewBox="0 0 260 260"
        width="100%"
      >
        <Path d="M42 181 L82 153 L118 170 L144 126 L183 139 L218 94" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
        <Path d="M82 153 L67 105 L96 75" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <Path d="M144 126 L145 72 L178 47" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <Path d="M183 139 L211 179" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <Path d="M118 170 L126 211" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />

        <GoldNode radius={6} x={42} y={181} />
        <Circle cx="82" cy="153" fill={colors.onboardingInk} r="4" />
        <GoldNode radius={5} x={118} y={170} />
        <GoldNode radius={6.5} x={144} y={126} />
        <Circle cx="183" cy="139" fill={colors.onboardingInk} r="4" />
        <GoldNode radius={5.5} x={218} y={94} />
        <Circle cx="67" cy="105" fill={colors.onboardingInk} r="3.5" />
        <GoldNode radius={4.5} x={96} y={75} />
        <Circle cx="145" cy="72" fill={colors.onboardingInk} r="3.5" />
        <GoldNode radius={5} x={178} y={47} />
        <Circle cx="211" cy="179" fill={colors.onboardingInk} r="3.5" />
        <Circle cx="126" cy="211" fill={colors.onboardingInk} r="3.5" />
        <Circle cx="144" cy="126" fill="none" opacity="0.6" r="35" stroke={colors.onboardingGlow} strokeDasharray="3 7" strokeWidth="2" />
      </Svg>
    </OnboardingArtworkFrame>
  );
}

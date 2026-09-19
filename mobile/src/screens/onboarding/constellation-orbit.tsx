import Svg, { Circle, G, Line, Path } from 'react-native-svg';

import { OnboardingArtworkFrame } from '@/screens/onboarding/onboarding-artwork-frame';
import { colors } from '@/theme';

type ConstellationOrbitProps = {
  compact?: boolean;
};

function Star({
  x,
  y,
  radius: starRadius = 4,
  active = false,
}: {
  x: number;
  y: number;
  radius?: number;
  active?: boolean;
}) {
  return (
    <G>
      {active ? <Circle cx={x} cy={y} fill={colors.starlight} opacity={0.2} r={starRadius * 4} /> : null}
      <Circle cx={x} cy={y} fill={active ? colors.starlight : colors.onboardingInk} r={starRadius} />
    </G>
  );
}

export function ConstellationOrbit({ compact = false }: ConstellationOrbitProps) {
  return (
    <OnboardingArtworkFrame caption="one curious idea can lead anywhere" compact={compact}>
      <Svg
        accessibilityLabel="A trail of stars growing from one curious idea"
        accessibilityRole="image"
        height="100%"
        viewBox="0 0 260 260"
        width="100%"
      >
        <Circle
          cx="130"
          cy="130"
          fill="none"
          opacity="0.55"
          r="93"
          stroke={colors.onboardingGlow}
          strokeDasharray="3 8"
          strokeWidth="2"
        />
        <Circle
          cx="130"
          cy="130"
          fill="none"
          opacity="0.55"
          r="64"
          stroke={colors.onboardingLine}
          strokeWidth="1.5"
        />
        <Path
          d="M45 188 L83 153 L111 174 L143 118 L177 133 L215 75"
          fill="none"
          stroke={colors.onboardingInk}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        <Line opacity="0.7" stroke={colors.onboardingInk} strokeWidth="2" x1="143" x2="124" y1="118" y2="76" />
        <Line opacity="0.7" stroke={colors.onboardingInk} strokeWidth="2" x1="177" x2="204" y1="133" y2="174" />

        <Star active radius={5} x={45} y={188} />
        <Star radius={3.5} x={83} y={153} />
        <Star active radius={5.5} x={111} y={174} />
        <Star active radius={6} x={143} y={118} />
        <Star radius={4} x={177} y={133} />
        <Star active radius={5.5} x={215} y={75} />
        <Star radius={3.5} x={124} y={76} />
        <Star radius={3.5} x={204} y={174} />
        <Path
          d="M143 46 L148 59 L161 64 L148 69 L143 82 L138 69 L125 64 L138 59 Z"
          fill={colors.starlight}
        />
      </Svg>
    </OnboardingArtworkFrame>
  );
}

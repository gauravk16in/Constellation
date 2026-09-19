import { View, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors, radius } from '@/theme';
import type { CuriosityAreaId } from '@/types/constellation';

export function DomainGlyph({ id, accent = colors.onboardingInk, wash = colors.onboardingCanvas, size = 48, style }: {
  id: CuriosityAreaId; accent?: string; wash?: string; size?: number; style?: ViewStyle;
}) {
  const common = { fill: 'none', stroke: accent, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 1.8 };
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[{
      alignItems: 'center', backgroundColor: wash, borderCurve: 'continuous', borderRadius: radius.small,
      height: size, justifyContent: 'center', width: size,
    }, style]}>
      <Svg height={size * 0.66} viewBox="0 0 32 32" width={size * 0.66}>
        {id === 'nature-noticing' ? <><Path d="M7 23C8 13 15 8 25 7C24 17 19 24 9 25" {...common} /><Path d="M9 24C13 19 17 15 23 10" {...common} /><Circle cx="23.5" cy="9.5" fill={colors.starlight} r="2.5" /></> : null}
        {id === 'make-create' ? <><Path d="M8 23L20 11L24 15L12 27H8V23Z" {...common} /><Path d="M18 13L22 17" {...common} /><Circle cx="24" cy="8" fill={colors.starlight} r="2.5" /></> : null}
        {id === 'talk-connect' ? <><Path d="M6 8H22V20H14L9 24V20H6V8Z" {...common} /><Path d="M11 13H18M11 16H16" {...common} /><Circle cx="24" cy="9" fill={colors.starlight} r="2.5" /></> : null}
        {id === 'test-discover' ? <><Path d="M12 6H20M14 6V13L8 24C7 26 9 27 11 27H21C23 27 25 26 24 24L18 13V6" {...common} /><Path d="M11 21H21" {...common} /><Circle cx="18" cy="19" fill={colors.starlight} r="2.5" /></> : null}
        {id === 'everyday-skills' ? <><Path d="M7 11H25V25H7V11ZM12 11V8H20V11" {...common} /><Path d="M7 17H25M14 17V20H18V17" {...common} /><Circle cx="23.5" cy="9" fill={colors.starlight} r="2.5" /></> : null}
        {id === 'move-brave' ? <><Circle cx="16" cy="7" fill={colors.starlight} r="3" /><Path d="M16 11L13 17L8 20M14 15L20 17L24 13M13 17L11 25M16 18L21 25" {...common} /></> : null}
      </Svg>
    </View>
  );
}

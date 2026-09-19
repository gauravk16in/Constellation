import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { MissionWorldArtwork } from '@/features/missions/mission-world-artwork';
import { getPrimaryInteraction } from '@/features/missions/mission-state';
import { colors, fontFamilies, radius, spacing } from '@/theme';
import type { MissionDefinition } from '@/types/mission';

export function MissionMiniature({ definition, accent, wash, compact = false, resolved = false }: { definition: MissionDefinition; accent: string; wash: string; compact?: boolean; resolved?: boolean }) {
  const size = compact ? 48 : 88;
  const interaction = getPrimaryInteraction(definition);
  if (definition.narrative) {
    return (
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.frame, compact && styles.compact, { borderColor: accent }]}>
        <MissionWorldArtwork accent={accent} artworkId={definition.narrative.artworkId} resolved={resolved} sceneId={definition.narrative.artworkSceneId} signalId={definition.narrative.signalId} size="miniature" wash={wash} />
        {!compact ? <ThemedText selectable={false} style={styles.caption} variant="caption">{definition.previewLabel}</ThemedText> : null}
      </View>
    );
  }
  const signalFill = resolved ? colors.starlight : accent;
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.frame, compact && styles.compact, { borderColor: accent }]}>
      <Svg height={size} viewBox="0 0 88 88" width={size}>
        <Line x1="14" y1="68" x2="74" y2="20" stroke={accent} strokeLinecap="round" strokeOpacity="0.3" strokeWidth="2" />
        {interaction.kind === 'slot-input' ? (
          <><Rect x="18" y="20" width="52" height="12" rx="6" fill={colors.onboardingSurface} stroke={accent} /><Rect x="18" y="39" width="52" height="12" rx="6" fill={colors.onboardingSurface} stroke={accent} /><Rect x="18" y="58" width="52" height="12" rx="6" fill={colors.onboardingSurface} stroke={accent} /></>
        ) : interaction.kind === 'counter' || interaction.kind === 'marker-board' ? (
          <>{[22, 44, 66].map((x, index) => <Circle key={x} cx={x} cy={index === 1 ? 34 : 54} fill={index === 1 ? signalFill : colors.onboardingSurface} r="9" stroke={accent} strokeWidth="2" />)}</>
        ) : interaction.kind === 'ordered-cards' || interaction.kind === 'arrangement' ? (
          <><Rect x="17" y="24" width="22" height="38" rx="8" fill={colors.onboardingSurface} stroke={accent} transform="rotate(-8 28 43)" /><Rect x="33" y="18" width="22" height="42" rx="8" fill={colors.onboardingSurface} stroke={accent} /><Rect x="50" y="25" width="22" height="38" rx="8" fill={signalFill} stroke={accent} transform="rotate(8 61 44)" /></>
        ) : interaction.kind === 'prompt-deck' ? (
          <><Path d="M20 28h42v38H20z" fill={colors.onboardingSurface} stroke={accent} strokeLinejoin="round" /><Path d="M28 20h40v38" fill="none" stroke={accent} strokeLinecap="round" strokeLinejoin="round" /><Circle cx="33" cy="40" r="5" fill={signalFill} /><Line x1="44" y1="40" x2="58" y2="40" stroke={accent} strokeLinecap="round" strokeWidth="2" /></>
        ) : (
          <>{[24, 44, 64].map((x, index) => <Rect key={x} x={x - 9} y={index === 1 ? 24 : 42} width="18" height="18" rx="7" fill={index === 1 ? signalFill : colors.onboardingSurface} stroke={accent} strokeWidth="2" />)}</>
        )}
      </Svg>
      {!compact ? <ThemedText selectable={false} style={styles.caption} variant="caption">{definition.previewLabel}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', backgroundColor: 'rgba(255,249,255,0.66)', borderCurve: 'continuous', borderRadius: radius.medium, borderWidth: 1, flex: 1, flexShrink: 1, gap: spacing.one, maxWidth: 216, minWidth: 0, paddingHorizontal: spacing.three, paddingVertical: spacing.two },
  compact: { borderRadius: radius.small, flex: 0, flexShrink: 0, height: 56, justifyContent: 'center', paddingHorizontal: spacing.one, paddingVertical: spacing.one, width: 56 },
  caption: { color: colors.onboardingInk, fontFamily: fontFamilies.semibold, fontSize: 12, lineHeight: 17, textAlign: 'center' },
});

import { Pressable, StyleSheet, View } from 'react-native';

import { DomainGlyph } from '@/components/domain-glyph';
import { ThemedText } from '@/components/themed-text';
import { getCuriosityArea } from '@/data/catalog/curiosity-areas';
import { getMissionDefinition } from '@/data/catalog/mission-registry';
import { MissionMiniature } from '@/features/missions/mission-miniature';
import { useAppData } from '@/features/app/app-data-provider';
import { colors, fontFamilies, radius, spacing } from '@/theme';
import type { Recommendation } from '@/types/constellation';

type Props = {
  recommendation: Recommendation;
  onPress: () => void;
  variant?: 'featured' | 'compact';
  status?: 'active' | 'completed';
};

export function RecommendationCard({ recommendation, onPress, variant = 'featured', status }: Props) {
  const { profile } = useAppData();
  const { experience, fitReasons } = recommendation;
  const area = getCuriosityArea(experience.domainId)!;
  const definition = getMissionDefinition(experience.id, profile?.ageBand ?? '8-9', experience.version)!;
  const compact = variant === 'compact';
  return (
    <Pressable
      accessibilityHint="Opens the interactive real-world mission"
      accessibilityLabel={`${status === 'active' ? 'Continue mission. ' : status === 'completed' ? 'A star you lit. ' : ''}${experience.title}. ${experience.promise}. ${fitReasons.join(', ')}.`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, compact && styles.compactCard, { backgroundColor: compact ? colors.onboardingSurface : area.wash }, pressed && styles.pressed]}
    >
      {compact ? <MissionMiniature accent={area.accent} compact definition={definition} resolved={status === 'completed'} wash={area.wash} /> : (
        <View style={styles.topRow}>
          <DomainGlyph accent={area.accent} id={experience.domainId} size={44} wash={colors.onboardingSurface} />
          <MissionMiniature accent={area.accent} definition={definition} resolved={status === 'completed'} wash={area.wash} />
        </View>
      )}
      <View style={[styles.copy, compact && styles.compactCopy]}>
        {status ? <View style={styles.statusLine}><View style={[styles.statusDot, status === 'completed' && styles.statusDotCompleted]} /><ThemedText selectable={false} style={styles.statusText} variant="caption">{status === 'active' ? 'Continue your mission' : 'A star you lit'}</ThemedText></View> : null}
        <ThemedText selectable={false} style={[styles.title, compact && styles.compactTitle]} variant="title">{experience.title}</ThemedText>
        {!compact ? <ThemedText selectable={false} style={styles.promise} variant="body">{experience.promise}</ThemedText> : <ThemedText numberOfLines={2} selectable={false} style={styles.compactPreview} variant="caption">{definition.previewLabel}</ThemedText>}
        <View style={styles.reasonRow}>{fitReasons.map((reason) => <ThemedText key={reason} selectable={false} style={styles.reasonText} variant="caption">{reason}</ThemedText>)}</View>
      </View>
      {compact ? <View style={styles.arrowCircle}><ThemedText selectable={false} style={styles.arrow} variant="label">→</ThemedText></View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.four, minHeight: 258, padding: spacing.six },
  compactCard: { alignItems: 'center', borderColor: colors.onboardingLine, borderRadius: radius.medium, borderWidth: 1, flexDirection: 'row', minHeight: 116, padding: spacing.four },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  topRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.four, justifyContent: 'space-between' },
  arrowCircle: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderRadius: radius.pill, height: 44, justifyContent: 'center', width: 44 },
  arrow: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 22 },
  copy: { gap: spacing.two },
  compactCopy: { flex: 1 },
  title: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 25, lineHeight: 30 },
  compactTitle: { fontSize: 18, lineHeight: 23 },
  promise: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 16, lineHeight: 23 },
  compactPreview: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 12, lineHeight: 17 },
  reasonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.two },
  reasonText: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.semibold, fontSize: 11, lineHeight: 16 },
  statusLine: { alignItems: 'center', flexDirection: 'row', gap: spacing.two },
  statusDot: { backgroundColor: colors.onboardingInk, borderRadius: radius.pill, height: 8, width: 8 },
  statusDotCompleted: { backgroundColor: colors.starlight },
  statusText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase' },
});

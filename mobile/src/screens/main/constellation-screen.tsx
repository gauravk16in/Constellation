import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { DomainGlyph } from '@/components/domain-glyph';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { CURIOSITY_AREAS, getCuriosityArea } from '@/data/catalog/curiosity-areas';
import { getExperienceById } from '@/data/catalog/experience-catalog';
import { getMissionDefinition } from '@/data/catalog/mission-registry';
import { useAppData } from '@/features/app/app-data-provider';
import { MissionWorldArtwork } from '@/features/missions/mission-world-artwork';
import { PlanetFinds } from '@/features/planet/planet-finds';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { PATH_GAMES } from '@/features/planet/path-game-engine';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';
import type { ConstellationStar, CuriosityAreaId } from '@/types/constellation';

const REFLECTION_COPY = {
  again: 'I’d try this again',
  learned: 'I noticed something new',
  challenging: 'It was tricky',
  'not-for-me': 'Not for me today',
} as const;

const BRANCHES: Record<CuriosityAreaId, { x: number; y: number }> = {
  'nature-noticing': { x: 48, y: 38 }, 'make-create': { x: 159, y: 22 }, 'talk-connect': { x: 279, y: 55 },
  'test-discover': { x: 282, y: 195 }, 'everyday-skills': { x: 165, y: 235 }, 'move-brave': { x: 43, y: 202 },
};

function hash(value: string) {
  return [...value].reduce((total, character) => total + character.charCodeAt(0), 0);
}

function starPosition(star: ConstellationStar, index: number) {
  const endpoint = BRANCHES[star.primaryDomain];
  const progress = Math.min(0.88, 0.34 + index * 0.16);
  const wobble = (hash(star.positionSeed) % 15) - 7;
  return {
    x: 160 + (endpoint.x - 160) * progress + wobble,
    y: 128 + (endpoint.y - 128) * progress - wobble * 0.4,
  };
}

function ConstellationMap({ stars, onSelect }: { stars: ConstellationStar[]; onSelect: (star: ConstellationStar) => void }) {
  const groupedIndex = new Map<CuriosityAreaId, number>();
  const positioned = stars.map((star) => {
    const index = groupedIndex.get(star.primaryDomain) ?? 0;
    groupedIndex.set(star.primaryDomain, index + 1);
    return { star, ...starPosition(star, index) };
  });

  return (
    <View accessibilityLabel={`${stars.length} ${stars.length === 1 ? 'star' : 'stars'} lit across your Constellation`} accessibilityRole="image" style={styles.map}>
      <Svg height="100%" viewBox="0 0 320 260" width="100%">
        {CURIOSITY_AREAS.map((area) => <Line key={area.id} x1="160" y1="128" x2={BRANCHES[area.id].x} y2={BRANCHES[area.id].y} stroke={colors.onMidnightMuted} strokeDasharray="2 8" strokeLinecap="round" strokeOpacity="0.42" strokeWidth="1.5" />)}
        {CURIOSITY_AREAS.map((area) => <Circle key={`end-${area.id}`} cx={BRANCHES[area.id].x} cy={BRANCHES[area.id].y} fill={colors.midnightRaised} r="6" stroke={colors.onMidnightMuted} strokeOpacity="0.48" />)}
        <Circle cx="160" cy="128" fill={colors.starlight} r="9" />
        <Circle cx="160" cy="128" fill="none" r="18" stroke={colors.starlight} strokeOpacity="0.24" />
      </Svg>
      {positioned.map(({ star, x, y }) => (
        <Pressable
          key={star.id}
          accessibilityHint="Shows the experience behind this star"
          accessibilityLabel={`Star lit ${new Date(star.litAt).toLocaleDateString()}`}
          accessibilityRole="button"
          onPress={() => onSelect(star)}
          style={({ pressed }) => [styles.starButton, { left: `${(x / 320) * 100}%`, top: `${(y / 260) * 100}%` }, pressed && styles.starPressed]}
        ><View style={styles.litStar} /></Pressable>
      ))}
    </View>
  );
}

export function ConstellationScreen() {
  const [origin, setOrigin] = useState<'digital' | 'real-world'>('digital');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { outcomes, profile, stars } = useAppData();
  const [selectedStar, setSelectedStar] = useState<ConstellationStar | null>(null);
  const completedOutcomes = outcomes.filter((outcome) => outcome.state === 'completed');
  const areasExplored = new Set(stars.map((star) => star.primaryDomain)).size;

  const selectedDetail = useMemo(() => {
    if (!selectedStar) return null;
    const outcome = outcomes.find((item) => item.id === selectedStar.outcomeId);
    const experience = outcome ? getExperienceById(outcome.experienceId) : undefined;
    return outcome && experience ? { outcome, experience, area: getCuriosityArea(experience.domainId)!, mission: getMissionDefinition(experience.id, profile?.ageBand ?? '8-9', outcome.catalogVersion) } : null;
  }, [outcomes, profile?.ageBand, selectedStar]);

  const latestCompleted = completedOutcomes[0];
  const latestExperience = latestCompleted ? getExperienceById(latestCompleted.experienceId) : undefined;
  if (!profile) return null;

  return (
    <Screen contentInsetAdjustmentBehavior="automatic" style={styles.screen} contentContainerStyle={[
      styles.content, { paddingBottom: Math.max(insets.bottom + 96, spacing.six), paddingTop: Math.max(insets.top + spacing.six, spacing.eight) },
    ]}>
      <StatusBar style="dark" />
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.main}>
        <ThemedText accessibilityRole="header" style={styles.heading} variant="display">My Finds</ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.two }}>
          <PlanetChoice label="Made here" selected={origin === 'digital'} onPress={() => setOrigin('digital')} />
          <PlanetChoice label="Tried out there" selected={origin === 'real-world'} onPress={() => setOrigin('real-world')} />
        </View>
        {origin === 'digital' ? <PlanetFinds /> : <>
        <View style={styles.intro}>
          <ThemedText style={styles.eyebrow} variant="label">REPORTED REAL-WORLD EXPERIENCES</ThemedText>
          <ThemedText accessibilityRole="header" style={styles.heading} variant="display">Your Constellation.</ThemedText>
          <ThemedText style={styles.body} variant="body">Every gold star comes from an experience in the real world. There is no perfect shape to build.</ThemedText>
        </View>

        <View style={styles.constellationField}>
          <ConstellationMap onSelect={setSelectedStar} stars={stars} />
          {stars.length === 0 ? (
            <View style={styles.emptyMapCopy}>
              <ThemedText style={styles.emptyMapTitle} variant="title">Your first star begins with something you do.</ThemedText>
              <ThemedText style={styles.emptyMapBody} variant="caption">Choose one idea, put the phone down, and come back when it is done.</ThemedText>
              <ActionButton label="Find something to try" onPress={() => router.push('/curiosity')} />
            </View>
          ) : null}
        </View>

        {selectedDetail ? (
          <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={[styles.starDetail, selectedDetail.mission?.narrative && styles.starDetailStory, { backgroundColor: selectedDetail.area.wash }]}> 
            {selectedDetail.mission?.narrative ? <MissionWorldArtwork accent={selectedDetail.area.accent} artworkId={selectedDetail.mission.narrative.artworkId} resolved sceneId={selectedDetail.mission.narrative.artworkSceneId} signalId={selectedDetail.mission.narrative.signalId} size="compact" wash={selectedDetail.area.wash} /> : <DomainGlyph accent={selectedDetail.area.accent} id={selectedDetail.area.id} size={48} wash={colors.onboardingSurface} />}
            <View style={styles.starDetailCopy}>
              <ThemedText style={styles.starDetailTitle} variant="title">{selectedDetail.experience.title}</ThemedText>
              <ThemedText style={styles.starDetailMeta} variant="caption">Star lit {new Date(selectedDetail.outcome.endedAt ?? '').toLocaleDateString()}</ThemedText>
              {selectedDetail.outcome.reflection ? <ThemedText style={styles.starDetailMeta} variant="caption">Reflection: {REFLECTION_COPY[selectedDetail.outcome.reflection]}</ThemedText> : null}
              {selectedDetail.mission?.narrative ? <ThemedText style={styles.starDiscovery} variant="body">{selectedDetail.mission.narrative.knowledgeReveal.body}</ThemedText> : null}
              {selectedDetail.outcome.evidence.length > 0 ? <View style={styles.evidenceSection}><ThemedText accessibilityRole="header" style={styles.evidenceTitle} variant="label">What this star remembers</ThemedText>{selectedDetail.outcome.evidence.map((evidence) => <View key={`${evidence.kind}-${evidence.statement}`} style={styles.evidenceRow}><View style={styles.evidenceDot} /><ThemedText style={styles.evidenceText} variant="body">{evidence.statement}</ThemedText></View>)}</View> : null}
            </View>
          </Animated.View>
        ) : null}

        <View style={styles.statsSurface}>
          {[['Stars lit', stars.length], ['Experiences tried', outcomes.filter((outcome) => outcome.state !== 'skipped').length], ['Areas explored', areasExplored]].map(([label, value], index) => (
            <View key={String(label)} style={[styles.stat, index > 0 && styles.statDivider]}>
              <ThemedText style={styles.statValue} variant="title">{value}</ThemedText>
              <ThemedText style={styles.statLabel} variant="caption">{label}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText accessibilityRole="header" style={styles.sectionTitle} variant="title">What you’ve explored</ThemedText>
          <View style={styles.branchSurface}>
            {CURIOSITY_AREAS.map((area, index) => {
              const count = stars.filter((star) => star.primaryDomain === area.id).length;
              const gameId = area.id === 'make-create' ? 'paper-post' : Object.keys(PATH_GAMES).find((id) => PATH_GAMES[id as keyof typeof PATH_GAMES].area.toLowerCase() === area.title.toLowerCase());
              const invitation = area.id === 'nature-noticing' ? 'Investigate Rose Signal' : gameId ? `Play ${gameId === 'paper-post' ? 'Paper Post' : PATH_GAMES[gameId as keyof typeof PATH_GAMES].title}` : 'Explore this area';
              return <View key={area.id}><View style={styles.branchRow}><DomainGlyph accent={area.accent} id={area.id} size={44} wash={area.wash} /><View style={styles.branchCopy}><ThemedText style={styles.branchTitle} variant="label">{area.title}</ThemedText><ThemedText style={styles.branchMeta} variant="caption">{count === 0 ? invitation : `${count} ${count === 1 ? 'real-world star' : 'real-world stars'} lit`}</ThemedText></View><View style={[styles.branchDot, count > 0 && styles.branchDotLit]} /></View><PlanetChoice label={invitation} onPress={() => router.push(gameId ? `/play/${gameId}` : `/curiosity/${area.id}`)} />{index < CURIOSITY_AREAS.length - 1 ? <View style={styles.divider} /> : null}</View>;
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText accessibilityRole="header" style={styles.sectionTitle} variant="title">Recent discovery</ThemedText>
          <View style={styles.recentLine}>{latestExperience ? <><ThemedText style={styles.recentTitle} variant="label">{latestExperience.title}</ThemedText><ThemedText style={styles.body} variant="body">{latestCompleted?.reflection ? `You said: ${REFLECTION_COPY[latestCompleted.reflection]}.` : 'A real-world experience became a star.'}</ThemedText></> : <ThemedText style={styles.body} variant="body">Nothing here yet—and nothing is late. Begin whenever curiosity finds you.</ThemedText>}</View>
        </View>
        </>}
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.onboardingCanvas },
  content: { backgroundColor: colors.onboardingCanvas, paddingHorizontal: spacing.six },
  main: { alignSelf: 'center', gap: spacing.eight, maxWidth: 620, width: '100%' },
  intro: { gap: spacing.three },
  eyebrow: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 12, letterSpacing: 1.2 },
  heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 38, letterSpacing: -1.1, lineHeight: 42 },
  body: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 16, lineHeight: 24 },
  constellationField: { backgroundColor: colors.midnight, borderCurve: 'continuous', borderRadius: radius.large, minHeight: 390, overflow: 'hidden', padding: spacing.four },
  map: { alignSelf: 'center', aspectRatio: 1.23, maxWidth: 360, position: 'relative', width: '100%' },
  starButton: { alignItems: 'center', height: 44, justifyContent: 'center', marginLeft: -22, marginTop: -22, position: 'absolute', width: 44 },
  starPressed: { opacity: 0.65, transform: [{ scale: 0.92 }] },
  litStar: { backgroundColor: colors.starlight, borderRadius: radius.pill, boxShadow: '0 0 12px rgba(245, 199, 91, 0.5)', height: 12, width: 12 },
  emptyMapCopy: { alignItems: 'center', gap: spacing.three, paddingBottom: spacing.six, paddingHorizontal: spacing.four },
  emptyMapTitle: { color: colors.onMidnight, fontFamily: fontFamilies.bold, fontSize: 21, lineHeight: 27, textAlign: 'center' },
  emptyMapBody: { color: colors.onMidnightMuted, fontFamily: fontFamilies.regular, textAlign: 'center' },
  starDetail: { alignItems: 'center', borderCurve: 'continuous', borderRadius: radius.medium, flexDirection: 'row', gap: spacing.four, padding: spacing.four },
  starDetailStory: { alignItems: 'center', flexDirection: 'column' },
  starDetailCopy: { flex: 1, gap: spacing.one },
  starDetailTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 20, lineHeight: 25 },
  starDetailMeta: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular },
  starDiscovery: { color: colors.onboardingInk, fontFamily: fontFamilies.semibold, fontSize: 14, lineHeight: 21, paddingTop: spacing.two },
  evidenceSection: { borderTopColor: colors.onboardingLine, borderTopWidth: 1, gap: spacing.two, marginTop: spacing.three, paddingTop: spacing.three },
  evidenceTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 15 },
  evidenceRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.two },
  evidenceDot: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 8, marginTop: 7, width: 8 },
  evidenceText: { color: colors.onboardingInk, flex: 1, fontFamily: fontFamilies.semibold, fontSize: 14, lineHeight: 21 },
  statsSurface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.medium, borderWidth: 1, flexDirection: 'row', paddingVertical: spacing.four },
  stat: { alignItems: 'center', flex: 1, gap: spacing.one, paddingHorizontal: spacing.two },
  statDivider: { borderLeftColor: colors.onboardingLine, borderLeftWidth: 1 },
  statValue: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 25, fontVariant: ['tabular-nums'] },
  statLabel: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.semibold, fontSize: 11, textAlign: 'center' },
  section: { gap: spacing.four },
  sectionTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 24 },
  branchSurface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.medium, borderWidth: 1, overflow: 'hidden' },
  branchRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.three, minHeight: 76, paddingHorizontal: spacing.four, paddingVertical: spacing.three },
  branchCopy: { flex: 1, gap: spacing.one },
  branchTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 15 },
  branchMeta: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular },
  branchDot: { borderColor: colors.onboardingLine, borderRadius: radius.pill, borderWidth: 2, height: 12, width: 12 },
  branchDotLit: { backgroundColor: colors.starlight, borderColor: colors.starlight },
  divider: { backgroundColor: colors.onboardingLine, height: 1, marginHorizontal: spacing.four },
  recentLine: { borderTopColor: colors.onboardingLine, borderTopWidth: 1, gap: spacing.two, paddingTop: spacing.four },
  recentTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
});

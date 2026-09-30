import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { DomainGlyph } from '@/components/domain-glyph';
import { RecommendationCard } from '@/components/recommendation-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { getCuriosityArea } from '@/data/catalog/curiosity-areas';
import { EXPERIENCE_CATALOG, getExperienceAgePolicy, getExperienceById } from '@/data/catalog/experience-catalog';
import { FLAGSHIP_EXPERIENCE_IDS, getMissionDefinition } from '@/data/catalog/mission-registry';
import { useAppData } from '@/features/app/app-data-provider';
import { MissionWorldArtwork } from '@/features/missions/mission-world-artwork';
import { recommendExperiences } from '@/features/recommendations/recommendation-engine';
import { useExperienceSession } from '@/features/session/experience-session-provider';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import { canAccessExperience } from '@/features/entitlements/access-policy';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';

const COMPANION_LABELS = { solo: 'by myself', guardian: 'with a grown-up', sibling: 'with a sibling', friend: 'with a friend' } as const;

function nextPreparation(reasons: string[], experienceId: string) {
  if (reasons.includes('guardian-boundary')) return 'Ask your grown-up to review your allowed places.';
  if (reasons.includes('companion') || reasons.includes('guardian-support')) return experienceId === 'rose-signal' ? 'A trusted grown-up needs to join you.' : 'Choose who is here with you.';
  if (reasons.includes('materials')) return experienceId === 'rose-signal' ? 'Find a familiar, grown-up-approved plant.' : 'Check the materials you have.';
  if (reasons.includes('duration')) return 'Choose a little more time.';
  if (reasons.includes('setting')) return 'Choose a place that fits this mission.';
  if (reasons.includes('time-of-day')) return 'Try when the light outside is right.';
  if (reasons.includes('weather')) return 'Wait for weather that fits this mission.';
  return 'Review what fits before you begin.';
}

export function CuriosityAreaScreen() {
  const { domainId } = useLocalSearchParams<{ domainId: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { activeSession, outcomes, profile, stars } = useAppData();
  const { accessTier } = useEntitlements();
  const { context } = useExperienceSession();
  const area = getCuriosityArea(domainId);

  const result = useMemo(() => profile && area ? recommendExperiences({
    profile, context, domainId: area.id, limit: 3, accessTier,
    completedExperienceIds: outcomes.filter((outcome) => outcome.state === 'completed').map((outcome) => outcome.experienceId),
  }) : { recommendations: [], excluded: [] }, [accessTier, area, context, outcomes, profile]);

  if (!profile || !area) {
    return <View style={styles.invalid}><Stack.Title>Curiosity</Stack.Title><ThemedText variant="title">This curiosity path could not be found.</ThemedText><ActionButton label="Back to Curiosity" onPress={() => router.replace('/curiosity')} variant="ink" /></View>;
  }

  const starCount = stars.filter((star) => star.primaryDomain === area.id).length;
  const contextLabel = `${context.availableMinutes} min · ${context.setting} · ${COMPANION_LABELS[context.companions[0]]}`;
  const activeExperience = activeSession ? getExperienceById(activeSession.experienceId) : undefined;
  const activeInArea = activeSession && activeExperience?.domainId === area.id ? activeSession.experienceId : null;
  const activeRecommendation = activeInArea && activeExperience ? {
    experience: activeExperience,
    fitReasons: [`${getExperienceAgePolicy(activeExperience, profile.ageBand).durationMinutes} minutes`, 'saved on this device'],
  } : null;
  const completedIds = new Set(outcomes.filter((outcome) => outcome.state === 'completed').map((outcome) => outcome.experienceId));
  const flagshipExperience = FLAGSHIP_EXPERIENCE_IDS.map((id) => getExperienceById(id)).find((item) => item?.domainId === area.id);
  const flagshipMission = flagshipExperience ? getMissionDefinition(flagshipExperience.id, profile.ageBand, flagshipExperience.version) : undefined;
  const flagshipRestored = flagshipExperience ? completedIds.has(flagshipExperience.id) : false;
  const featuredIds = new Set(result.recommendations.map((item) => item.experience.id));
  const browseMissions = EXPERIENCE_CATALOG.filter((experience) => experience.domainId === area.id && canAccessExperience(experience.id, accessTier) && !featuredIds.has(experience.id));

  return (
    <Screen contentInsetAdjustmentBehavior="automatic" style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + spacing.eight, spacing.eight) }]}>
      <Stack.Title>{area.title}</Stack.Title>
      <StatusBar style="dark" />
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.main}>
        <View style={[styles.hero, { backgroundColor: area.wash }]}>
          <View style={styles.heroTop}>
            <DomainGlyph accent={area.accent} id={area.id} size={52} wash={colors.onboardingSurface} />
            <View style={styles.starPill}><View style={styles.starDot} /><ThemedText style={styles.starPillText} variant="caption">{starCount} {starCount === 1 ? 'star' : 'stars'} lit</ThemedText></View>
          </View>
          <View style={styles.heroLine}><View style={styles.heroCopy}>
            <ThemedText accessibilityRole="header" style={styles.heading} variant="display">{area.title}</ThemedText>
            <ThemedText style={[styles.invitation, { color: area.accent }]} variant="body">{area.invitation}</ThemedText>
          </View>{width >= 500 && flagshipMission?.narrative ? <MissionWorldArtwork accent={area.accent} artworkId={flagshipMission.narrative.artworkId} resolved={flagshipRestored} sceneId={flagshipMission.narrative.artworkSceneId} signalId={flagshipMission.narrative.signalId} size="compact" wash={area.wash} /> : null}</View>
        </View>

        <View style={styles.contextRow}>
          <View style={styles.contextCopy}><ThemedText style={styles.contextEyebrow} variant="caption">WHAT FITS NOW</ThemedText><ThemedText style={styles.contextValue} variant="label">{contextLabel}</ThemedText></View>
          <ActionButton label="Change" onPress={() => router.push({ pathname: '/what-fits', params: { fromArea: area.id } })} variant="ink" />
        </View>

        {area.id === 'make-create' ? <View style={styles.studioInvite}>
          <ThemedText style={styles.contextEyebrow} variant="caption">PLAY WITH AN IDEA</ThemedText>
          <ThemedText accessibilityRole="header" style={styles.sectionTitle} variant="title">Step into the Maker’s Workbench.</ThemedText>
          <ThemedText style={styles.body} variant="body">Draw a shape from memory or connect paper gears, then try a related idea away from the screen.</ThemedText>
          <ActionButton label="Open the workbench" onPress={() => router.push('/maker-studio')} variant="ink" />
        </View> : null}

        {area.id === 'test-discover' ? <View style={styles.studioInvite}>
          <ThemedText style={styles.contextEyebrow} variant="caption">PLAY WITH A NUMBER PATTERN</ThemedText>
          <ThemedText accessibilityRole="header" style={styles.sectionTitle} variant="title">How close is it to ten?</ThemedText>
          <ThemedText style={styles.body} variant="body">Slide a marker to discover the missing gap, then use the pattern in a short Vedic Maths lesson. This is digital practice, separate from the real-world missions below.</ThemedText>
          <ActionButton label="Try Number Patterns" onPress={() => router.push('/number-patterns')} variant="ink" />
        </View> : null}

        <View style={styles.recommendations}>
          <View style={styles.sectionHeading}>
            <ThemedText accessibilityRole="header" style={styles.sectionTitle} variant="title">{activeInArea ? 'Your mission is waiting' : result.recommendations.length ? 'Ready to try' : 'Explore this path'}</ThemedText>
            <ThemedText style={styles.sectionHint} variant="caption">{activeInArea ? 'Return before choosing another direction.' : result.recommendations.length ? 'These missions fit the choices above.' : 'The missions are here. Check what each one needs before going out.'}</ThemedText>
          </View>
          {activeRecommendation ? <RecommendationCard recommendation={activeRecommendation} onPress={() => router.push(`/experience/${activeRecommendation.experience.id}`)} status="active" /> : result.recommendations.length > 0 ? <>
            <RecommendationCard recommendation={result.recommendations[0]} onPress={() => router.push(`/experience/${result.recommendations[0].experience.id}`)} status={completedIds.has(result.recommendations[0].experience.id) ? 'completed' : undefined} />
            {result.recommendations.length > 1 ? <View style={styles.alternatives}><View style={styles.alternativeHeading}><ThemedText style={styles.alternativeTitle} variant="label">Two more directions</ThemedText><ThemedText style={styles.sectionHint} variant="caption">Different ways into the same curiosity area.</ThemedText></View>{result.recommendations.slice(1).map((recommendation) => <RecommendationCard key={recommendation.experience.id} recommendation={recommendation} onPress={() => router.push(`/experience/${recommendation.experience.id}`)} status={completedIds.has(recommendation.experience.id) ? 'completed' : undefined} variant="compact" />)}</View> : null}
          </> : null}
          {!activeInArea && browseMissions.length > 0 ? <View style={styles.browseList}>
            {result.recommendations.length > 0 ? <ThemedText accessibilityRole="header" style={styles.alternativeTitle} variant="label">More missions in this path</ThemedText> : null}
            {browseMissions.map((experience, index) => {
              const reasons = result.excluded.find((item) => item.experienceId === experience.id)?.reasons ?? [];
              const ready = reasons.length === 0;
              return <View key={experience.id} style={[styles.browseRow, index === 0 && styles.firstBrowseRow]}>
                <View style={styles.browseCopy}><ThemedText style={styles.browseTitle} variant="label">{experience.title}</ThemedText><ThemedText style={styles.browsePromise} variant="body">{experience.promise}</ThemedText><ThemedText style={[styles.browseReason, { color: area.accent }]} variant="caption">{ready ? 'Ready with what fits now' : nextPreparation(reasons, experience.id)}</ThemedText></View>
                <ActionButton label={ready ? 'Open' : 'Prepare'} onPress={() => ready ? router.push(`/experience/${experience.id}`) : router.push({ pathname: '/what-fits', params: { fromArea: area.id } })} variant="ink" />
              </View>;
            })}
          </View> : null}
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.onboardingCanvas },
  content: { backgroundColor: colors.onboardingCanvas, paddingHorizontal: spacing.six, paddingTop: spacing.six },
  main: { alignSelf: 'center', gap: spacing.eight, maxWidth: 560, width: '100%' },
  hero: { borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.four, padding: spacing.six },
  heroTop: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  starPill: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.two, minHeight: 40, paddingHorizontal: spacing.three },
  starDot: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 9, width: 9 },
  starPillText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  heroLine: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.three, justifyContent: 'space-between' },
  heroCopy: { flex: 1, gap: spacing.two, minWidth: 180 },
  heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 30, letterSpacing: -0.8, lineHeight: 35 },
  invitation: { fontFamily: fontFamilies.bold, fontSize: 18, lineHeight: 25 },
  body: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 16, lineHeight: 24 },
  contextRow: { alignItems: 'center', borderBottomColor: colors.onboardingLine, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.four, justifyContent: 'space-between', paddingBottom: spacing.six },
  contextCopy: { flex: 1, gap: spacing.one },
  contextEyebrow: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.bold, fontSize: 11, letterSpacing: 1 },
  contextValue: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 15 },
  recommendations: { gap: spacing.four },
  studioInvite: { backgroundColor: colors.onboardingSurface, borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.three, padding: spacing.six },
  alternatives: { borderTopColor: colors.onboardingLine, borderTopWidth: 1, gap: spacing.three, paddingTop: spacing.four },
  alternativeHeading: { gap: spacing.one },
  alternativeTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 16 },
  sectionHeading: { gap: spacing.one },
  sectionTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 25 },
  sectionHint: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular },
  browseList: { backgroundColor: colors.onboardingSurface, borderCurve: 'continuous', borderRadius: radius.medium, gap: spacing.three, padding: spacing.four },
  browseRow: { alignItems: 'center', borderTopColor: colors.onboardingLine, borderTopWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.three, paddingTop: spacing.three },
  firstBrowseRow: { borderTopWidth: 0, paddingTop: 0 },
  browseCopy: { flex: 1, gap: spacing.one, minWidth: 190 },
  browseTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 18 },
  browsePromise: { color: colors.onboardingInkMuted, fontSize: 14, lineHeight: 20 },
  browseReason: { fontFamily: fontFamilies.bold, fontSize: 12 },
  invalid: { backgroundColor: colors.onboardingCanvas, flex: 1, gap: spacing.four, justifyContent: 'center', padding: spacing.six },
});

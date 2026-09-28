import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { DomainGlyph } from '@/components/domain-glyph';
import { RecommendationCard } from '@/components/recommendation-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { getCuriosityArea } from '@/data/catalog/curiosity-areas';
import { getExperienceAgePolicy, getExperienceById } from '@/data/catalog/experience-catalog';
import { FLAGSHIP_EXPERIENCE_IDS, getMissionDefinition } from '@/data/catalog/mission-registry';
import { useAppData } from '@/features/app/app-data-provider';
import { MissionWorldArtwork } from '@/features/missions/mission-world-artwork';
import { recommendExperiences } from '@/features/recommendations/recommendation-engine';
import { useExperienceSession } from '@/features/session/experience-session-provider';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';

const COMPANION_LABELS = { solo: 'by myself', guardian: 'with a grown-up', sibling: 'with a sibling', friend: 'with a friend' } as const;

export function CuriosityAreaScreen() {
  const { domainId } = useLocalSearchParams<{ domainId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { activeSession, outcomes, profile, stars } = useAppData();
  const { accessTier } = useEntitlements();
  const { context } = useExperienceSession();
  const [offset, setOffset] = useState(0);
  const area = getCuriosityArea(domainId);

  const result = useMemo(() => profile && area ? recommendExperiences({
    profile, context, domainId: area.id, limit: 3, offset, accessTier,
    completedExperienceIds: outcomes.filter((outcome) => outcome.state === 'completed').map((outcome) => outcome.experienceId),
  }) : { recommendations: [], excluded: [] }, [accessTier, area, context, offset, outcomes, profile]);

  const alternateResult = useMemo(() => profile && area ? recommendExperiences({
    profile, context, domainId: area.id, limit: 3, offset: offset === 0 ? 3 : 0, accessTier,
    completedExperienceIds: outcomes.filter((outcome) => outcome.state === 'completed').map((outcome) => outcome.experienceId),
  }) : { recommendations: [], excluded: [] }, [accessTier, area, context, offset, outcomes, profile]);

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

  return (
    <Screen contentInsetAdjustmentBehavior="automatic" style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + spacing.eight, spacing.eight) }]}>
      <Stack.Title>{area.title}</Stack.Title>
      <StatusBar style="dark" />
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.main}>
        <View style={[styles.hero, { backgroundColor: area.wash }]}>
          <View style={styles.heroTop}>
            <DomainGlyph accent={area.accent} id={area.id} size={72} wash={colors.onboardingSurface} />
            <View style={styles.starPill}><View style={styles.starDot} /><ThemedText style={styles.starPillText} variant="caption">{starCount} {starCount === 1 ? 'star' : 'stars'} lit</ThemedText></View>
          </View>
          {flagshipMission?.narrative ? <View style={styles.worldPreview}><MissionWorldArtwork accent={area.accent} artworkId={flagshipMission.narrative.artworkId} resolved={flagshipRestored} sceneId={flagshipMission.narrative.artworkSceneId} signalId={flagshipMission.narrative.signalId} size="compact" wash={area.wash} /><ThemedText style={[styles.worldName, { color: area.accent }]} variant="caption">{flagshipMission.narrative.worldName.toUpperCase()}</ThemedText></View> : null}
          <View style={styles.heroCopy}>
            <ThemedText accessibilityRole="header" style={styles.heading} variant="display">{area.title}</ThemedText>
            <ThemedText style={[styles.invitation, { color: area.accent }]} variant="body">{area.invitation}</ThemedText>
            <ThemedText style={styles.body} variant="body">{area.description}</ThemedText>
          </View>
        </View>

        <View style={styles.contextRow}>
          <View style={styles.contextCopy}><ThemedText style={styles.contextEyebrow} variant="caption">WHAT FITS NOW</ThemedText><ThemedText style={styles.contextValue} variant="label">{contextLabel}</ThemedText></View>
          <ActionButton label="Change" onPress={() => router.push('/what-fits')} />
        </View>

        {area.id === 'make-create' ? <View style={styles.studioInvite}>
          <ThemedText style={styles.contextEyebrow} variant="caption">PLAY WITH AN IDEA</ThemedText>
          <ThemedText accessibilityRole="header" style={styles.sectionTitle} variant="title">Step into the Maker’s Workbench.</ThemedText>
          <ThemedText style={styles.body} variant="body">Draw a shape from memory or connect paper gears, then try a related idea away from the screen.</ThemedText>
          <ActionButton label="Open the workbench" onPress={() => router.push('/maker-studio')} variant="ink" />
        </View> : null}

        <View style={styles.recommendations}>
          <View style={styles.sectionHeading}>
            <ThemedText accessibilityRole="header" style={styles.sectionTitle} variant="title">{activeInArea ? 'Your mission is waiting' : 'Try this next'}</ThemedText>
            <ThemedText style={styles.sectionHint} variant="caption">{activeInArea ? 'Return before choosing another direction.' : 'A reviewed mission shaped for what fits now.'}</ThemedText>
          </View>
          {activeRecommendation ? <RecommendationCard recommendation={activeRecommendation} onPress={() => router.push(`/experience/${activeRecommendation.experience.id}`)} status="active" /> : result.recommendations.length > 0 ? <>
            <RecommendationCard recommendation={result.recommendations[0]} onPress={() => router.push(`/experience/${result.recommendations[0].experience.id}`)} status={completedIds.has(result.recommendations[0].experience.id) ? 'completed' : undefined} />
            {result.recommendations.length > 1 ? <View style={styles.alternatives}><View style={styles.alternativeHeading}><ThemedText style={styles.alternativeTitle} variant="label">Two more directions</ThemedText><ThemedText style={styles.sectionHint} variant="caption">Different ways into the same curiosity area.</ThemedText></View>{result.recommendations.slice(1).map((recommendation) => <RecommendationCard key={recommendation.experience.id} recommendation={recommendation} onPress={() => router.push(`/experience/${recommendation.experience.id}`)} status={completedIds.has(recommendation.experience.id) ? 'completed' : undefined} variant="compact" />)}</View> : null}
          </> : (
            <View accessibilityLiveRegion="polite" style={styles.emptySurface}>
              <ThemedText style={styles.emptyTitle} variant="title">No safe match in this path right now.</ThemedText>
              <ThemedText style={styles.body} variant="body">Change what fits right now: time, place, company or materials. Safety boundaries stay in place.</ThemedText>
            </View>
          )}
          {!activeInArea && result.recommendations.length > 0 && alternateResult.recommendations.length > 0 ? (
            <ActionButton label={offset === 0 ? 'Try another set' : 'Show first set'} onPress={() => setOffset((current) => current === 0 ? 3 : 0)} variant="ink" />
          ) : null}
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.onboardingCanvas },
  content: { backgroundColor: colors.onboardingCanvas, paddingHorizontal: spacing.six, paddingTop: spacing.six },
  main: { alignSelf: 'center', gap: spacing.eight, maxWidth: 560, width: '100%' },
  hero: { borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.six, padding: spacing.six },
  heroTop: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  starPill: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.two, minHeight: 40, paddingHorizontal: spacing.three },
  starDot: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 9, width: 9 },
  starPillText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  worldPreview: { alignItems: 'center', alignSelf: 'center', gap: spacing.one, minHeight: 144 },
  worldName: { fontFamily: fontFamilies.bold, fontSize: 11, letterSpacing: 1.1 },
  heroCopy: { gap: spacing.three },
  heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 34, letterSpacing: -0.8, lineHeight: 39 },
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
  emptySurface: { backgroundColor: colors.onboardingSurface, borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.three, padding: spacing.six },
  emptyTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 22, lineHeight: 28 },
  invalid: { backgroundColor: colors.onboardingCanvas, flex: 1, gap: spacing.four, justifyContent: 'center', padding: spacing.six },
});

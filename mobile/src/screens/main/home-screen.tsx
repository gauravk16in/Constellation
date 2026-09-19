import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { RecommendationCard } from '@/components/recommendation-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { getExperienceById } from '@/data/catalog/experience-catalog';
import { useAppData } from '@/features/app/app-data-provider';
import { recommendExperiences } from '@/features/recommendations/recommendation-engine';
import { useExperienceSession } from '@/features/session/experience-session-provider';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';
import type { CompanionId, MaterialGroupId, SettingId } from '@/types/constellation';

function ChoiceChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      aria-checked={selected}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.chipPressed]}
    >
      <ThemedText selectable={false} style={[styles.chipText, selected && styles.chipTextSelected]} variant="caption">{label}</ThemedText>
    </Pressable>
  );
}

const TIME_OPTIONS = [10, 20, 30, 45, 60] as const;
const SETTING_OPTIONS: { id: SettingId; label: string }[] = [
  { id: 'indoors', label: 'Indoors' }, { id: 'outdoors', label: 'Outdoors' }, { id: 'either', label: 'Either' },
];
const COMPANION_OPTIONS: { id: CompanionId; label: string }[] = [
  { id: 'solo', label: 'By myself' }, { id: 'guardian', label: 'Grown-up' }, { id: 'sibling', label: 'Sibling' }, { id: 'friend', label: 'Friend' },
];
const MATERIAL_OPTIONS: { id: MaterialGroupId; label: string }[] = [
  { id: 'nothing-special', label: 'Nothing special' }, { id: 'paper-drawing', label: 'Paper & pens' },
  { id: 'basic-household', label: 'Household things' }, { id: 'outdoor-found', label: 'Fallen nature finds' },
  { id: 'familiar-plant', label: 'A familiar plant' },
];

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { activeSession, outcomes, profile } = useAppData();
  const { accessTier } = useEntitlements();
  const { context, updateContext } = useExperienceSession();
  const [searched, setSearched] = useState(false);
  const activeExperience = activeSession ? getExperienceById(activeSession.experienceId) : undefined;
  const companionOptions = profile?.ageBand === '6-7' ? COMPANION_OPTIONS.filter((option) => option.id === 'guardian') : COMPANION_OPTIONS;

  const result = useMemo(() => profile ? recommendExperiences({
    profile,
    context,
    completedExperienceIds: outcomes.filter((outcome) => outcome.state === 'completed').map((outcome) => outcome.experienceId),
    accessTier,
    limit: 3,
  }) : { recommendations: [], excluded: [] }, [accessTier, context, outcomes, profile]);

  const selectMaterial = (id: MaterialGroupId) => {
    if (id === 'nothing-special') return updateContext({ materialsAvailable: ['nothing-special'] });
    const withoutDefault = context.materialsAvailable.filter((material) => material !== 'nothing-special');
    const next = withoutDefault.includes(id) ? withoutDefault.filter((material) => material !== id) : [...withoutDefault, id];
    updateContext({ materialsAvailable: ['nothing-special', ...next] });
  };

  if (!profile) return null;

  return (
    <Screen contentInsetAdjustmentBehavior="automatic" style={styles.screen} contentContainerStyle={[
      styles.content, { paddingBottom: Math.max(insets.bottom + 96, spacing.six), paddingTop: Math.max(insets.top + spacing.six, spacing.eight) },
    ]}>
      <StatusBar style="dark" />
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.main}>
        <View style={styles.intro}>
          <View style={styles.greetingRow}>
            <ThemedText style={styles.greeting} variant="label">Hi, {profile.nickname}.</ThemedText>
            <Pressable accessibilityHint="Opens a grown-up check before family controls" accessibilityRole="button" onPress={() => router.push('/grown-ups')} style={({ pressed }) => [styles.grownUpButton, pressed && styles.chipPressed]}><ThemedText selectable={false} style={styles.grownUpButtonText} variant="caption">Grown-ups</ThemedText></Pressable>
          </View>
          <ThemedText accessibilityRole="header" style={styles.heading} variant="display">What could you explore today?</ThemedText>
          <ThemedText style={styles.body} variant="body">Tell Constellation what fits right now. You’ll get a few strong ideas, not a feed.</ThemedText>
        </View>

        {activeExperience ? (
          <View style={styles.activeSurface}>
            <ThemedText style={styles.eyebrow} variant="caption">{activeSession?.phase === 'paused' ? 'SAVED FOR LATER' : 'OUT IN THE WORLD'}</ThemedText>
            <ThemedText style={styles.activeTitle} variant="title">{activeExperience.title}</ThemedText>
            <ThemedText style={styles.body} variant="body">{activeSession?.phase === 'return' ? 'You came back. Finish the short reflection when you are ready.' : 'Your choices are saved on this device. Return whenever you are ready.'}</ThemedText>
            <ActionButton label="Return to experience" onPress={() => router.push(`/experience/${activeExperience.id}`)} variant="ink" />
          </View>
        ) : (
          <View style={styles.contextSurface}>
            <View style={styles.surfaceHeadingRow}>
              <View><ThemedText style={styles.sectionTitle} variant="title">What fits right now?</ThemedText><ThemedText style={styles.sectionHint} variant="caption">These choices stay in this session.</ThemedText></View>
              <View accessibilityElementsHidden style={styles.contextStar} />
            </View>
            <View style={styles.contextGroup}>
              <ThemedText style={styles.contextLabel} variant="label">Time available</ThemedText>
              <View accessibilityRole="radiogroup" style={styles.chipRow}>{TIME_OPTIONS.map((minutes) => <ChoiceChip key={minutes} label={`${minutes} min`} onPress={() => updateContext({ availableMinutes: minutes })} selected={context.availableMinutes === minutes} />)}</View>
            </View>
            <View style={styles.contextGroup}>
              <ThemedText style={styles.contextLabel} variant="label">Place</ThemedText>
              <View accessibilityRole="radiogroup" style={styles.chipRow}>{SETTING_OPTIONS.map((option) => <ChoiceChip key={option.id} label={option.label} onPress={() => updateContext({ setting: option.id })} selected={context.setting === option.id} />)}</View>
            </View>
            <View style={styles.contextGroup}>
              <ThemedText style={styles.contextLabel} variant="label">Who is here?</ThemedText>
              <View accessibilityRole="radiogroup" style={styles.chipRow}>{companionOptions.map((option) => <ChoiceChip key={option.id} label={option.label} onPress={() => updateContext({ companions: [option.id] })} selected={context.companions.includes(option.id)} />)}</View>
              {profile.ageBand === '6-7' ? <ThemedText style={styles.sectionHint} variant="caption">For ages 6–7, every mission is read and tried with a grown-up.</ThemedText> : null}
            </View>
            <View style={styles.contextGroup}>
              <ThemedText style={styles.contextLabel} variant="label">Things nearby</ThemedText>
              <View style={styles.chipRow}>{MATERIAL_OPTIONS.map((option) => <ChoiceChip key={option.id} label={option.label} onPress={() => selectMaterial(option.id)} selected={context.materialsAvailable.includes(option.id)} />)}</View>
            </View>
            <ActionButton accessibilityHint="Finds up to three reviewed experiences that fit these choices" label="See today’s ideas" onPress={() => setSearched(true)} variant="ink" />
          </View>
        )}

        {searched && !activeExperience ? (
          <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.results}>
            <View style={styles.resultHeading}>
              <ThemedText accessibilityRole="header" style={styles.sectionTitle} variant="title">Three ways to begin</ThemedText>
              <ThemedText style={styles.sectionHint} variant="caption">Each idea passed the profile and context boundaries first.</ThemedText>
            </View>
            {result.recommendations.length > 0 ? result.recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.experience.id} recommendation={recommendation} onPress={() => router.push(`/experience/${recommendation.experience.id}`)} />
            )) : (
              <View accessibilityLiveRegion="polite" style={styles.emptySurface}>
                <ThemedText style={styles.emptyTitle} variant="title">Nothing safe fits all those choices yet.</ThemedText>
                <ThemedText style={styles.body} variant="body">Try allowing more time, choosing indoors, adding a grown-up, or selecting materials you have nearby.</ThemedText>
              </View>
            )}
          </Animated.View>
        ) : null}
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.onboardingCanvas },
  content: { backgroundColor: colors.onboardingCanvas, paddingHorizontal: spacing.six },
  main: { alignSelf: 'center', gap: spacing.eight, maxWidth: 560, width: '100%' },
  intro: { gap: spacing.three },
  greetingRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.four, justifyContent: 'space-between' },
  greeting: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 16 },
  grownUpButton: { alignItems: 'center', borderColor: colors.onboardingLine, borderRadius: radius.pill, borderWidth: 1, justifyContent: 'center', minHeight: 44, paddingHorizontal: spacing.four },
  grownUpButtonText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 38, letterSpacing: -1.1, lineHeight: 42 },
  body: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 17, lineHeight: 25 },
  contextSurface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, gap: spacing.six, padding: spacing.six },
  surfaceHeadingRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  contextStar: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 14, marginTop: spacing.two, width: 14 },
  sectionTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 24, lineHeight: 29 },
  sectionHint: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, marginTop: spacing.one },
  contextGroup: { gap: spacing.three },
  contextLabel: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.two },
  chip: { backgroundColor: colors.onboardingCanvas, borderColor: colors.onboardingLine, borderRadius: radius.pill, borderWidth: 1, minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.four, paddingVertical: spacing.two },
  chipSelected: { backgroundColor: colors.onboardingInk, borderColor: colors.onboardingInk },
  chipPressed: { opacity: 0.75 },
  chipText: { color: colors.onboardingInk, fontFamily: fontFamilies.semibold },
  chipTextSelected: { color: colors.onboardingSurface },
  activeSurface: { backgroundColor: colors.domainTest, borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.four, padding: spacing.six },
  eyebrow: { color: colors.domainTestInk, fontFamily: fontFamilies.bold, letterSpacing: 1.2 },
  activeTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  results: { gap: spacing.four },
  resultHeading: { gap: spacing.one },
  emptySurface: { backgroundColor: colors.onboardingSurface, borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.three, padding: spacing.six },
  emptyTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 23, lineHeight: 29 },
});

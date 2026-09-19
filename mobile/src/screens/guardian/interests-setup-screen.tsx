import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AccessibilityInfo, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { Screen } from '@/components/screen';
import { SelectionRow } from '@/components/selection-row';
import { ThemedText } from '@/components/themed-text';
import { useSetupDraft } from '@/features/setup/setup-draft-provider';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';
import type { CuriosityAreaId } from '@/types/constellation';

type Interest = {
  description: string;
  id: CuriosityAreaId;
  title: string;
};

const INTERESTS: Interest[] = [
  {
    id: 'nature-noticing',
    title: 'Nature & noticing',
    description: 'Living things, weather, and the world outside',
  },
  {
    id: 'make-create',
    title: 'Make & create',
    description: 'Art, stories, music, and building ideas',
  },
  {
    id: 'talk-connect',
    title: 'Talk & connect',
    description: 'Listening, interviewing, playing, and helping',
  },
  {
    id: 'test-discover',
    title: 'Test & discover',
    description: 'Experiments, questions, and how things work',
  },
  {
    id: 'everyday-skills',
    title: 'Everyday skills',
    description: 'Cooking, fixing, organising, and contributing',
  },
  {
    id: 'move-brave',
    title: 'Move & be brave',
    description: 'Physical skills, games, and new challenges',
  },
];

function InterestGlyph({ id }: { id: CuriosityAreaId }) {
  const common = {
    fill: 'none',
    stroke: colors.onboardingInk,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  };

  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.glyph}>
      <Svg height="30" viewBox="0 0 32 32" width="30">
        {id === 'nature-noticing' ? (
          <>
            <Path d="M7 23C8 13 15 8 25 7C24 17 19 24 9 25" {...common} />
            <Path d="M9 24C13 19 17 15 23 10" {...common} />
            <Circle cx="23.5" cy="9.5" fill={colors.starlight} r="2.5" />
          </>
        ) : null}
        {id === 'make-create' ? (
          <>
            <Path d="M8 23L20 11L24 15L12 27H8V23Z" {...common} />
            <Path d="M18 13L22 17" {...common} />
            <Circle cx="24" cy="8" fill={colors.starlight} r="2.5" />
          </>
        ) : null}
        {id === 'talk-connect' ? (
          <>
            <Path d="M6 8H22V20H14L9 24V20H6V8Z" {...common} />
            <Path d="M11 13H18M11 16H16" {...common} />
            <Circle cx="24" cy="9" fill={colors.starlight} r="2.5" />
          </>
        ) : null}
        {id === 'test-discover' ? (
          <>
            <Path d="M12 6H20M14 6V13L8 24C7 26 9 27 11 27H21C23 27 25 26 24 24L18 13V6" {...common} />
            <Path d="M11 21H21" {...common} />
            <Circle cx="18" cy="19" fill={colors.starlight} r="2.5" />
          </>
        ) : null}
        {id === 'everyday-skills' ? (
          <>
            <Path d="M7 11H25V25H7V11ZM12 11V8H20V11" {...common} />
            <Path d="M7 17H25M14 17V20H18V17" {...common} />
            <Circle cx="23.5" cy="9" fill={colors.starlight} r="2.5" />
          </>
        ) : null}
        {id === 'move-brave' ? (
          <>
            <Circle cx="16" cy="7" fill={colors.starlight} r="3" />
            <Path d="M16 11L13 17L8 20M14 15L20 17L24 13M13 17L11 25M16 18L21 25" {...common} />
          </>
        ) : null}
      </Svg>
    </View>
  );
}

export function InterestsSetupScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useSetupDraft();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const compact = width < 360 || height < 720;

  const [selected, setSelected] = useState<CuriosityAreaId[]>(draft.interests);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = useCallback((id: CuriosityAreaId) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((interestId) => interestId !== id) : [...current, id],
    );
    setError(null);
  }, []);

  const handleContinue = useCallback(() => {
    if (selected.length < 2) {
      const message = 'Choose at least two starting points.';
      setError(message);
      AccessibilityInfo.announceForAccessibility(message);
      return;
    }

    updateDraft({ interests: selected });
    router.push('/support-setup');
  }, [router, selected, updateDraft]);

  const countLabel = `${selected.length} selected`;

  return (
    <Screen
      bounces={false}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: Math.max(insets.bottom + spacing.six, spacing.eight),
          paddingTop: compact ? spacing.four : spacing.six,
        },
      ]}
    >
      <StatusBar style="dark" />

      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)}
        style={styles.main}
      >
        <View style={styles.intro}>
          <View style={styles.eyebrowRow}>
            <View accessibilityElementsHidden style={styles.miniConstellation}>
              <View style={styles.miniStar} />
              <View style={styles.miniLine} />
              <View style={styles.miniNode} />
            </View>
            <ThemedText style={styles.eyebrow} variant="label">
              Starting points, not labels
            </ThemedText>
          </View>
          <ThemedText accessibilityRole="header" style={styles.headline} variant="display">
            What are they curious about?
          </ThemedText>
          <ThemedText style={styles.body} variant="body">
            Choose at least two. Constellation will still invite them to try new things beyond these choices.
          </ThemedText>
        </View>

        <View style={styles.selectionHeader}>
          <ThemedText style={styles.fieldLabel} variant="label">
            Curiosity areas
          </ThemedText>
          <View style={styles.countPill}>
            <ThemedText accessibilityLiveRegion="polite" style={styles.countText} variant="caption">
              {countLabel}
            </ThemedText>
          </View>
        </View>

        <View
          accessibilityLabel="Curiosity areas"
          accessibilityRole="list"
          style={[styles.optionsPanel, error && styles.optionsPanelError]}
        >
          {INTERESTS.map((interest, index) => (
            <View key={interest.id}>
              <SelectionRow
                description={interest.description}
                icon={<InterestGlyph id={interest.id} />}
                onPress={() => toggleInterest(interest.id)}
                selected={selected.includes(interest.id)}
                title={interest.title}
              />
              {index < INTERESTS.length - 1 ? (
                <View accessibilityElementsHidden style={styles.divider} />
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          {error ? (
            <ThemedText accessibilityLiveRegion="polite" style={styles.errorText} variant="caption">
              {error}
            </ThemedText>
          ) : null}
          <ActionButton
            accessibilityHint="Checks the curiosity choices and opens support needs"
            label="Continue setup"
            onPress={handleContinue}
            variant="ink"
          />
          <ThemedText style={styles.nextStep} variant="caption">
            Next: accessibility and support needs.
          </ThemedText>
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.onboardingCanvas,
  },
  content: {
    backgroundColor: colors.onboardingCanvas,
    minHeight: '100%',
    paddingHorizontal: spacing.six,
  },
  main: {
    alignSelf: 'center',
    gap: spacing.six,
    maxWidth: 520,
    width: '100%',
  },
  intro: {
    gap: spacing.three,
  },
  eyebrowRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.two,
  },
  miniConstellation: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 16,
    width: 32,
  },
  miniStar: {
    backgroundColor: colors.starlight,
    borderRadius: radius.pill,
    height: 9,
    width: 9,
  },
  miniLine: {
    backgroundColor: colors.onboardingInk,
    height: 1.5,
    transform: [{ rotate: '-12deg' }],
    width: 14,
  },
  miniNode: {
    backgroundColor: colors.onboardingInk,
    borderRadius: radius.pill,
    height: 5,
    width: 5,
  },
  eyebrow: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  headline: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 34,
    letterSpacing: -0.9,
    lineHeight: 38,
  },
  body: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.regular,
    fontSize: 17,
    lineHeight: 25,
  },
  selectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    lineHeight: 21,
  },
  countPill: {
    backgroundColor: colors.onboardingGlow,
    borderCurve: 'continuous',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.one,
  },
  countText: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
  },
  optionsPanel: {
    backgroundColor: colors.onboardingSurface,
    borderColor: colors.onboardingLine,
    borderCurve: 'continuous',
    borderRadius: radius.medium,
    borderWidth: 1,
    boxShadow: '0 12px 30px rgba(56, 38, 70, 0.07)',
    overflow: 'hidden',
  },
  optionsPanelError: {
    borderColor: colors.danger,
  },
  glyph: {
    alignItems: 'center',
    backgroundColor: colors.onboardingCanvas,
    borderCurve: 'continuous',
    borderRadius: radius.small,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  divider: {
    backgroundColor: colors.onboardingLine,
    height: 1,
    marginHorizontal: spacing.four,
  },
  footer: {
    gap: spacing.three,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fontFamilies.semibold,
  },
  nextStep: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.semibold,
    textAlign: 'center',
  },
});

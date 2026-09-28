import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProtectedStarArtwork } from '@/screens/guardian/protected-star-artwork';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';

type AssuranceIconName = 'device' | 'data' | 'orbit';

type Assurance = {
  body: string;
  icon: AssuranceIconName;
  title: string;
};

const ASSURANCES: Assurance[] = [
  {
    title: 'Private by default',
    body: 'For this first version, family setup and progress stay on this device.',
    icon: 'device',
  },
  {
    title: 'Only what helps',
    body: 'We ask for a nickname and age band—not a legal name, school, photos, voice, or precise location.',
    icon: 'data',
  },
  {
    title: 'Curiosity with guardrails',
    body: 'Experiences come from an authored library with safety checks. There is no open-ended AI chat for children.',
    icon: 'orbit',
  },
];

function AssuranceIcon({ name }: { name: AssuranceIconName }) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.iconFrame}>
      <Svg height="28" viewBox="0 0 28 28" width="28">
        {name === 'device' ? (
          <>
            <Rect
              fill="none"
              height="22"
              rx="5"
              stroke={colors.onboardingInk}
              strokeWidth="2"
              width="16"
              x="6"
              y="3"
            />
            <Path d="M16.5 8 L18 12 L22 13.5 L18 15 L16.5 19 L15 15 L11 13.5 L15 12 Z" fill={colors.starlight} />
          </>
        ) : null}

        {name === 'data' ? (
          <>
            <Circle cx="14" cy="14" fill="none" r="11" stroke={colors.onboardingInk} strokeWidth="2" />
            <Circle cx="8.5" cy="14" fill={colors.onboardingInk} r="2" />
            <Circle cx="14" cy="14" fill={colors.starlight} r="2.8" />
            <Circle cx="19.5" cy="14" fill={colors.onboardingInk} r="2" />
          </>
        ) : null}

        {name === 'orbit' ? (
          <>
            <Path
              d="M5 12 C7 5 16 2 22 7"
              fill="none"
              stroke={colors.onboardingInk}
              strokeLinecap="round"
              strokeWidth="2"
            />
            <Path
              d="M23 11 C25 19 18 25 11 23 C7 22 4 19 3 16"
              fill="none"
              stroke={colors.onboardingInk}
              strokeLinecap="round"
              strokeWidth="2"
            />
            <Path d="M14 7 L16 12 L21 14 L16 16 L14 21 L12 16 L7 14 L12 12 Z" fill={colors.starlight} />
          </>
        ) : null}
      </Svg>
    </View>
  );
}

function AssuranceRow({ assurance, showDivider }: { assurance: Assurance; showDivider: boolean }) {
  return (
    <>
      <View style={styles.assuranceRow}>
        <AssuranceIcon name={assurance.icon} />
        <View style={styles.assuranceCopy}>
          <ThemedText style={styles.assuranceTitle} variant="label">
            {assurance.title}
          </ThemedText>
          <ThemedText style={styles.assuranceBody} variant="caption">
            {assurance.body}
          </ThemedText>
        </View>
      </View>
      {showDivider ? <View accessibilityElementsHidden style={styles.divider} /> : null}
    </>
  );
}

export function GuardianIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const compact = width < 360 || height < 720;

  const continueToProfile = useCallback(() => {
    router.push('/profile-setup');
  }, [router]);

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
        <View style={styles.hero}>
          <ProtectedStarArtwork compact={compact} />
          <View style={styles.introCopy}>
            <ThemedText accessibilityRole="header" style={styles.headline} variant="display">
              Now, a grown-up takes the lead.
            </ThemedText>
            <ThemedText style={styles.body} variant="body">
              Constellation suggests real-world experiences for young people. You choose the safety
              boundaries, permissions, and purchases.
            </ThemedText>
          </View>
        </View>

        <View style={styles.assurancePanel}>
          {ASSURANCES.map((assurance, index) => (
            <AssuranceRow
              assurance={assurance}
              key={assurance.title}
              showDivider={index < ASSURANCES.length - 1}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <ActionButton
            accessibilityHint="Opens local child profile setup"
            label="Continue as guardian"
            onPress={continueToProfile}
            variant="ink"
          />
          <ThemedText style={styles.nextStep} variant="caption">
            Next: create a local child profile.
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
  hero: {
    alignItems: 'center',
    gap: spacing.six,
  },
  introCopy: {
    gap: spacing.three,
    width: '100%',
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
  assurancePanel: {
    backgroundColor: colors.onboardingSurface,
    borderColor: colors.onboardingLine,
    borderCurve: 'continuous',
    borderRadius: radius.medium,
    borderWidth: 1,
    boxShadow: '0 12px 30px rgba(56, 38, 70, 0.07)',
    paddingHorizontal: spacing.four,
  },
  assuranceRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.three,
    paddingVertical: spacing.four,
  },
  iconFrame: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  assuranceCopy: {
    flex: 1,
    gap: spacing.one,
  },
  assuranceTitle: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    lineHeight: 21,
  },
  assuranceBody: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    backgroundColor: colors.onboardingLine,
    height: 1,
    marginLeft: 44,
  },
  footer: {
    gap: spacing.three,
  },
  nextStep: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.semibold,
    textAlign: 'center',
  },
});

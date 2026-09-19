import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { useAppData } from '@/features/app/app-data-provider';
import { useSetupDraft } from '@/features/setup/setup-draft-provider';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';
import type { CompletedSetupDraft } from '@/types/constellation';

function ReadyConstellation({ reduceMotion }: { reduceMotion: boolean }) {
  const branches = [
    { x: 42, y: 32 }, { x: 78, y: 24 }, { x: 98, y: 58 },
    { x: 83, y: 94 }, { x: 45, y: 100 }, { x: 23, y: 68 },
  ];

  return (
    <View
      accessibilityLabel="A gold star growing six constellation branches"
      accessibilityRole="image"
      style={styles.artSurface}
    >
      <Svg height="144" viewBox="0 0 120 120" width="144">
        {branches.map((branch) => (
          <Line
            key={`${branch.x}-${branch.y}`}
            x1="60"
            y1="62"
            x2={branch.x}
            y2={branch.y}
            stroke={colors.onboardingInk}
            strokeLinecap="round"
            strokeOpacity="0.28"
            strokeWidth="2"
          />
        ))}
        {branches.map((branch, index) => (
          <Circle
            key={`node-${branch.x}-${branch.y}`}
            cx={branch.x}
            cy={branch.y}
            fill={index < 2 ? colors.onboardingGlow : colors.onboardingSurface}
            r="5"
            stroke={colors.onboardingInk}
            strokeOpacity="0.38"
            strokeWidth="1.5"
          />
        ))}
        <Circle cx="60" cy="62" fill={colors.onboardingSurface} r="20" />
        <Path d="M60 43L65 56L79 61L65 66L60 80L55 66L41 61L55 56Z" fill={colors.starlight} />
      </Svg>
      {!reduceMotion ? (
        <Animated.View entering={FadeIn.duration(motion.deliberate).delay(motion.standard)} style={styles.artGlow} />
      ) : null}
    </View>
  );
}

export function GettingReadyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { completeSetup } = useAppData();
  const { draft } = useSetupDraft();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async () => {
    if (!draft.ageBand || !draft.nickname || draft.interests.length < 2 || draft.allowedContexts.length === 0) {
      setError('Some setup choices are missing. Review the earlier steps and try again.');
      return;
    }

    setError(null);
    const completedDraft = draft as CompletedSetupDraft;
    try {
      await Promise.all([
        completeSetup(completedDraft),
        new Promise((resolve) => setTimeout(resolve, reduceMotion ? 150 : 900)),
      ]);
      router.replace('/home');
    } catch {
      setError('We couldn’t save the local profile. Your choices are still here, so it is safe to try again.');
    }
  }, [completeSetup, draft, reduceMotion, router]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void save();
  }, [save]);

  return (
    <View style={[styles.screen, { paddingBottom: Math.max(insets.bottom, spacing.six), paddingTop: insets.top + spacing.six }]}> 
      <StatusBar style="dark" />
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.content}>
        <ReadyConstellation reduceMotion={reduceMotion} />
        <View style={styles.copy}>
          <ThemedText accessibilityRole="header" style={styles.heading} variant="display">
            Getting your Constellation ready
          </ThemedText>
          <ThemedText style={styles.body} variant="body">
            Bringing together the things you like, the support that helps, and the places your family chose.
          </ThemedText>
        </View>

        {error ? (
          <View accessibilityLiveRegion="polite" style={styles.errorSurface}>
            <ThemedText style={styles.errorText} variant="caption">{error}</ThemedText>
            <View style={styles.errorActions}>
              <ActionButton label="Try again" onPress={() => void save()} variant="ink" />
              <ActionButton label="Review choices" onPress={() => router.back()} />
            </View>
          </View>
        ) : (
          <View accessibilityLabel="Saving choices on this device" accessibilityRole="progressbar" style={styles.progressTrack}>
            <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(motion.standard)} style={styles.progressFill} />
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: colors.onboardingCanvas,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.six,
  },
  content: {
    alignItems: 'center',
    gap: spacing.eight,
    maxWidth: 480,
    width: '100%',
  },
  artSurface: {
    alignItems: 'center',
    backgroundColor: colors.onboardingSurface,
    borderColor: colors.onboardingLine,
    borderCurve: 'continuous',
    borderRadius: radius.pill,
    borderWidth: 1,
    boxShadow: '0 16px 36px rgba(56, 38, 70, 0.10)',
    height: 184,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 184,
  },
  artGlow: {
    backgroundColor: colors.starlight,
    borderRadius: radius.pill,
    height: 14,
    opacity: 0.16,
    position: 'absolute',
    width: 14,
  },
  copy: { alignItems: 'center', gap: spacing.three },
  heading: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 36,
    letterSpacing: -1,
    lineHeight: 41,
    textAlign: 'center',
  },
  body: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.regular,
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
  },
  progressTrack: {
    backgroundColor: colors.onboardingLine,
    borderRadius: radius.pill,
    height: 6,
    overflow: 'hidden',
    width: 128,
  },
  progressFill: {
    backgroundColor: colors.onboardingInk,
    borderRadius: radius.pill,
    height: '100%',
    width: '72%',
  },
  errorSurface: {
    backgroundColor: colors.onboardingSurface,
    borderColor: colors.onboardingLine,
    borderCurve: 'continuous',
    borderRadius: radius.medium,
    borderWidth: 1,
    gap: spacing.four,
    padding: spacing.four,
    width: '100%',
  },
  errorText: { color: colors.danger, fontFamily: fontFamilies.semibold, textAlign: 'center' },
  errorActions: { gap: spacing.three },
});

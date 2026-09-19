import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProtectedStarArtwork } from '@/screens/guardian/protected-star-artwork';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';

function makeChallenge() {
  const first = 14 + Math.floor(Math.random() * 18);
  const second = 19 + Math.floor(Math.random() * 23);
  return { first, second, answer: first + second };
}

export function GrownUpGateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [challenge] = useState(makeChallenge);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);

  const checkAnswer = () => {
    Keyboard.dismiss();
    if (Number(answer.trim()) !== challenge.answer) {
      setError('That answer does not match. Ask a grown-up to try again.');
      return;
    }
    setError(null);
    router.replace('/grown-up-controls' as never);
  };

  return (
    <Screen
      bounces={false}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + spacing.six, spacing.eight) }]}
    >
      <Stack.Title>For grown-ups</Stack.Title>
      <StatusBar style="dark" />
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.main}>
        <ProtectedStarArtwork compact />
        <View style={styles.copy}>
          <ThemedText accessibilityRole="header" style={styles.heading} variant="display">A grown-up takes it from here.</ThemedText>
          <ThemedText style={styles.body} variant="body">Family plans, purchase recovery, and membership management stay outside the child experience.</ThemedText>
        </View>

        <View style={styles.gateSurface}>
          <ThemedText style={styles.eyebrow} variant="caption">GROWN-UP CHECK</ThemedText>
          <ThemedText style={styles.question} variant="title">What is {challenge.first} + {challenge.second}?</ThemedText>
          <ThemedText style={styles.hint} variant="caption">This helps prevent an accidental visit to purchase controls. It does not verify identity or age.</ThemedText>
          <TextInput
            accessibilityLabel={`Answer to ${challenge.first} plus ${challenge.second}`}
            accessibilityHint="Enter the number, then choose Open grown-up controls"
            aria-describedby={error ? 'grown-up-gate-error' : undefined}
            aria-invalid={Boolean(error)}
            inputMode="numeric"
            keyboardType="number-pad"
            maxLength={4}
            onChangeText={(value) => { setAnswer(value.replace(/\D/g, '')); setError(null); }}
            onSubmitEditing={checkAnswer}
            placeholder="Answer…"
            placeholderTextColor={colors.onboardingInkMuted}
            returnKeyType="done"
            style={styles.input}
            value={answer}
          />
          {error ? <ThemedText accessibilityLiveRegion="polite" id="grown-up-gate-error" style={styles.error} variant="caption">{error}</ThemedText> : null}
          <ActionButton label="Open grown-up controls" onPress={checkAnswer} variant="ink" />
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.onboardingCanvas },
  content: { alignItems: 'center', backgroundColor: colors.onboardingCanvas, paddingHorizontal: spacing.six, paddingTop: spacing.six },
  main: { alignItems: 'center', gap: spacing.six, maxWidth: 520, width: '100%' },
  copy: { gap: spacing.three, width: '100%' },
  heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 34, letterSpacing: -0.9, lineHeight: 39 },
  body: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 17, lineHeight: 25 },
  gateSurface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, gap: spacing.four, padding: spacing.six, width: '100%' },
  eyebrow: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 11, letterSpacing: 1.1 },
  question: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 25, lineHeight: 31 },
  hint: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 14, lineHeight: 20 },
  input: { backgroundColor: colors.onboardingCanvas, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.medium, borderWidth: 1, color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 24, minHeight: 58, paddingHorizontal: spacing.four },
  error: { color: colors.danger, fontFamily: fontFamilies.semibold, lineHeight: 20 },
});

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
import type { AllowedContextId } from '@/types/constellation';

type AllowedContext = {
  description: string;
  id: AllowedContextId;
  title: string;
};

const ALLOWED_CONTEXTS: AllowedContext[] = [
  {
    id: 'home',
    title: 'Inside home',
    description: 'Rooms and indoor spaces your family allows',
  },
  {
    id: 'yard',
    title: 'Yard or shared outdoor space',
    description: 'A garden, courtyard, porch, or similar family-approved area',
  },
  {
    id: 'neighbourhood',
    title: 'Nearby neighbourhood',
    description: 'Familiar nearby places under your family’s rules',
  },
  {
    id: 'public-place',
    title: 'Public places',
    description: 'Parks, libraries, museums, and community spaces',
  },
];

function ContextGlyph({ id }: { id: AllowedContextId }) {
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
        {id === 'home' ? (
          <>
            <Path d="M6 15L16 7L26 15V26H6V15Z" {...common} />
            <Path d="M13 26V19H19V26" {...common} />
            <Circle cx="23.5" cy="10" fill={colors.starlight} r="2.7" />
          </>
        ) : null}
        {id === 'yard' ? (
          <>
            <Path d="M6 25V16M12 25V16M18 25V16M24 25V16M5 19H25M5 23H25" {...common} />
            <Path d="M18 13C18 8 22 6 26 6C26 10 23 13 18 13Z" {...common} />
            <Circle cx="26" cy="7" fill={colors.starlight} r="2.4" />
          </>
        ) : null}
        {id === 'neighbourhood' ? (
          <>
            <Path d="M4 16L10 11L16 16V25H4V16ZM17 13L22 9L28 14V25H17V13Z" {...common} />
            <Path d="M10 25C13 21 16 20 20 25" {...common} />
            <Circle cx="16" cy="20" fill={colors.starlight} r="2.6" />
          </>
        ) : null}
        {id === 'public-place' ? (
          <>
            <Path d="M5 12L16 7L27 12H5ZM7 25H25M9 13V23M14 13V23M19 13V23M24 13V23" {...common} />
            <Circle cx="24.5" cy="8" fill={colors.starlight} r="2.6" />
          </>
        ) : null}
      </Svg>
    </View>
  );
}

function BoundaryNote() {
  return (
    <View style={styles.boundaryNote}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.noteIcon}>
        <Svg height="28" viewBox="0 0 32 32" width="28">
          <Path
            d="M6 18C9 9 22 7 27 15C30 21 23 27 16 25C10 24 7 21 8 16"
            fill="none"
            stroke={colors.onboardingInk}
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <Circle cx="17" cy="16" fill={colors.starlight} r="3.2" />
        </Svg>
      </View>
      <View style={styles.noteCopy}>
        <ThemedText style={styles.noteTitle} variant="label">
          Categories, not coordinates
        </ThemedText>
        <ThemedText style={styles.noteBody} variant="caption">
          We don’t ask for an address or precise location. A place choice never means going there alone—each experience still says who must be present.
        </ThemedText>
      </View>
    </View>
  );
}

export function ContextsSetupScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useSetupDraft();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const compact = width < 360 || height < 720;
  const [selected, setSelected] = useState<AllowedContextId[]>(draft.allowedContexts);
  const [error, setError] = useState<string | null>(null);

  const toggleContext = useCallback((id: AllowedContextId) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((contextId) => contextId !== id) : [...current, id],
    );
    setError(null);
  }, []);

  const handleContinue = useCallback(() => {
    if (selected.length === 0) {
      const message = 'Choose at least one allowed setting.';
      setError(message);
      AccessibilityInfo.announceForAccessibility(message);
      return;
    }

    updateDraft({ allowedContexts: selected });
    router.push('/getting-ready');
  }, [router, selected, updateDraft]);

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
            <View accessibilityElementsHidden style={styles.boundaryPath}>
              <View style={styles.pathStar} />
              <View style={styles.pathLine} />
              <View style={styles.pathGate} />
            </View>
            <ThemedText style={styles.eyebrow} variant="label">
              Boundaries before suggestions
            </ThemedText>
          </View>
          <ThemedText accessibilityRole="header" style={styles.headline} variant="display">
            Where may experiences happen?
          </ThemedText>
          <ThemedText style={styles.body} variant="body">
            Choose the kinds of places your family is comfortable with. Constellation will only suggest experiences that fit these boundaries.
          </ThemedText>
        </View>

        <View style={styles.selectionHeader}>
          <ThemedText style={styles.fieldLabel} variant="label">
            Allowed settings
          </ThemedText>
          <View style={styles.countPill}>
            <ThemedText accessibilityLiveRegion="polite" style={styles.countText} variant="caption">
              {selected.length} selected
            </ThemedText>
          </View>
        </View>

        <View
          accessibilityLabel="Allowed settings"
          accessibilityRole="list"
          style={[styles.optionsPanel, error && styles.optionsPanelError]}
        >
          {ALLOWED_CONTEXTS.map((context, index) => (
            <View key={context.id}>
              <SelectionRow
                description={context.description}
                icon={<ContextGlyph id={context.id} />}
                onPress={() => toggleContext(context.id)}
                selected={selected.includes(context.id)}
                title={context.title}
              />
              {index < ALLOWED_CONTEXTS.length - 1 ? (
                <View accessibilityElementsHidden style={styles.divider} />
              ) : null}
            </View>
          ))}
        </View>

        {error ? (
          <ThemedText accessibilityLiveRegion="polite" style={styles.errorText} variant="caption">
            {error}
          </ThemedText>
        ) : null}

        <BoundaryNote />

        <View style={styles.footer}>
          <ActionButton
            accessibilityHint="Checks the allowed settings and gets the local profile ready"
            label="Finish setup"
            onPress={handleContinue}
            variant="ink"
          />
          <ThemedText style={styles.nextStep} variant="caption">
            Next: get their Constellation ready.
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
  boundaryPath: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 16,
    width: 36,
  },
  pathStar: {
    backgroundColor: colors.starlight,
    borderRadius: radius.pill,
    height: 9,
    width: 9,
  },
  pathLine: {
    backgroundColor: colors.onboardingInk,
    height: 1.5,
    width: 13,
  },
  pathGate: {
    borderColor: colors.onboardingInk,
    borderRadius: 3,
    borderWidth: 1.5,
    height: 12,
    width: 10,
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
    fontVariant: ['tabular-nums'],
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
  errorText: {
    color: colors.danger,
    fontFamily: fontFamilies.semibold,
  },
  boundaryNote: {
    alignItems: 'flex-start',
    backgroundColor: colors.onboardingGlow,
    borderCurve: 'continuous',
    borderRadius: radius.medium,
    flexDirection: 'row',
    gap: spacing.three,
    padding: spacing.four,
  },
  noteIcon: {
    alignItems: 'center',
    backgroundColor: colors.onboardingSurface,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  noteCopy: {
    flex: 1,
    gap: spacing.one,
  },
  noteTitle: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  noteBody: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.regular,
    lineHeight: 19,
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

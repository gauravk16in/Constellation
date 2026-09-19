import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { Screen } from '@/components/screen';
import { SelectionRow } from '@/components/selection-row';
import { ThemedText } from '@/components/themed-text';
import { useSetupDraft } from '@/features/setup/setup-draft-provider';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';
import type { SupportNeedId } from '@/types/constellation';

type SupportNeed = {
  description: string;
  id: SupportNeedId;
  title: string;
};

const SUPPORT_NEEDS: SupportNeed[] = [
  {
    id: 'clearer-steps',
    title: 'Clearer, shorter steps',
    description: 'Break instructions into smaller, simpler pieces',
  },
  {
    id: 'lower-sensory',
    title: 'Quiet, lower-sensory ideas',
    description: 'Prefer calmer activities with less noise or sensory input',
  },
  {
    id: 'low-movement',
    title: 'Seated or low-movement choices',
    description: 'Offer ways to take part with less standing or moving',
  },
  {
    id: 'flexible-pacing',
    title: 'More time and flexible pacing',
    description: 'Allow pauses and avoid rushed steps',
  },
  {
    id: 'guardian-alongside',
    title: 'A grown-up alongside',
    description: 'Prefer experiences designed for guardian participation',
  },
];

function SupportGlyph({ id }: { id: SupportNeedId }) {
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
        {id === 'clearer-steps' ? (
          <>
            <Path d="M8 9H23M8 16H20M8 23H17" {...common} />
            <Circle cx="25" cy="23" fill={colors.starlight} r="2.7" />
          </>
        ) : null}
        {id === 'lower-sensory' ? (
          <>
            <Path d="M9 13C12 13 13 10 16 10C21 10 25 14 25 18C25 22 22 25 18 25C14 25 12 22 12 19" {...common} />
            <Path d="M7 16H11M8 20H11" {...common} />
            <Circle cx="9" cy="11" fill={colors.starlight} r="2.7" />
          </>
        ) : null}
        {id === 'low-movement' ? (
          <>
            <Circle cx="13" cy="8" fill={colors.starlight} r="2.8" />
            <Path d="M13 12V19H20L23 25M13 16L9 22H19M9 22V26" {...common} />
          </>
        ) : null}
        {id === 'flexible-pacing' ? (
          <>
            <Circle cx="16" cy="17" r="9" {...common} />
            <Path d="M16 12V17L20 20M12 6H20" {...common} />
            <Circle cx="24" cy="9" fill={colors.starlight} r="2.7" />
          </>
        ) : null}
        {id === 'guardian-alongside' ? (
          <>
            <Circle cx="11" cy="10" r="3" {...common} />
            <Circle cx="21" cy="12" fill={colors.starlight} r="3" />
            <Path d="M5 25C5 19 8 16 12 16C16 16 18 19 18 25M16 25C16 20 18 18 21 18C24 18 27 21 27 25" {...common} />
          </>
        ) : null}
      </Svg>
    </View>
  );
}

export function SupportSetupScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useSetupDraft();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const compact = width < 360 || height < 720;
  const [selected, setSelected] = useState<SupportNeedId[]>(draft.supportNeeds);

  const toggleSupportNeed = useCallback((id: SupportNeedId) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((needId) => needId !== id) : [...current, id],
    );
  }, []);

  const countLabel = selected.length === 0 ? 'Optional' : `${selected.length} selected`;

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
            <View accessibilityElementsHidden style={styles.adaptivePath}>
              <View style={styles.pathNode} />
              <View style={styles.pathLine} />
              <View style={styles.pathStar} />
            </View>
            <ThemedText style={styles.eyebrow} variant="label">
              Different ways still count
            </ThemedText>
          </View>
          <ThemedText accessibilityRole="header" style={styles.headline} variant="display">
            What helps experiences work for them?
          </ThemedText>
          <ThemedText style={styles.body} variant="body">
            Choose any adaptations that may help. These guide how an experience should flex—they don’t describe who the child is.
          </ThemedText>
        </View>

        <View style={styles.selectionHeader}>
          <ThemedText style={styles.fieldLabel} variant="label">
            Helpful adaptations
          </ThemedText>
          <View style={styles.countPill}>
            <ThemedText accessibilityLiveRegion="polite" style={styles.countText} variant="caption">
              {countLabel}
            </ThemedText>
          </View>
        </View>

        <View accessibilityLabel="Helpful adaptations" accessibilityRole="list" style={styles.optionsPanel}>
          {SUPPORT_NEEDS.map((need, index) => (
            <View key={need.id}>
              <SelectionRow
                description={need.description}
                icon={<SupportGlyph id={need.id} />}
                onPress={() => toggleSupportNeed(need.id)}
                selected={selected.includes(need.id)}
                title={need.title}
              />
              {index < SUPPORT_NEEDS.length - 1 ? (
                <View accessibilityElementsHidden style={styles.divider} />
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.optionalNote}>
          <View accessibilityElementsHidden style={styles.noteStar} />
          <ThemedText style={styles.noteText} variant="caption">
            No selection is required. Constellation will never treat an adaptation as a limitation.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <ActionButton
            accessibilityHint="Continues to allowed places"
            label="Continue setup"
            onPress={() => {
              updateDraft({ supportNeeds: selected });
              router.push('/contexts-setup');
            }}
            variant="ink"
          />
          <ThemedText style={styles.nextStep} variant="caption">
            Next: where experiences may happen.
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
  adaptivePath: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 16,
    width: 34,
  },
  pathNode: {
    backgroundColor: colors.onboardingInk,
    borderRadius: radius.pill,
    height: 5,
    width: 5,
  },
  pathLine: {
    backgroundColor: colors.onboardingInk,
    height: 1.5,
    transform: [{ rotate: '12deg' }],
    width: 16,
  },
  pathStar: {
    backgroundColor: colors.starlight,
    borderRadius: radius.pill,
    height: 10,
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
  optionalNote: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.two,
  },
  noteStar: {
    backgroundColor: colors.starlight,
    borderRadius: radius.pill,
    height: 7,
    marginTop: 6,
    width: 7,
  },
  noteText: {
    color: colors.onboardingInkMuted,
    flex: 1,
    fontFamily: fontFamilies.semibold,
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

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useSetupDraft } from '@/features/setup/setup-draft-provider';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';
import type { AgeBand } from '@/types/constellation';

type FormErrors = {
  ageBand?: string;
  nickname?: string;
};

const AGE_BANDS: { label: string; value: AgeBand }[] = [
  { label: '6–7', value: '6-7' },
  { label: '8–9', value: '8-9' },
  { label: '10–12', value: '10-12' },
];

function normalizeNickname(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function ProfileStarMark() {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.mark}>
      <Svg height="52" viewBox="0 0 52 52" width="52">
        <Circle cx="26" cy="26" fill="none" r="20" stroke={colors.onboardingGlow} strokeDasharray="2 5" strokeWidth="2" />
        <Circle cx="19" cy="22" fill={colors.onboardingInk} r="4" />
        <Circle cx="34" cy="30" fill={colors.onboardingInk} r="4" />
        <Path d="M26 10 L29 18 L37 21 L29 24 L26 32 L23 24 L15 21 L23 18 Z" fill={colors.starlight} />
        <Path d="M19 22 L34 30" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="2" />
      </Svg>
    </View>
  );
}

function AgeBandOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Age ${label}`}
      accessibilityRole="radio"
      aria-checked={selected}
      onPress={onPress}
      style={({ pressed }) => [
        styles.ageOption,
        selected && styles.ageOptionSelected,
        pressed && styles.ageOptionPressed,
      ]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <ThemedText selectable={false} style={styles.ageOptionLabel} variant="label">
        {label} years
      </ThemedText>
    </Pressable>
  );
}

export function ProfileSetupScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useSetupDraft();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<TextInput>(null);
  const compact = width < 360 || height < 720;

  const [nickname, setNickname] = useState(draft.nickname);
  const [ageBand, setAgeBand] = useState<AgeBand | null>(draft.ageBand);
  const [errors, setErrors] = useState<FormErrors>({});
  const [nicknameFocused, setNicknameFocused] = useState(false);

  const handleNicknameChange = useCallback((value: string) => {
    setNickname(value);
    setErrors((current) => ({ ...current, nickname: undefined }));
  }, []);

  const handleNicknameBlur = useCallback(() => {
    setNicknameFocused(false);
    const normalized = normalizeNickname(nickname);
    if (normalized.length > 0 && [...normalized].length < 2) {
      setErrors((current) => ({ ...current, nickname: 'Use at least 2 characters.' }));
    }
  }, [nickname]);

  const handleAgeBandChange = useCallback((value: AgeBand) => {
    setAgeBand(value);
    setErrors((current) => ({ ...current, ageBand: undefined }));
  }, []);

  const handleContinue = useCallback(() => {
    const normalizedNickname = normalizeNickname(nickname);
    const nextErrors: FormErrors = {};

    if (normalizedNickname.length === 0) {
      nextErrors.nickname = 'Enter a nickname.';
    } else if ([...normalizedNickname].length < 2) {
      nextErrors.nickname = 'Use at least 2 characters.';
    }

    if (!ageBand) {
      nextErrors.ageBand = 'Choose an age band.';
    }

    setErrors(nextErrors);

    if (nextErrors.nickname) {
      inputRef.current?.focus();
      AccessibilityInfo.announceForAccessibility(nextErrors.nickname);
      return;
    }

    if (nextErrors.ageBand) {
      AccessibilityInfo.announceForAccessibility(nextErrors.ageBand);
      return;
    }

    setNickname(normalizedNickname);
    updateDraft({ nickname: normalizedNickname, ageBand });
    router.push('/interests-setup');
  }, [ageBand, nickname, router, updateDraft]);

  return (
    <Screen
      automaticallyAdjustKeyboardInsets
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
          <ProfileStarMark />
          <View style={styles.introCopy}>
            <ThemedText accessibilityRole="header" style={styles.headline} variant="display">
              Create their local profile.
            </ThemedText>
            <ThemedText style={styles.body} variant="body">
              A nickname and age band help Constellation choose ideas that fit. This stays on this device.
            </ThemedText>
          </View>
        </View>

        <View style={styles.formPanel}>
          <View style={styles.fieldGroup}>
            <ThemedText nativeID="nickname-label" style={styles.fieldLabel} variant="label">
              What should we call them?
            </ThemedText>
            <TextInput
              accessibilityHint="Use a nickname instead of a full legal name"
              accessibilityLabel="Child nickname"
              aria-invalid={Boolean(errors.nickname)}
              autoCapitalize="words"
              autoComplete="off"
              enterKeyHint="next"
              maxLength={24}
              onBlur={handleNicknameBlur}
              onChangeText={handleNicknameChange}
              onFocus={() => setNicknameFocused(true)}
              onSubmitEditing={() => setNicknameFocused(false)}
              placeholder="Nickname"
              placeholderTextColor={colors.onboardingInkMuted}
              ref={inputRef}
              returnKeyType="next"
              selectionColor={colors.starlightPressed}
              style={[
                styles.input,
                nicknameFocused && styles.inputFocused,
                errors.nickname && styles.inputError,
              ]}
              textContentType="nickname"
              value={nickname}
            />
            <ThemedText
              accessibilityLiveRegion="polite"
              style={[styles.helperText, errors.nickname && styles.errorText]}
              variant="caption"
            >
              {errors.nickname ?? 'Use a nickname, not a full legal name.'}
            </ThemedText>
          </View>

          <View accessibilityElementsHidden style={styles.divider} />

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel} variant="label">
              How old are they?
            </ThemedText>
            <View accessibilityLabel="Age band" accessibilityRole="radiogroup" style={styles.ageOptions}>
              {AGE_BANDS.map((option) => (
                <AgeBandOption
                  key={option.value}
                  label={option.label}
                  onPress={() => handleAgeBandChange(option.value)}
                  selected={ageBand === option.value}
                />
              ))}
            </View>
            {errors.ageBand ? (
              <ThemedText accessibilityLiveRegion="polite" style={styles.errorText} variant="caption">
                {errors.ageBand}
              </ThemedText>
            ) : null}
          </View>
        </View>

        <View style={styles.footer}>
          <ActionButton
            accessibilityHint="Checks the profile fields and opens interest selection"
            label="Choose interests"
            onPress={handleContinue}
            variant="ink"
          />
          <ThemedText style={styles.nextStep} variant="caption">
            Next: choose a few things they’re curious about.
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
    gap: spacing.four,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: colors.onboardingSurface,
    borderCurve: 'continuous',
    borderRadius: radius.pill,
    boxShadow: '0 10px 26px rgba(56, 38, 70, 0.09)',
    height: 64,
    justifyContent: 'center',
    width: 64,
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
  formPanel: {
    backgroundColor: colors.onboardingSurface,
    borderColor: colors.onboardingLine,
    borderCurve: 'continuous',
    borderRadius: radius.medium,
    borderWidth: 1,
    boxShadow: '0 12px 30px rgba(56, 38, 70, 0.07)',
    gap: spacing.four,
    padding: spacing.four,
  },
  fieldGroup: {
    gap: spacing.three,
  },
  fieldLabel: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    lineHeight: 21,
  },
  input: {
    backgroundColor: colors.onboardingCanvas,
    borderColor: colors.onboardingLine,
    borderCurve: 'continuous',
    borderRadius: radius.small,
    borderWidth: 1.5,
    color: colors.onboardingInk,
    fontFamily: fontFamilies.semibold,
    fontSize: 17,
    minHeight: 56,
    paddingHorizontal: spacing.four,
    paddingVertical: spacing.three,
  },
  inputFocused: {
    borderColor: colors.onboardingInk,
  },
  inputError: {
    borderColor: colors.danger,
  },
  helperText: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.regular,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fontFamilies.semibold,
  },
  divider: {
    backgroundColor: colors.onboardingLine,
    height: 1,
  },
  ageOptions: {
    flexDirection: 'row',
    gap: spacing.three,
  },
  ageOption: {
    alignItems: 'center',
    backgroundColor: colors.onboardingCanvas,
    borderColor: colors.onboardingLine,
    borderCurve: 'continuous',
    borderRadius: radius.small,
    borderWidth: 1.5,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.two,
    minHeight: 56,
    paddingHorizontal: spacing.three,
  },
  ageOptionSelected: {
    backgroundColor: colors.onboardingGlow,
    borderColor: colors.onboardingInk,
  },
  ageOptionPressed: {
    opacity: 0.78,
  },
  radio: {
    alignItems: 'center',
    borderColor: colors.onboardingInkMuted,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  radioSelected: {
    borderColor: colors.onboardingInk,
  },
  radioDot: {
    backgroundColor: colors.starlight,
    borderRadius: radius.pill,
    height: 10,
    width: 10,
  },
  ageOptionLabel: {
    color: colors.onboardingInk,
    flexShrink: 1,
    fontFamily: fontFamilies.bold,
    fontSize: 15,
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

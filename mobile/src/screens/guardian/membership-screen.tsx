import { useState } from 'react';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { EXPERIENCE_CATALOG } from '@/data/catalog/experience-catalog';
import { FREE_MISSION_COUNT } from '@/features/entitlements/access-policy';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import { ProtectedStarArtwork } from '@/screens/guardian/protected-star-artwork';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';

const MEMBERSHIP_ROWS = [
  { label: 'Paper Post and Shadow experiments; creative planning tools', free: 'Included', family: 'Included' },
  { label: 'Extra Paper Post challenges', free: '—', family: '2 prompts' },
  { label: 'Reviewed real-world missions', free: `${FREE_MISSION_COUNT} flagships`, family: `All ${EXPERIENCE_CATALOG.length}` },
  { label: 'Curiosity areas', free: 'All 6', family: 'All 6' },
  { label: 'Constellation and learning memories', free: 'Included', family: 'Included' },
  { label: 'Child-facing ads or purchase prompts', free: 'Never', family: 'Never' },
] as const;

function TextAction({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.textAction, pressed && styles.pressed, disabled && styles.disabled]}><ThemedText selectable={false} style={styles.textActionLabel} variant="label">{label}</ThemedText></Pressable>;
}

export function MembershipScreen() {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const {
    accessTier, configurationStatus, error, manageMembership, membershipStatus,
    presentFamilyPaywall, restoreMembership,
  } = useEntitlements();
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const loading = membershipStatus === 'loading';
  const family = accessTier === 'family';

  const seePlans = async () => {
    setMessage(null);
    const result = await presentFamilyPaywall();
    if (result === 'purchased') setMessage('Constellation Family is active on this device.');
    if (result === 'restored') setMessage('Your family membership was restored.');
  };

  const restore = async () => {
    setMessage(null);
    if (await restoreMembership()) setMessage('Your family membership was restored.');
  };

  return (
    <Screen
      bounces={false}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + spacing.six, spacing.eight) }]}
    >
      <Stack.Title>Family membership</Stack.Title>
      <StatusBar style="dark" />
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.main}>
        <View style={styles.hero}>
          <ProtectedStarArtwork compact />
          <View style={styles.heroCopy}>
            <ThemedText accessibilityRole="header" style={styles.heading} variant="display">More ways to explore. Still no pressure.</ThemedText>
            <ThemedText style={styles.body} variant="body">Try light and shadow, build paper bridges, and plan stories together for free. Family adds more real-world activities—such as sound mapping, rhythm and everyday projects—plus two extra Paper Post challenges. Saved creations remain yours when membership ends.</ThemedText>
          </View>
        </View>

        <View style={styles.comparisonSurface}>
          <View style={styles.columnHeadings}>
            <ThemedText style={styles.rowLabel} variant="label">What families receive</ThemedText>
            <ThemedText style={styles.columnHeading} variant="caption">FREE</ThemedText>
            <ThemedText style={styles.columnHeading} variant="caption">FAMILY</ThemedText>
          </View>
          {MEMBERSHIP_ROWS.map((row, index) => <View key={row.label} style={[styles.comparisonRow, index > 0 && styles.rowDivider]}>
            <ThemedText style={styles.rowLabel} variant="caption">{row.label}</ThemedText>
            <ThemedText style={styles.rowValue} variant="caption">{row.free}</ThemedText>
            <ThemedText style={styles.familyValue} variant="caption">{row.family}</ThemedText>
          </View>)}
        </View>

        {family ? (
          <View accessibilityLiveRegion="polite" style={styles.activeSurface}>
            <View style={styles.activeSignal} />
            <View style={styles.activeCopy}><ThemedText style={styles.activeTitle} variant="title">Constellation Family is active.</ThemedText><ThemedText style={styles.smallBody} variant="caption">All reviewed missions are available. Subscription changes remain in this grown-up area.</ThemedText></View>
            <ActionButton label="Manage membership" loading={loading} onPress={() => void manageMembership()} variant="ink" />
          </View>
        ) : (
          <View style={styles.purchaseSection}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: guardianConsent }}
              aria-checked={guardianConsent}
              onPress={() => setGuardianConsent((current) => !current)}
              style={({ pressed }) => [styles.consentRow, pressed && styles.pressed]}
            >
              <View style={[styles.checkbox, guardianConsent && styles.checkboxSelected]}>{guardianConsent ? <View style={styles.checkboxDot} /> : null}</View>
              <ThemedText selectable={false} style={styles.consentCopy} variant="caption">I am the grown-up managing purchases. When I continue, RevenueCat receives an anonymous purchase identifier and store purchase history—not the child’s nickname, age band, missions, answers, or progress.</ThemedText>
            </Pressable>
            <ActionButton disabled={!guardianConsent || configurationStatus !== 'ready'} label="See family plans" loading={loading} onPress={() => void seePlans()} variant="ink" />
            <ThemedText style={styles.storeNote} variant="caption">Your App Store or Play Store shows the local price, trial, renewal terms, and confirmation before charging.</ThemedText>
            <TextAction disabled={!guardianConsent || loading || configurationStatus !== 'ready'} label="Restore an earlier purchase" onPress={() => void restore()} />
          </View>
        )}

        {configurationStatus !== 'ready' ? <View accessibilityLiveRegion="polite" style={styles.noticeSurface}><ThemedText style={styles.noticeTitle} variant="label">Purchases are unavailable in this version</ThemedText><ThemedText style={styles.smallBody} variant="caption">Free experiments, saved creations and the six free missions remain available. No purchase has been made.</ThemedText></View> : null}
        {message ? <ThemedText accessibilityLiveRegion="polite" style={styles.message} variant="caption">{message}</ThemedText> : null}
        {error ? <ThemedText accessibilityLiveRegion="polite" style={styles.error} variant="caption">{error}</ThemedText> : null}
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.onboardingCanvas },
  content: { backgroundColor: colors.onboardingCanvas, paddingHorizontal: spacing.six, paddingTop: spacing.six },
  main: { alignSelf: 'center', gap: spacing.six, maxWidth: 560, width: '100%' },
  hero: { alignItems: 'center', gap: spacing.six },
  heroCopy: { gap: spacing.three, width: '100%' },
  heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 34, letterSpacing: -0.9, lineHeight: 39 },
  body: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 17, lineHeight: 25 },
  smallBody: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 14, lineHeight: 20 },
  comparisonSurface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, overflow: 'hidden', paddingHorizontal: spacing.four },
  columnHeadings: { alignItems: 'center', flexDirection: 'row', gap: spacing.two, minHeight: 58 },
  columnHeading: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.bold, fontSize: 10, letterSpacing: 0.9, textAlign: 'center', width: 68 },
  comparisonRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.two, minHeight: 68, paddingVertical: spacing.three },
  rowDivider: { borderTopColor: colors.onboardingLine, borderTopWidth: 1 },
  rowLabel: { color: colors.onboardingInk, flex: 1, fontFamily: fontFamilies.semibold, lineHeight: 19 },
  rowValue: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.semibold, textAlign: 'center', width: 68 },
  familyValue: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, textAlign: 'center', width: 68 },
  purchaseSection: { gap: spacing.four },
  consentRow: { alignItems: 'flex-start', backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.medium, borderWidth: 1, flexDirection: 'row', gap: spacing.three, minHeight: 56, padding: spacing.four },
  checkbox: { alignItems: 'center', borderColor: colors.onboardingInk, borderRadius: 7, borderWidth: 1.5, height: 24, justifyContent: 'center', width: 24 },
  checkboxSelected: { backgroundColor: colors.onboardingInk },
  checkboxDot: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 8, width: 8 },
  consentCopy: { color: colors.onboardingInkMuted, flex: 1, fontFamily: fontFamilies.regular, fontSize: 14, lineHeight: 20 },
  storeNote: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, lineHeight: 19, textAlign: 'center' },
  textAction: { alignItems: 'center', justifyContent: 'center', minHeight: 48, paddingHorizontal: spacing.four },
  textActionLabel: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, textDecorationLine: 'underline' },
  activeSurface: { backgroundColor: colors.domainNature, borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.four, padding: spacing.six },
  activeSignal: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 12, width: 12 },
  activeCopy: { gap: spacing.two },
  activeTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  noticeSurface: { backgroundColor: colors.domainEveryday, borderCurve: 'continuous', borderRadius: radius.medium, gap: spacing.two, padding: spacing.four },
  noticeTitle: { color: colors.domainEverydayInk, fontFamily: fontFamilies.bold },
  message: { color: colors.domainNatureInk, fontFamily: fontFamilies.bold, textAlign: 'center' },
  error: { color: colors.danger, fontFamily: fontFamilies.semibold, lineHeight: 20, textAlign: 'center' },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.45 },
});

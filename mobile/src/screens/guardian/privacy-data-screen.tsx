import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAppData } from '@/features/app/app-data-provider';
import { colors, fontFamilies, radius, spacing } from '@/theme';

const STORED = [
  ['Local profile', 'Nickname, age band, chosen interests, support preferences, and allowed places.'],
  ['Mission progress', 'One active mission, completed or stopped outcomes, reflections, learning memories, and stars.'],
  ['Not collected', 'No legal name, school, photos, voice recordings, precise location, advertising ID, or child analytics. Optional read-aloud uses only authored prompts through the device’s speech provider.'],
] as const;

export function PrivacyDataScreen() {
  const router = useRouter();
  const { deleteChildData } = useAppData();
  const [busy, setBusy] = useState(false);

  const confirmDelete = () => Alert.alert(
    'Delete this child’s Constellation?',
    'This permanently removes the local profile, active mission, reflections, outcomes, and stars from this device. Family membership is preserved.',
    [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete child data', style: 'destructive', onPress: () => void performDelete() }],
  );

  const performDelete = async () => {
    setBusy(true);
    try {
      await deleteChildData({ preserveEntitlement: true });
      router.replace('/');
    } finally { setBusy(false); }
  };

  return <Screen style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.main}><View style={styles.copy}><ThemedText accessibilityRole="header" style={styles.heading} variant="display">What stays on this device.</ThemedText><ThemedText style={styles.body} variant="body">Constellation keeps child setup and learning progress local. Store membership is managed separately by RevenueCat and Google Play.</ThemedText></View>
      <View style={styles.surface}>{STORED.map(([title, body], index) => <View key={title}><View style={styles.row}><View style={[styles.dot, index === 2 && styles.emptyDot]} /><View style={styles.rowCopy}><ThemedText style={styles.rowTitle} variant="label">{title}</ThemedText><ThemedText style={styles.rowBody} variant="caption">{body}</ThemedText></View></View>{index < STORED.length - 1 ? <View style={styles.divider} /> : null}</View>)}</View>
      <Pressable accessibilityRole="link" onPress={() => router.push('/privacy' as never)} style={styles.link}><ThemedText style={styles.linkText} variant="label">Read the full privacy policy →</ThemedText></Pressable>
      <View style={styles.dangerSurface}><ThemedText style={styles.dangerTitle} variant="title">Delete child profile and constellation</ThemedText><ThemedText style={styles.rowBody} variant="body">This cannot be undone. It does not cancel or erase a grown-up’s store membership.</ThemedText><ActionButton disabled={busy} label={busy ? 'Deleting…' : 'Delete child data'} onPress={confirmDelete} variant="ink" /></View>
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.onboardingCanvas }, content: { alignItems: 'center', padding: spacing.six, paddingBottom: spacing.twelve }, main: { gap: spacing.six, maxWidth: 540, width: '100%' }, copy: { gap: spacing.three }, heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 34, lineHeight: 39 }, body: { color: colors.onboardingInkMuted, fontSize: 17, lineHeight: 25 }, surface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, overflow: 'hidden' }, row: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.three, padding: spacing.four }, dot: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 10, marginTop: 5, width: 10 }, emptyDot: { backgroundColor: colors.onboardingCanvas, borderColor: colors.onboardingInk, borderWidth: 2 }, rowCopy: { flex: 1, gap: spacing.one }, rowTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold }, rowBody: { color: colors.onboardingInkMuted, lineHeight: 20 }, divider: { backgroundColor: colors.onboardingLine, height: 1, marginLeft: spacing.eight }, link: { minHeight: 44, justifyContent: 'center' }, linkText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold }, dangerSurface: { backgroundColor: colors.onboardingSurface, borderColor: colors.danger, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, gap: spacing.three, padding: spacing.six }, dangerTitle: { color: colors.danger, fontFamily: fontFamilies.bold, fontSize: 21 },
});

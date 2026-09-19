import { useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { colors, fontFamilies, radius, spacing } from '@/theme';

export function SafetySupportScreen() {
  const router = useRouter();
  const rows = [
    ['Safety approach', 'Reviewed, context-eligible missions and risk-based grown-up handoffs.', () => router.push('/safety' as never)],
    ['Privacy policy', 'What Constellation stores locally and what RevenueCat receives.', () => router.push('/privacy' as never)],
    ['Terms of use', 'The boundaries for using this first public release.', () => router.push('/terms' as never)],
    ['Email support', 'Get help from the Constellation team.', () => void Linking.openURL('mailto:support@constellation.family')],
  ] as const;
  return <Screen style={styles.screen} contentContainerStyle={styles.content}><View style={styles.main}><View style={styles.copy}><ThemedText accessibilityRole="header" style={styles.heading} variant="display">Curiosity with guardrails.</ThemedText><ThemedText style={styles.body} variant="body">Missions come from a versioned, reviewed library. Eligibility is checked again before a child starts; safety rules are never relaxed to fill a recommendation.</ThemedText></View><View style={styles.note}><ThemedText style={styles.noteTitle} variant="label">No surveillance proof</ThemedText><ThemedText style={styles.noteBody} variant="body">Constellation trusts the child’s return and reflection. It does not ask for a camera, microphone, photo, exact location, or open-ended AI chat.</ThemedText></View><View style={styles.surface}>{rows.map(([title, body, onPress], index) => <View key={title}><Pressable accessibilityRole={title === 'Email support' ? 'link' : 'button'} onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}><View style={styles.rowCopy}><ThemedText style={styles.rowTitle} variant="label">{title}</ThemedText><ThemedText style={styles.rowBody} variant="caption">{body}</ThemedText></View><ThemedText style={styles.arrow} variant="title">›</ThemedText></Pressable>{index < rows.length - 1 ? <View style={styles.divider} /> : null}</View>)}</View></View></Screen>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: colors.onboardingCanvas }, content: { alignItems: 'center', padding: spacing.six, paddingBottom: spacing.twelve }, main: { gap: spacing.six, maxWidth: 540, width: '100%' }, copy: { gap: spacing.three }, heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 34, lineHeight: 39 }, body: { color: colors.onboardingInkMuted, fontSize: 17, lineHeight: 25 }, note: { backgroundColor: colors.onboardingSurface, borderColor: colors.starlight, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, gap: spacing.two, padding: spacing.six }, noteTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold }, noteBody: { color: colors.onboardingInkMuted, lineHeight: 23 }, surface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, overflow: 'hidden' }, row: { alignItems: 'center', flexDirection: 'row', minHeight: 92, padding: spacing.four }, pressed: { backgroundColor: colors.onboardingCanvas }, rowCopy: { flex: 1, gap: spacing.one }, rowTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold }, rowBody: { color: colors.onboardingInkMuted, lineHeight: 19 }, arrow: { color: colors.onboardingInkMuted, fontSize: 28 }, divider: { backgroundColor: colors.onboardingLine, height: 1, marginLeft: spacing.four } });

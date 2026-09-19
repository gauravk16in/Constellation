import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProtectedStarArtwork } from '@/screens/guardian/protected-star-artwork';
import { colors, fontFamilies, radius, spacing } from '@/theme';

type RowProps = { icon: 'star' | 'data' | 'shield'; title: string; body: string; onPress: () => void };

function ControlIcon({ kind }: { kind: RowProps['icon'] }) {
  return <View style={styles.icon}><Svg height="28" viewBox="0 0 28 28" width="28">
    {kind === 'star' ? <><Circle cx="14" cy="14" r="10" fill="none" stroke={colors.onboardingInk} strokeWidth="2" /><Path d="M14 7l1.8 4.4 4.7.4-3.6 3 1.1 4.6-4-2.5-4 2.5 1.1-4.6-3.6-3 4.7-.4z" fill={colors.starlight} /></> : null}
    {kind === 'data' ? <><Rect x="5" y="5" width="18" height="18" rx="6" fill="none" stroke={colors.onboardingInk} strokeWidth="2" /><Circle cx="10" cy="14" r="2" fill={colors.onboardingInk} /><Circle cx="18" cy="14" r="2" fill={colors.starlight} /></> : null}
    {kind === 'shield' ? <><Path d="M14 4l8 3v6c0 5-3.3 8.5-8 11-4.7-2.5-8-6-8-11V7z" fill="none" stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="2" /><Circle cx="14" cy="13" r="3" fill={colors.starlight} /></> : null}
  </Svg></View>;
}

function ControlRow({ icon, title, body, onPress }: RowProps) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
    <ControlIcon kind={icon} /><View style={styles.rowCopy}><ThemedText style={styles.rowTitle} variant="label">{title}</ThemedText><ThemedText style={styles.rowBody} variant="caption">{body}</ThemedText></View><ThemedText style={styles.arrow} variant="title">›</ThemedText>
  </Pressable>;
}

export function GrownUpControlsScreen() {
  const router = useRouter();
  return <Screen style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.main}><ProtectedStarArtwork compact /><View style={styles.copy}><ThemedText accessibilityRole="header" style={styles.heading} variant="display">Your family controls.</ThemedText><ThemedText style={styles.body} variant="body">Membership, local child data, and safety information stay together behind the grown-up check.</ThemedText></View>
      <View style={styles.surface}>
        <ControlRow icon="star" title="Family membership" body="See plans, purchase, restore, or manage membership." onPress={() => router.push('/membership')} />
        <View style={styles.divider} />
        <ControlRow icon="data" title="Privacy and local data" body="See what stays on this device or delete the child profile." onPress={() => router.push('/privacy-data' as never)} />
        <View style={styles.divider} />
        <ControlRow icon="shield" title="Safety and support" body="How missions are reviewed, plus policies and help." onPress={() => router.push('/safety-support' as never)} />
      </View>
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.onboardingCanvas }, content: { alignItems: 'center', padding: spacing.six, paddingBottom: spacing.twelve }, main: { alignItems: 'center', gap: spacing.six, maxWidth: 540, width: '100%' }, copy: { gap: spacing.three, width: '100%' }, heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 34, lineHeight: 39 }, body: { color: colors.onboardingInkMuted, fontSize: 17, lineHeight: 25 }, surface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, overflow: 'hidden', width: '100%' }, row: { alignItems: 'center', flexDirection: 'row', gap: spacing.four, minHeight: 108, padding: spacing.four }, pressed: { backgroundColor: colors.onboardingCanvas }, icon: { alignItems: 'center', backgroundColor: colors.onboardingCanvas, borderRadius: radius.medium, height: 48, justifyContent: 'center', width: 48 }, rowCopy: { flex: 1, gap: spacing.one }, rowTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 16 }, rowBody: { color: colors.onboardingInkMuted, fontSize: 13, lineHeight: 19 }, arrow: { color: colors.onboardingInkMuted, fontSize: 28 }, divider: { backgroundColor: colors.onboardingLine, height: 1, marginLeft: 80 },
});

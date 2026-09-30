import { useRouter, type Href } from 'expo-router';
import { Pressable, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { completedTrailIds, nextTrailId, PLAY_TRAIL } from '@/features/planet/play-trail';
import { colors, fontFamilies, spacing } from '@/theme';
import { planetStyles as s } from '@/theme/planet';
import type { PlanetData } from '@/types/pocket-planet';

export function PlayTrailMap({ data }: { data: PlanetData }) {
  const router = useRouter();
  const completed = completedTrailIds(data);
  const next = nextTrailId(data);
  return <View style={{ gap: spacing.three }}>
    <View style={{ gap: spacing.one }}><ThemedText style={s.caption}>EXPLORE LITTLE LANDING</ThemedText><ThemedText accessibilityRole="header" style={s.prompt}>Six places to play</ThemedText><ThemedText style={s.body}>Try any place. Revisit and change your idea whenever you like.</ThemedText></View>
    <View style={{ backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: 28, borderWidth: 1, paddingHorizontal: spacing.four }}>
      {PLAY_TRAIL.map((entry, index) => {
        const tried = completed.has(entry.id);
        const suggested = next === entry.id;
        return <View key={entry.id} style={{ borderBottomColor: colors.onboardingLine, borderBottomWidth: index === PLAY_TRAIL.length - 1 ? 0 : 1 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Stop ${index + 1}: ${entry.title}. ${tried ? 'Tried here before' : suggested ? 'Suggested next' : 'Open to explore'}. ${entry.question}`}
            onPress={() => router.push(entry.href as Href)} style={({ pressed }) => ({ alignItems: 'center', flexDirection: 'row', gap: spacing.three, minHeight: 76, opacity: pressed ? 0.72 : 1, paddingVertical: spacing.two })}>
            <View style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 24,
              backgroundColor: tried ? colors.domainTest : suggested ? colors.domainMake : colors.onboardingCanvas,
              borderColor: colors.onboardingInk, borderWidth: suggested ? 2 : 1 }}>
              <ThemedText selectable={false} style={{ color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 20 }}>{index + 1}</ThemedText>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText selectable={false} style={s.label}>{entry.title}</ThemedText>
              <ThemedText selectable={false} style={s.caption}>{tried ? 'Tried here · play again' : suggested ? 'Suggested next' : entry.area}</ThemedText>
            </View>
            <ThemedText selectable={false} style={{ color: colors.onboardingInk, fontSize: 24 }}>›</ThemedText>
          </Pressable>
        </View>;
      })}
    </View>
    <Pressable accessibilityRole="button" onPress={() => router.push('/maker-studio')} style={({ pressed }) => ({ backgroundColor: colors.domainMake, borderCurve: 'continuous', borderRadius: 20, gap: spacing.one, minHeight: 64, opacity: pressed ? 0.72 : 1, padding: spacing.four })}><ThemedText selectable={false} style={s.label}>Maker’s Workbench →</ThemedText><ThemedText selectable={false} style={s.caption}>Draw shapes or arrange paper gears</ThemedText></Pressable>
    <ThemedText style={s.caption}>Playing here saves ideas. Gold stars remember only real-world missions.</ThemedText>
  </View>;
}

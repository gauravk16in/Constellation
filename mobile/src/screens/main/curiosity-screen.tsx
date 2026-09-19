import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DomainGlyph } from '@/components/domain-glyph';
import { ActionButton } from '@/components/action-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { CURIOSITY_AREAS } from '@/data/catalog/curiosity-areas';
import { useAppData } from '@/features/app/app-data-provider';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';

export function CuriosityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const { profile, stars } = useAppData();
  const oneColumn = width < 360;

  const orderedAreas = useMemo(() => profile ? [...CURIOSITY_AREAS].sort((a, b) => {
    const aSelected = profile.interests.includes(a.id) ? 1 : 0;
    const bSelected = profile.interests.includes(b.id) ? 1 : 0;
    return bSelected - aSelected || CURIOSITY_AREAS.indexOf(a) - CURIOSITY_AREAS.indexOf(b);
  }) : CURIOSITY_AREAS, [profile]);

  if (!profile) return null;

  return (
    <Screen contentInsetAdjustmentBehavior="automatic" style={styles.screen} contentContainerStyle={[
      styles.content, { paddingBottom: Math.max(insets.bottom + 96, spacing.six), paddingTop: Math.max(insets.top + spacing.six, spacing.eight) },
    ]}>
      <StatusBar style="dark" />
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.main}>
        <View style={styles.intro}>
          <View style={styles.titleLine}><View style={styles.titleStar} /><ThemedText style={styles.eyebrow} variant="label">SIX OPEN PATHS</ThemedText></View>
          <ThemedText accessibilityRole="header" style={styles.heading} variant="display">Try something out there.</ThemedText>
          <ThemedText style={styles.body} variant="body">Your starting points come first. Every area stays open, because interests can change when you try something real.</ThemedText>
          <ActionButton variant="ink" label="What fits right now?" onPress={() => router.push('/what-fits')} />
        </View>

        <View accessibilityLabel="Curiosity areas" accessibilityRole="list" style={styles.grid}>
          {orderedAreas.map((area) => {
            const selected = profile.interests.includes(area.id);
            const starCount = stars.filter((star) => star.primaryDomain === area.id).length;
            return (
              <Pressable
                key={area.id}
                accessibilityHint="Opens recommendations in this curiosity area"
                accessibilityLabel={`${area.title}. ${area.description}. ${selected ? 'Chosen as a starting point.' : 'Open to explore.'} ${starCount} stars lit.`}
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/curiosity/[domainId]', params: { domainId: area.id } })}
                style={({ pressed }) => [styles.tile, { backgroundColor: area.wash, width: oneColumn ? '100%' : '48%' }, pressed && styles.tilePressed]}
              >
                <View style={styles.tileTop}>
                  <DomainGlyph accent={area.accent} id={area.id} size={52} wash={colors.onboardingSurface} />
                  <View style={styles.starCount}><View style={styles.smallStar} /><ThemedText selectable={false} style={styles.starCountText} variant="caption">{starCount}</ThemedText></View>
                </View>
                <View style={styles.tileCopy}>
                  <ThemedText selectable={false} style={styles.tileTitle} variant="title">{area.title}</ThemedText>
                  <ThemedText selectable={false} numberOfLines={3} style={styles.tileDescription} variant="caption">{area.description}</ThemedText>
                </View>
                <ThemedText selectable={false} style={[styles.tileFooter, { color: area.accent }]} variant="caption">{selected ? 'PICKED BY YOU' : 'OPEN TO EXPLORE'}  →</ThemedText>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.onboardingCanvas },
  content: { backgroundColor: colors.onboardingCanvas, paddingHorizontal: spacing.six },
  main: { alignSelf: 'center', gap: spacing.eight, maxWidth: 620, width: '100%' },
  intro: { gap: spacing.three },
  titleLine: { alignItems: 'center', flexDirection: 'row', gap: spacing.two },
  titleStar: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 10, width: 10 },
  eyebrow: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 12, letterSpacing: 1.2 },
  heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 38, letterSpacing: -1.1, lineHeight: 42 },
  body: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 17, lineHeight: 25 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.three },
  tile: { borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.four, justifyContent: 'space-between', minHeight: 228, padding: spacing.four },
  tilePressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  tileTop: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  starCount: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.one, minHeight: 36, paddingHorizontal: spacing.three },
  smallStar: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 8, width: 8 },
  starCountText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontVariant: ['tabular-nums'] },
  tileCopy: { gap: spacing.two },
  tileTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 21, lineHeight: 25 },
  tileDescription: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 14, lineHeight: 20 },
  tileFooter: { fontFamily: fontFamilies.bold, fontSize: 11, letterSpacing: 0.6 },
});

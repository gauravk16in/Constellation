import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  AccessibilityInfo,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ConstellationOrbit } from '@/screens/onboarding/constellation-orbit';
import {
  ContextCompassArtwork,
  GrowingMapArtwork,
  RealWorldDoorwayArtwork,
} from '@/screens/onboarding/onboarding-artworks';
import { SlideToBegin } from '@/screens/onboarding/slide-to-begin';
import { colors, fontFamilies, spacing } from '@/theme';

const AUTO_ADVANCE_MS = 6500;
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 60 };

type ArtworkComponent = ComponentType<{ compact?: boolean }>;

type OnboardingStory = {
  Artwork: ArtworkComponent;
  body: string;
  id: string;
  title: string;
};

const STORIES: OnboardingStory[] = [
  {
    id: 'curiosity',
    title: 'Make the real world more interesting than the screen.',
    body: 'Follow your curiosity into something you can explore, make, ask, or try—right where you are.',
    Artwork: ConstellationOrbit,
  },
  {
    id: 'context',
    title: 'The right idea, at the right moment.',
    body: 'Constellation considers your time, weather, interests, and who is with you—then offers a few good possibilities.',
    Artwork: ContextCompassArtwork,
  },
  {
    id: 'real-world',
    title: 'The screen points. You go.',
    body: 'Build, explore, cook, create, help, or move. The experience happens out in the real world.',
    Artwork: RealWorldDoorwayArtwork,
  },
  {
    id: 'growth',
    title: 'Every experience lights a star.',
    body: 'Over time, your constellation becomes a map of what you have tried, learned, and might become.',
    Artwork: GrowingMapArtwork,
  },
];

function BrandLockup() {
  return (
    <View style={styles.brand}>
      <Svg height="31" viewBox="0 0 31 31" width="31">
        <Circle cx="15.5" cy="15.5" fill="none" r="11.5" stroke={colors.onboardingInk} strokeWidth="2.5" />
        <Circle cx="15.5" cy="15.5" fill="none" r="6.5" stroke={colors.onboardingInk} strokeWidth="2.5" />
        <Path d="M22 5 L24 9 L28 11 L24 13 L22 17 L20 13 L16 11 L20 9 Z" fill={colors.starlight} />
      </Svg>
      <ThemedText selectable={false} style={styles.brandName} variant="label">
        Constellation
      </ThemedText>
    </View>
  );
}

function StoryProgress({ currentIndex }: { currentIndex: number }) {
  return (
    <View
      accessibilityLabel={`Onboarding, step ${currentIndex + 1} of ${STORIES.length}`}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: STORIES.length, now: currentIndex + 1 }}
      style={styles.progress}
    >
      {STORIES.map((story, index) => (
        <View
          key={story.id}
          style={[styles.progressSegment, index <= currentIndex && styles.progressSegmentActive]}
        />
      ))}
    </View>
  );
}

type StorySlideProps = {
  carouselHeight: number;
  compact: boolean;
  currentIndex: number;
  index: number;
  pageWidth: number;
  story: OnboardingStory;
};

function StorySlide({ carouselHeight, compact, currentIndex, index, pageWidth, story }: StorySlideProps) {
  const { Artwork } = story;
  const isCurrent = index === currentIndex;

  return (
    <View
      accessibilityElementsHidden={!isCurrent}
      aria-hidden={!isCurrent}
      importantForAccessibility={isCurrent ? 'yes' : 'no-hide-descendants'}
      style={[styles.slide, { height: carouselHeight, width: pageWidth }]}
    >
      <View style={styles.copy}>
        <ThemedText
          accessibilityRole="header"
          style={[styles.headline, compact && styles.headlineCompact]}
          variant="display"
        >
          {story.title}
        </ThemedText>
        <ThemedText style={[styles.body, compact && styles.bodyCompact]} variant="body">
          {story.body}
        </ThemedText>
      </View>
      <Artwork compact={compact} />
    </View>
  );
}

export function OnboardingWelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const compact = width < 360 || height < 720;
  const pageWidth = Math.min(width, 520) - spacing.six * 2;
  const carouselHeight = Math.min(575, Math.max(500, height - 285));

  const listRef = useRef<FlatList<OnboardingStory>>(null);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAnnouncedSlide = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [autoCycle, setAutoCycle] = useState(0);
  const screenReaderBlocksAutoAdvance = process.env.EXPO_OS !== 'web' && screenReaderEnabled;

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  useEffect(() => {
    void AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReaderEnabled);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!hasAnnouncedSlide.current) {
      hasAnnouncedSlide.current = true;
      return;
    }
    AccessibilityInfo.announceForAccessibility(
      `Onboarding step ${currentIndex + 1} of ${STORIES.length}. ${STORIES[currentIndex].title}`,
    );
  }, [currentIndex]);

  useEffect(() => {
    clearAutoAdvance();
    if (reduceMotion || screenReaderBlocksAutoAdvance || currentIndex >= STORIES.length - 1) return;

    autoAdvanceTimer.current = setTimeout(() => {
      const nextIndex = currentIndex + 1;
      listRef.current?.scrollToOffset({ animated: true, offset: nextIndex * pageWidth });
      setCurrentIndex(nextIndex);
    }, AUTO_ADVANCE_MS);

    return clearAutoAdvance;
  }, [autoCycle, clearAutoAdvance, currentIndex, pageWidth, reduceMotion, screenReaderBlocksAutoAdvance]);

  const continueToGuardian = useCallback(() => {
    router.push('/guardian-intro');
  }, [router]);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<OnboardingStory>[] }) => {
      const nextIndex = viewableItems.find((item) => item.isViewable)?.index;
      if (typeof nextIndex === 'number') setCurrentIndex(nextIndex);
    },
    [],
  );

  const handleMomentumEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setCurrentIndex(Math.max(0, Math.min(STORIES.length - 1, nextIndex)));
    setAutoCycle((cycle) => cycle + 1);
  }, [pageWidth]);

  return (
    <Screen
      bounces={false}
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          minHeight: height,
          paddingBottom: Math.max(insets.bottom + spacing.three, spacing.six),
          paddingTop: Math.max(insets.top + spacing.three, spacing.six),
        },
      ]}
    >
      <StatusBar style="dark" />

      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(420)} style={styles.header}>
        <StoryProgress currentIndex={currentIndex} />
        <BrandLockup />
      </Animated.View>

      <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(520).delay(100)}>
        <FlatList
          accessibilityLabel="Constellation introduction. Swipe left or right to move between four stories."
          bounces={false}
          data={STORIES}
          decelerationRate="fast"
          disableIntervalMomentum
          extraData={currentIndex}
          getItemLayout={(_, index) => ({ index, length: pageWidth, offset: pageWidth * index })}
          horizontal
          keyExtractor={(story) => story.id}
          nestedScrollEnabled
          onMomentumScrollEnd={handleMomentumEnd}
          onScrollBeginDrag={clearAutoAdvance}
          onViewableItemsChanged={handleViewableItemsChanged}
          pagingEnabled
          ref={listRef}
          renderItem={({ item, index }) => (
            <StorySlide
              carouselHeight={carouselHeight}
              compact={compact}
              currentIndex={currentIndex}
              index={index}
              pageWidth={pageWidth}
              story={item}
            />
          )}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={pageWidth}
          style={{ height: carouselHeight, width: pageWidth }}
          viewabilityConfig={VIEWABILITY_CONFIG}
        />
      </Animated.View>

      <Animated.View entering={reduceMotion ? undefined : FadeInUp.duration(420).delay(260)} style={styles.footer}>
        <SlideToBegin onComplete={continueToGuardian} />
        <ThemedText style={styles.guardianNote} variant="caption">
          A parent or guardian joins you for setup.
        </ThemedText>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.onboardingCanvas,
  },
  content: {
    alignSelf: 'center',
    backgroundColor: colors.onboardingCanvas,
    gap: spacing.six,
    justifyContent: 'space-between',
    maxWidth: 520,
    overflow: 'hidden',
    paddingHorizontal: spacing.six,
    width: '100%',
  },
  header: {
    gap: spacing.six,
  },
  progress: {
    flexDirection: 'row',
    gap: spacing.two,
    height: 4,
  },
  progressSegment: {
    backgroundColor: colors.onboardingLine,
    borderRadius: 2,
    flex: 1,
  },
  progressSegmentActive: {
    backgroundColor: colors.onboardingInk,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.three,
  },
  brandName: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    letterSpacing: -0.35,
  },
  slide: {
    gap: spacing.four,
    justifyContent: 'space-between',
  },
  copy: {
    gap: spacing.four,
  },
  headline: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 39,
    letterSpacing: -1.15,
    lineHeight: 43,
  },
  headlineCompact: {
    fontSize: 34,
    letterSpacing: -0.9,
    lineHeight: 38,
  },
  body: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.regular,
    fontSize: 17,
    lineHeight: 25,
    maxWidth: 430,
  },
  bodyCompact: {
    fontSize: 16,
    lineHeight: 23,
  },
  footer: {
    gap: spacing.three,
  },
  guardianNote: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.semibold,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});

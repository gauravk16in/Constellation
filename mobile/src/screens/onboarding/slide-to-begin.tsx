/* eslint-disable react-hooks/immutability, react-hooks/refs -- Reanimated shared values are mutable by design inside gesture worklets. */
import { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Line, Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { colors, fontFamilies, radius, spacing } from '@/theme';

const HANDLE_SIZE = 54;
const TRACK_PADDING = 6;

type SlideToBeginProps = {
  onComplete: () => void;
};

export function SlideToBegin({ onComplete }: SlideToBeginProps) {
  'use no memo';

  const translateX = useSharedValue(0);
  const maximumDrag = useSharedValue(0);
  const completed = useSharedValue(false);
  const completedOnJs = useRef(false);

  const completeOnce = useCallback(() => {
    if (completedOnJs.current) return;
    completedOnJs.current = true;
    onComplete();
  }, [onComplete]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      maximumDrag.value = Math.max(0, event.nativeEvent.layout.width - HANDLE_SIZE - TRACK_PADDING * 2);
    },
    [maximumDrag],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(3)
        .onUpdate((event) => {
          if (completed.value) return;
          translateX.value = Math.max(0, Math.min(event.translationX, maximumDrag.value));
        })
        .onEnd(() => {
          if (translateX.value >= maximumDrag.value * 0.76) {
            completed.value = true;
            translateX.value = withTiming(
              maximumDrag.value,
              { duration: 180, easing: Easing.out(Easing.cubic) },
              (finished) => {
                if (finished) runOnJS(completeOnce)();
              },
            );
          } else {
            translateX.value = withSpring(0, { damping: 17, stiffness: 190 });
          }
        }),
    [completeOnce, completed, maximumDrag, translateX],
  );

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, Math.max(1, maximumDrag.value * 0.58)], [1, 0.12], 'clamp'),
  }));

  return (
    <View onLayout={handleLayout} style={styles.track}>
      <Animated.View style={[styles.labelWrap, labelStyle]}>
        <ThemedText selectable={false} style={styles.label} variant="label">
          Slide to begin
        </ThemedText>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.handle, handleStyle]}>
          <Pressable
            accessibilityHint="Swipe right or double tap to continue"
            accessibilityLabel="Begin Constellation"
            accessibilityRole="button"
            hitSlop={6}
            onPress={completeOnce}
            style={({ pressed }) => [styles.handlePressable, pressed && styles.handlePressed]}
          >
            <Svg height="26" viewBox="0 0 26 26" width="26">
              <Line stroke="#FFFFFF" strokeLinecap="round" strokeWidth="2.3" x1="4" x2="21" y1="13" y2="13" />
              <Path
                d="M15 7 L21 13 L15 19"
                fill="none"
                stroke="#FFFFFF"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.3"
              />
            </Svg>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(255, 249, 255, 0.74)',
    borderColor: '#FFFFFF',
    borderRadius: radius.pill,
    borderWidth: 1,
    boxShadow: '0 10px 30px rgba(56, 38, 70, 0.09)',
    height: 66,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: TRACK_PADDING,
    position: 'relative',
    width: '100%',
  },
  labelWrap: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    paddingLeft: HANDLE_SIZE / 2,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  label: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
  handle: {
    backgroundColor: colors.onboardingInk,
    borderRadius: radius.pill,
    height: HANDLE_SIZE,
    width: HANDLE_SIZE,
  },
  handlePressable: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.two,
  },
  handlePressed: {
    opacity: 0.78,
  },
});

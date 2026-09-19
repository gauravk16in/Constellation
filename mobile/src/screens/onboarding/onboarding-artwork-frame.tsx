import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, fontFamilies, radius, spacing } from '@/theme';

type OnboardingArtworkFrameProps = {
  caption: string;
  children: ReactNode;
  compact?: boolean;
};

export function OnboardingArtworkFrame({ caption, children, compact = false }: OnboardingArtworkFrameProps) {
  return (
    <View style={styles.wrapper}>
      <View accessibilityElementsHidden style={[styles.distantStar, styles.distantStarLeft]} />
      <View accessibilityElementsHidden style={[styles.distantStar, styles.distantStarRight]} />

      <View style={[styles.orbit, compact && styles.orbitCompact]}>{children}</View>

      <View style={styles.caption}>
        <View accessibilityElementsHidden style={styles.captionStar} />
        <ThemedText selectable={false} style={styles.captionText} variant="caption">
          {caption}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 264,
    position: 'relative',
  },
  orbit: {
    backgroundColor: colors.onboardingSurface,
    borderCurve: 'continuous',
    borderRadius: 130,
    boxShadow: '0 18px 45px rgba(56, 38, 70, 0.12)',
    height: 250,
    padding: spacing.two,
    width: 250,
  },
  orbitCompact: {
    borderRadius: 112,
    height: 218,
    width: 218,
  },
  distantStar: {
    backgroundColor: colors.onboardingInk,
    borderRadius: radius.pill,
    height: 5,
    opacity: 0.34,
    position: 'absolute',
    width: 5,
  },
  distantStarLeft: {
    left: '8%',
    top: '34%',
  },
  distantStarRight: {
    right: '7%',
    top: '17%',
  },
  caption: {
    alignItems: 'center',
    backgroundColor: colors.onboardingSurface,
    borderColor: '#FFFFFF',
    borderRadius: radius.pill,
    borderWidth: 1,
    bottom: 4,
    flexDirection: 'row',
    gap: spacing.two,
    paddingHorizontal: spacing.four,
    paddingVertical: spacing.two,
    position: 'absolute',
  },
  captionStar: {
    backgroundColor: colors.starlight,
    height: 8,
    transform: [{ rotate: '45deg' }],
    width: 8,
  },
  captionText: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
    letterSpacing: 0.2,
  },
});

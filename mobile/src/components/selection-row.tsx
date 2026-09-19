import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { colors, fontFamilies, radius, spacing } from '@/theme';

type SelectionRowProps = {
  description: string;
  icon: ReactNode;
  onPress: () => void;
  selected: boolean;
  title: string;
};

export function SelectionRow({ description, icon, onPress, selected, title }: SelectionRowProps) {
  return (
    <Pressable
      accessibilityHint={description}
      accessibilityRole="checkbox"
      aria-checked={selected}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected && styles.rowSelected,
        pressed && styles.rowPressed,
      ]}
    >
      {icon}
      <View style={styles.copy}>
        <ThemedText selectable={false} style={styles.title} variant="label">
          {title}
        </ThemedText>
        <ThemedText selectable={false} style={styles.description} variant="caption">
          {description}
        </ThemedText>
      </View>
      <View style={[styles.check, selected && styles.checkSelected]}>
        {selected ? (
          <Svg height="14" viewBox="0 0 16 16" width="14">
            <Path
              d="M3.5 8.2L6.6 11.2L12.7 4.9"
              fill="none"
              stroke={colors.onboardingInk}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
            />
          </Svg>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.three,
    minHeight: 76,
    paddingHorizontal: spacing.four,
    paddingVertical: spacing.three,
  },
  rowSelected: {
    backgroundColor: colors.onboardingGlow,
  },
  rowPressed: {
    opacity: 0.76,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  description: {
    color: colors.onboardingInkMuted,
    fontFamily: fontFamilies.regular,
    lineHeight: 18,
  },
  check: {
    alignItems: 'center',
    borderColor: colors.onboardingInkMuted,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkSelected: {
    backgroundColor: colors.starlight,
    borderColor: colors.onboardingInk,
  },
});

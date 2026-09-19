import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, radius, spacing } from '@/theme';

type ActionButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  loading?: boolean;
  variant?: 'starlight' | 'ink';
};

const variantStyles = {
  starlight: {
    background: colors.starlight,
    foreground: colors.onStarlight,
  },
  ink: {
    background: colors.onboardingInk,
    foreground: colors.onboardingSurface,
  },
} as const;

export function ActionButton({
  label,
  loading = false,
  variant = 'starlight',
  disabled,
  style,
  ...props
}: ActionButtonProps) {
  const unavailable = disabled || loading;
  const palette = variantStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      style={(state) => [
        styles.base,
        { backgroundColor: palette.background },
        state.pressed && !unavailable && styles.pressed,
        state.pressed && !unavailable && variant === 'starlight' && styles.starlightPressed,
        unavailable && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={palette.foreground} />
      ) : (
        <ThemedText
          selectable={false}
          variant="label"
          style={[styles.label, { color: palette.foreground }]}
        >
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: radius.medium,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.six,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  starlightPressed: {
    backgroundColor: colors.starlightPressed,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.onStarlight,
    textAlign: 'center',
  },
});

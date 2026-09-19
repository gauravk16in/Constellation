import type { PropsWithChildren } from 'react';
import { Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { planetStyles as s } from '@/theme/planet';

export function PlanetChoice({ label, selected = false, disabled = false, onPress, children }: PropsWithChildren<{
  label: string; selected?: boolean; disabled?: boolean; onPress: () => void;
}>) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected, disabled }} disabled={disabled}
    onPress={onPress} style={({ pressed }) => [s.chip, selected && s.selected, disabled && s.disabled, pressed && s.pressed]}>
    {children}<ThemedText selectable={false} style={s.label}>{label}</ThemedText>
  </Pressable>;
}

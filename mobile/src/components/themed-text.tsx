import { Text, type TextProps } from 'react-native';

import { colors, typography, type TypographyVariant } from '@/theme';

type ThemedTextProps = TextProps & {
  variant?: TypographyVariant;
};

export function ThemedText({
  variant = 'body',
  style,
  selectable = true,
  ...props
}: ThemedTextProps) {
  return (
    <Text
      selectable={selectable}
      style={[{ color: colors.ink }, typography[variant], style]}
      {...props}
    />
  );
}

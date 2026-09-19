import { ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';

import { colors } from '@/theme';

export function Screen({ contentContainerStyle, style, ...props }: ScrollViewProps) {
  return (
    <ScrollView
      automaticallyAdjustContentInsets
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={[styles.screen, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.canvas,
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});

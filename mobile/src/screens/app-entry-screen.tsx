import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { useAppData } from '@/features/app/app-data-provider';
import { OnboardingWelcomeScreen } from '@/screens/onboarding/onboarding-welcome-screen';
import { colors, fontFamilies, spacing } from '@/theme';

export function AppEntryScreen() {
  const { deleteChildData, setupStatus } = useAppData();
  if (setupStatus === 'complete') return <Redirect href="/home" />;
  if (setupStatus === 'missing') return <OnboardingWelcomeScreen />;
  if (setupStatus === 'corrupt') {
    const confirmReset = () => Alert.alert('Repair local setup?', 'This removes the unreadable local setup so a grown-up can create it again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Repair setup', style: 'destructive', onPress: () => void deleteChildData({ preserveEntitlement: true }) },
    ]);
    return <View style={styles.recovery}><StatusBar style="dark" />
      <ThemedText accessibilityRole="header" style={styles.heading} variant="title">Setup needs repair.</ThemedText>
      <ThemedText style={styles.body} variant="body">The local profile could not be read. No information will be sent anywhere.</ThemedText>
      <ActionButton label="Repair local setup" onPress={confirmReset} variant="ink" />
    </View>;
  }
  return <View accessibilityLabel="Opening Constellation" accessibilityRole="progressbar" style={styles.loading}><StatusBar style="dark" /><ActivityIndicator color={colors.onboardingInk} size="large" /></View>;
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', backgroundColor: colors.onboardingCanvas, flex: 1, justifyContent: 'center' },
  recovery: { backgroundColor: colors.onboardingCanvas, flex: 1, gap: spacing.four, justifyContent: 'center', padding: spacing.six },
  heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  body: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular },
});

import { Stack } from 'expo-router/stack';

import { SetupDraftProvider } from '@/features/setup/setup-draft-provider';
import { colors, fontFamilies } from '@/theme';

const setupScreenOptions = {
  contentStyle: { backgroundColor: colors.onboardingCanvas },
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.onboardingCanvas },
  headerTintColor: colors.onboardingInk,
  headerTitleStyle: {
    color: colors.onboardingInk,
    fontFamily: fontFamilies.bold,
    fontSize: 17,
  },
} as const;

export default function OnboardingLayout() {
  return (
    <SetupDraftProvider>
      <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="guardian-intro" options={{ ...setupScreenOptions, title: 'For grown-ups' }} />
        <Stack.Screen name="profile-setup" options={{ ...setupScreenOptions, title: 'Local profile' }} />
        <Stack.Screen name="interests-setup" options={{ ...setupScreenOptions, title: 'Interests' }} />
        <Stack.Screen name="support-setup" options={{ ...setupScreenOptions, title: 'Support needs' }} />
        <Stack.Screen name="contexts-setup" options={{ ...setupScreenOptions, title: 'Allowed places' }} />
        <Stack.Screen name="getting-ready" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack>
    </SetupDraftProvider>
  );
}

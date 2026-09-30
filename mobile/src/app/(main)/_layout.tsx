import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { ActivityIndicator, View } from 'react-native';

import { useAppData } from '@/features/app/app-data-provider';
import { ExperienceSessionProvider } from '@/features/session/experience-session-provider';
import { PlanetProvider } from '@/features/planet/planet-provider';
import { colors, fontFamilies } from '@/theme';

export default function MainLayout() {
  const { setupStatus } = useAppData();
  if (setupStatus === 'loading') return <View style={{ alignItems: 'center', backgroundColor: colors.onboardingCanvas, flex: 1, justifyContent: 'center' }}><ActivityIndicator color={colors.onboardingInk} /></View>;
  if (setupStatus !== 'complete') return <Redirect href="/" />;

  return (
    <ExperienceSessionProvider>
      <PlanetProvider>
      <Stack screenOptions={{
        contentStyle: { backgroundColor: colors.onboardingCanvas },
        headerBackButtonDisplayMode: 'minimal', headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.onboardingCanvas }, headerTintColor: colors.onboardingInk,
        headerTitleStyle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 17 },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="curiosity/[domainId]" options={{ title: 'Curiosity' }} />
        <Stack.Screen name="experience/[experienceId]" options={{ title: 'Experience' }} />
        <Stack.Screen name="play/[gameId]" options={{ title: 'Paper Post' }} />
        <Stack.Screen name="what-fits" options={{ title: 'Out there: what fits?' }} />
        <Stack.Screen name="bridge-nearby" options={{ title: 'Build one nearby' }} />
        <Stack.Screen name="path-nearby/[gameId]" options={{ title: 'Try it nearby' }} />
        <Stack.Screen name="maker-studio" options={{ title: 'Maker’s Workbench' }} />
        <Stack.Screen name="number-patterns" options={{ title: 'Number Patterns' }} />
        <Stack.Screen name="grown-ups" options={{ title: 'For grown-ups' }} />
        <Stack.Screen name="grown-up-controls" options={{ title: 'Grown-up controls' }} />
        <Stack.Screen name="membership" options={{ title: 'Family membership' }} />
        <Stack.Screen name="privacy-data" options={{ title: 'Privacy & local data' }} />
        <Stack.Screen name="safety-support" options={{ title: 'Safety & support' }} />
      </Stack>
      </PlanetProvider>
    </ExperienceSessionProvider>
  );
}

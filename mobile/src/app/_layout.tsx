import { useEffect } from 'react';
import {
  Quicksand_400Regular,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
  useFonts,
} from '@expo-google-fonts/quicksand';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppDataProvider } from '@/features/app/app-data-provider';
import { EntitlementProvider } from '@/features/entitlements/entitlement-provider';
import { colors, fontFamilies } from '@/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Quicksand_400Regular,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <EntitlementProvider>
        <AppDataProvider>
          <Stack screenOptions={{
            contentStyle: { backgroundColor: colors.onboardingCanvas }, headerShown: false,
            headerBackButtonDisplayMode: 'minimal', headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.onboardingCanvas }, headerTintColor: colors.onboardingInk,
            headerTitleStyle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 17 },
          }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(main)" />
            <Stack.Screen name="privacy" options={{ headerShown: true, title: 'Privacy policy' }} />
            <Stack.Screen name="terms" options={{ headerShown: true, title: 'Terms' }} />
            <Stack.Screen name="safety" options={{ headerShown: true, title: 'Safety' }} />
            <Stack.Screen name="support" options={{ headerShown: true, title: 'Support' }} />
          </Stack>
        </AppDataProvider>
      </EntitlementProvider>
    </GestureHandlerRootView>
  );
}

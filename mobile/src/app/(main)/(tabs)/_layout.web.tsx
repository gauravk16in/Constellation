import { Tabs } from 'expo-router';

import { colors, fontFamilies } from '@/theme';

export default function MainTabsWebLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false, tabBarActiveTintColor: colors.onboardingInk,
      tabBarInactiveTintColor: colors.onboardingInkMuted,
      tabBarLabelStyle: { fontFamily: fontFamilies.bold, fontSize: 12 },
      tabBarStyle: { backgroundColor: colors.onboardingSurface, borderTopColor: colors.onboardingLine },
    }}>
      <Tabs.Screen name="(home)" options={{ title: 'Planet' }} />
      <Tabs.Screen name="(curiosity)" options={{ title: 'Out There' }} />
      <Tabs.Screen name="(constellation)" options={{ title: 'My Finds' }} />
    </Tabs>
  );
}

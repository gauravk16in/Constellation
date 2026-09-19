import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { colors, fontFamilies } from '@/theme';

export default function MainTabsLayout() {
  return (
    <NativeTabs
      backgroundColor={colors.onboardingSurface}
      iconColor={{ default: colors.onboardingInkMuted, selected: colors.onboardingInk }}
      labelStyle={{
        default: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.semibold, fontSize: 11 },
        selected: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 11 },
      }}
      tintColor={colors.onboardingInk}
    >
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label>Planet</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(curiosity)">
        <NativeTabs.Trigger.Icon sf={{ default: 'safari', selected: 'safari.fill' }} md="explore" />
        <NativeTabs.Trigger.Label>Out There</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(constellation)">
        <NativeTabs.Trigger.Icon sf={{ default: 'sparkles', selected: 'sparkles' }} md="stars" />
        <NativeTabs.Trigger.Label>My Finds</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

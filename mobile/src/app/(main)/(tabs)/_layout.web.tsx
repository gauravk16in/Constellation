import { Tabs } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, fontFamilies } from '@/theme';

export default function WebTabs() {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.onboardingInk, tabBarInactiveTintColor: colors.onboardingInkMuted,
    tabBarStyle: { backgroundColor: colors.onboardingSurface, height: 68, paddingBottom: 8, paddingTop: 6 },
    tabBarLabelStyle: { fontFamily: fontFamilies.bold, fontSize: 12 } }}>
    <Tabs.Screen name="(home)" options={{ title: 'Planet', tabBarIcon: ({ color }) => <Svg width={24} height={24} viewBox="0 0 24 24"><Circle cx={12} cy={12} r={7} fill="none" stroke={color} strokeWidth={1.8}/><Path d="M3 16Q12 18 21 8" fill="none" stroke={color} strokeWidth={1.8}/></Svg> }} />
    <Tabs.Screen name="(curiosity)" options={{ title: 'Out There', tabBarIcon: ({ color }) => <Svg width={24} height={24} viewBox="0 0 24 24"><Circle cx={12} cy={12} r={9} fill="none" stroke={color} strokeWidth={1.8}/><Path d="M16 7L14 14L7 17L10 10Z" fill="none" stroke={color} strokeWidth={1.8}/></Svg> }} />
    <Tabs.Screen name="(constellation)" options={{ title: 'My Finds', tabBarIcon: ({ color }) => <Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M12 3L15 9L21 12L15 15L12 21L9 15L3 12L9 9Z" fill="none" stroke={color} strokeWidth={1.8}/></Svg> }} />
  </Tabs>;
}

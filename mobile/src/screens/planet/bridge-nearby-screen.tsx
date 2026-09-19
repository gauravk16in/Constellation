import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { ScrollView, View } from 'react-native';
import Svg from 'react-native-svg';
import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { getExperienceAgePolicy, getExperienceById } from '@/data/catalog/experience-catalog';
import { useAppData } from '@/features/app/app-data-provider';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import { BridgeDrawing } from '@/features/planet/little-landing-artwork';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { usePlanet } from '@/features/planet/planet-provider';
import { evaluateExperience } from '@/features/recommendations/recommendation-engine';
import { useExperienceSession } from '@/features/session/experience-session-provider';
import { bridgeColors, planetStyles as s } from '@/theme/planet';

export function BridgeNearbyScreen() {
  const { profile } = useAppData();
  const { data } = usePlanet();
  const { accessTier } = useEntitlements();
  const { context, updateContext, setBridgeHandoff } = useExperienceSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [guardian, setGuardian] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const artifact = data?.artifacts.at(-1);
  const experience = getExperienceById('paper-bridge')!;
  if (!profile) return null;
  const policy = getExperienceAgePolicy(experience, profile.ageBand);
  const guardianRequired = profile.ageBand === '6-7' || profile.supportNeeds.includes('guardian-alongside');
  const proceed = () => {
    const nextContext = { ...context, localHour: new Date().getHours(), availableMinutes: policy.durationMinutes,
      setting: 'indoors' as const, companions: guardian ? ['guardian' as const] : ['solo' as const],
      materialsAvailable: ['nothing-special', 'paper-drawing', 'basic-household'] as const };
    const eligibleContext = { ...nextContext, materialsAvailable: [...nextContext.materialsAvailable] };
    if (!ready || guardian === null || (guardianRequired && !guardian)) return;
    if (evaluateExperience(experience, { profile, context: eligibleContext, accessTier }).length) {
      setError('This mission does not fit the family’s current boundaries. Choose another real-world mission; your digital bridge stays safe.'); return;
    }
    updateContext(eligibleContext);
    setBridgeHandoff(artifact?.shape ?? data?.session?.state.shape ?? null);
    router.push('/experience/paper-bridge');
  };
  return <ScrollView contentInsetAdjustmentBehavior="automatic" style={s.page} contentContainerStyle={s.content}>
    <Stack.Title>Build one nearby</Stack.Title>
    <ThemedText style={s.caption}>TRY OUT THERE</ThemedText>
    <ThemedText accessibilityRole="header" style={s.title}>What will real paper do?</ThemedText>
    {artifact ? <Svg accessibilityLabel={`Your ${artifact.shape} paper bridge`} accessibilityRole="image" width="100%" height={90} viewBox="-10 -20 220 65"><BridgeDrawing shape={artifact.shape} color={bridgeColors[artifact.color]} /></Svg> : null}
    <ThemedText style={s.body}>Take your shape into a real experiment. It may behave similarly, differently, or be hard to compare. All are useful discoveries.</ThemedText>
    <View style={s.surface}><ThemedText style={s.label}>First, what is available?</ThemedText>
      <PlanetChoice label={`We have ${policy.durationMinutes} minutes, paper, two stable supports and small lightweight test objects, indoors at home.`} selected={ready} onPress={() => setReady(!ready)} />
      <ThemedText style={s.label}>Who is here now?</ThemedText>
      <PlanetChoice label="A grown-up is here" selected={guardian === true} onPress={() => setGuardian(true)} />
      {!guardianRequired ? <PlanetChoice label="I’m doing this myself" selected={guardian === false} onPress={() => setGuardian(false)} /> : <ThemedText style={s.body}>A grown-up stays with you for this version.</ThemedText>}
    </View>
    <ThemedText style={s.body}>Use a stable table or clear floor. No heavy objects, sharp tools or climbing. The next screen keeps the full safety and ready check.</ThemedText>
    {error ? <ThemedText accessibilityRole="alert" style={s.body}>{error}</ThemedText> : null}
    <ActionButton variant="ink" label="Prepare my real bridge" disabled={!ready || guardian === null || (guardianRequired && !guardian)} onPress={proceed} />
    <PlanetChoice label="Choose another mission" onPress={() => router.replace('/curiosity')} />
    <PlanetChoice label="Stay on my planet" onPress={() => router.replace('/home')} />
  </ScrollView>;
}

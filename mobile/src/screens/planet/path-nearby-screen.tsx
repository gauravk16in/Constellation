import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { getExperienceAgePolicy, getExperienceById } from '@/data/catalog/experience-catalog';
import { useAppData } from '@/features/app/app-data-provider';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import { PATH_GAMES } from '@/features/planet/path-game-engine';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { ShadowTransfer } from '@/features/planet/shadow-transfer';
import { evaluateExperience } from '@/features/recommendations/recommendation-engine';
import { useExperienceSession } from '@/features/session/experience-session-provider';
import { spacing } from '@/theme';
import { planetStyles as s } from '@/theme/planet';
import type { CompanionId, ExperienceContext } from '@/types/constellation';
import type { PathGameId } from '@/types/path-games';

const READINESS: Record<PathGameId, { materials: string; safety: string; task: string }> = {
  'object-theatre': { materials: 'Three safe, ordinary unbreakable household objects', safety: 'Tell the story only with a trusted person already with you.', task: 'Choose three nearby objects. Tell a beginning, a change and an ending together.' },
  'borrow-a-shadow': { materials: 'Paper, a pencil and a familiar outdoor object', safety: 'Work in gentle sunlight with an approved companion. Never look at the Sun.', task: 'Trace one object’s shadow twice. Compare the positions.' },
  'parcel-room': { materials: 'One low shelf, drawer or small group of safe objects', safety: 'No medicines, chemicals, sharp tools, breakables or climbing.', task: 'Group one small space by a rule you can explain.' },
  'delivery-path': { materials: 'A clear dry floor away from furniture and stairs', safety: 'Move slowly, stop if uncomfortable. A seated version is welcome.', task: 'Try three calm movements from your plan. Notice what helped you adjust.' },
};

export function PathNearbyScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const id = gameId as PathGameId;
  const game = PATH_GAMES[id];
  const { profile, activeSession } = useAppData();
  const { accessTier } = useEntitlements();
  const { context, updateContext } = useExperienceSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [materialsReady, setMaterialsReady] = useState(false);
  const [placeReady, setPlaceReady] = useState(false);
  const [weatherReady, setWeatherReady] = useState(false);
  const [companion, setCompanion] = useState<CompanionId | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!game || !profile) return <View style={s.page}><ThemedText style={s.title}>This mission could not be found.</ThemedText></View>;
  const experience = getExperienceById(game.missionId)!;
  const policy = getExperienceAgePolicy(experience, profile.ageBand);
  const needGuardian = profile.ageBand === '6-7' || profile.supportNeeds.includes('guardian-alongside');
  const isOutdoor = experience.settings.length === 1 && experience.settings[0] === 'outdoors';
  const canGo = materialsReady && placeReady && companion && (!needGuardian || companion === 'guardian') && (!isOutdoor || weatherReady);
  const proceed = () => {
    if (!canGo) return;
    const next: ExperienceContext = {
      ...context, localHour: new Date().getHours(), availableMinutes: policy.durationMinutes,
      setting: isOutdoor ? 'outdoors' : 'indoors', companions: [companion],
      materialsAvailable: ['nothing-special', ...experience.requiredMaterials.filter((material) => material !== 'nothing-special')],
      weather: isOutdoor ? 'clear' : context.weather,
    };
    const reasons = evaluateExperience(experience, { profile, context: next, accessTier });
    if (reasons.length) {
      setError(reasons.includes('membership') ? 'This real-world activity is outside the free mission library. You can keep playing here or choose another open activity in Out There.' :
        reasons.includes('guardian-boundary') ? 'This place is outside your family’s chosen boundaries. Choose another mission.' :
        reasons.includes('time-of-day') ? 'This outdoor activity needs daylight. Come back when the Sun is up.' :
        'This activity does not fit the people, place or support selected for now. Choose another mission.');
      return;
    }
    updateContext(next);
    router.push(`/experience/${experience.id}`);
  };
  return <ScrollView contentInsetAdjustmentBehavior="automatic" style={s.page} contentContainerStyle={[s.content, { paddingBottom: insets.bottom + spacing.eight }]}>
    <Stack.Title>Try it nearby</Stack.Title>
    <ThemedText style={s.caption}>TRY OUT THERE · {game.area.toUpperCase()}</ThemedText>
    <ThemedText accessibilityRole="header" style={s.title}>{game.title} leaves the screen.</ThemedText>
    <ThemedText style={s.body}>{READINESS[id].task}</ThemedText>
    {id === 'borrow-a-shadow' ? <ShadowTransfer /> : null}
    {activeSession ? <View style={s.surface}><ThemedText style={s.body}>Your current real-world mission is waiting. Finish or pause it before choosing another.</ThemedText><ActionButton variant="ink" label="Return to my mission" onPress={() => router.push(`/experience/${activeSession.experienceId}`)} /></View> : <>
      <View style={s.surface}>
        <ThemedText style={s.label}>What is available right now?</ThemedText>
        <PlanetChoice label={`We have ${policy.durationMinutes} minutes and ${READINESS[id].materials.toLowerCase()}`} selected={materialsReady} onPress={() => setMaterialsReady(!materialsReady)} />
        <PlanetChoice label={isOutdoor ? 'We are in a family-approved outdoor place' : 'We are indoors at home'} selected={placeReady} onPress={() => setPlaceReady(!placeReady)} />
        {isOutdoor ? <PlanetChoice label="The sky is clear and it is daylight now" selected={weatherReady} onPress={() => setWeatherReady(!weatherReady)} /> : null}
        <ThemedText style={s.label}>Who is with you?</ThemedText>
        <View style={s.row}>{policy.companionOptions.filter((person) => !needGuardian || person === 'guardian').map((person) => <PlanetChoice key={person} label={person === 'guardian' ? 'Trusted grown-up' : person === 'solo' ? 'By myself' : person === 'friend' ? 'Friend' : 'Sibling'} selected={companion === person} onPress={() => setCompanion(person)} />)}</View>
      </View>
      <ThemedText style={s.body}>{READINESS[id].safety} The next screen includes the full ready check.</ThemedText>
      {error ? <ThemedText accessibilityRole="alert" style={s.body}>{error}</ThemedText> : null}
      <ActionButton variant="ink" label="Prepare this real mission" disabled={!canGo} onPress={proceed} />
    </>}
    <PlanetChoice label="Choose another real-world idea" onPress={() => router.push('/curiosity')} />
    <PlanetChoice label="Back to my planet" onPress={() => router.push('/home')} />
  </ScrollView>;
}

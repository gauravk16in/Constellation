import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { getExperienceById } from '@/data/catalog/experience-catalog';
import { useAppData } from '@/features/app/app-data-provider';
import { LittleLandingArtwork } from '@/features/planet/little-landing-artwork';
import { PathGameArtwork } from '@/features/planet/path-game-artwork';
import { initialPaper } from '@/features/planet/paper-post-engine';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { usePlanet } from '@/features/planet/planet-provider';
import { initialPathState, PATH_GAMES } from '@/features/planet/path-game-engine';
import { spacing } from '@/theme';
import { planetStyles as s } from '@/theme/planet';

export function PlanetScreen() {
  const { data, error, reload } = usePlanet();
  const { activeSession, outcomes } = useAppData();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [crossed, setCrossed] = useState(false);
  const [previewLight, setPreviewLight] = useState<18 | 85>(18);
  const bridge = data?.artifacts.filter((v) => v.position === 'workshop').at(-1) ?? data?.artifacts.at(-1);
  const state = { ...initialPaper('sandbox'), shape: bridge?.shape ?? 'flat' as const, color: bridge?.color ?? 'coral' as const, gap: 'short' as const };
  const physicalBridge = outcomes.find((outcome) => outcome.experienceId === 'paper-bridge' && outcome.state === 'completed');
  const initialShadow = initialPathState('borrow-a-shadow');
  const shadowPreview = initialShadow.kind === 'shadow' && initialShadow.lesson
    ? { ...initialShadow, lesson: { ...initialShadow.lesson, phase: 'explore' as const, lightPosition: previewLight } }
    : initialShadow;
  return <ScrollView contentInsetAdjustmentBehavior="automatic" style={s.page} contentContainerStyle={[s.content, { paddingTop: Math.max(insets.top, spacing.four), paddingBottom: insets.bottom + spacing.eight }]}>
    <View style={[s.row, { justifyContent: 'space-between' }]}><ThemedText style={s.label}>POCKET PLANET</ThemedText><PlanetChoice label="Grown-ups" onPress={() => router.push('/grown-ups')} /></View>
    <ThemedText accessibilityRole="header" style={s.title}>Little Landing</ThemedText>
    <ThemedText style={s.body}>A little world shaped by your big ideas.</ThemedText>
    {!data && !error ? <ActivityIndicator accessibilityLabel="Opening your planet" /> : null}
    {error ? <View style={s.surface}><ThemedText accessibilityRole="alert" style={s.body}>{error}</ThemedText><PlanetChoice label="Try again" onPress={() => void reload()} /></View> : null}
    {data ? <>
      {data.pathSession ? <ActionButton variant="ink" label={`Continue ${PATH_GAMES[data.pathSession.gameId].title}`} onPress={() => router.push(`/play/${data.pathSession!.gameId}`)} /> : data.session ? <ActionButton variant="ink" label="Continue Paper Post" onPress={() => router.push('/play/paper-post')} /> : null}
      <View style={s.section}>
        <ThemedText style={s.caption}>TRY AN EXPERIMENT</ThemedText>
        <ThemedText accessibilityRole="header" style={s.prompt}>Move the light. Find the shade.</ThemedText>
        <PathGameArtwork state={shadowPreview} />
        <View style={s.row}>
          <PlanetChoice label="Light left" selected={previewLight === 18} onPress={() => setPreviewLight(18)} />
          <PlanetChoice label="Light right" selected={previewLight === 85} onPress={() => setPreviewLight(85)} />
        </View>
        <ThemedText accessibilityLiveRegion="polite" style={s.body}>The shadow stretches {previewLight === 18 ? 'right' : 'left'}—away from the light. What happens when you move it?</ThemedText>
        <ActionButton variant="ink" label="Try the full shadow experiment" onPress={() => router.push('/play/borrow-a-shadow')} />
      </View>
      {bridge ? <><LittleLandingArtwork overview artifacts={data.artifacts} state={{ ...state, result: crossed ? { ...state, holds: true } : null }} onTest={() => setCrossed(!crossed)} />
        <ThemedText accessibilityLiveRegion="polite" style={s.body}>{crossed ? 'Across it goes. That is your bridge.' : 'Your bridge is part of this place. Tap the parcel to send Pip across.'}</ThemedText>
        <PlanetChoice label={crossed ? 'Bring Pip back' : 'Send Pip across my bridge'} onPress={() => setCrossed(!crossed)} /></> : data.pathFinds?.at(-1) ? <><PathGameArtwork state={data.pathFinds.at(-1)!.state} /><ThemedText style={s.body}>Your saved idea is here. Change it, or try a related activity nearby.</ThemedText></> : null}
      {activeSession ? <View style={s.surface}><ThemedText style={s.label}>Your real-world mission is waiting</ThemedText><ThemedText style={s.body}>{getExperienceById(activeSession.experienceId)?.title}</ThemedText><ActionButton variant="ink" label="Return to my real-world mission" onPress={() => router.push(`/experience/${activeSession.experienceId}`)} /></View> : null}
      <ActionButton variant="ink" label={data.session ? 'Continue Paper Post' : bridge ? 'Change my bridge' : 'Try Paper Post'} onPress={() => router.push('/play/paper-post')} />
      {bridge ? <PlanetChoice label="Build one nearby" onPress={() => router.push('/bridge-nearby')} /> : null}
      <PlanetChoice label="See My Finds" onPress={() => router.push('/constellation')} />
      <View style={s.section}>
        <ThemedText style={s.label}>What else could you make happen?</ThemedText>
        <PlanetChoice label="Maker’s Workbench · Sketch shapes and connect gears" onPress={() => router.push('/maker-studio')} />
        {Object.entries(PATH_GAMES).map(([pathId, game]) => <PlanetChoice key={pathId} label={`${game.title} · ${game.question}`} onPress={() => router.push(`/play/${pathId}`)} />)}
      </View>
      {physicalBridge ? <View style={s.surface}><ThemedText style={s.label}>Tried out there · A real bridge</ThemedText><ThemedText style={s.body}>You reported trying paper building outside the game. Its gold star remembers that experience.</ThemedText><PlanetChoice label="See its learning memory" onPress={() => router.push('/constellation')} /></View> : null}
    </> : null}
  </ScrollView>;
}

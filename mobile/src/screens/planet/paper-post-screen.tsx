import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import Svg, { G } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { makeId } from '@/data/persistence/app-repository-types';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import { BridgeDrawing, LittleLandingArtwork } from '@/features/planet/little-landing-artwork';
import { PAPER_AGE_GUIDES, PAPER_SCENARIOS, paperFeedback } from '@/features/planet/paper-post-engine';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { usePlanet } from '@/features/planet/planet-provider';
import { PATH_GAMES } from '@/features/planet/path-game-engine';
import { colors, spacing } from '@/theme';
import { bridgeColors, planetStyles as s } from '@/theme/planet';
import type { PaperAction, PaperScenario, PaperShape } from '@/types/pocket-planet';

const shapes: { id: PaperShape; label: string }[] = [{ id: 'flat', label: 'Flat' }, { id: 'folded', label: 'Folded edges' }, { id: 'accordion', label: 'Accordion' }];

export function PaperPostScreen({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const params = useLocalSearchParams<{ gameId?: string }>();
  const { accessTier } = useEntitlements();
  const { data, busy, error, change, reload } = usePlanet();
  const insets = useSafeAreaInsets();
  const [placing, setPlacing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [moreTools, setMoreTools] = useState(false);
  const [scenarios, setScenarios] = useState(false);
  const [pendingScenario, setPendingScenario] = useState<PaperScenario | null>(null);
  const [replacePath, setReplacePath] = useState(false);
  const [replaceId, setReplaceId] = useState<string | undefined>();
  const booted = useRef(false);
  const available = embedded || !params.gameId || params.gameId === 'paper-post';
  useEffect(() => {
    if (!available || !data || booted.current) return;
    booted.current = true;
    if (!data.session && !data.pathSession) {
      const latest = data.artifacts.at(-1);
      void change({ type: 'start', id: makeId('game'), scenarioId: latest ? 'sandbox' : 'first-parcel', editArtifactId: latest?.id });
    }
  }, [available, change, data]);
  const session = data?.session;
  const state = session?.state;
  const act = async (action: PaperAction) => {
    if (!session) return;
    await change({ type: 'act', sessionId: session.id, action });
  };
  const chooseScenario = async (id: PaperScenario, replace = false) => {
    if (session && !replace) { setPendingScenario(id); return; }
    const next = await change({ type: 'start', id: makeId('game'), scenarioId: id, replaceSessionId: replace ? session?.id : undefined });
    if (next) { setSaved(false); setPlacing(false); setScenarios(false); setPendingScenario(null); }
  };
  const save = async () => {
    if (!session) return;
    const next = await change({ type: 'finish', sessionId: session.id, replaceArtifactId: replaceId });
    if (next) { setSaved(true); setPlacing(false); }
  };

  return <ScrollView style={s.page} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={[s.content, { paddingTop: embedded ? Math.max(insets.top, spacing.four) : spacing.four, paddingBottom: insets.bottom + spacing.eight }]}>
    {!embedded ? <Stack.Title>Paper Post</Stack.Title> : <View style={[s.row, { justifyContent: 'space-between' }]}><ThemedText style={s.label}>Little Landing</ThemedText><PlanetChoice label="Grown-ups" onPress={() => router.push('/grown-ups')} /></View>}
    {!available ? <><ThemedText style={s.title}>This game is not here yet.</ThemedText><ActionButton variant="ink" label="Back to my planet" onPress={() => router.replace('/home')} /></> : null}
    {available && !data && !error ? <ActivityIndicator color={colors.onboardingInk} accessibilityLabel="Opening your planet" /> : null}
    {available && data?.pathSession ? <View style={s.surface}>
      <ThemedText accessibilityRole="header" style={s.prompt}>Keep your current idea?</ThemedText>
      <ThemedText style={s.body}>A digital draft is saved for {PATH_GAMES[data.pathSession.gameId].title}. Return to it, or replace just that draft with Paper Post. Saved creations and real-world missions stay unchanged.</ThemedText>
      <ActionButton variant="ink" label="Resume my saved game" onPress={() => router.push(`/play/${data.pathSession!.gameId}`)} />
      <PlanetChoice label={replacePath ? 'Keep my draft' : 'Choose Paper Post instead'} onPress={() => setReplacePath(!replacePath)} />
      {replacePath ? <ActionButton variant="ink" label="Replace draft with Paper Post" disabled={busy} onPress={() => void change({ type: 'start', id: makeId('game'), scenarioId: 'first-parcel', replacePathSessionId: data.pathSession!.id })} /> : null}
    </View> : null}
    {error ? <View style={s.surface}><ThemedText accessibilityRole="alert" style={s.body}>{error}</ThemedText><PlanetChoice label="Try again" onPress={() => { if (data && !data.session && !saved) void chooseScenario('first-parcel'); else void reload(); }} /></View> : null}
    {available && session && state ? <>
      <View style={s.section}>
        <ThemedText style={s.caption}>{placing ? 'MAKE IT YOURS' : 'PAPER POST · PLAY HERE'}</ThemedText>
        <ThemedText accessibilityRole="header" style={s.prompt}>{placing ? 'Where will your bridge live?' : PAPER_SCENARIOS.find((item) => item.id === session.scenarioId)?.prompt}</ThemedText>
      </View>
      <LittleLandingArtwork state={state} disabled={busy || placing || (session.ageBand === '6-7' && !state.guardianIntroduced)}
        onFold={() => void act({ type: 'shape', value: shapes[(shapes.findIndex((v) => v.id === state.shape) + 1) % 3].id })}
        onTest={() => void act({ type: 'test' })} />
      {session.ageBand === '6-7' && !state.guardianIntroduced ? <View style={s.surface}>
        <ThemedText style={s.label}>Read this together</ThemedText><ThemedText style={s.body}>{PAPER_AGE_GUIDES['6-7'].cue}</ThemedText>
        <ActionButton variant="ink" label="We’re ready to try" loading={busy} onPress={() => void act({ type: 'introduce' })} />
      </View> : placing ? <>
        <View style={s.row}>{(['coral', 'sage', 'sky'] as const).map((color) => <PlanetChoice key={color} disabled={busy} label={`${color[0].toUpperCase()}${color.slice(1)} paper`} selected={state.color === color} onPress={() => void act({ type: 'color', value: color })}><View style={{ width: 24, height: 8, borderRadius: 4, backgroundColor: bridgeColors[color] }} /></PlanetChoice>)}</View>
        <View style={s.row}>{([{ id: 'workshop', label: 'The crossing' }, { id: 'hill', label: 'On the hill' }, { id: 'theatre', label: 'By the theatre' }] as const).map((place) => <PlanetChoice key={place.id} disabled={busy} label={place.label} selected={state.position === place.id} onPress={() => void act({ type: 'position', value: place.id })} />)}</View>
        {data!.artifacts.length >= 12 ? <View style={s.surface}><ThemedText style={s.label}>Your twelve creation spaces are full.</ThemedText><ThemedText style={s.body}>Choose one below to replace. You can undo the replacement in My Finds.</ThemedText>
          {data!.artifacts.map((artifact, i) => <PlanetChoice key={artifact.id} label={`Replace bridge ${i + 1}: ${artifact.color}, ${artifact.shape}`} selected={replaceId === artifact.id} onPress={() => setReplaceId(artifact.id)}><Svg width={120} height={30} viewBox="0 -6 205 40"><BridgeDrawing shape={artifact.shape} color={bridgeColors[artifact.color]} /></Svg></PlanetChoice>)}
        </View> : null}
        <ActionButton variant="ink" label="Keep this bridge" loading={busy} disabled={data!.artifacts.length >= 12 && !replaceId} onPress={() => void save()} />
        <PlanetChoice label="Keep experimenting" onPress={() => setPlacing(false)} />
      </> : <>
        <ThemedText accessibilityLiveRegion="polite" style={s.body}>{state.result ? paperFeedback(state) : PAPER_AGE_GUIDES[session.ageBand].cue}</ThemedText>
        <View style={s.row}>{shapes.map((shape) => <PlanetChoice key={shape.id} label={shape.label} selected={state.shape === shape.id} disabled={busy || (session.scenarioId === 'heavy-post' && shape.id !== 'folded')} onPress={() => void act({ type: 'shape', value: shape.id })}>
          <Svg width={64} height={24} viewBox="0 -9 210 65"><G><BridgeDrawing shape={shape.id} color={bridgeColors[state.color]} /></G></Svg>
        </PlanetChoice>)}</View>
        <ActionButton variant="ink" label={state.result ? 'Test again' : 'Try the parcel'} loading={busy} onPress={() => void act({ type: 'test' })} />
        {state.result && (state.result.holds || session.scenarioId === 'sandbox') ? <PlanetChoice label="Put this bridge on my planet" onPress={() => setPlacing(true)} /> : null}
        <PlanetChoice label={moreTools ? 'Hide extra tools' : 'Move the banks · Change the post'} onPress={() => setMoreTools(!moreTools)} />
        {moreTools ? <View style={s.surface}>
          <ThemedText style={s.label}>Space between the banks</ThemedText><View style={s.row}>{(['short', 'wide'] as const).map((gap) => <PlanetChoice key={gap} label={`${gap === 'short' ? 'Short' : 'Wide'} gap`} selected={state.gap === gap} disabled={busy || (session.scenarioId === 'wide-gap' && gap !== 'wide')} onPress={() => void act({ type: 'gap', value: gap })} />)}</View>
          <ThemedText style={s.label}>What is Pip carrying?</ThemedText><View style={s.row}>{([1, 2, 3] as const).map((parcels) => <PlanetChoice key={parcels} label={`${parcels} ${parcels === 1 ? 'parcel' : 'parcels'}`} selected={state.parcels === parcels} disabled={busy || (session.scenarioId === 'heavy-post' && parcels !== 3)} onPress={() => void act({ type: 'parcels', value: parcels })} />)}</View>
          <ThemedText style={s.body}>{PAPER_AGE_GUIDES[session.ageBand].hint}</ThemedText><PlanetChoice label="Reset the test" disabled={busy} onPress={() => void act({ type: 'reset' })} />
        </View> : null}
        <ThemedText style={s.caption}>A playful model, not a prediction for real paper. Your real bridge may behave differently.</ThemedText>
      </>}
    </> : null}
    {available && saved ? <View style={s.surface}>
      <ThemedText accessibilityRole="header" style={s.title}>A bridge of your own.</ThemedText>
      <ThemedText style={s.body}>Made here, saved on this device. Pip can use it whenever you visit.</ThemedText>
      <ActionButton variant="ink" label="Back to my planet" onPress={() => router.replace('/home')} />
      <PlanetChoice label="Change my bridge" onPress={async () => {
        const next = await change({ type: 'start', id: makeId('game'), scenarioId: 'sandbox', editArtifactId: data?.artifacts.at(-1)?.id });
        if (next) { setSaved(false); setPlacing(false); }
      }} />
      <PlanetChoice label="Build one nearby" onPress={() => router.push('/bridge-nearby')} />
    </View> : null}
    {available && data ? <>
      <PlanetChoice label={scenarios ? 'Close experiment prompts' : 'Choose an experiment prompt'} onPress={() => setScenarios(!scenarios)} />
      {scenarios ? <View style={s.surface}><ThemedText style={s.body}>A starting idea, not a level. Choose any available prompt.</ThemedText>{PAPER_SCENARIOS.filter((item) => !item.family || accessTier === 'family').map((scenario) => <PlanetChoice key={scenario.id} label={scenario.title} selected={session?.scenarioId === scenario.id} disabled={busy} onPress={() => void chooseScenario(scenario.id)} />)}</View> : null}
      {pendingScenario ? <View style={s.surface}><ThemedText style={s.body}>Your current Paper Post experiment is saved. Keep it or replace just this digital draft? Real-world missions are not changed.</ThemedText><PlanetChoice label="Resume current game" onPress={() => { setPendingScenario(null); setScenarios(false); }} /><PlanetChoice label="Replace draft with this experiment" disabled={busy} onPress={() => void chooseScenario(pendingScenario, true)} /></View> : null}
    </> : null}
    {embedded ? <View style={s.section}>
      <ThemedText style={s.label}>Other places in Little Landing</ThemedText>
      {Object.entries(PATH_GAMES).map(([pathId, game]) => <PlanetChoice key={pathId} label={`${game.title} · ${game.area}`} onPress={() => router.push(`/play/${pathId}`)} />)}
      <PlanetChoice label="See real-world curiosity areas" onPress={() => router.push('/curiosity')} />
    </View> : null}
  </ScrollView>;
}

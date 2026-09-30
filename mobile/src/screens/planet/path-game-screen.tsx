import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { makeId } from '@/data/persistence/app-repository-types';
import { PathGameArtwork } from '@/features/planet/path-game-artwork';
import { MOVE_CARDS, PATH_GAMES, SORT_OBJECTS, SORT_RULES, STORY_OBJECTS, canSavePath, pathFeedback } from '@/features/planet/path-game-engine';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { usePlanet } from '@/features/planet/planet-provider';
import { MissionVoice } from '@/features/voice/mission-voice';
import { spacing } from '@/theme';
import { planetStyles as s } from '@/theme/planet';
import { ShadowLessonScreen } from '@/screens/planet/shadow-lesson-screen';
import type { PathAction, PathGameId, PathGameState } from '@/types/path-games';

function StoryControls({ state, act, busy }: { state: Extract<PathGameState, { kind: 'story' }>; act: (action: PathAction) => void; busy: boolean }) {
  const scene = state.scenes[state.activeScene];
  return <View style={s.section}>
    <ThemedText style={s.label}>Choose a scene</ThemedText>
    <View style={s.row}>{([0, 1, 2] as const).map((index) => <PlanetChoice key={index} label={['Beginning', 'Something changes', 'Ending'][index]} selected={state.activeScene === index} onPress={() => act({ type: 'story-scene', scene: index })} />)}</View>
    <View style={s.row}><PlanetChoice label="Swap beginning and middle" disabled={busy} onPress={() => act({ type: 'story-swap', from: 0, to: 1 })} /><PlanetChoice label="Swap middle and ending" disabled={busy} onPress={() => act({ type: 'story-swap', from: 1, to: 2 })} /></View>
    <ThemedText style={s.label}>What appears?</ThemedText>
    <View style={s.row}>{STORY_OBJECTS.map((object) => <PlanetChoice key={object} label={object} selected={scene.object === object} disabled={busy} onPress={() => act({ type: 'story-object', value: object })} />)}</View>
    <ThemedText style={s.label}>What happens?</ThemedText>
    <View style={s.row}>{(['arrive', 'hide', 'find'] as const).map((action) => <PlanetChoice key={action} label={action} selected={scene.action === action} disabled={busy} onPress={() => act({ type: 'story-action', value: action })} />)}</View>
    <ThemedText style={s.label}>Where?</ThemedText>
    <View style={s.row}>{(['workshop', 'hill', 'theatre'] as const).map((backdrop) => <PlanetChoice key={backdrop} label={backdrop} selected={scene.backdrop === backdrop} disabled={busy} onPress={() => act({ type: 'story-backdrop', value: backdrop })} />)}</View>
    <ActionButton variant="ink" label="Read my storyboard" disabled={busy || state.scenes.some((part) => !part.object)} onPress={() => act({ type: 'story-play' })} />
    {state.played ? <ThemedText style={s.body}>Your story: {state.scenes.map((part, i) => `${['First', 'Then', 'Finally'][i]} the ${part.object} ${part.action === 'hide' ? 'hides' : part.action === 'find' ? 'is found' : 'arrives'} at the ${part.backdrop}`).join('. ')}.</ThemedText> : null}
  </View>;
}

function ShadowControls({ state, act, busy }: { state: Extract<PathGameState, { kind: 'shadow' }>; act: (action: PathAction) => void; busy: boolean }) {
  const latest = state.trials.at(-1);
  return <View style={s.section}>
    <ThemedText style={s.label}>Move the light along the arc</ThemedText>
    <View style={s.row}>{([0, 1, 2, 3, 4] as const).map((point) => <PlanetChoice key={point} label={`Light position ${point + 1}`} selected={state.light === point} disabled={busy} onPress={() => act({ type: 'shadow-light', value: point })} />)}</View>
    <ThemedText style={s.label}>Place an object</ThemedText>
    <View style={s.row}>{(['tree', 'post', 'parcel'] as const).map((object) => <PlanetChoice key={object} label={object} selected={state.object === object} disabled={busy} onPress={() => act({ type: 'shadow-object', value: object })} />)}</View>
    <ThemedText style={s.label}>Move Pip’s picnic mat</ThemedText>
    <View style={s.row}>{([0, 1, 2, 3, 4] as const).map((point) => <PlanetChoice key={point} label={`Mat position ${point + 1}`} selected={state.mat === point} disabled={busy} onPress={() => act({ type: 'shadow-mat', value: point })} />)}</View>
    <ActionButton variant="ink" label="Test the shade" disabled={busy} onPress={() => act({ type: 'shadow-test' })} />
    {latest ? <ThemedText style={s.caption}>Last test: {latest.shade ? 'Pip’s mat was in shade' : 'Pip’s mat was still in light'} · {latest.length === 1 ? 'short' : latest.length === 3 ? 'long' : 'medium'} shadow</ThemedText> : null}
  </View>;
}

const SORT_LABELS = {
  shape: ['Rounded shapes', 'Other shapes'],
  size: ['Small finds', 'Larger finds'],
  purpose: ['Things to play or learn with', 'Things for home or nature'],
} as const;
function SortControls({ state, act, busy }: { state: Extract<PathGameState, { kind: 'sort' }>; act: (action: PathAction) => void; busy: boolean }) {
  return <View style={s.section}>
    <ThemedText style={s.label}>Invent your grouping rule</ThemedText>
    <View style={s.row}>{SORT_RULES.map((rule) => <PlanetChoice key={rule} label={`Group by ${rule}`} selected={state.rule === rule} disabled={busy} onPress={() => act({ type: 'sort-rule', value: rule })} />)}</View>
    <ThemedText style={s.body}>Group one: {SORT_LABELS[state.rule][0]}. Group two: {SORT_LABELS[state.rule][1]}.</ThemedText>
    {SORT_OBJECTS.map((object) => <View key={object} style={[s.surface, { gap: spacing.one }]}><ThemedText style={s.label}>{object}</ThemedText><View style={s.row}>
      <PlanetChoice label={`Put ${object} in group one`} selected={state.groups[object] === 'left'} disabled={busy} onPress={() => act({ type: 'sort-place', object, value: 'left' })} />
      <PlanetChoice label={`Put ${object} in group two`} selected={state.groups[object] === 'right'} disabled={busy} onPress={() => act({ type: 'sort-place', object, value: 'right' })} />
    </View></View>)}
    <ActionButton variant="ink" label="Test my sorting rule" disabled={busy || Object.values(state.groups).some((group) => group === null)} onPress={() => act({ type: 'sort-test' })} />
    {state.tested ? <ThemedText style={s.caption}>Tell someone why your groups make sense. You can invent a different rule.</ThemedText> : null}
  </View>;
}

function MoveControls({ state, act, busy }: { state: Extract<PathGameState, { kind: 'move' }>; act: (action: PathAction) => void; busy: boolean }) {
  return <View style={s.section}>
    <ThemedText style={s.body}>Tap any card to change that part of Pip’s path. A seated reach is an equal way to play.</ThemedText>
    {([0, 1, 2] as const).map((slot) => <View key={slot} style={s.surface}><ThemedText style={s.label}>Move {slot + 1}</ThemedText><View style={s.row}>{MOVE_CARDS.map((card) => <PlanetChoice key={card} label={card.replaceAll('-', ' ')} selected={state.sequence[slot] === card} disabled={busy} onPress={() => act({ type: 'move-card', slot, value: card })} />)}</View></View>)}
    <ActionButton variant="ink" label="Review my movement plan" disabled={busy} onPress={() => act({ type: 'move-run' })} />
  </View>;
}

export function PathGameScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const id = gameId as PathGameId;
  const definition = PATH_GAMES[id];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, error, busy, change, reload } = usePlanet();
  const [saved, setSaved] = useState(false);
  const [replaceChoice, setReplaceChoice] = useState(false);
  const booted = useRef(false);
  useEffect(() => {
    if (!definition || !data || booted.current || data.pathSession || data.session || data.pathFinds?.some((find) => find.gameId === id)) return;
    booted.current = true;
    void change({ type: 'start-path', id: makeId('path'), gameId: id });
  }, [change, data, definition, id]);
  const session = data?.pathSession;
  const mine = session?.gameId === id ? session : null;
  const shadowLesson = mine?.state.kind === 'shadow' ? mine.state.lesson : undefined;
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (shadowLesson?.phase) scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [shadowLesson?.phase]);
  const previous = data?.pathFinds?.find((find) => find.gameId === id);
  const act = (action: PathAction) => { if (mine) void change({ type: 'act-path', sessionId: mine.id, action }); };
  const finish = async () => {
    if (!mine) return;
    const result = await change({ type: 'finish-path', sessionId: mine.id });
    if (result) setSaved(true);
  };
  const restart = async (replaceSessionId?: string, replacePaperSessionId?: string) => {
    const result = await change({ type: 'start-path', id: makeId('path'), gameId: id, replaceSessionId, replacePaperSessionId });
    if (result) { setSaved(false); setReplaceChoice(false); }
  };
  return <ScrollView ref={scrollRef} contentInsetAdjustmentBehavior="automatic" style={s.page} contentContainerStyle={[s.content, { paddingBottom: insets.bottom + spacing.eight }]}>
    <Stack.Title>{definition?.title ?? 'A place in your planet'}</Stack.Title>
    {!definition ? <ThemedText style={s.title}>This place could not be found.</ThemedText> : <>
      {!shadowLesson ? <><ThemedText style={s.caption}>{definition.area.toUpperCase()} · PLAY HERE</ThemedText>
        <ThemedText accessibilityRole="header" style={s.title}>{definition.question}</ThemedText>
        <ThemedText style={s.body}>{definition.prompt}</ThemedText></> : null}
      {definition && !shadowLesson ? <MissionVoice text={`${definition.question} ${definition.prompt}`} /> : null}
      {!data && !error ? <ActivityIndicator accessibilityLabel="Opening your saved game" /> : null}
      {error ? <View style={s.surface}><ThemedText accessibilityRole="alert" style={s.body}>{error}</ThemedText><PlanetChoice label="Reload my saved game" onPress={() => void reload()} /></View> : null}
      {data?.session ? <View style={s.surface}><ThemedText style={s.body}>Your Paper Post draft is saved. Keep playing it, or replace only this digital draft. Your real-world mission will not change.</ThemedText><ActionButton variant="ink" label="Return to Paper Post" onPress={() => router.push('/play/paper-post')} /><PlanetChoice label={replaceChoice ? 'Keep Paper Post' : `Choose ${definition.title} instead`} onPress={() => setReplaceChoice(!replaceChoice)} />{replaceChoice ? <ActionButton variant="ink" label="Replace Paper Post draft" disabled={busy} onPress={() => void restart(undefined, data.session?.id)} /> : null}</View> : null}
      {session && !mine ? <View style={s.surface}><ThemedText style={s.body}>A digital draft is saved for {PATH_GAMES[session.gameId].title}.</ThemedText><PlanetChoice label="Resume that game" onPress={() => router.push(`/play/${session.gameId}`)} /><PlanetChoice label={replaceChoice ? 'Keep the current draft' : 'Choose this game instead'} onPress={() => setReplaceChoice(!replaceChoice)} />{replaceChoice ? <ActionButton label="Replace digital draft" variant="ink" disabled={busy} onPress={() => void restart(session.id)} /> : null}</View> : null}
      {previous && !session && !saved ? <View style={s.section}><PathGameArtwork state={previous.state} /><ThemedText style={s.body}>Your creation is saved in My Finds. Change it, or try the related idea outside the game.</ThemedText><ActionButton variant="ink" label="Change my creation" disabled={busy} onPress={() => void restart()} /><PlanetChoice label="Try it nearby" onPress={() => router.push(`/path-nearby/${id}`)} /></View> : null}
      {mine && !saved ? <>
        {mine.ageBand === '6-7' && !mine.guardianIntroduced ? <View style={s.surface}><ThemedText style={s.label}>Read this together</ThemedText><ThemedText style={s.body}>A grown-up can read the short prompts and help you try one change at a time.</ThemedText><ActionButton variant="ink" label="We’re ready to play" disabled={busy} onPress={() => void change({ type: 'introduce-path', sessionId: mine.id })} /></View> : mine.state.kind === 'shadow' && mine.state.lesson ?
          <ShadowLessonScreen state={mine.state as typeof mine.state & { lesson: NonNullable<typeof mine.state.lesson> }} ageBand={mine.ageBand} busy={busy} act={act} save={() => void finish()} /> : <>
        <PathGameArtwork state={mine.state} /><ThemedText accessibilityLiveRegion="polite" style={s.body}>{pathFeedback(mine.state)}</ThemedText>
        {mine.state.kind === 'story' ? <StoryControls state={mine.state} busy={busy} act={act} /> : null}
        {mine.state.kind === 'shadow' ? <ShadowControls state={mine.state} busy={busy} act={act} /> : null}
        {mine.state.kind === 'sort' ? <SortControls state={mine.state} busy={busy} act={act} /> : null}
        {mine.state.kind === 'move' ? <MoveControls state={mine.state} busy={busy} act={act} /> : null}
        <ActionButton variant="ink" label="Keep this creation" disabled={busy || !canSavePath(mine.state)} onPress={() => void finish()} />
        </>}
      </> : null}
      {saved ? <View style={s.surface}><ThemedText accessibilityRole="header" style={s.title}>{id === 'borrow-a-shadow' ? 'Your shadow discovery lives here.' : 'Your idea has a place here.'}</ThemedText><ThemedText style={s.body}>{id === 'borrow-a-shadow' ? 'You used a flashlight model to predict, compare, and make shade. You can revisit it—or investigate real shadows with a grown-up when conditions fit.' : 'You can replay it, revise it, or try a related idea nearby.'}</ThemedText>
        <ActionButton variant="ink" label="Try it nearby" onPress={() => router.push(`/path-nearby/${id}`)} />
        <PlanetChoice label="Change my creation" onPress={() => void restart()} />
        <PlanetChoice label="See it in My Finds" onPress={() => router.push('/constellation')} />
        <PlanetChoice label="Back to my planet" onPress={() => router.push('/home')} />
      </View> : null}
      {!mine && !saved && data && !session && !data.session && !previous ? <PlanetChoice label="Start this game" onPress={() => void restart()} /> : null}
    </>}
  </ScrollView>;
}

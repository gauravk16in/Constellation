import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, View, type GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { useAppData } from '@/features/app/app-data-provider';
import { NUMBER_CHALLENGES, distanceFromBase, leftChoices, nearBaseParts, rightChoices } from '@/features/planet/number-patterns-engine';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { usePlanet } from '@/features/planet/planet-provider';
import { MissionVoice } from '@/features/voice/mission-voice';
import { colors, fontFamilies, spacing } from '@/theme';
import { planetInk as p, planetStyles as s } from '@/theme/planet';

type Phase = 'first' | 'second' | 'left' | 'right' | 'reveal';

function DistanceRail({ base, value, gap, onChange }: { base: number; value: number; gap: number; onChange: (next: number) => void }) {
  const [width, setWidth] = useState(300);
  const update = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.locationX;
    if (Number.isFinite(x)) onChange(Math.max(0, Math.min(10, Math.round((x - 24) / Math.max(1, width - 48) * 10))));
  };
  const thumbLeft = 2 + gap / 10 * Math.max(0, width - 48);
  return <View style={{ backgroundColor: p.paper, borderColor: p.ink, borderCurve: 'continuous', borderRadius: 24, borderWidth: 1.5, gap: spacing.two, padding: spacing.four }}>
    <ThemedText style={s.label}>{value} is how far from {base}?</ThemedText>
    <ThemedText accessibilityLiveRegion="polite" style={[s.prompt, { textAlign: 'center' }]}>{value} + {gap} = {value + gap}</ThemedText>
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)} accessible={false} onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true}
      onResponderGrant={update} onResponderMove={update} onResponderRelease={update}
      style={{ height: 72, justifyContent: 'center' }}>
      <View style={{ height: 5, backgroundColor: p.earthDark, marginHorizontal: 24, borderRadius: 3 }} />
      <View style={{ position: 'absolute', left: thumbLeft, top: 7, height: 48, width: 48, borderRadius: 24, borderColor: p.ink, borderWidth: 2, backgroundColor: p.coral, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText selectable={false} style={[s.label, { fontSize: 20 }]}>{gap}</ThemedText>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 19, position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <ThemedText style={s.caption}>0</ThemedText><ThemedText style={s.caption}>5</ThemedText><ThemedText style={s.caption}>10</ThemedText>
      </View>
    </View>
    <ThemedText style={s.caption}>Slide the paper marker, tap the line, or use the buttons.</ThemedText>
    <View style={s.row}>
      <PlanetChoice label="One less" disabled={gap <= 0} onPress={() => onChange(gap - 1)} />
      <PlanetChoice label="One more" disabled={gap >= 10} onPress={() => onChange(gap + 1)} />
    </View>
  </View>;
}

function NumberArtwork({ first, second, base, left, right, revealed, pairOnly }: { first: number; second: number; base: number; left: number; right: number; revealed: boolean; pairOnly: boolean }) {
  return <View accessibilityRole="image" accessibilityLabel={revealed ? pairOnly ? `${first} and ${second} are both near ten. They need ${base - first} and ${base - second} to reach ten.` : `${first} times ${second} is ${first * second}. The near-base parts are ${left} and ${right}.` : `Two paper number ribbons marked ${first} and ${second}, both near ${base}.`}
    style={{ aspectRatio: 1.7, backgroundColor: p.sky, borderCurve: 'continuous', borderRadius: 24, overflow: 'hidden' }}>
    <Svg width="100%" height="100%" viewBox="0 0 340 200">
      <Rect width="340" height="200" fill={p.sky} />
      <Path d="M0 173Q90 145 175 171Q260 140 340 170V200H0Z" fill={p.grassLight} />
      {[first, second].map((number, index) => <Svg key={index} x={index ? 180 : 36} y={45} width={124} height={104}>
        <Rect x={1} y={1} width={122} height={100} rx={14} fill={p.paper} stroke={p.ink} strokeWidth={2} />
        <SvgText x={62} y={70} textAnchor="middle" fontFamily={fontFamilies.bold} fontSize={42} fill={p.ink}>{number}</SvgText>
      </Svg>)}
      <Circle cx={170} cy={97} r={20} fill={p.coral} stroke={p.ink} strokeWidth={2} />
      <SvgText x={170} y={104} textAnchor="middle" fontFamily={fontFamilies.bold} fontSize={27} fill={p.ink}>{revealed && !pairOnly ? '×' : '?'}</SvgText>
      <SvgText x={170} y={184} textAnchor="middle" fontFamily={fontFamilies.bold} fontSize={13} fill={p.ink}>{revealed ? pairOnly ? 'TWO WAYS TO MAKE TEN' : `${left} × ${base} + ${right}` : `LOOK TOWARD ${base}`}</SvgText>
    </Svg>
  </View>;
}

export function NumberPatternsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAppData();
  const { data, error, busy, change } = usePlanet();
  const ageBand = profile?.ageBand ?? '8-9';
  const challenge = NUMBER_CHALLENGES[ageBand];
  const parts = nearBaseParts(challenge.base, challenge.first, challenge.second);
  const [phase, setPhase] = useState<Phase>('first');
  const [gap, setGap] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [replay, setReplay] = useState(false);
  const [paperPrompt, setPaperPrompt] = useState(false);
  const finished = Boolean(data?.numberLessons?.some((lesson) => lesson.id === 'near-base'));
  const close = () => { setFeedback(''); setGap(0); };
  const checkGap = () => {
    const value = phase === 'first' ? challenge.first : challenge.second;
    if (gap !== distanceFromBase(challenge.base, value)) { setFeedback(`${value} + ${gap} makes ${value + gap}. Slide until it makes ${challenge.base}; try again.`); return; }
    setFeedback(`${value} needs ${gap} to reach ${challenge.base}.`);
    setGap(0);
    setPhase(phase === 'first' ? 'second' : ageBand === '6-7' ? 'reveal' : 'left');
  };
  const choosePart = (value: number) => {
    const expected = phase === 'left' ? parts.left : parts.right;
    if (value !== expected) { setFeedback(phase === 'left' ? `Try ${challenge.first} minus ${parts.secondGap}. You can use the two gaps above.` : `Try ${parts.firstGap} times ${parts.secondGap}. No timer—take another look.`); return; }
    setFeedback(phase === 'left' ? `${challenge.first} − ${parts.secondGap} = ${parts.left}. That is the left part.` : `${parts.firstGap} × ${parts.secondGap} = ${parts.right}. Now the two parts fit together.`);
    setPhase(phase === 'left' ? 'right' : 'reveal');
  };
  const save = async () => {
    const result = await change({ type: 'complete-number-lesson', lessonId: 'near-base' });
    if (result) { setReplay(false); setPaperPrompt(false); close(); }
  };
  return <ScrollView contentInsetAdjustmentBehavior="automatic" style={s.page} contentContainerStyle={[s.content, { paddingTop: Math.max(insets.top, spacing.four), paddingBottom: insets.bottom + spacing.eight }]}>
    <Stack.Title>Number Patterns</Stack.Title>
    <ThemedText style={s.caption}>STOP 6 · TEST & DISCOVER · PLAY HERE</ThemedText>
    <ThemedText accessibilityRole="header" style={s.title}>{challenge.title}</ThemedText>
    <ThemedText style={s.body}>{challenge.cue}</ThemedText>
    <MissionVoice text={`${challenge.title}. ${challenge.cue} Move the number marker or use the buttons to find the missing gap.`} />
    {ageBand === '6-7' ? <ThemedText style={s.label}>Grown-up, read and try these ten-pairs together. Multiplication comes later.</ThemedText> : <ThemedText style={s.body}>This near-base multiplication pattern is sometimes taught as Nikhilam in Vedic maths. Let’s see why it works, not race a clock.</ThemedText>}
    <NumberArtwork first={challenge.first} second={challenge.second} base={challenge.base} left={parts.left} right={parts.right} revealed={phase === 'reveal' || (finished && !replay)} pairOnly={ageBand === '6-7'} />
    {error ? <ThemedText accessibilityRole="alert" style={s.body}>{error}</ThemedText> : null}
    {finished && !replay ? <View style={s.section}>
      <View style={s.surface}><ThemedText accessibilityRole="header" style={s.prompt}>Your number discovery is saved.</ThemedText>
        <ThemedText style={s.body}>{ageBand === '6-7' ? `You found the missing steps: ${challenge.first} + ${parts.firstGap} and ${challenge.second} + ${parts.secondGap} both make ten.` : `${challenge.first} × ${challenge.second} = ${parts.left} × ${challenge.base} + ${parts.right} = ${parts.product}. You tested the parts of the pattern.`}</ThemedText>
        <ThemedText style={s.caption}>Practised here · no score and no gold star</ThemedText></View>
      {paperPrompt ? <View style={{ backgroundColor: p.ink, borderCurve: 'continuous', borderRadius: 24, gap: spacing.three, padding: spacing.four }}>
        <ThemedText accessibilityRole="header" style={[s.prompt, { color: p.paper }]}>Take the pattern off-screen.</ThemedText>
        <ThemedText style={[s.body, { color: p.paper }]}>{ageBand === '6-7' ? 'With a grown-up, draw two rows of ten squares. Fill seven in one and eight in the other. How many spaces are left? Tell each other.' : `With paper and a grown-up’s okay, draw a number line ending at ${challenge.base}. Mark ${challenge.first} and ${challenge.second}, then explain how their two gaps help you find the product.`}</ThemedText>
        <ThemedText style={[s.caption, { color: p.paper }]}>The phone can wait. Nothing you say or draw is recorded.</ThemedText>
        <PlanetChoice label="Back to the number lesson" onPress={() => setPaperPrompt(false)} />
      </View> : <ActionButton variant="ink" label="Try this with real paper" onPress={() => setPaperPrompt(true)} />}
      <PlanetChoice label="Try these numbers again" onPress={() => { setReplay(true); setPhase('first'); setGap(0); setFeedback(''); }} />
      <PlanetChoice label="Back to my play path" onPress={() => router.push('/home')} />
    </View> : <View style={s.section}>
      {phase === 'first' || phase === 'second' ? <>
        <ThemedText style={s.caption}>{phase === 'first' ? '1 · FIND THE FIRST GAP' : '2 · FIND THE SECOND GAP'}</ThemedText>
        <DistanceRail base={challenge.base} value={phase === 'first' ? challenge.first : challenge.second} gap={gap} onChange={(value) => { setGap(value); setFeedback(''); }} />
        <ActionButton variant="ink" label="Check this gap" onPress={checkGap} />
      </> : null}
      {phase === 'left' ? <View style={s.section}>
        <ThemedText style={s.caption}>3 · CROSS-SUBTRACT</ThemedText>
        <ThemedText accessibilityRole="header" style={s.prompt}>What is {challenge.first} − {parts.secondGap}?</ThemedText>
        <ThemedText style={s.body}>Take the second gap away from the first number. Tap the part you found.</ThemedText>
        <View style={s.row}>{leftChoices(parts.left).map((choice) => <PlanetChoice key={choice} label={`${choice}`} onPress={() => choosePart(choice)} />)}</View>
      </View> : null}
      {phase === 'right' ? <View style={s.section}>
        <ThemedText style={s.caption}>4 · THE SMALL PRODUCT</ThemedText>
        <ThemedText accessibilityRole="header" style={s.prompt}>What is {parts.firstGap} × {parts.secondGap}?</ThemedText>
        <ThemedText style={s.body}>Multiply only the two little gaps. Tap your result.</ThemedText>
        <View style={s.row}>{rightChoices(parts.right).map((choice) => <PlanetChoice key={choice} label={`${choice}`} onPress={() => choosePart(choice)} />)}</View>
      </View> : null}
      {phase === 'reveal' ? <View style={s.surface}>
        <ThemedText style={s.caption}>THE PATTERN YOU FOUND</ThemedText>
        <ThemedText accessibilityRole="header" style={s.prompt}>{ageBand === '6-7' ? 'Two different ways to reach ten.' : `${challenge.first} × ${challenge.second} = ${parts.product}`}</ThemedText>
        <ThemedText style={s.body}>{ageBand === '6-7' ? `${challenge.first} + ${parts.firstGap} = ten. ${challenge.second} + ${parts.secondGap} = ten. You can draw those spaces on paper next.` : `The left part, ${parts.left}, counts groups of ${challenge.base}. The two gaps make ${parts.right} more. ${parts.left} × ${challenge.base} + ${parts.right} = ${parts.product}.`}</ThemedText>
        <ActionButton variant="ink" label="Keep this discovery" disabled={busy} onPress={() => void save()} />
      </View> : null}
      {feedback ? <ThemedText accessibilityLiveRegion="polite" style={[s.body, { backgroundColor: colors.domainTest, borderCurve: 'continuous', borderRadius: 14, padding: spacing.three }]}>{feedback}</ThemedText> : null}
      <ThemedText style={s.caption}>No timer, score, or locked door. Change your answer and try again.</ThemedText>
    </View>}
  </ScrollView>;
}

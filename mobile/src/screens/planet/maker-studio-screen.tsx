import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { ScrollView, View, type GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { GEAR_PARTS, STUDIO_SHAPES, canAdvanceStudio, gearAngles, nextStudioPhase, placeGearPart, shapePoints, strokePath, type GearPart, type StudioPhase, type StudioPoint, type StudioShape, type StudioStroke } from '@/features/planet/maker-studio-engine';
import { useAppData } from '@/features/app/app-data-provider';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import { fontFamilies, spacing } from '@/theme';
import { planetInk as p, planetStyles as s } from '@/theme/planet';

const palette = [
  { label: 'Coral', color: p.coral },
  { label: 'Sage', color: p.grass },
  { label: 'Sky', color: p.blue },
] as const;

const partNames: Record<GearPart, string> = { driver: 'first gear', partner: 'second gear', handle: 'turning handle' };

function ShapeCanvas({ shape, phase, strokes, color, onStroke }: {
  shape: StudioShape; phase: StudioPhase; strokes: StudioStroke[]; color: string; onStroke: (stroke: StudioStroke) => void;
}) {
  const [width, setWidth] = useState(320);
  const active = useRef<StudioPoint[]>([]);
  const [preview, setPreview] = useState<StudioPoint[]>([]);
  const toPoint = (event: GestureResponderEvent): StudioPoint => ({
    x: Math.max(0, Math.min(320, event.nativeEvent.locationX / Math.max(1, width) * 320)),
    y: Math.max(0, Math.min(240, event.nativeEvent.locationY / Math.max(1, width) * 320)),
  });
  const start = (event: GestureResponderEvent) => { active.current = [toPoint(event)]; setPreview(active.current); };
  const move = (event: GestureResponderEvent) => {
    if (active.current.length === 0) return;
    const point = toPoint(event);
    const prior = active.current.at(-1)!;
    if (Math.abs(point.x - prior.x) + Math.abs(point.y - prior.y) < 3) return;
    active.current = [...active.current, point].slice(0, 300);
    setPreview(active.current);
  };
  const finish = () => {
    if (active.current.length > 0) onStroke({ points: active.current, color });
    active.current = [];
    setPreview([]);
  };
  return <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)} style={{ aspectRatio: 4 / 3, backgroundColor: p.paper, borderCurve: 'continuous', borderRadius: 24, overflow: 'hidden' }}>
    <Svg accessibilityLabel={phase === 'guided' ? `Drawing board with a ${shape} guide` : 'Your drawing board'} accessibilityRole="image" height="100%" viewBox="0 0 320 240" width="100%">
      <Rect width="320" height="240" fill={p.paper} />
      {phase === 'guided' ? <Path d={strokePath(shapePoints(shape))} fill="none" stroke={p.earthDark} strokeDasharray="7 8" strokeLinecap="round" strokeWidth="5" /> : null}
      {strokes.map((stroke, index) => <Path key={index} d={strokePath(stroke.points)} fill="none" stroke={stroke.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />)}
      {preview.length > 0 ? <Path d={strokePath(preview)} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" /> : null}
    </Svg>
    <View accessible={false} onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderGrant={start} onResponderMove={move} onResponderRelease={finish} onResponderTerminate={finish} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
  </View>;
}

function GearDrawing({ placed, turns }: { placed: GearPart[]; turns: number }) {
  const angles = gearAngles(turns);
  return <View accessibilityLabel={placed.length < 3 ? `${placed.length} of 3 parts placed` : `Two gears connected. The first turns clockwise and the second turns counterclockwise. Handle turned ${turns} ${turns === 1 ? 'time' : 'times'}.`} accessibilityRole="image" style={{ aspectRatio: 4 / 3, backgroundColor: p.sky, borderCurve: 'continuous', borderRadius: 24, overflow: 'hidden' }}>
    <Svg height="100%" viewBox="0 0 320 240" width="100%">
      <Rect width="320" height="240" fill={p.sky} />
      <Path d="M0 198Q160 170 320 200V240H0Z" fill={p.grassLight} />
      {([['driver', 104, angles.driver], ['partner', 216, angles.partner]] as const).map(([part, x, angle]) => <G key={part}>
        <Circle cx={x} cy="116" r="51" fill={placed.includes(part) ? p.paper : 'none'} stroke={p.ink} strokeDasharray={placed.includes(part) ? undefined : '5 8'} strokeWidth="3" />
        {placed.includes(part) ? <G transform={`rotate(${angle} ${x} 116)`}>
          {Array.from({ length: 12 }, (_, index) => <Rect key={index} fill={p.paper} height="15" rx="2" stroke={p.ink} strokeWidth="2" transform={`rotate(${index * 30} ${x} 116)`} width="12" x={x - 6} y="58" />)}
          {[0, 45, 90, 135].map((direction) => <Path key={direction} d={`M${x - 29} 116H${x + 29}`} stroke={p.ink} strokeWidth="5" transform={`rotate(${direction} ${x} 116)`} />)}
          <Circle cx={x} cy="116" r="11" fill={p.coral} stroke={p.ink} strokeWidth="2" />
          <Circle cx={x + 24} cy="116" r="5" fill={p.ink} />
        </G> : <SvgText fill={p.ink} fontFamily={fontFamilies.bold} fontSize="12" textAnchor="middle" x={x} y="120">{part === 'driver' ? 'FIRST' : 'SECOND'}</SvgText>}
      </G>)}
      {placed.includes('handle') ? <Path d="M104 116L104 70L129 62" fill="none" stroke={p.ink} strokeLinecap="round" strokeWidth="7" /> : <Path d="M104 69L129 62" fill="none" stroke={p.ink} strokeDasharray="5 7" strokeWidth="3" />}
      <SvgText fill={p.ink} fontFamily={fontFamilies.bold} fontSize="13" textAnchor="middle" x="160" y="219">{placed.length === 3 ? 'TURN THE HANDLE' : 'MATCH THE THREE OUTLINES'}</SvgText>
    </Svg>
  </View>;
}

export function MakerStudioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAppData();
  const { accessTier } = useEntitlements();
  const [station, setStation] = useState<'shapes' | 'gears'>('shapes');
  const [shape, setShape] = useState<StudioShape>('triangle');
  const [phase, setPhase] = useState<StudioPhase>('guided');
  const [color, setColor] = useState<string>(palette[0].color);
  const [strokes, setStrokes] = useState<StudioStroke[]>([]);
  const [paperPrompt, setPaperPrompt] = useState(false);
  const [placed, setPlaced] = useState<GearPart[]>([]);
  const [selectedPart, setSelectedPart] = useState<GearPart | null>(null);
  const [turns, setTurns] = useState(0);
  const [gearMessage, setGearMessage] = useState('Choose a part, then match its outline.');
  const chooseShape = (next: StudioShape) => { setShape(next); setPhase('guided'); setStrokes([]); setPaperPrompt(false); };
  const addShape = () => setStrokes((current) => [...current, { points: shapePoints(shape), color }]);
  const place = (slot: GearPart) => {
    if (!selectedPart) { setGearMessage('Choose a part from the tray first.'); return; }
    const next = placeGearPart(placed, selectedPart, slot);
    if (next.length === placed.length) { setGearMessage(selectedPart === slot ? 'That part is already placed.' : `Try the ${partNames[selectedPart]} outline.`); return; }
    setPlaced(next); setSelectedPart(null);
    setGearMessage(next.length === 3 ? 'Now turn the handle and watch both gears.' : `${partNames[slot]} placed. Choose another part.`);
  };
  return <ScrollView contentInsetAdjustmentBehavior="automatic" style={s.page} contentContainerStyle={[s.content, { paddingTop: Math.max(insets.top, spacing.four), paddingBottom: insets.bottom + spacing.eight }]}>
    <Stack.Title>Maker’s Workbench</Stack.Title>
    <ThemedText style={s.caption}>MAKE & CREATE · PLAY HERE</ThemedText>
    <ThemedText accessibilityRole="header" style={s.title}>Try an idea with your hands.</ThemedText>
    <ThemedText style={s.body}>Sketch a shape, or make two gears turn. Then take an idea into the real world.</ThemedText>
    {profile?.ageBand === '6-7' ? <ThemedText style={s.label}>Read and try this together with your grown-up.</ThemedText> : null}
    <View style={s.row}>
      <PlanetChoice label="Shape studio" selected={station === 'shapes'} onPress={() => setStation('shapes')} />
      <PlanetChoice label="Gear table" selected={station === 'gears'} onPress={() => setStation('gears')} />
    </View>

    {station === 'shapes' ? <View style={s.section}>
      <View style={{ gap: spacing.two }}>
        <ThemedText accessibilityRole="header" style={s.prompt}>{phase === 'guided' ? 'Follow the shape.' : phase === 'memory' ? 'Now hide the guide.' : 'Make it yours.'}</ThemedText>
        <ThemedText style={s.body}>{phase === 'guided' ? 'Draw over the dotted line with your finger. A shape button works too.' : phase === 'memory' ? 'Try the same shape without the guide. It does not need to be perfect.' : 'Use three colours to make a picture of your own. Try repeating or combining shapes.'}</ThemedText>
      </View>
      <View style={s.row}>{STUDIO_SHAPES.map((item) => <PlanetChoice key={item} label={item[0].toUpperCase() + item.slice(1)} selected={shape === item} onPress={() => chooseShape(item)} />)}</View>
      <ShapeCanvas color={color} onStroke={(stroke) => setStrokes((current) => [...current, stroke])} phase={phase} shape={shape} strokes={strokes} />
      <ThemedText accessibilityLiveRegion="polite" style={s.caption}>{strokes.length} {strokes.length === 1 ? 'mark' : 'marks'} on your picture.</ThemedText>
      <View style={s.row}>{palette.map((item) => <PlanetChoice key={item.label} label={item.label} selected={color === item.color} onPress={() => setColor(item.color)} />)}</View>
      <View style={s.row}>
        <PlanetChoice label={`Add a ${shape} without drawing`} onPress={addShape} />
        <PlanetChoice label="Undo last mark" disabled={strokes.length === 0} onPress={() => setStrokes((current) => current.slice(0, -1))} />
      </View>
      {phase !== 'create' ? <ActionButton variant="ink" label={phase === 'guided' ? 'Try without the guide' : 'Make my own picture'} disabled={!canAdvanceStudio(phase, strokes)} onPress={() => { setPhase(nextStudioPhase(phase)); setStrokes([]); }} /> : <>
        <ThemedText style={s.caption}>Your drawing is yours to change. This practice is not scored or saved as a star.</ThemedText>
        {paperPrompt ? <View style={{ backgroundColor: p.ink, borderCurve: 'continuous', borderRadius: 24, gap: spacing.three, padding: spacing.four }}>
          <ThemedText accessibilityRole="header" style={[s.prompt, { color: p.paper }]}>Now try it on paper.</ThemedText>
          <ThemedText style={[s.body, { color: p.paper }]}>With a grown-up’s okay, find paper and three colours. Draw your shape again, then repeat or combine it to make something new. The phone can wait here.</ThemedText>
          <PlanetChoice label="Back to my picture" onPress={() => setPaperPrompt(false)} />
        </View> : <ActionButton variant="ink" label="Try this on real paper" onPress={() => setPaperPrompt(true)} />}
        {accessTier === 'family' ? <PlanetChoice label="Open the full three-colour mission" onPress={() => router.push('/experience/three-colour-picture')} /> : null}
      </>}
    </View> : <View style={s.section}>
      <View style={{ gap: spacing.two }}>
        <ThemedText accessibilityRole="header" style={s.prompt}>What happens when gears connect?</ThemedText>
        <ThemedText style={s.body}>Choose each paper part, then tap its matching outline. Turn the handle when they are all in place.</ThemedText>
      </View>
      <GearDrawing placed={placed} turns={turns} />
      <ThemedText style={s.label}>Parts tray</ThemedText>
      <View style={s.row}>{GEAR_PARTS.map((part) => <PlanetChoice key={part} label={partNames[part]} selected={selectedPart === part} disabled={placed.includes(part)} onPress={() => setSelectedPart(part)} />)}</View>
      <ThemedText style={s.label}>Match an outline</ThemedText>
      <View style={s.row}>{GEAR_PARTS.map((part) => <PlanetChoice key={part} label={`${partNames[part]} outline`} selected={placed.includes(part)} disabled={placed.includes(part)} onPress={() => place(part)} />)}</View>
      <ThemedText accessibilityLiveRegion="polite" style={s.body}>{gearMessage}</ThemedText>
      <ActionButton variant="ink" label="Turn the handle" disabled={placed.length !== 3} onPress={() => { setTurns((count) => count + 1); setGearMessage('The first gear turns one way; the connected gear turns the other way.'); }} />
      {turns > 0 ? <View style={s.surface}>
        <ThemedText style={s.label}>What did you notice?</ThemedText>
        <ThemedText style={s.body}>These two connected gears turn in opposite directions. This simplified drawing shows one relationship; real machines have other parts and constraints.</ThemedText>
        <ThemedText style={s.body}>Want to spot gears nearby? Ask a grown-up to point out a safe example. Do not open or touch a machine to look inside.</ThemedText>
      </View> : null}
      <PlanetChoice label="Take the parts apart and try again" onPress={() => { setPlaced([]); setSelectedPart(null); setTurns(0); setGearMessage('Choose a part, then match its outline.'); }} />
    </View>}
  </ScrollView>;
}

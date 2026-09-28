import { useState } from 'react';
import { View, type GestureResponderEvent } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { PathGameArtwork } from '@/features/planet/path-game-artwork';
import { hasComparedBothSides, shadowProjection } from '@/features/planet/shadow-lesson';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { fontFamilies, spacing } from '@/theme';
import { planetInk as p, planetStyles as s } from '@/theme/planet';
import type { PathAction, ShadowState } from '@/types/path-games';

type LessonState = ShadowState & { lesson: NonNullable<ShadowState['lesson']> };

function ComparisonScene({ observations }: { observations: readonly number[] }) {
  const positions = [observations.find((position) => shadowProjection(position).side === 'right') ?? 18,
    observations.find((position) => shadowProjection(position).side === 'left') ?? 85];
  return <View accessibilityRole="image" accessibilityLabel="Two observations: with the light left, the shadow stretches right; with the light right, the shadow stretches left" style={{ borderRadius: 22, borderCurve: 'continuous', overflow: 'hidden' }}>
    <Svg width="100%" height={142} viewBox="0 0 344 142">
      {positions.map((position, index) => {
        const x = index * 174;
        const lightX = x + 20 + position * 1.3;
        const treeX = x + 86;
        const tipX = treeX + (treeX - lightX) * 1.1;
        return <G key={index}>
          <Rect x={x} y={0} width={170} height={142} rx={20} fill={p.sky} />
          <Rect x={x} y={100} width={170} height={42} fill={p.earth} />
          <Circle cx={lightX} cy={35} r={15} fill={p.paper} stroke={p.ink} strokeWidth={2} />
          <Ellipse cx={(treeX + tipX) / 2} cy={106} rx={Math.max(10, Math.abs(tipX - treeX) / 2)} ry={7} fill={p.ink} opacity={0.65} />
          <Path d={`M${treeX} 104V61`} stroke={p.ink} strokeWidth={5} />
          <Circle cx={treeX} cy={55} r={17} fill={p.grassDark} stroke={p.ink} strokeWidth={1.5} />
          <SvgText x={x + 85} y={133} textAnchor="middle" fontFamily={fontFamilies.bold} fontSize={12} fill={p.ink}>{index === 0 ? 'FIRST' : 'THEN'}</SvgText>
        </G>;
      })}
    </Svg>
  </View>;
}

function ShadowScene({ state, busy, act }: { state: LessonState; busy: boolean; act: (action: PathAction) => void }) {
  const [preview, setPreview] = useState<number | null>(null);
  const [width, setWidth] = useState(300);
  const movable = !busy && ['explore', 'challenge'].includes(state.lesson.phase);
  const shownPosition = preview ?? state.lesson.lightPosition;
  const move = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.locationX;
    if (Number.isFinite(x)) setPreview(Math.max(0, Math.min(100, Math.round(x / width * 100))));
  };
  const rendered = { ...state, lesson: { ...state.lesson, lightPosition: shownPosition } };
  const setPosition = (value: number) => {
    act({ type: 'shadow-move-light', value });
  };
  return <View style={{ gap: spacing.two }}>
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <PathGameArtwork state={rendered} />
      {movable ? <View
        accessible={false}
        onStartShouldSetResponder={() => true}
        onResponderGrant={move}
        onResponderMove={move}
        onResponderRelease={(event) => { const x = event.nativeEvent.locationX; setPreview(null); if (Number.isFinite(x)) act({ type: 'shadow-move-light', value: Math.max(0, Math.min(100, Math.round(x / width * 100))) }); }}
        onResponderTerminate={() => setPreview(null)}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '42%' }}
      /> : null}
    </View>
    {movable ? <>
      <ThemedText style={s.caption}>Slide the light across the top of the picture, or use these buttons.</ThemedText>
      <View style={s.row}>
        <PlanetChoice label="Light left" selected={shownPosition <= 28} disabled={busy} onPress={() => setPosition(0)} />
        <PlanetChoice label="Light above" selected={shownPosition > 28 && shownPosition < 72} disabled={busy} onPress={() => setPosition(50)} />
        <PlanetChoice label="Light right" selected={shownPosition >= 72} disabled={busy} onPress={() => setPosition(85)} />
      </View>
    </> : null}
  </View>;
}

export function ShadowLessonScreen({ state, ageBand, busy, act, save }: {
  state: LessonState; ageBand: '6-7' | '8-9' | '10-12'; busy: boolean;
  act: (action: PathAction) => void; save: () => void;
}) {
  const lesson = state.lesson;
  const phase = lesson.phase;
  const projection = shadowProjection(lesson.lightPosition);
  const predictionResult = shadowProjection(18).side;
  const phaseLabel = { predict: '1 · MAKE A PREDICTION', explore: '2 · EXPERIMENT', compare: '3 · EXPLAIN', challenge: '4 · TRY IT YOURSELF', complete: 'YOUR DISCOVERY' }[phase];
  const heading = {
    predict: 'Where will the shadow fall?',
    explore: 'What changes when the light moves?',
    compare: 'What pattern did you find?',
    challenge: 'Can you shade Pip’s mat?',
    complete: 'You made a place in the shade.',
  }[phase];
  return <View style={s.section}>
    <ThemedText style={s.caption}>{phaseLabel}</ThemedText>
    <ThemedText accessibilityRole="header" style={s.title}>{heading}</ThemedText>
    <ThemedText style={s.body}>{phase === 'predict' ? 'The light is left of the tree. Point to where you think the shadow will appear.' :
      phase === 'explore' ? 'Slide the light to the other side of the tree. Watch the shadow move, then keep that observation.' :
      phase === 'compare' ? 'You saw the light on both sides. Think about where the shadow went.' :
      phase === 'challenge' ? 'Pip left a mat to the right of the tree. Move the light until the mat is in shade, then test your idea.' :
      'You predicted, tested both sides, and used what you noticed to shade the mat.'}</ThemedText>
    {phase === 'compare' ? <ComparisonScene observations={lesson.observations} /> : <ShadowScene state={state} busy={busy} act={act} />}

    {phase === 'predict' ? <View style={s.section}>
      <ThemedText style={s.label}>My prediction</ThemedText>
      <View style={s.row}>{(['left', 'right', 'under'] as const).map((side) => <PlanetChoice key={side} label={side === 'under' ? 'Under the tree' : `To the ${side}`} selected={lesson.prediction === side} disabled={busy} onPress={() => act({ type: 'shadow-predict', value: side })} />)}</View>
      <ActionButton variant="ink" label="Reveal the shadow" disabled={!lesson.prediction || busy} onPress={() => act({ type: 'shadow-reveal' })} />
    </View> : null}

    {phase === 'explore' ? <View style={s.section}>
      <ThemedText accessibilityLiveRegion="polite" style={s.body}>{lesson.prediction === predictionResult ? 'Your first prediction matched the model: the shadow landed to the right.' : `You predicted ${lesson.prediction === 'under' ? 'under the tree' : `to the ${lesson.prediction}`}. In this model it landed to the right. The tree blocked light travelling past it.`}</ThemedText>
      <ThemedText style={s.label}>Now the shadow is {projection.side === 'under' ? 'under the tree' : `to the ${projection.side}`}.</ThemedText>
      <ThemedText style={s.caption}>{hasComparedBothSides(lesson.observations) ? 'You have seen both sides.' : projection.side === 'left' ? 'You found the other side. Keep this observation.' : 'Find a shadow on the other side of the tree.'}</ThemedText>
      <ActionButton variant="ink" label="Keep this observation" disabled={busy} onPress={() => act({ type: 'shadow-record' })} />
    </View> : null}

    {phase === 'compare' ? <View style={s.section}>
      <ThemedText style={s.label}>When the light crossed to the other side, the shadow...</ThemedText>
      <PlanetChoice label="Moved to the opposite side" disabled={busy} onPress={() => act({ type: 'shadow-explain', value: 'opposite' })} />
      <PlanetChoice label="Moved to the same side as the light" disabled={busy} onPress={() => act({ type: 'shadow-explain', value: 'same' })} />
      <PlanetChoice label="Did not follow a pattern" disabled={busy} onPress={() => act({ type: 'shadow-explain', value: 'unrelated' })} />
      {lesson.explanation && lesson.explanation !== 'opposite' ? <ThemedText accessibilityRole="alert" style={s.body}>Look at the two sides again: the tree blocks the light, so the shadow stretches away from it. Try another answer.</ThemedText> : null}
    </View> : null}

    {phase === 'challenge' ? <View style={s.section}>
      <ThemedText accessibilityLiveRegion="polite" style={s.body}>{lesson.challengeAttempts > 0 ? 'The mat is still in light. Try the light on the opposite side of the tree, then test again.' : 'This time there is no hint on where to put the light.'}</ThemedText>
      <ActionButton variant="ink" label="Test the shade on Pip’s mat" disabled={busy} onPress={() => act({ type: 'shadow-try-shade' })} />
    </View> : null}

    {phase === 'complete' ? <View style={s.section}>
      <ThemedText style={s.body}>A light on one side makes a shadow on the other because the tree blocks some of its light. This flashlight model is not a forecast for a real outdoor shadow.</ThemedText>
      {ageBand === '6-7' ? <ThemedText style={s.caption}>Tell your grown-up: where did the shadow go?</ThemedText> : <ThemedText style={s.caption}>Before you go outside, can you explain which side of an object its shadow will be on?</ThemedText>}
      <ActionButton variant="ink" label="Keep this discovery" disabled={busy} onPress={save} />
    </View> : null}
  </View>;
}

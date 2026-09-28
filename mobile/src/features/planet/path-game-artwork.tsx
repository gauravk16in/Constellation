import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { bridgeColors, planetInk as p } from '@/theme/planet';
import { fontFamilies } from '@/theme';
import type { PathGameState } from '@/types/path-games';
import { SORT_OBJECTS, shadowResult } from '@/features/planet/path-game-engine';
import { shadowProjection } from '@/features/planet/shadow-lesson';

const glyph: Record<string, string> = { parcel: '▣', leaf: '❧', cup: '◡', key: '⚿', sock: '⌁', spoon: '◖', ball: '●', book: '▤' };

function Token({ label, x, y, fill = p.paper }: { label: string; x: number; y: number; fill?: string }) {
  return <G><Circle cx={x} cy={y} r="22" fill={fill} stroke={p.ink} strokeWidth="2" /><SvgText x={x} y={y + 7} textAnchor="middle" fontSize="23" fill={p.ink}>{glyph[label] ?? '●'}</SvgText></G>;
}

export function PathGameArtwork({ state }: { state: PathGameState }) {
  const shadow = state.kind === 'shadow' ? shadowResult(state) : null;
  const lab = state.kind === 'shadow' && state.lesson ? shadowProjection(state.lesson.lightPosition) : null;
  return <View accessibilityRole="image" accessibilityLabel={state.kind === 'story' ? 'A three-scene paper theatre with the selected object and backdrop' : state.kind === 'shadow' ? lab ? state.lesson?.phase === 'predict' ? 'A light to the left of a paper tree. Its shadow is hidden until you predict.' : `A light and paper tree. The shadow stretches ${lab.side === 'under' ? 'under the tree' : `to the ${lab.side}`}${['challenge', 'complete'].includes(state.lesson?.phase ?? '') ? '. Pip’s mat is to the right.' : '.'}` : 'A light, object, shadow, and movable picnic mat' : state.kind === 'sort' ? 'Six finds beside two paper sorting shelves' : 'A three-step path across a grassy hill'} style={{ width: '100%', aspectRatio: 1.24, borderRadius: 28, borderCurve: 'continuous', overflow: 'hidden', backgroundColor: p.sky }}>
    <Svg width="100%" height="100%" viewBox="0 0 400 320">
      <Rect width="400" height="320" fill={state.kind === 'story' ? '#D8E7F2' : state.kind === 'shadow' ? p.sky : state.kind === 'sort' ? '#F4E4BF' : '#E1D9F0'} />
      <Circle cx="330" cy="47" r="25" fill={p.cloud} opacity="0.8" /><Path d="M0 240Q90 180 178 214Q282 161 400 224V320H0Z" fill={p.grassLight} />
      {state.kind === 'story' ? <>
        <Path d="M20 52Q200 32 380 52V270H20Z" fill={p.earthDark} stroke={p.ink} strokeWidth="2" />
        <Rect x="49" y="70" width="302" height="178" rx="8" fill={state.scenes[state.activeScene].backdrop === 'hill' ? p.sky : state.scenes[state.activeScene].backdrop === 'theatre' ? '#F3D7DD' : p.paper} />
        <Path d="M20 51Q65 60 80 180Q68 218 20 250ZM380 51Q335 60 320 180Q332 218 380 250Z" fill={p.coral} stroke={p.ink} strokeWidth="2" />
        <Path d="M40 250Q200 270 360 250L375 279H25Z" fill={p.ink} />
        <Token x={200} y={166} label={state.scenes[state.activeScene].object ?? 'parcel'} fill={state.scenes[state.activeScene].object ? p.paper : p.fold} />
        <SvgText x="200" y="115" textAnchor="middle" fontSize="20" fill={p.ink}>{state.scenes[state.activeScene].action.toUpperCase()}</SvgText>
        <SvgText x="200" y="304" textAnchor="middle" fontSize="15" fill={p.ink}>SCENE {state.activeScene + 1} OF 3</SvgText>
      </> : null}
      {state.kind === 'shadow' && lab ? <>
        <Path d="M0 232H400V320H0Z" fill={p.earth} />
        <Path d={`M${lab.lightX} 78L176 190L224 190Z`} fill={p.paper} opacity="0.58" />
        <Circle cx={lab.lightX} cy="69" r="27" fill={p.paper} stroke={p.ink} strokeWidth="2" />
        <Path d={`M${lab.lightX - 8} 69H${lab.lightX + 8}`} stroke={p.ink} strokeWidth="3" strokeLinecap="round" />
        <SvgText x={lab.lightX} y="113" textAnchor="middle" fontFamily={fontFamilies.bold} fontSize="13" fill={p.ink}>LIGHT</SvgText>
        {['challenge', 'complete'].includes(state.lesson?.phase ?? '') ? <Rect x="259" y="237" width="67" height="27" rx="8" fill={p.coral} stroke={p.ink} strokeWidth="2" /> : null}
        {state.lesson?.phase !== 'predict' ? <Path d={`M197 238L203 238L${lab.tipX} 246L${lab.tipX} 260L197 257Z`} fill={p.ink} opacity="0.55" /> : null}
        <Path d="M200 239V142M200 177L177 165M200 166L218 151" stroke={p.ink} strokeWidth="8" strokeLinecap="round" />
        <Circle cx="200" cy="137" r="31" fill={p.grassDark} stroke={p.ink} strokeWidth="2" />
        {['challenge', 'complete'].includes(state.lesson?.phase ?? '') ? <>
          <SvgText x="292" y="281" textAnchor="middle" fontFamily={fontFamilies.bold} fontSize="12" fill={p.ink}>PIP’S MAT</SvgText>
        </> : null}
        <SvgText x="200" y="307" textAnchor="middle" fontFamily={fontFamilies.bold} fontSize="14" fill={p.ink}>{state.lesson?.phase === 'predict' ? 'WHERE WILL THE SHADOW GO?' : state.lesson?.phase === 'challenge' ? 'CAN PIP SIT IN SHADE?' : lab.side === 'under' ? 'SHADOW UNDER THE TREE' : `SHADOW TO THE ${lab.side.toUpperCase()}`}</SvgText>
      </> : null}
      {state.kind === 'shadow' && shadow && !state.lesson ? <>
        <Path d={`M${55 + state.light * 72} 50L200 230`} stroke={p.paper} strokeWidth="8" opacity="0.8" />
        <Circle cx={55 + state.light * 72} cy="50" r="26" fill={p.paper} stroke={p.ink} strokeWidth="2" />
        <Ellipse cx={200 + (state.light < 2 ? 1 : -1) * shadow.length * 39} cy="241" rx={shadow.length * 24} ry="10" fill={p.ink} opacity="0.42" />
        <Path d={state.object === 'tree' ? 'M200 238V138M200 179L169 160M200 157L227 135' : 'M200 238V155'} stroke={p.ink} strokeWidth="9" strokeLinecap="round" />
        {state.object === 'tree' ? <Circle cx="200" cy="128" r="33" fill={p.grassDark} /> : state.object === 'parcel' ? <Rect x="179" y="153" width="43" height="47" rx="4" fill={p.coral} /> : <Circle cx="200" cy="149" r="13" fill={p.coral} />}
        <Rect x={25 + state.mat * 78} y="252" width="62" height="27" rx="8" fill={p.coral} stroke={p.ink} strokeWidth="2" />
        <SvgText x={55 + state.mat * 78} y="271" textAnchor="middle" fontSize="12" fill={p.ink}>PIP’S MAT</SvgText>
      </> : null}
      {state.kind === 'sort' ? <>
        <Rect x="28" y="95" width="160" height="162" rx="15" fill={p.paper} stroke={p.ink} strokeWidth="2" />
        <Rect x="212" y="95" width="160" height="162" rx="15" fill={p.paper} stroke={p.ink} strokeWidth="2" />
        <SvgText x="108" y="122" textAnchor="middle" fontSize="17" fill={p.ink}>GROUP ONE</SvgText><SvgText x="292" y="122" textAnchor="middle" fontSize="17" fill={p.ink}>GROUP TWO</SvgText>
        {SORT_OBJECTS.map((item, i) => <Token key={item} label={item} x={state.groups[item] === 'left' ? 65 + (i % 2) * 72 : state.groups[item] === 'right' ? 250 + (i % 2) * 72 : 58 + i * 57} y={state.groups[item] ? 164 + Math.floor(i / 2) * 34 : 288} fill={state.groups[item] ? p.grassLight : p.fold} />)}
      </> : null}
      {state.kind === 'move' ? <>
        <Path d="M12 266Q90 241 120 218Q184 190 215 231Q287 270 390 181" fill="none" stroke={p.paper} strokeWidth="37" strokeLinecap="round" />
        <Path d="M12 266Q90 241 120 218Q184 190 215 231Q287 270 390 181" fill="none" stroke={p.ink} strokeWidth="2" strokeDasharray="5 8" />
        {[0, 1, 2].map((slot) => <G key={slot}><Circle cx={90 + slot * 108} cy={slot === 1 ? 215 : slot === 2 ? 220 : 248} r="28" fill={bridgeColors[['coral', 'sky', 'sage'][slot] as keyof typeof bridgeColors]} stroke={p.ink} strokeWidth="2" /><SvgText x={90 + slot * 108} y={(slot === 1 ? 215 : slot === 2 ? 220 : 248) + 7} textAnchor="middle" fontSize="21" fill={p.ink}>{slot + 1}</SvgText></G>)}
        <Path d="M325 114L350 100L374 112L345 135Z" fill={p.paper} stroke={p.ink} strokeWidth="2" />
      </> : null}
    </Svg>
  </View>;
}

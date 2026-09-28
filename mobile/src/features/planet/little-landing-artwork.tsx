import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { bridgeColors, planetInk as p } from '@/theme/planet';
import type { CreativeArtifact, PaperShape, PaperState } from '@/types/pocket-planet';

export function PaperBird() {
  return <Svg viewBox="0 0 90 75" width="100%" height="100%">
    <Ellipse cx="40" cy="67" rx="26" ry="4" fill={p.ink} opacity="0.1" />
    <Path d="M35 48L31 64M50 49L52 65M27 65H37M47 66H57" stroke={p.ink} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 21L35 30L52 8L65 19L58 46L35 54Z" fill={p.paper} stroke={p.ink} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M8 21L38 41L58 46L35 54Z" fill={p.fold} /><Path d="M35 30L38 41L52 8" fill="none" stroke={p.earthDark} strokeWidth="1" />
    <Path d="M64 22L79 28L62 32Z" fill={p.coral} stroke={p.ink} strokeWidth="1.4" />
    <Circle cx="58" cy="22" r="2.3" fill={p.ink} /><Path d="M36 30L22 10L48 34L38 41Z" fill={p.cloud} stroke={p.earthDark} strokeWidth="1" />
  </Svg>;
}

export function BridgeDrawing({ shape, color, sag = false }: { shape: PaperShape; color: string; sag?: boolean }) {
  const center = sag ? 41 : 9;
  return <G>
    <Path d={`M0 8 Q100 ${center} 200 8 L200 23 Q100 ${center + 15} 0 23Z`} fill={color} stroke={p.ink} strokeWidth="1.5" />
    {shape === 'folded' ? <><Path d={`M0 8 Q100 ${center} 200 8 L200 -3 Q100 ${center - 11} 0 -3Z`} fill={p.paper} stroke={p.ink} strokeWidth="1.3" /><Path d={`M0 23 Q100 ${center + 15} 200 23 L200 12 Q100 ${center + 4} 0 12Z`} fill={color} stroke={p.ink} strokeWidth="1.3" /></> : null}
    {shape === 'accordion' ? <Path d="M0 14L20 1L40 14L60 1L80 14L100 1L120 14L140 1L160 14L180 1L200 14V25L180 12L160 25L140 12L120 25L100 12L80 25L60 12L40 25L20 12L0 25Z" fill={p.paper} stroke={p.ink} strokeWidth="1.3" /> : null}
  </G>;
}

function Tree({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return <G transform={`translate(${x} ${y}) scale(${size})`}>
    <Ellipse cx="0" cy="8" rx="25" ry="7" fill={p.grassDark} opacity="0.2" />
    <Path d="M0 5L-2 -75M-1 -23L-20 -40M-1 -40L16 -54" stroke={p.ink} strokeWidth="4" strokeLinecap="round" />
    <Path d="M-3 -117C-35 -91 -42 -42 -19 -29C5 -16 29 -36 25 -62C26 -84 12 -106 -3 -117Z" fill={p.grassDark} />
    <Path d="M-3 -112L-3 -33M-3 -55L-18 -66M-3 -74L10 -85" stroke={p.grassLight} strokeWidth="1.5" fill="none" opacity="0.7" />
  </G>;
}

export function LittleLandingArtwork({ state, onFold, onTest, disabled, overview = false, artifacts = [] }: {
  state: PaperState; onFold?: () => void; onTest?: () => void; disabled?: boolean;
  overview?: boolean; artifacts?: CreativeArtifact[];
}) {
  const [width, setWidth] = useState(350);
  const reduceMotion = useReducedMotion();
  const crossing = useSharedValue(0);
  useEffect(() => { crossing.value = withTiming(state.result?.holds ? 1 : 0, { duration: reduceMotion ? 0 : 850 }); }, [crossing, reduceMotion, state.result]);
  const birdStyle = useAnimatedStyle(() => ({ transform: [{ translateX: crossing.value * width * 0.45 }, { rotate: `${crossing.value > 0 && crossing.value < 1 ? -7 : 0}deg` }] }));
  const wide = state.gap === 'wide';
  const left = wide ? 102 : 132;
  const right = wide ? 302 : 272;
  return <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)} style={{ width: '100%', aspectRatio: 0.93, overflow: 'hidden', borderRadius: 32, borderCurve: 'continuous', backgroundColor: p.sky }}>
    <Svg width="100%" height="100%" viewBox="0 0 400 430">
      <Rect width="400" height="430" fill={p.sky} />
      <Circle cx="311" cy="60" r="28" fill={p.cloud} />
      <Path d="M-20 68C15 55 33 78 56 66C79 47 106 53 113 73C138 65 155 80 157 88H-20ZM232 120C249 104 273 110 284 114C304 88 335 100 341 116C366 109 391 121 410 136H232Z" fill={p.cloud} opacity="0.8" />
      <Path d="M-25 203C47 110 107 175 160 131C213 86 265 166 303 157C342 146 392 165 432 202V430H-25Z" fill={p.distant} />
      <Path d="M-20 258C69 213 117 218 201 206C280 190 337 166 423 216V430H-20Z" fill={p.grassLight} />
      <Path d="M192 212C178 277 279 291 217 359C182 397 124 410 114 450H257C250 397 313 389 281 340C239 295 219 280 224 212Z" fill={p.river} />
      <Path d="M203 224C195 278 291 306 244 353M224 376L210 389M235 372L218 393M179 416L163 430" fill="none" stroke={p.riverLight} strokeWidth="3" strokeLinecap="round" />
      <Path d="M-20 318C18 278 69 288 119 307L137 353L114 432H-20Z" fill={p.earthDark} />
      <Path d={`M-20 272C38 251 65 272 ${left} 287L${left + 12} 323L88 348L-20 329Z`} fill={p.earth} />
      <Path d={`M-20 269C35 244 74 266 ${left} 282L${left + 8} 296C63 318 21 298 -20 310Z`} fill={p.grass} />
      <Path d={`M${right} 293C346 262 393 254 425 285V412L${right - 15} 357Z`} fill={p.earth} />
      <Path d={`M${right - 5} 293C337 260 382 254 421 277L420 306C363 295 337 324 ${right - 4} 309Z`} fill={p.grass} />
      <G transform="translate(44 227)"><Path d="M-5 0V-56L48 -72L61 -19V0Z" fill={p.paper} stroke={p.earthDark} strokeWidth="1.5" /><Path d="M-17 -50L25 -85L68 -63L68 -50L27 -68L-9 -39Z" fill={p.coral} stroke={p.ink} strokeWidth="1.5" /><Rect x="12" y="-29" width="21" height="30" rx="2" fill={p.grassDark} /><Path d="M40 -40H54V-25H40Z" fill={p.blue} stroke={p.earthDark} /><Path d="M0 5H63" stroke={p.ink} strokeWidth="2" /></G>
      <Tree x={349} y={243} size={0.7} /><Tree x={14} y={179} size={0.46} />
      <G transform="translate(273 174)"><Ellipse rx="24" ry="7" fill={p.grass} /><Path d="M-16 -2L1 -24L20 -3Z" fill={p.coral} /><Path d="M1 -24L2 -52" stroke={p.ink} strokeWidth="2" /><Path d="M2 -52L15 -58L23 -43L8 -37Z" fill={p.paper} stroke={p.ink} /></G>
      <G transform="translate(338 378)"><Path d="M-32 0V-48H29V0Z" fill={p.paper} stroke={p.earthDark} /><Path d="M-37 -47L-31 -59H30L36 -47Z" fill={p.coral} /><Path d="M-28 -44H-12L-19 -3H-28ZM25 -44H9L16 -3H25Z" fill={p.coral} /><Path d="M-12 -40H9V0H-19Z" fill={p.earthDark} /></G>
      <Path d="M45 374Q57 342 73 349Q82 366 74 382M355 334Q370 313 375 335M20 328L26 314L30 329M92 208L99 198L98 214" fill={p.grassDark} />
      <G transform={`translate(${left} 282) scale(${(right - left) / 200} 1)`}><BridgeDrawing shape={state.shape} color={bridgeColors[state.color]} sag={!!state.result && !state.result.holds} /></G>
      {Array.from({ length: state.parcels }, (_, i) => <G key={i} transform={`translate(${state.result?.holds ? 315 : 126 + i * 25} ${state.result && !state.result.holds ? 283 - i * 9 : 257 - i * 9})`}>
        <Path d="M0 0L12 -7L30 -2L19 6Z" fill={p.paper} stroke={p.earthDark} /><Path d="M0 0V18L19 24V6ZM19 6L30 -2V16L19 24Z" fill={p.coral} stroke={p.ink} strokeWidth="1.2" /><Path d="M10 -5L27 1V20M0 9L19 15L30 7" fill="none" stroke={p.paper} strokeWidth="2" />
      </G>)}
      {overview ? artifacts.filter((a) => a.position !== 'workshop').slice(-2).map((a) => <G key={a.id} transform={a.position === 'hill' ? 'translate(230 187) scale(.23)' : 'translate(316 369) scale(.18)'}><BridgeDrawing shape={a.shape} color={bridgeColors[a.color]} /></G>) : null}
      <Path d="M33 396L62 390M74 394L93 389M317 412L339 405" stroke={p.grassLight} strokeWidth="3" strokeLinecap="round" />
    </Svg>
    <Animated.View style={[{ position: 'absolute', left: '12%', top: '47%', width: '21%', aspectRatio: 1.2, pointerEvents: 'none' }, birdStyle]}><PaperBird /></Animated.View>
    {onFold ? <Pressable accessibilityRole="button" accessibilityLabel="Paper bridge. Tap to change its fold." disabled={disabled} onPress={onFold} style={({ pressed }) => ({ position: 'absolute', left: '25%', top: '65%', width: '51%', height: '13%', minHeight: 48, opacity: pressed ? 0.3 : 1, backgroundColor: pressed ? p.paper : 'transparent', borderRadius: 20 })} /> : null}
    {onTest ? <Pressable accessibilityRole="button" accessibilityLabel={overview ? 'Send Pip across your bridge' : 'Test the parcel on this bridge'} disabled={disabled} onPress={onTest} style={({ pressed }) => ({ position: 'absolute', left: state.result?.holds ? '76%' : '30%', top: '53%', width: '20%', height: '13%', minWidth: 48, minHeight: 48, opacity: pressed ? 0.3 : 1, backgroundColor: pressed ? p.paper : 'transparent', borderRadius: 20 })} /> : null}
  </View>;
}

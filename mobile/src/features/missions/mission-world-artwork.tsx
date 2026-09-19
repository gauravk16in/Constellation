import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { RoseSignalArtwork } from '@/features/missions/rose-signal-artwork';
import { colors } from '@/theme';
import type { MissionWorldArtworkId } from '@/types/mission';

type ArtworkSize = 'full' | 'compact' | 'miniature';

const ACCESSIBILITY_COPY: Record<MissionWorldArtworkId, { resolved: string; unresolved: string }> = {
  'nature-compass-rose': {
    unresolved: 'An unlit rose signal connected to a Nature Compass whose needle points away.',
    resolved: 'The Nature Compass points to a gold rose signal and a new gold star.',
  },
  'makers-workbench-bridge': {
    unresolved: 'A folded paper bridge on the Maker’s Workbench with a gap in its star path.',
    resolved: 'The paper bridge holds a delivery and completes a gold star path.',
  },
  'story-archive-objects': {
    unresolved: 'Three object cards inside the Story Archive with a broken story thread.',
    resolved: 'A gold thread connects the three object cards from beginning to ending.',
  },
  'discovery-lens-shadow': {
    unresolved: 'A Discovery Lens showing two shadow outlines that do not align.',
    resolved: 'The two shadow observations align through a gold Discovery Lens signal.',
  },
  'everyday-station-snack': {
    unresolved: 'An Everyday Station tray with three empty supply places and an unlit safety signal.',
    resolved: 'The three supplies are arranged and the Everyday Station safety signal is gold.',
  },
  'courage-path-balance': {
    unresolved: 'A Courage Path with three careful movement marks and a dim destination.',
    resolved: 'The movement marks connect to a steady gold destination star.',
  },
};

function MakerArtwork({ accent, wash, resolved }: { accent: string; wash: string; resolved: boolean }) {
  return <>
    <Path d="M38 165H86M218 165H266" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="8" />
    <Path d="M80 157C116 78 188 78 224 157" fill="none" stroke={resolved ? colors.starlight : accent} strokeLinecap="round" strokeWidth="13" />
    <Path d="M91 142L112 128L133 119L154 116L175 119L196 129L216 144" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    <Rect x="137" y="82" width="34" height="28" rx="7" fill={wash} stroke={colors.onboardingInk} strokeWidth="3" />
    <Path d="M154 84V106M140 93H168" stroke={accent} strokeLinecap="round" strokeWidth="2.5" />
    <Path d="M42 58H102L121 77M262 58H205L186 77" fill="none" stroke={colors.onboardingInkMuted} strokeDasharray="3 8" strokeLinecap="round" strokeWidth="2.5" />
    {resolved ? <><Circle cx="154" cy="45" fill={colors.starlight} r="10" /><Line x1="154" y1="24" x2="154" y2="16" stroke={colors.starlight} strokeLinecap="round" strokeWidth="3" /></> : <Circle cx="154" cy="45" fill={colors.onboardingSurface} r="10" stroke={accent} strokeWidth="3" />}
  </>;
}

function NatureCompassArtwork({ accent, wash, resolved, signalId }: { accent: string; wash: string; resolved: boolean; signalId: string }) {
  const seed = [...signalId].reduce((total, character) => total + character.charCodeAt(0), 0);
  const angle = (seed % 120) - 60;
  return <>
    <Circle cx="152" cy="105" fill={wash} r="68" stroke={colors.onboardingInk} strokeWidth="4" />
    <Circle cx="152" cy="105" fill="none" r="48" stroke={accent} strokeDasharray="3 8" strokeLinecap="round" strokeWidth="2.5" />
    <G transform={`rotate(${resolved ? 0 : angle} 152 105)`}><Path d="M152 52L165 111L152 101L139 111Z" fill={resolved ? colors.starlight : accent} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="2.5" /><Circle cx="152" cy="105" fill={colors.onboardingSurface} r="7" stroke={colors.onboardingInk} strokeWidth="2.5" /></G>
    {[76, 112, 152, 192, 228].map((x, index) => <Circle key={x} cx={x} cy="190" fill={resolved && index === seed % 5 ? colors.starlight : colors.onboardingSurface} r="7" stroke={index === seed % 5 ? accent : colors.onboardingInkMuted} strokeWidth="2" />)}
  </>;
}

function ArchiveArtwork({ accent, wash, resolved }: { accent: string; wash: string; resolved: boolean }) {
  return <>
    <Path d="M55 171V72C55 45 77 30 102 30H202C227 30 249 45 249 72V171" fill={wash} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="4" />
    <Line x1="55" y1="171" x2="249" y2="171" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="6" />
    {[82, 131, 180].map((x, index) => <G key={x} transform={`rotate(${index === 0 ? -6 : index === 2 ? 6 : 0} ${x + 20} 112)`}><Rect x={x} y="77" width="40" height="68" rx="11" fill={colors.onboardingSurface} stroke={accent} strokeWidth="3" /><Circle cx={x + 20} cy={index === 1 ? 99 : 119} fill={index === 1 && resolved ? colors.starlight : wash} r="8" stroke={colors.onboardingInk} strokeWidth="2" /></G>)}
    <Path d="M101 119C123 87 144 142 164 105C180 77 202 102 219 119" fill="none" stroke={resolved ? colors.starlight : colors.onboardingInkMuted} strokeDasharray={resolved ? undefined : '4 8'} strokeLinecap="round" strokeWidth="4" />
    {resolved ? <Circle cx="154" cy="55" fill={colors.starlight} r="8" /> : null}
  </>;
}

function LensArtwork({ accent, wash, resolved }: { accent: string; wash: string; resolved: boolean }) {
  return <>
    <Circle cx="133" cy="100" fill={wash} r="69" stroke={colors.onboardingInk} strokeWidth="5" />
    <Path d="M182 149L241 192" fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="16" />
    <Path d="M177 145L235 187" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="5" />
    <Circle cx="110" cy="76" fill={resolved ? colors.starlight : colors.onboardingSurface} r="10" stroke={colors.onboardingInk} strokeWidth="2.5" />
    <Line x1="110" y1="93" x2="110" y2="130" stroke={colors.onboardingInk} strokeLinecap="round" strokeWidth="5" />
    <Path d="M110 130L73 144" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="8" />
    <Path d="M110 130L64 125" fill="none" stroke={colors.onboardingInkMuted} strokeDasharray="4 7" strokeLinecap="round" strokeWidth="5" />
    {resolved ? <Path d="M55 45L63 62L82 64L68 77L72 96L55 86L38 96L42 77L28 64L47 62Z" fill={colors.starlight} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="2" /> : <Circle cx="55" cy="68" fill={colors.onboardingSurface} r="8" stroke={accent} strokeWidth="2.5" />}
  </>;
}

function StationArtwork({ accent, wash, resolved }: { accent: string; wash: string; resolved: boolean }) {
  return <>
    <Rect x="50" y="56" width="204" height="116" rx="28" fill={wash} stroke={colors.onboardingInk} strokeWidth="4" />
    <Path d="M78 91H226" stroke={colors.onboardingInkMuted} strokeDasharray="3 8" strokeLinecap="round" strokeWidth="2.5" />
    {[96, 152, 208].map((x, index) => <G key={x}><Circle cx={x} cy="124" fill={resolved ? (index === 1 ? colors.starlight : accent) : colors.onboardingSurface} r="22" stroke={colors.onboardingInk} strokeWidth="3" /><Path d={index === 0 ? `M${x - 7} 124H${x + 7}` : index === 1 ? `M${x} 116V132M${x - 8} 124H${x + 8}` : `M${x - 8} 119L${x} 130L${x + 10} 114`} fill="none" stroke={colors.onboardingInk} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></G>)}
    <Circle cx="235" cy="48" fill={resolved ? colors.starlight : colors.onboardingSurface} r="13" stroke={colors.onboardingInk} strokeWidth="3" />
    <Path d="M229 48L234 53L242 43" fill="none" stroke={resolved ? colors.onStarlight : accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
  </>;
}

function PathArtwork({ accent, wash, resolved }: { accent: string; wash: string; resolved: boolean }) {
  return <>
    <Path d="M30 173C78 135 52 77 112 80C166 82 146 157 213 145C249 139 262 103 274 67" fill="none" stroke={wash} strokeLinecap="round" strokeWidth="28" />
    <Path d="M30 173C78 135 52 77 112 80C166 82 146 157 213 145C249 139 262 103 274 67" fill="none" stroke={colors.onboardingInk} strokeDasharray="4 12" strokeLinecap="round" strokeWidth="3" />
    {[[72, 132, -18], [124, 97, 12], [188, 144, -14]].map(([x, y, angle], index) => <G key={index} transform={`rotate(${angle} ${x} ${y})`}><Path d={`M${x - 5} ${y - 12}C${x - 15} ${y - 3} ${x - 10} ${y + 13} ${x} ${y + 13}C${x + 10} ${y + 13} ${x + 13} ${y - 3} ${x + 5} ${y - 12}Z`} fill={accent} stroke={colors.onboardingInk} strokeWidth="2.5" /></G>)}
    {resolved ? <Path d="M273 32L282 52L304 54L288 69L292 91L273 80L254 91L258 69L242 54L264 52Z" fill={colors.starlight} stroke={colors.onboardingInk} strokeLinejoin="round" strokeWidth="2.5" /> : <Circle cx="273" cy="61" fill={colors.onboardingSurface} r="15" stroke={accent} strokeWidth="3" />}
  </>;
}

function SignalMark({ accent, resolved, signalId }: { accent: string; resolved: boolean; signalId: string }) {
  const seed = [...signalId].reduce((total, character, index) => total + character.charCodeAt(0) * (index + 1), 0);
  const points = [0, 1, 2].map((index) => ({ x: 124 + index * 28, y: 194 + ((seed >> (index * 2)) % 3) * 5 }));
  return <G>
    <Path d={`M${points[0].x} ${points[0].y}L${points[1].x} ${points[1].y}L${points[2].x} ${points[2].y}`} fill="none" stroke={resolved ? colors.starlight : accent} strokeDasharray={resolved ? undefined : '2 5'} strokeLinecap="round" strokeWidth="2" />
    {points.map((point, index) => <Circle key={index} cx={point.x} cy={point.y} fill={resolved && index === seed % 3 ? colors.starlight : colors.onboardingSurface} r={index === seed % 3 ? 5 : 3.5} stroke={resolved ? colors.starlight : colors.onboardingInk} strokeWidth="1.5" />)}
  </G>;
}

export function MissionWorldArtwork({ artworkId, signalId = 'signal', accent, wash, resolved = false, size = 'full' }: { artworkId: MissionWorldArtworkId; sceneId?: string; signalId?: string; accent: string; wash: string; resolved?: boolean; size?: ArtworkSize }) {
  if (artworkId === 'nature-compass-rose' && signalId === 'rose-signal') return <RoseSignalArtwork resolved={resolved} size={size === 'full' ? 'large' : 'compact'} />;
  return (
    <View accessibilityLabel={ACCESSIBILITY_COPY[artworkId][resolved ? 'resolved' : 'unresolved']} accessibilityRole="image" style={[styles.frame, size === 'compact' && styles.compact, size === 'miniature' && styles.miniature]}>
      <Svg height="100%" viewBox="0 0 304 214" width="100%">
        {artworkId === 'nature-compass-rose' ? <NatureCompassArtwork accent={accent} resolved={resolved} signalId={signalId} wash={wash} /> : null}
        {artworkId === 'makers-workbench-bridge' ? <MakerArtwork accent={accent} resolved={resolved} wash={wash} /> : null}
        {artworkId === 'story-archive-objects' ? <ArchiveArtwork accent={accent} resolved={resolved} wash={wash} /> : null}
        {artworkId === 'discovery-lens-shadow' ? <LensArtwork accent={accent} resolved={resolved} wash={wash} /> : null}
        {artworkId === 'everyday-station-snack' ? <StationArtwork accent={accent} resolved={resolved} wash={wash} /> : null}
        {artworkId === 'courage-path-balance' ? <PathArtwork accent={accent} resolved={resolved} wash={wash} /> : null}
        <SignalMark accent={accent} resolved={resolved} signalId={signalId} />
      </Svg>
    </View>
  );
}

export function EverydayStationSafetyArtwork({ accent }: { accent: string }) {
  return (
    <View accessibilityLabel="A clean preparation surface with approved ingredients, clean hands, and no heat or sharp tools." accessibilityRole="image" style={styles.safetyFrame}>
      <Svg height="150" viewBox="0 0 280 150" width="100%">
        <Rect x="35" y="42" width="150" height="80" rx="24" fill={colors.domainEveryday} stroke={colors.onboardingInk} strokeWidth="3" />
        {[72, 110, 148].map((x) => <Circle key={x} cx={x} cy="83" fill={colors.onboardingSurface} r="15" stroke={accent} strokeWidth="2.5" />)}
        <Circle cx="219" cy="78" fill={colors.onboardingSurface} r="31" stroke={colors.onboardingInk} strokeWidth="3" />
        <Path d="M204 78L216 90L236 65" fill="none" stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        <Line x1="196" y1="118" x2="244" y2="118" stroke={colors.danger} strokeLinecap="round" strokeWidth="4" />
        <Path d="M206 108L234 128M234 108L206 128" stroke={colors.danger} strokeLinecap="round" strokeWidth="3" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', aspectRatio: 304 / 214, justifyContent: 'center', maxWidth: '100%', width: '100%' },
  compact: { height: 138, width: 196 },
  miniature: { height: 72, width: 102 },
  safetyFrame: { alignSelf: 'center', maxWidth: 360, width: '100%' },
});

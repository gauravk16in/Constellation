import Svg, { Circle, Line, Path } from 'react-native-svg';

import type { MissionOptionVisualId } from '@/types/mission';

type Props = { accent: string; id: MissionOptionVisualId; selected: boolean };

export function MissionOptionArtwork({ accent, id, selected }: Props) {
  const ink = selected ? '#FFFDF8' : '#2A2730';
  const detail = selected ? '#FFFDF8' : accent;
  const common = { fill: 'none', stroke: ink, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 2.1 };
  return (
    <Svg height={42} viewBox="0 0 48 42" width={48}>
      {id === 'bridge-flat' ? <Path {...common} d="M5 29h38M10 22h28" /> : null}
      {id === 'bridge-folded' ? <Path {...common} d="M5 30h38M10 25v-7h28v7" /> : null}
      {id === 'bridge-accordion' ? <Path {...common} d="M5 30h38M9 25l5-9 5 9 5-9 5 9 5-9 5 9" /> : null}
      {id === 'bridge-arch' ? <><Path {...common} d="M5 30h38M9 26c4-15 26-15 30 0" /><Circle cx="24" cy="18" fill={detail} r="2.4" /></> : null}
      {id === 'story-cup' ? <><Path {...common} d="M13 12h20l-2 21H15zM33 17h3c5 0 5 9-1 9h-3" /><Line {...common} x1="17" x2="29" y1="8" y2="8" /></> : null}
      {id === 'story-key' ? <><Circle {...common} cx="15" cy="18" r="7" /><Path {...common} d="M21 22l14 12m-5-5 4-4m-8 0 3-3" /></> : null}
      {id === 'story-leaf' ? <><Path {...common} d="M9 31c1-17 11-23 30-21-1 18-12 24-30 21Z" /><Path {...common} d="M12 30c8-7 14-11 25-17" /></> : null}
      {id === 'story-sock' ? <Path {...common} d="M18 7h14v17c0 8-7 11-14 11-6 0-9-4-8-8 1-3 4-4 8-4Z" /> : null}
      {id === 'story-spoon' ? <><EllipseLike cx={16} cy={14} stroke={ink} /><Path {...common} d="M20 20l14 15" /></> : null}
      {id === 'story-box' ? <><Path {...common} d="M8 15l16-7 16 7-16 8zM8 15v17l16 7 16-7V15M24 23v16" /><Circle cx="24" cy="15" fill={detail} r="2" /></> : null}
      {id === 'window-light' ? <><Circle {...common} cx="16" cy="15" r="6" /><Path {...common} d="M16 4v3m0 16v3M5 15h3m16 0h3M8 7l2 2m12 12 2 2" /><Path {...common} d="M23 31h18" /></> : null}
      {id === 'window-weather' ? <><Path {...common} d="M9 23c0-5 4-8 9-7 2-7 13-6 15 1 8-1 10 10 2 11H13c-3 0-4-2-4-5Z" /><Path {...common} d="M17 32l-2 4m10-4-2 4m10-4-2 4" /></> : null}
      {id === 'window-living' ? <><Path {...common} d="M11 32c2-16 11-23 27-20-1 16-11 22-27 20Z" /><Path {...common} d="M13 31c8-7 14-11 23-16" /><Circle cx="36" cy="10" fill={detail} r="2.5" /></> : null}
      {id === 'window-movement' ? <><Path {...common} d="M7 13h20m-16 8h27M6 29h20" /><Path fill="none" stroke={detail} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m34 25 5 4-5 4" /></> : null}
      {id === 'window-same' ? <><Line {...common} x1="9" x2="39" y1="14" y2="14" /><Line {...common} x1="9" x2="39" y1="28" y2="28" /></> : null}
      {id === 'window-changed' ? <><Path {...common} d="M9 13h22m-8-5 8 5-8 5M39 29H17m8-5-8 5 8 5" /></> : null}
      {id === 'window-unsure' ? <><Path {...common} d="M17 14c1-7 14-8 15 0 1 7-8 7-8 13" /><Circle cx="24" cy="35" fill={detail} r="2" /></> : null}
    </Svg>
  );
}

function EllipseLike({ cx, cy, stroke }: { cx: number; cy: number; stroke: string }) {
  return <Path d={`M${cx - 6} ${cy}c0-7 12-7 12 0s-12 10-12 0Z`} fill="none" stroke={stroke} strokeWidth={2.1} />;
}

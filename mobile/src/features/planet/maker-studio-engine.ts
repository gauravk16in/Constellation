export type StudioShape = 'triangle' | 'circle' | 'square';
export type StudioPhase = 'guided' | 'memory' | 'create';
export type GearPart = 'driver' | 'partner' | 'handle';

export type StudioPoint = { x: number; y: number };
export type StudioStroke = { points: StudioPoint[]; color: string };

export const STUDIO_SHAPES: StudioShape[] = ['triangle', 'circle', 'square'];
export const GEAR_PARTS: GearPart[] = ['driver', 'partner', 'handle'];

export function shapePoints(shape: StudioShape): StudioPoint[] {
  if (shape === 'triangle') return [{ x: 160, y: 35 }, { x: 65, y: 205 }, { x: 255, y: 205 }, { x: 160, y: 35 }];
  if (shape === 'square') return [{ x: 85, y: 45 }, { x: 235, y: 45 }, { x: 235, y: 195 }, { x: 85, y: 195 }, { x: 85, y: 45 }];
  return Array.from({ length: 49 }, (_, index) => {
    const angle = index / 48 * Math.PI * 2;
    return { x: 160 + Math.cos(angle) * 86, y: 120 + Math.sin(angle) * 86 };
  });
}

export function strokePath(points: readonly StudioPoint[]): string {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${Math.round(point.x)} ${Math.round(point.y)}`).join(' ');
}

export function canAdvanceStudio(phase: StudioPhase, strokes: readonly StudioStroke[]): boolean {
  return phase !== 'create' && strokes.some((stroke) => stroke.points.length >= 3);
}

export function nextStudioPhase(phase: StudioPhase): StudioPhase {
  return phase === 'guided' ? 'memory' : 'create';
}

export function placeGearPart(placed: readonly GearPart[], selected: GearPart, slot: GearPart): GearPart[] {
  if (selected !== slot || placed.includes(slot)) return [...placed];
  return [...placed, slot];
}

export function gearAngles(turns: number): { driver: number; partner: number } {
  const angle = Math.max(0, Math.floor(turns)) * 45;
  return { driver: angle, partner: -angle };
}

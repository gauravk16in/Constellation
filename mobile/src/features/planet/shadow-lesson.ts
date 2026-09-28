import type { ShadowLesson, ShadowSide } from '@/types/path-games';

const OBJECT_X = 200;
const LIGHT_MIN_X = 48;
const LIGHT_MAX_X = 352;
const MAT_X = 292;

export function initialShadowLesson(): ShadowLesson {
  return { phase: 'predict', lightPosition: 18, prediction: null, observations: [], explanation: null,
    explanationAttempts: 0, challengeAttempts: 0 };
}

/** A deliberately simple side-view flashlight model, not an outdoor Sun forecast. */
export function shadowProjection(lightPosition: number) {
  const position = Math.max(0, Math.min(100, lightPosition));
  const lightX = LIGHT_MIN_X + (LIGHT_MAX_X - LIGHT_MIN_X) * position / 100;
  const difference = OBJECT_X - lightX;
  const tipX = Math.max(18, Math.min(382, OBJECT_X + difference * 0.86));
  const side: ShadowSide = difference > 15 ? 'right' : difference < -15 ? 'left' : 'under';
  const coversMat = side === 'right' && tipX >= MAT_X + 2;
  return { lightX, tipX, side, coversMat, length: Math.abs(tipX - OBJECT_X) };
}

export function hasComparedBothSides(observations: readonly number[]) {
  return observations.some((position) => shadowProjection(position).side === 'left') &&
    observations.some((position) => shadowProjection(position).side === 'right');
}

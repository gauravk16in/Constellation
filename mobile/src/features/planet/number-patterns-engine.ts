import type { AgeBand } from '@/types/constellation';

/** The 8+ near-base examples use (B-a)(B-b) = B(B-a-b) + ab.
 * Editorial reference: Uttarakhand Open University, Vedic Mathematics, Nikhilam section.
 * https://uou.ac.in/sites/default/files/slm/VAC-12.pdf
 * We teach the arithmetic pattern, not a claim about its historical origin or speed.
 */
export const NUMBER_CHALLENGES = {
  '6-7': { base: 10, first: 7, second: 8, title: 'Find the friends of ten', cue: 'Two spaces on the number path need filling. Read this together.' },
  '8-9': { base: 10, first: 9, second: 8, title: 'A surprising way to make 72', cue: 'How far are 9 and 8 from ten?' },
  '10-12': { base: 100, first: 97, second: 96, title: 'A pattern hiding near 100', cue: 'Use each number’s distance from 100 to investigate 97 × 96.' },
} as const satisfies Record<AgeBand, { base: number; first: number; second: number; title: string; cue: string }>;

export function distanceFromBase(base: number, value: number) {
  if (![10, 100].includes(base) || !Number.isInteger(value) || value < 0 || value > base) throw new Error('Use a number on the path.');
  return base - value;
}

export function nearBaseParts(base: 10 | 100, first: number, second: number) {
  const firstGap = distanceFromBase(base, first);
  const secondGap = distanceFromBase(base, second);
  const left = first - secondGap;
  const right = firstGap * secondGap;
  if (right >= base) throw new Error('This introductory lesson uses gaps whose product fits beneath the base.');
  return { firstGap, secondGap, left, right, product: first * second };
}

export function leftChoices(correct: number) { return [correct + 1, correct, correct - 1] as const; }
export function rightChoices(correct: number) { return [correct + 1, Math.max(0, correct - 1), correct] as const; }

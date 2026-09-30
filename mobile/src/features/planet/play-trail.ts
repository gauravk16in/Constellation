import type { PlanetData } from '@/types/pocket-planet';

export const PLAY_TRAIL = [
  { id: 'paper-post', title: 'Paper Post', question: 'Can paper carry a parcel?', area: 'Make & create', href: '/play/paper-post' },
  { id: 'borrow-a-shadow', title: 'Borrow a Shadow', question: 'Where does shade go?', area: 'Test & discover', href: '/play/borrow-a-shadow' },
  { id: 'object-theatre', title: 'Object Theatre', question: 'What happens next?', area: 'Talk & connect', href: '/play/object-theatre' },
  { id: 'parcel-room', title: 'Parcel Room', question: 'How can these finds belong together?', area: 'Everyday skills', href: '/play/parcel-room' },
  { id: 'delivery-path', title: 'Delivery Path', question: 'What is a calm way across?', area: 'Move & be brave', href: '/play/delivery-path' },
  { id: 'near-base', title: 'Vedic Maths · Number Patterns', question: 'What hides near ten or 100?', area: 'Test & discover', href: '/number-patterns' },
] as const;

export type PlayTrailId = typeof PLAY_TRAIL[number]['id'];

export function completedTrailIds(data: PlanetData): Set<PlayTrailId> {
  const completed = new Set<PlayTrailId>();
  if (data.outcomes.length > 0) completed.add('paper-post');
  for (const outcome of data.pathOutcomes ?? []) {
    if (PLAY_TRAIL.some((entry) => entry.id === outcome.gameId)) completed.add(outcome.gameId as PlayTrailId);
  }
  if (data.numberLessons?.some((lesson) => lesson.id === 'near-base')) completed.add('near-base');
  return completed;
}

export function nextTrailId(data: PlanetData): PlayTrailId | null {
  const completed = completedTrailIds(data);
  return PLAY_TRAIL.find((entry) => !completed.has(entry.id))?.id ?? null;
}

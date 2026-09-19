import { colors } from '@/theme';
import type { CuriosityAreaId } from '@/types/constellation';

export type CuriosityArea = {
  id: CuriosityAreaId;
  title: string;
  shortTitle: string;
  description: string;
  invitation: string;
  accent: string;
  wash: string;
};

export const CURIOSITY_AREAS: CuriosityArea[] = [
  {
    id: 'nature-noticing',
    title: 'Nature & noticing',
    shortTitle: 'Notice',
    description: 'Living things, weather, patterns, and the world outside.',
    invitation: 'Look closer. The ordinary world is full of clues.',
    accent: colors.domainNatureInk,
    wash: colors.domainNature,
  },
  {
    id: 'make-create',
    title: 'Make & create',
    shortTitle: 'Make',
    description: 'Art, stories, music, and building ideas with your hands.',
    invitation: 'Turn something you imagine into something real.',
    accent: colors.domainMakeInk,
    wash: colors.domainMake,
  },
  {
    id: 'talk-connect',
    title: 'Talk & connect',
    shortTitle: 'Connect',
    description: 'Listening, interviewing, explaining, playing, and helping.',
    invitation: 'Every person knows something you have not heard yet.',
    accent: colors.domainTalkInk,
    wash: colors.domainTalk,
  },
  {
    id: 'test-discover',
    title: 'Test & discover',
    shortTitle: 'Discover',
    description: 'Experiments, questions, numbers, and how things work.',
    invitation: 'Make a guess, try it, then notice what really happens.',
    accent: colors.domainTestInk,
    wash: colors.domainTest,
  },
  {
    id: 'everyday-skills',
    title: 'Everyday skills',
    shortTitle: 'Practise',
    description: 'Cooking, organising, planning, fixing, and contributing.',
    invitation: 'Small useful skills can change what you are able to do.',
    accent: colors.domainEverydayInk,
    wash: colors.domainEveryday,
  },
  {
    id: 'move-brave',
    title: 'Move & be brave',
    shortTitle: 'Move',
    description: 'Physical skills, games, coordination, and new challenges.',
    invitation: 'Try one safe step beyond what already feels easy.',
    accent: colors.domainMoveInk,
    wash: colors.domainMove,
  },
];

export function getCuriosityArea(id: string) {
  return CURIOSITY_AREAS.find((area) => area.id === id);
}

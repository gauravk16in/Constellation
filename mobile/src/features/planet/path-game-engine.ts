import type { AgeBand } from '@/types/constellation';
import type { PathAction, PathGameId, PathGameState, ShadowState, SortObject, SortRule } from '@/types/path-games';
import type { PlanetCommand, PlanetData } from '@/types/pocket-planet';
import { hasComparedBothSides, initialShadowLesson, shadowProjection } from '@/features/planet/shadow-lesson';

export const PATH_GAMES = {
  'object-theatre': { title: 'The Missing Parcel Storyboard', area: 'Talk & connect', question: 'Where did the parcel go?', missionId: 'three-object-story', place: 'The little theatre', prompt: 'Arrange three scenes. Read your story aloud, then change the ending.' },
  'borrow-a-shadow': { title: 'Borrow a Shadow', area: 'Test & discover', question: 'Can you move the shade?', missionId: 'shadow-tracing', place: 'The light hill', prompt: 'Move the light or the mat, then test where the shadow lands.' },
  'parcel-room': { title: 'The Mixed-Up Parcel Room', area: 'Everyday skills', question: 'How would you organize these finds?', missionId: 'ten-minute-tidy-system', place: 'Pip’s parcel room', prompt: 'Invent a rule, place all six objects, then test your system.' },
  'delivery-path': { title: 'My Movement Plan', area: 'Move & be brave', question: 'Which three moves will you try?', missionId: 'floor-line-balance', place: 'The winding path', prompt: 'Arrange three moves and review your plan. This is a plan, not a test of balance or safety.' },
} as const;

export const STORY_OBJECTS = ['parcel', 'leaf', 'cup', 'key', 'sock', 'spoon'] as const;
export const SORT_OBJECTS = ['ball', 'cup', 'book', 'parcel', 'leaf', 'sock'] as const;
export const MOVE_CARDS = ['slow-step', 'side-step', 'pause', 'look-ahead', 'wide-step', 'seated-reach'] as const;
export const SORT_RULES = ['shape', 'size', 'purpose'] as const;

export function initialPathState(id: PathGameId): PathGameState {
  if (id === 'object-theatre') return { kind: 'story', scenes: [
    { object: null, action: 'arrive', backdrop: 'workshop' },
    { object: null, action: 'hide', backdrop: 'hill' },
    { object: null, action: 'find', backdrop: 'theatre' },
  ], activeScene: 0, played: false, playCount: 0 };
  if (id === 'borrow-a-shadow') return { kind: 'shadow', light: 0, object: 'tree', mat: 3, trials: [], lesson: initialShadowLesson() };
  if (id === 'parcel-room') return { kind: 'sort', rule: 'shape', groups: { ball: null, cup: null, book: null, parcel: null, leaf: null, sock: null }, tested: false, tests: 0 };
  return { kind: 'move', sequence: ['side-step', 'wide-step', 'slow-step'], runs: 0, steady: null };
}

/** Keep the child's composition, but require a fresh review before a new outcome. */
export function editablePathState(saved: PathGameState): PathGameState {
  const state = JSON.parse(JSON.stringify(saved)) as PathGameState;
  if (state.kind === 'story') return { ...state, played: false, playCount: 0 };
  if (state.kind === 'sort') return { ...state, tested: false, tests: 0 };
  if (state.kind === 'move') return { ...state, runs: 0, steady: null };
  return { ...state, trials: [], ...(state.lesson ? { lesson: { ...initialShadowLesson(), lightPosition: state.lesson.lightPosition } } : {}) };
}

export function shadowResult(state: Pick<ShadowState, 'light' | 'mat' | 'object'>) {
  // Five authored light positions around a fixed object. This illustrates a
  // relationship; it does not predict an outdoor shadow or move the real Sun.
  const direction = state.light < 2 ? 1 : -1;
  const length = state.light === 2 ? 1 : state.light === 1 || state.light === 3 ? 2 : 3;
  const target = Math.max(0, Math.min(4, 2 + direction * length));
  return { light: state.light, object: state.object, mat: state.mat, shade: state.mat === target, length };
}

const LEFT: Record<SortRule, readonly SortObject[]> = {
  shape: ['ball', 'cup'], size: ['ball', 'leaf', 'sock'], purpose: ['ball', 'book', 'sock'],
};
export function sortResult(state: Extract<PathGameState, { kind: 'sort' }>) {
  return SORT_OBJECTS.filter((object) => state.groups[object] === (LEFT[state.rule].includes(object) ? 'left' : 'right')).length;
}

export function reducePath(state: PathGameState, action: PathAction): PathGameState {
  if (state.kind === 'story') {
    if (action.type === 'story-scene') return { ...state, activeScene: action.scene };
    if (action.type === 'story-swap') {
      if (action.to !== action.from + 1) throw new Error('Swap neighboring scenes.');
      const scenes = [...state.scenes] as typeof state.scenes;
      [scenes[action.from], scenes[action.to]] = [scenes[action.to], scenes[action.from]];
      return { ...state, scenes, played: false };
    }
    if (action.type === 'story-object' || action.type === 'story-action' || action.type === 'story-backdrop') {
      const scenes = state.scenes.map((scene, index) => index === state.activeScene ? { ...scene,
        ...(action.type === 'story-object' ? { object: action.value } : action.type === 'story-action' ? { action: action.value } : { backdrop: action.value }),
      } : scene) as typeof state.scenes;
      return { ...state, scenes, played: false };
    }
    if (action.type === 'story-play') {
      if (state.scenes.some((scene) => !scene.object)) throw new Error('Put one object in each scene before the curtain opens.');
      return { ...state, played: true, playCount: state.playCount + 1 };
    }
  }
  if (state.kind === 'shadow') {
    if (state.lesson) {
      const lesson = state.lesson;
      if (action.type === 'shadow-predict' && lesson.phase === 'predict') return { ...state, lesson: { ...lesson, prediction: action.value } };
      if (action.type === 'shadow-reveal' && lesson.phase === 'predict' && lesson.prediction) return { ...state,
        lesson: { ...lesson, phase: 'explore', observations: [lesson.lightPosition] } };
      if (action.type === 'shadow-move-light' && (lesson.phase === 'explore' || lesson.phase === 'challenge')) return { ...state,
        lesson: { ...lesson, lightPosition: Math.max(0, Math.min(100, Math.round(action.value))) } };
      if (action.type === 'shadow-record' && lesson.phase === 'explore') {
        const observations = lesson.observations.some((position) => Math.abs(position - lesson.lightPosition) < 5)
          ? lesson.observations : [...lesson.observations, lesson.lightPosition].slice(-12);
        return { ...state, lesson: { ...lesson, observations,
          phase: hasComparedBothSides(observations) ? 'compare' : 'explore' } };
      }
      if (action.type === 'shadow-explain' && lesson.phase === 'compare') return { ...state,
        lesson: { ...lesson, explanation: action.value, explanationAttempts: lesson.explanationAttempts + 1,
          phase: action.value === 'opposite' ? 'challenge' : 'compare',
          lightPosition: action.value === 'opposite' ? 80 : lesson.lightPosition } };
      if (action.type === 'shadow-try-shade' && lesson.phase === 'challenge') return { ...state,
        lesson: { ...lesson, challengeAttempts: lesson.challengeAttempts + 1,
          phase: shadowProjection(lesson.lightPosition).coversMat ? 'complete' : 'challenge' } };
      throw new Error('Finish this part of the shadow investigation first.');
    }
    if (action.type === 'shadow-light') return { ...state, light: Math.max(0, Math.min(4, Math.round(action.value))) };
    if (action.type === 'shadow-mat') return { ...state, mat: Math.max(0, Math.min(4, Math.round(action.value))) };
    if (action.type === 'shadow-object') return { ...state, object: action.value };
    if (action.type === 'shadow-test') return { ...state, trials: [...state.trials, shadowResult(state)].slice(-12) };
  }
  if (state.kind === 'sort') {
    if (action.type === 'sort-rule') return { ...state, rule: action.value, tested: false };
    if (action.type === 'sort-place') return { ...state, groups: { ...state.groups, [action.object]: action.value }, tested: false };
    if (action.type === 'sort-test') {
      if (Object.values(state.groups).some((group) => group === null)) throw new Error('Give all six finds a place first.');
      return { ...state, tested: true, tests: state.tests + 1 };
    }
  }
  if (state.kind === 'move') {
    if (action.type === 'move-card') {
      const sequence = [...state.sequence] as typeof state.sequence; sequence[action.slot] = action.value;
      return { ...state, sequence, steady: null };
    }
    // Legacy `steady` is retained only for storage compatibility, never as a safety judgment.
    if (action.type === 'move-run') return { ...state, runs: state.runs + 1, steady: false };
  }
  throw new Error('This control does not belong to this game.');
}

export function canSavePath(state: PathGameState) {
  return state.kind === 'story' ? state.played : state.kind === 'shadow' ? state.lesson ? state.lesson.phase === 'complete' && state.lesson.challengeAttempts > 0 : state.trials.length > 0 : state.kind === 'sort' ? state.tested : state.runs > 0 && state.steady !== null;
}
export function pathFeedback(state: PathGameState) {
  if (state.kind === 'story') return state.played ? 'Your storyboard is ready to read aloud. Change a scene to tell a different version.' : 'Three scenes can tell a very different story when you change one part.';
  if (state.kind === 'shadow') {
    if (state.lesson) return state.lesson.phase === 'complete' ? 'You found a way to shade Pip’s mat. The real sky may behave differently from this flashlight model.' : 'Move the light, watch the shadow, and test your idea.';
    const result = state.trials.at(-1);
    return result ? result.shade ? 'The mat is in shade. Move the light to see where it goes next.' : `The shadow reaches another place. Try moving the mat ${result.light < 2 ? 'right' : 'left'}.` : 'Tap a light position, then test where the shadow falls.';
  }
  if (state.kind === 'sort') {
    if (!state.tested) return 'Move every find into a group. Your rule gives each group a reason.';
    return 'You grouped all six finds. Explain one choice to someone: the same object can fit different rules. Try another rule and notice what moves.';
  }
  return state.steady === null ? 'Review your three moves before trying them nearby.' : 'Your plan is ready. A screen cannot tell whether a movement is safe for you. Check the real space with a grown-up and stop if uncomfortable.';
}

function evidence(state: PathGameState): string[] {
  if (state.kind === 'story') return ['Arranged three scenes and opened a storyboard.'];
  if (state.kind === 'shadow') return state.lesson ? [
    'Predicted where a flashlight-model shadow would fall.',
    'Compared shadows with the light on both sides of an object.',
    'Moved the light to shade a target in the model.',
  ] : ['Moved a light and tested where the shadow fell.', ...(new Set(state.trials.map((t) => t.length)).size > 1 ? ['Compared a longer and shorter shadow.'] : [])];
  if (state.kind === 'sort') return ['Placed six objects using a chosen grouping rule.'];
  return ['Chose three movements and reviewed a plan.'];
}

export function applyPathCommand(data: PlanetData, command: Extract<PlanetCommand, { type: 'start-path' | 'act-path' | 'introduce-path' | 'finish-path' | 'undo-path-replacement' }>, context: {
  profileId: string; ageBand: AgeBand; now: string;
}): PlanetData {
  const next = JSON.parse(JSON.stringify(data)) as PlanetData;
  next.pathSession ??= null; next.pathFinds ??= []; next.pathOutcomes ??= []; next.pathReplacement ??= null;
  const current = next.pathSession;
  if (command.type === 'start-path') {
    if (!(command.gameId in PATH_GAMES)) throw new Error('This place is unavailable.');
    if (next.session && next.session.id !== command.replacePaperSessionId) throw new Error('Resume Paper Post or choose to replace its digital draft.');
    if (current && current.id !== command.replaceSessionId) throw new Error('Resume your current game or replace its draft.');
    if (next.pathOutcomes.some((outcome) => outcome.id === `path-${command.id}`)) throw new Error('This game has already been saved.');
    next.session = null;
    const saved = next.pathFinds.find((find) => find.gameId === command.gameId);
    const state = saved ? editablePathState(saved.state) : initialPathState(command.gameId);
    next.pathSession = { id: command.id, profileId: context.profileId, gameId: command.gameId, version: 1,
      ageBand: context.ageBand, guardianIntroduced: false, state, updatedAt: context.now };
  } else if (command.type === 'introduce-path') {
    if (!current || current.id !== command.sessionId || current.profileId !== context.profileId) throw new Error('Reopen your current game.');
    next.pathSession = { ...current, guardianIntroduced: true, updatedAt: context.now };
  } else if (command.type === 'act-path') {
    if (!current || current.id !== command.sessionId || current.profileId !== context.profileId) throw new Error('Reopen your current game.');
    if (current.ageBand === '6-7' && !current.guardianIntroduced) throw new Error('Read the game introduction together first.');
    next.pathSession = { ...current, state: reducePath(current.state, command.action), updatedAt: context.now };
  } else if (command.type === 'finish-path') {
    if (next.pathOutcomes.some((item) => item.id === `path-${command.sessionId}`)) return data;
    if (!current || current.id !== command.sessionId || current.profileId !== context.profileId || !canSavePath(current.state)) throw new Error('Try your creation before keeping it.');
    const id = `find-${current.id}`;
    const prior = next.pathFinds.find((find) => find.gameId === current.gameId);
    const find = { id, gameId: current.gameId, outcomeId: `path-${current.id}`, createdAt: context.now, state: current.state };
    next.pathFinds = prior ? next.pathFinds.map((item) => item.id === prior.id ? find : item) : [...next.pathFinds, find];
    next.pathReplacement = prior ? { previous: prior, replacementId: find.id } : null;
    next.pathOutcomes.push({ id: find.outcomeId, gameId: current.gameId, completedAt: context.now, evidence: evidence(current.state) });
    next.pathSession = null;
  } else {
    if (!next.pathReplacement) throw new Error('There is no creation to restore.');
    const undo = next.pathReplacement;
    next.pathFinds = next.pathFinds.map((item) => item.id === undo.replacementId ? undo.previous : item);
    next.pathReplacement = null;
  }
  next.revision++;
  return next;
}

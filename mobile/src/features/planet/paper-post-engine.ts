import type { AgeBand } from '@/types/constellation';
import { applyPathCommand, PATH_GAMES, MOVE_CARDS, SORT_OBJECTS, SORT_RULES, STORY_OBJECTS, shadowResult } from '@/features/planet/path-game-engine';
import { hasComparedBothSides, shadowProjection } from '@/features/planet/shadow-lesson';
import type { PaperAction, PaperConfiguration, PaperScenario, PaperState, PlanetCommand, PlanetData } from '@/types/pocket-planet';

export const PAPER_SCENARIOS = [
  { id: 'first-parcel', title: 'The first parcel', prompt: 'Can this paper carry the parcel?', family: false },
  { id: 'sandbox', title: 'Just experiment', prompt: 'What else can your paper do?', family: false },
  { id: 'wide-gap', title: 'Across the wide gap', prompt: 'Keep the banks apart. Can you change the paper?', family: true },
  { id: 'heavy-post', title: 'A heavier delivery', prompt: 'Keep the folded paper. What happens when you move the banks?', family: true },
] as const;

export const PAPER_AGE_GUIDES: Record<AgeBand, { cue: string; hint: string }> = {
  '6-7': { cue: 'Read together. Tap the paper to fold it. Then tap the parcel.', hint: 'Try one change together. What do you notice?' },
  '8-9': { cue: 'Tap the paper. Tap the parcel. See what changes.', hint: 'Try a different fold, then move the banks closer.' },
  '10-12': { cue: 'Can you change the result by changing just one thing?', hint: 'Keep the paper shape the same. Compare a short gap with a wide one.' },
};

/** A deliberately qualitative toy model, not a load rating for real paper.
 * Folds increase the model's stiffness; a shorter span lowers its demand.
 * Source: https://www.sciencebuddies.org/stem-activities/build-best-bridge
 * No dimensions, mass, or engineering predictions are exposed to children.
 */
export function paperHolds(config: PaperConfiguration) {
  const stiffness = { flat: 1, folded: 3, accordion: 5 }[config.shape];
  return stiffness >= config.parcels * (config.gap === 'wide' ? 2 : 1);
}

export function initialPaper(scenario: PaperScenario): PaperState {
  return { shape: scenario === 'heavy-post' ? 'folded' : 'flat', gap: 'wide', parcels: scenario === 'heavy-post' ? 3 : 1,
    color: 'coral', position: 'workshop', trials: [], result: null, guardianIntroduced: false };
}

export function reducePaper(state: PaperState, action: PaperAction): PaperState {
  switch (action.type) {
    case 'shape': return { ...state, shape: action.value, result: null };
    case 'gap': return { ...state, gap: action.value, result: null };
    case 'parcels': return { ...state, parcels: action.value, result: null };
    case 'color': return { ...state, color: action.value };
    case 'position': return { ...state, position: action.value };
    case 'introduce': return { ...state, guardianIntroduced: true };
    case 'reset': return { ...state, result: null };
    case 'test': {
      const result = { shape: state.shape, gap: state.gap, parcels: state.parcels, holds: paperHolds(state) };
      // Keep a bounded local draft; no gesture coordinates or identifying input.
      return { ...state, result, trials: [...state.trials, result].slice(-24) };
    }
  }
}

export function paperFeedback(state: PaperState) {
  if (!state.result) return 'Tap the parcel to test your paper.';
  const previous = state.trials.at(-2);
  if (previous && previous.shape === state.shape && previous.parcels === state.parcels && previous.gap !== state.gap) {
    return state.gap === 'short' ? 'The shorter gap bends less in this model.' : 'The wider gap asks more of the paper.';
  }
  return state.result.holds ? 'It holds! Pip can carry the post across.' : 'It bends. Try a fold, a shorter gap, or less post.';
}

export function emptyPlanet(): PlanetData {
  return { version: 1, revision: 0, session: null, artifacts: [], outcomes: [], replacement: null, numberLessons: [] };
}

function evidenceFor(state: PaperState) {
  const evidence = ['Tested a paper bridge in a digital model.'];
  if (state.trials.some((a, i) => state.trials.slice(i + 1).some((b) => a.shape === b.shape && a.parcels === b.parcels && a.gap !== b.gap))) {
    evidence.push('Changed the support gap and tested the same paper again.');
  }
  if (state.trials.some((a, i) => state.trials.slice(i + 1).some((b) => a.gap === b.gap && a.parcels === b.parcels && a.shape !== b.shape))) {
    evidence.push('Compared paper shapes with the same gap and delivery.');
  }
  return evidence.slice(0, 3);
}

export function applyPlanetCommand(data: PlanetData, command: PlanetCommand, context: {
  profileId: string; ageBand: AgeBand; family: boolean; now: string;
}): PlanetData {
  if (command.type === 'start-path' || command.type === 'act-path' || command.type === 'introduce-path' || command.type === 'finish-path' || command.type === 'undo-path-replacement') {
    return parsePlanet(JSON.stringify(applyPathCommand(data, command, context)));
  }
  const next = JSON.parse(JSON.stringify(data)) as PlanetData;
  const session = next.session;
  if (command.type === 'complete-number-lesson') {
    if (command.lessonId !== 'near-base') throw new Error('This number lesson is unavailable.');
    next.numberLessons ??= [];
    if (next.numberLessons.some((lesson) => lesson.id === command.lessonId)) return data;
    next.numberLessons.push({ id: command.lessonId, ageBand: context.ageBand, completedAt: context.now });
  } else if (command.type === 'start') {
    if (next.pathSession && next.pathSession.id !== command.replacePathSessionId) throw new Error('Resume your current digital game or choose to replace its draft.');
    const scenario = PAPER_SCENARIOS.find((item) => item.id === command.scenarioId);
    if (!scenario) throw new Error('This game scenario is unavailable.');
    if (session && session.id !== command.replaceSessionId) throw new Error('Resume your game or choose to replace its draft.');
    if (scenario.family && !context.family) throw new Error('This scenario needs a Family membership. Free play is still available.');
    if (next.outcomes.some((item) => item.sessionId === command.id)) throw new Error('This game was already saved.');
    if (command.initialShape && !['flat', 'folded', 'accordion'].includes(command.initialShape)) throw new Error('That paper shape is unavailable.');
    const artifact = command.editArtifactId ? next.artifacts.find((item) => item.id === command.editArtifactId) : undefined;
    if (command.editArtifactId && (!artifact || command.scenarioId !== 'sandbox')) throw new Error('Reopen your saved bridge to edit it in free play.');
    const state = initialPaper(command.scenarioId);
    if (command.initialShape && !artifact && command.scenarioId === 'first-parcel') state.shape = command.initialShape;
    if (artifact) Object.assign(state, { shape: artifact.shape, color: artifact.color, position: artifact.position });
    next.pathSession = null;
    next.session = { id: command.id, profileId: context.profileId, gameId: 'paper-post', gameVersion: 1,
      scenarioId: command.scenarioId, ageBand: context.ageBand, state, updatedAt: context.now };
  } else if (command.type === 'act') {
    if (!session || session.id !== command.sessionId || session.profileId !== context.profileId) throw new Error('Reopen your current game before changing it.');
    if (session.ageBand === '6-7' && !session.state.guardianIntroduced && command.action.type !== 'introduce') throw new Error('Read the introduction with a grown-up first.');
    if (session.scenarioId === 'wide-gap' && command.action.type === 'gap' && command.action.value !== 'wide') throw new Error('This experiment keeps the wide gap.');
    if (session.scenarioId === 'heavy-post' && ((command.action.type === 'shape' && command.action.value !== 'folded') || (command.action.type === 'parcels' && command.action.value !== 3))) throw new Error('This experiment keeps the same folded paper and three parcels.');
    next.session = { ...session, state: reducePaper(session.state, command.action), updatedAt: context.now };
  } else if (command.type === 'finish') {
    if (next.outcomes.some((item) => item.sessionId === command.sessionId)) return data;
    if (!session || session.id !== command.sessionId || session.profileId !== context.profileId) throw new Error('Your current game could not be found.');
    if (!session.state.result || (session.scenarioId !== 'sandbox' && !session.state.result.holds)) throw new Error('Test this bridge before placing it on your planet.');
    const replace = command.replaceArtifactId ? next.artifacts.find((item) => item.id === command.replaceArtifactId) : undefined;
    if (command.replaceArtifactId && !replace) throw new Error('That creation changed. Choose it again.');
    if (!replace && next.artifacts.length >= 12) throw new Error('Choose a creation to replace. You can undo the replacement.');
    const id = `creation-${session.id}`;
    const outcomeId = `play-${session.id}`;
    const artifact = { id, gameId: 'paper-post' as const, origin: 'digital' as const, kind: 'bridge' as const,
      shape: session.state.shape, color: session.state.color, position: session.state.position, createdAt: context.now, outcomeId };
    if (replace) {
      next.artifacts = next.artifacts.map((item) => item.id === replace.id ? artifact : item);
      next.replacement = { previous: replace, replacementId: id };
    } else next.artifacts.push(artifact);
    next.outcomes.push({ id: outcomeId, sessionId: session.id, gameId: 'paper-post', gameVersion: 1, scenarioId: session.scenarioId,
      completedAt: context.now, evidence: evidenceFor(session.state) });
    next.session = null;
  } else if (command.type === 'undo-replacement') {
    if (!next.replacement) throw new Error('There is no replacement to undo.');
    const undo = next.replacement;
    next.artifacts = next.artifacts.map((item) => item.id === undo.replacementId ? undo.previous : item);
    next.replacement = null;
  } else if (command.type === 'move') {
    if (!next.artifacts.some((item) => item.id === command.artifactId)) throw new Error('This creation could not be found.');
    next.artifacts = next.artifacts.map((item) => item.id === command.artifactId ? { ...item, position: command.position } : item);
  }
  next.revision++;
  return parsePlanet(JSON.stringify(next));
}

export function parsePlanet(value: string | null): PlanetData {
  if (!value) return emptyPlanet();
  try {
    const data = JSON.parse(value) as PlanetData;
    const shape = (v: unknown) => ['flat', 'folded', 'accordion'].includes(String(v));
    const color = (v: unknown) => ['coral', 'sage', 'sky'].includes(String(v));
    const position = (v: unknown) => ['workshop', 'hill', 'theatre'].includes(String(v));
    const config = (v: PaperConfiguration) => v && shape(v.shape) && ['short', 'wide'].includes(v.gap) && [1, 2, 3].includes(v.parcels);
    if (data.version !== 1 || !Number.isInteger(data.revision) || !Array.isArray(data.artifacts) || data.artifacts.length > 12 || !Array.isArray(data.outcomes)) throw new Error();
    if (new Set(data.artifacts.map((v) => v.id)).size !== data.artifacts.length) throw new Error();
    if (data.artifacts.some((v) => !v.id || v.kind !== 'bridge' || v.origin !== 'digital' || v.gameId !== 'paper-post' || !shape(v.shape) || !color(v.color) || !position(v.position))) throw new Error();
    if (data.outcomes.some((v) => !v.id || v.gameId !== 'paper-post' || v.gameVersion !== 1 || !Array.isArray(v.evidence) || v.evidence.length > 3 || v.evidence.some((e) => ![
      'Tested a paper bridge in a digital model.', 'Changed the support gap and tested the same paper again.', 'Compared paper shapes with the same gap and delivery.',
    ].includes(e)))) throw new Error();
    if (data.numberLessons !== undefined && (!Array.isArray(data.numberLessons) || data.numberLessons.length > 1 ||
      data.numberLessons.some((lesson) => lesson.id !== 'near-base' || !['6-7', '8-9', '10-12'].includes(lesson.ageBand) ||
        !lesson.completedAt || !Number.isFinite(Date.parse(lesson.completedAt))))) throw new Error();
    if (data.session) {
      const s = data.session;
      if (!s.id || !s.profileId || s.gameId !== 'paper-post' || s.gameVersion !== 1 || !['6-7', '8-9', '10-12'].includes(s.ageBand) || !PAPER_SCENARIOS.some((v) => v.id === s.scenarioId)) throw new Error();
      if (!config(s.state) || !color(s.state.color) || !position(s.state.position) || typeof s.state.guardianIntroduced !== 'boolean' || !Array.isArray(s.state.trials) || s.state.trials.length > 24 || s.state.trials.some((v) => !config(v) || v.holds !== paperHolds(v))) throw new Error();
      if (s.state.result && (!config(s.state.result) || s.state.result.holds !== paperHolds(s.state.result) || s.state.result.shape !== s.state.shape || s.state.result.gap !== s.state.gap || s.state.result.parcels !== s.state.parcels)) throw new Error();
    }
    const validShadowLesson = (value: unknown): boolean => {
      if (!value || typeof value !== 'object') return false;
      const lesson = value as Record<string, unknown>;
      const phase = String(lesson.phase);
      const observations = lesson.observations;
      return ['predict', 'explore', 'compare', 'challenge', 'complete'].includes(phase) &&
        Number.isInteger(lesson.lightPosition) && Number(lesson.lightPosition) >= 0 && Number(lesson.lightPosition) <= 100 &&
        (lesson.prediction === null || ['left', 'right', 'under'].includes(String(lesson.prediction))) &&
        Array.isArray(observations) && observations.length <= 12 && observations.every((position) => Number.isInteger(position) && position >= 0 && position <= 100) &&
        (lesson.explanation === null || ['opposite', 'same', 'unrelated'].includes(String(lesson.explanation))) &&
        Number.isInteger(lesson.explanationAttempts) && Number(lesson.explanationAttempts) >= 0 &&
        Number.isInteger(lesson.challengeAttempts) && Number(lesson.challengeAttempts) >= 0 &&
        (phase === 'predict' || lesson.prediction !== null) &&
        (!['compare', 'challenge', 'complete'].includes(phase) || hasComparedBothSides(observations)) &&
        (!['challenge', 'complete'].includes(phase) || lesson.explanation === 'opposite') &&
        (phase !== 'complete' || (Number(lesson.challengeAttempts) > 0 && shadowProjection(Number(lesson.lightPosition)).coversMat));
    };
    const validPathState = (value: unknown, gameId: string): boolean => {
      if (!value || typeof value !== 'object') return false;
      const state = value as Record<string, unknown>;
      if (gameId === 'object-theatre') return state.kind === 'story' && Array.isArray(state.scenes) && state.scenes.length === 3 &&
        state.scenes.every((scene: Record<string, unknown>) => (scene.object === null || STORY_OBJECTS.includes(scene.object as typeof STORY_OBJECTS[number])) &&
          ['arrive', 'hide', 'find'].includes(String(scene.action)) && ['workshop', 'hill', 'theatre'].includes(String(scene.backdrop))) &&
        [0, 1, 2].includes(Number(state.activeScene)) && typeof state.played === 'boolean' && Number.isInteger(state.playCount) && Number(state.playCount) >= 0;
      if (gameId === 'borrow-a-shadow') return state.kind === 'shadow' && [0, 1, 2, 3, 4].includes(Number(state.light)) && [0, 1, 2, 3, 4].includes(Number(state.mat)) &&
        ['tree', 'post', 'parcel'].includes(String(state.object)) && Array.isArray(state.trials) && state.trials.length <= 12 &&
        state.trials.every((trial: Record<string, unknown>) => [0, 1, 2, 3, 4].includes(Number(trial.light)) && [0, 1, 2, 3, 4].includes(Number(trial.mat)) && ['tree', 'post', 'parcel'].includes(String(trial.object)) && trial.shade === shadowResult(trial as Parameters<typeof shadowResult>[0]).shade) &&
        (state.lesson === undefined || validShadowLesson(state.lesson));
      if (gameId === 'parcel-room') return state.kind === 'sort' && SORT_RULES.includes(state.rule as typeof SORT_RULES[number]) &&
        !!state.groups && typeof state.groups === 'object' && SORT_OBJECTS.every((item) => [null, 'left', 'right'].includes((state.groups as Record<string, unknown>)[item] as null | 'left' | 'right')) &&
        typeof state.tested === 'boolean' && Number.isInteger(state.tests) && Number(state.tests) >= 0;
      if (gameId === 'delivery-path') return state.kind === 'move' && Array.isArray(state.sequence) && state.sequence.length === 3 &&
        state.sequence.every((card: string) => MOVE_CARDS.includes(card as typeof MOVE_CARDS[number])) && Number.isInteger(state.runs) && Number(state.runs) >= 0 && [true, false, null].includes(state.steady as boolean | null);
      return false;
    };
    const pathSession = data.pathSession;
    if (pathSession && (!pathSession.id || !pathSession.profileId || pathSession.version !== 1 || typeof pathSession.guardianIntroduced !== 'boolean' || !['6-7', '8-9', '10-12'].includes(pathSession.ageBand) || !(pathSession.gameId in PATH_GAMES) || !validPathState(pathSession.state, pathSession.gameId))) throw new Error();
    if (data.session && pathSession) throw new Error();
    if (data.pathFinds !== undefined && (!Array.isArray(data.pathFinds) || data.pathFinds.length > 4 || new Set(data.pathFinds.map((find) => find.gameId)).size !== data.pathFinds.length || data.pathFinds.some((find) => !find.id || !(find.gameId in PATH_GAMES) || !validPathState(find.state, find.gameId)))) throw new Error();
    // Retire overclaims from already-saved outcomes, not just newly created memories.
    if (Array.isArray(data.pathOutcomes)) for (const outcome of data.pathOutcomes) {
      if (!Array.isArray(outcome.evidence)) throw new Error();
      outcome.evidence = outcome.evidence.filter((text) => !['Replayed the story after changing a scene.', 'Revised the grouping and tested it again.', 'Changed the movement plan and tried it again.'].includes(text)).map((text) =>
        text === 'Arranged three scenes and played a story.' ? 'Arranged three scenes and opened a storyboard.' : text === 'Arranged three moves and ran the route.' ? 'Chose three movements and reviewed a plan.' : text);
    }
    const approvedEvidence = ['Arranged three scenes and opened a storyboard.', 'Chose three movements and reviewed a plan.', 'Moved a light and tested where the shadow fell.', 'Compared a longer and shorter shadow.', 'Predicted where a flashlight-model shadow would fall.', 'Compared shadows with the light on both sides of an object.', 'Moved the light to shade a target in the model.', 'Placed six objects using a chosen grouping rule.'];
    if (data.pathOutcomes !== undefined && (!Array.isArray(data.pathOutcomes) || data.pathOutcomes.some((outcome) => !outcome.id || !(outcome.gameId in PATH_GAMES) || !Array.isArray(outcome.evidence) || outcome.evidence.length > 3 || outcome.evidence.some((statement) => !approvedEvidence.includes(statement))))) throw new Error();
    return data;
  } catch { throw new Error('Your saved planet could not be read. Nothing has been replaced. Try reopening the app.'); }
}

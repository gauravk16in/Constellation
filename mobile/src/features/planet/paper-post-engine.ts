import type { AgeBand } from '@/types/constellation';
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
  return { version: 1, revision: 0, session: null, artifacts: [], outcomes: [], replacement: null };
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
  const next = JSON.parse(JSON.stringify(data)) as PlanetData;
  const session = next.session;
  if (command.type === 'start') {
    const scenario = PAPER_SCENARIOS.find((item) => item.id === command.scenarioId);
    if (!scenario) throw new Error('This game scenario is unavailable.');
    if (session && session.id !== command.replaceSessionId) throw new Error('Resume your game or choose to replace its draft.');
    if (scenario.family && !context.family) throw new Error('This scenario needs a Family membership. Free play is still available.');
    if (next.outcomes.some((item) => item.sessionId === command.id)) throw new Error('This game was already saved.');
    next.session = { id: command.id, profileId: context.profileId, gameId: 'paper-post', gameVersion: 1,
      scenarioId: command.scenarioId, ageBand: context.ageBand, state: initialPaper(command.scenarioId), updatedAt: context.now };
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
    if (data.session) {
      const s = data.session;
      if (!s.id || !s.profileId || s.gameId !== 'paper-post' || s.gameVersion !== 1 || !['6-7', '8-9', '10-12'].includes(s.ageBand) || !PAPER_SCENARIOS.some((v) => v.id === s.scenarioId)) throw new Error();
      if (!config(s.state) || !color(s.state.color) || !position(s.state.position) || typeof s.state.guardianIntroduced !== 'boolean' || !Array.isArray(s.state.trials) || s.state.trials.length > 24 || s.state.trials.some((v) => !config(v) || v.holds !== paperHolds(v))) throw new Error();
      if (s.state.result && (!config(s.state.result) || s.state.result.holds !== paperHolds(s.state.result) || s.state.result.shape !== s.state.shape || s.state.result.gap !== s.state.gap || s.state.result.parcels !== s.state.parcels)) throw new Error();
    }
    return data;
  } catch { throw new Error('Your saved planet could not be read. Nothing has been replaced. Try reopening the app.'); }
}

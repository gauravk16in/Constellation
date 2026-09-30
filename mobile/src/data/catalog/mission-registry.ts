import { getMissionDefinition as getBaseline, MISSION_DEFINITIONS as BASELINE, validateMissionRegistry as validateBaseline } from './mission-registry-v2';
import type { AgeBand } from '@/types/constellation';
import type { MissionDefinition, MissionInteraction } from '@/types/mission';
export { FLAGSHIP_EXPERIENCE_IDS } from './mission-registry-v2';

const comparison: MissionInteraction = {
  kind: 'comparison', id: 'bridge-digital-comparison', required: false,
  title: 'If you played Paper Post, did real paper behave the same way?',
  instruction: 'Real paper can behave differently. Either result is useful.',
  options: [
    { id: 'similar', label: 'Similarly' }, { id: 'different', label: 'Differently' },
    { id: 'unsure', label: 'Difficult to compare' }, { id: 'not-played', label: 'I only tried real paper' },
  ],
};

function bridgeV3(definition: MissionDefinition): MissionDefinition {
  const briefInteractions = definition.briefInteractions.map((item) => item.id === 'bridge-fold' && item.kind === 'choice-board' ? {
    ...item, options: [{ id: 'flat', label: 'Flat paper', visualId: 'bridge-flat' as const }, ...item.options],
  } : item) as MissionDefinition['briefInteractions'];
  return { ...definition, briefInteractions, returnInteractions: [...(definition.returnInteractions ?? []), comparison] };
}

function bridgeV4(definition: MissionDefinition): MissionDefinition {
  const previous = bridgeV3(definition);
  const priorReturn = previous.returnInteractions ?? [];
  const firstResult = priorReturn[0];
  return {
    ...previous,
    successCue: 'You test a real paper bridge, notice what it carries, and decide whether to try one change.',
    memoryCue: 'Try one safe paper bridge. If you are curious, change one thing and test again.',
    preparation: previous.preparation.map((item, index) => index === 0 ? { ...item, label: 'Bring paper and a few lightweight, unbreakable test objects approved by a grown-up.' } : item),
    returnInteractions: [
      firstResult.kind === 'counter' ? { ...firstResult, maximum: 10, instruction: 'Count only lightweight objects. Zero is a useful result too.' } : firstResult,
      { kind: 'comparison', id: 'bridge-revision', title: 'Did you try a second design?',
        instruction: 'A second test is your choice. Changing one thing makes the comparison easier.', options: [
          { id: 'shape', label: 'Yes, I changed the paper shape' },
          { id: 'supports', label: 'Yes, I moved the supports' },
          { id: 'none', label: 'Not this time' },
        ] },
      { kind: 'counter', id: 'bridge-second-result', title: 'How many did the second bridge hold?',
        instruction: 'Count lightweight objects only. Zero is a useful result too.', counters: [{ id: 'objects', label: 'Objects held after the change' }], maximum: 10 },
      ...priorReturn.slice(1),
    ],
    narrative: { ...previous.narrative, resolvedWorld: {
      heading: 'The Starway is steady.',
      body: 'You predicted, tested real paper, and noticed what changed. Your star remembers the thinking, not a score.',
    } },
  };
}

export const MISSION_DEFINITIONS = BASELINE.map((definition) => {
  if (definition.experienceId !== 'paper-bridge') return definition;
  const next = bridgeV4(definition);
  return { ...next, variants: Object.fromEntries(Object.entries(definition.variants).map(([band, variant]) => {
    const resolved = bridgeV4({ ...definition, ...variant });
    return [band, { ...variant, briefInteractions: resolved.briefInteractions, returnInteractions: resolved.returnInteractions }];
  })) as MissionDefinition['variants'] };
});
export const MISSION_REGISTRY = Object.fromEntries(MISSION_DEFINITIONS.map((item) => [item.experienceId, item]));

export function getMissionDefinition(experienceId: string, ageBand: AgeBand = '8-9', catalogVersion?: number) {
  const version = catalogVersion ?? (experienceId === 'paper-bridge' ? 4 : 2);
  if (version > (experienceId === 'paper-bridge' ? 4 : 2)) return undefined;
  const definition = getBaseline(experienceId, ageBand, Math.min(version, 2));
  if (!definition || experienceId !== 'paper-bridge') return definition;
  return version === 4 ? bridgeV4(definition) : version === 3 ? bridgeV3(definition) : definition;
}

export function validateMissionRegistry(experienceIds: string[]) {
  const errors = validateBaseline(experienceIds);
  for (const band of ['6-7', '8-9', '10-12'] as const) {
    const definition = getMissionDefinition('paper-bridge', band, 4)!;
    const ids = [...definition.briefInteractions, ...(definition.returnInteractions ?? [])].map((item) => item.id);
    if (new Set(ids).size !== ids.length) errors.push(`duplicate Paper Bridge v3 interaction: ${band}`);
  }
  return errors;
}

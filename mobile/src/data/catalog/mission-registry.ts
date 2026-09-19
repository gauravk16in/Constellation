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

export const MISSION_DEFINITIONS = BASELINE.map((definition) => {
  if (definition.experienceId !== 'paper-bridge') return definition;
  const next = bridgeV3(definition);
  return { ...next, variants: Object.fromEntries(Object.entries(definition.variants).map(([band, variant]) => {
    const resolved = bridgeV3({ ...definition, ...variant });
    return [band, { ...variant, briefInteractions: resolved.briefInteractions, returnInteractions: resolved.returnInteractions }];
  })) as MissionDefinition['variants'] };
});
export const MISSION_REGISTRY = Object.fromEntries(MISSION_DEFINITIONS.map((item) => [item.experienceId, item]));

export function getMissionDefinition(experienceId: string, ageBand: AgeBand = '8-9', catalogVersion?: number) {
  const version = catalogVersion ?? (experienceId === 'paper-bridge' ? 3 : 2);
  if (version > (experienceId === 'paper-bridge' ? 3 : 2)) return undefined;
  const definition = getBaseline(experienceId, ageBand, Math.min(version, 2));
  return definition && experienceId === 'paper-bridge' && version === 3 ? bridgeV3(definition) : definition;
}

export function validateMissionRegistry(experienceIds: string[]) {
  const errors = validateBaseline(experienceIds);
  for (const band of ['6-7', '8-9', '10-12'] as const) {
    const definition = getMissionDefinition('paper-bridge', band, 3)!;
    const ids = [...definition.briefInteractions, ...(definition.returnInteractions ?? [])].map((item) => item.id);
    if (new Set(ids).size !== ids.length) errors.push(`duplicate Paper Bridge v3 interaction: ${band}`);
  }
  return errors;
}

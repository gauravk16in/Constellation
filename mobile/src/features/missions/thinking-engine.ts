import type { MissionDefinition, MissionNarrativeArchetype } from '@/types/mission';

export type ThinkingMove = 'Notice' | 'Imagine' | 'Remember' | 'Reason' | 'Plan' | 'Predict' | 'Experiment' | 'Explain' | 'Reflect';

const INVITATIONS: Record<MissionNarrativeArchetype, readonly ThinkingMove[]> = {
  'field-mystery': ['Notice', 'Reason', 'Explain'],
  'build-test': ['Predict', 'Experiment', 'Explain'],
  'co-play-story': ['Imagine', 'Remember', 'Explain'],
  'safe-practice': ['Plan', 'Reason', 'Reflect'],
  'movement-challenge': ['Plan', 'Experiment', 'Reflect'],
};

/** An editorial invitation, not a measurement or assessment of the child. */
export function thinkingMovesForMission(definition: MissionDefinition): readonly ThinkingMove[] {
  return INVITATIONS[definition.narrative.archetype];
}

const FAMILY_PROMPTS: Record<MissionNarrativeArchetype, string> = {
  'field-mystery': 'What did you notice that you missed the first time?',
  'build-test': 'What one thing would you change if you tried it again?',
  'co-play-story': 'Could the same beginning have a different ending?',
  'safe-practice': 'Which part of your plan made the task easier or safer?',
  'movement-challenge': 'What changed when you slowed down or tried another way?',
};

export function familyPromptForMission(definition: MissionDefinition) {
  return FAMILY_PROMPTS[definition.narrative.archetype];
}

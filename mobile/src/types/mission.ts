import type { AgeBand, CuriosityAreaId, ExperienceContext, LearningEvidenceKind } from '@/types/constellation';

export type MissionPhase = 'active' | 'paused' | 'return';
export type MissionReflection = 'again' | 'learned' | 'challenging' | 'not-for-me';
export type MissionActiveGuidance = 'memory-cue' | 'optional-steps' | 'prompt-deck' | 'optional-counter';

export type MissionOption = {
  id: string;
  label: string;
  detail?: string;
  visualId?: MissionOptionVisualId;
};

export type MissionOptionVisualId =
  | 'bridge-flat'
  | 'bridge-folded'
  | 'bridge-accordion'
  | 'bridge-arch'
  | 'story-cup'
  | 'story-key'
  | 'story-leaf'
  | 'story-sock'
  | 'story-spoon'
  | 'story-box'
  | 'window-light'
  | 'window-weather'
  | 'window-living'
  | 'window-movement'
  | 'window-same'
  | 'window-changed'
  | 'window-unsure';

type InteractionBase = {
  id: string;
  title: string;
  instruction: string;
  required?: boolean;
};

export type ChoiceBoardInteraction = InteractionBase & {
  kind: 'choice-board';
  options: MissionOption[];
  minSelections: number;
  maxSelections: number;
};

export type OrderedCardsInteraction = InteractionBase & {
  kind: 'ordered-cards';
  options: MissionOption[];
  minSelections: number;
  maxSelections: number;
};

export type PromptDeckInteraction = InteractionBase & {
  kind: 'prompt-deck';
  options: MissionOption[];
  selectionCount: number;
};

export type MarkerBoardInteraction = InteractionBase & {
  kind: 'marker-board';
  markers: MissionOption[];
};

export type CounterInteraction = InteractionBase & {
  kind: 'counter';
  counters: MissionOption[];
  maximum: number;
};

export type ComparisonInteraction = InteractionBase & {
  kind: 'comparison';
  options: MissionOption[];
};

export type SlotInputInteraction = InteractionBase & {
  kind: 'slot-input';
  slots: MissionOption[];
  maxLength: number;
};

export type ArrangementInteraction = InteractionBase & {
  kind: 'arrangement';
  items: MissionOption[];
};

export type RetellCardsInteraction = InteractionBase & {
  kind: 'retell-cards';
  cards: MissionOption[];
};

export type SafetySequenceOption = MissionOption & {
  correct: boolean;
  feedback: string;
};

export type SafetySequenceScene = {
  id: string;
  prompt: string;
  options: SafetySequenceOption[];
};

export type SafetySequenceInteraction = InteractionBase & {
  kind: 'safety-sequence';
  artworkId?: 'rose-prickle-map' | 'everyday-station-safety';
  scenes: SafetySequenceScene[];
};

export type MissionInteraction =
  | ChoiceBoardInteraction
  | OrderedCardsInteraction
  | PromptDeckInteraction
  | MarkerBoardInteraction
  | CounterInteraction
  | ComparisonInteraction
  | SlotInputInteraction
  | ArrangementInteraction
  | RetellCardsInteraction
  | SafetySequenceInteraction;

export type MissionWorldId =
  | 'nature-compass'
  | 'makers-workbench'
  | 'story-archive'
  | 'discovery-lens'
  | 'everyday-station'
  | 'courage-path';

export type MissionWorldArtworkId =
  | 'nature-compass-rose'
  | 'makers-workbench-bridge'
  | 'story-archive-objects'
  | 'discovery-lens-shadow'
  | 'everyday-station-snack'
  | 'courage-path-balance';

export type MissionNarrativeArchetype =
  | 'field-mystery'
  | 'build-test'
  | 'co-play-story'
  | 'safe-practice'
  | 'movement-challenge';

export type MissionEvidenceRule = {
  kind: LearningEvidenceKind;
  statement: string;
  interactionId?: string;
};

export type MissionNarrative = {
  worldId: CuriosityAreaId;
  signalId: string;
  artworkSceneId: string;
  worldName: string;
  artworkId: MissionWorldArtworkId;
  archetype: MissionNarrativeArchetype;
  hook: {
    heading: string;
    body: string;
    actionLabel: string;
  };
  knowledgeReveal: {
    heading: string;
    body: string;
  };
  resolvedWorld: {
    heading: string;
    body: string;
  };
  realWorldObjective: string;
  evidenceRules: MissionEvidenceRule[];
  knowledgeReview: {
    sourceLabels: string[];
    sourceUrls: readonly string[];
    reviewerRole: string;
    reviewedAt: string;
    expiresAt: string;
    changeNote: string;
  };
};

export type ParticipationMode = 'guardian-led' | 'together' | 'increasing-independence';

export type MissionAgeVariant = {
  participationMode: ParticipationMode;
  previewLabel: string;
  successCue: string;
  memoryCue: string;
  briefInteractions: [MissionInteraction, ...MissionInteraction[]];
  returnInteractions: MissionInteraction[];
  preparation: PreparationItem[];
  steps: string[];
  evidenceRules: MissionEvidenceRule[];
};

export type PreparationItem = {
  id: string;
  label: string;
};

export type StartPolicy =
  | { kind: 'child' }
  | { kind: 'guardian-confirm'; confirmation: string };

export type MissionDefinition = {
  experienceId: string;
  previewLabel: string;
  successCue: string;
  memoryCue: string;
  briefInteractions: [MissionInteraction, ...MissionInteraction[]];
  returnInteractions?: MissionInteraction[];
  preparation: PreparationItem[];
  activeGuidance: MissionActiveGuidance;
  steps: string[];
  timerMinutes?: number;
  startPolicy: StartPolicy;
  reflectionPrompt: string;
  narrative: MissionNarrative;
  variants: Record<AgeBand, MissionAgeVariant>;
};

export type MissionInteractionState = Record<string, string | string[] | number | boolean>;

export type ExperienceSession = {
  id: string;
  childProfileId: string;
  experienceId: string;
  catalogVersion: number;
  phase: MissionPhase;
  context: ExperienceContext;
  interactionState: MissionInteractionState;
  timerStartedAt?: string;
  startedAt: string;
  updatedAt: string;
};

export type StartMissionInput = {
  childProfileId: string;
  experienceId: string;
  catalogVersion: number;
  context: ExperienceContext;
  interactionState: MissionInteractionState;
};

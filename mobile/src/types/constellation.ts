export type AgeBand = '6-7' | '8-9' | '10-12';

export type CuriosityAreaId =
  | 'nature-noticing'
  | 'make-create'
  | 'talk-connect'
  | 'test-discover'
  | 'everyday-skills'
  | 'move-brave';

export type SupportNeedId =
  | 'clearer-steps'
  | 'lower-sensory'
  | 'low-movement'
  | 'flexible-pacing'
  | 'guardian-alongside';

export type AllowedContextId = 'home' | 'yard' | 'neighbourhood' | 'public-place';

export type CompanionId = 'solo' | 'guardian' | 'sibling' | 'friend';
export type SettingId = 'indoors' | 'outdoors' | 'either';
export type MaterialGroupId =
  | 'nothing-special'
  | 'paper-drawing'
  | 'basic-household'
  | 'outdoor-found'
  | 'familiar-plant';
export type WeatherId = 'clear' | 'cloudy' | 'rain' | 'hot' | 'cold' | 'unknown';

export type SetupDraft = {
  nickname: string;
  ageBand: AgeBand | null;
  interests: CuriosityAreaId[];
  supportNeeds: SupportNeedId[];
  allowedContexts: AllowedContextId[];
};

export type CompletedSetupDraft = Omit<SetupDraft, 'ageBand'> & { ageBand: AgeBand };

export type ChildProfile = CompletedSetupDraft & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type ExperienceContext = {
  localHour: number;
  availableMinutes: 10 | 20 | 30 | 45 | 60;
  setting: SettingId;
  companions: CompanionId[];
  materialsAvailable: MaterialGroupId[];
  weather: WeatherId;
};

export type ExperienceStatus = 'draft' | 'review' | 'published' | 'retired';

export type Experience = {
  id: string;
  version: number;
  status: ExperienceStatus;
  title: string;
  promise: string;
  domainId: CuriosityAreaId;
  ageBands: AgeBand[];
  durationMinutes: 10 | 20 | 30 | 45 | 60;
  settings: Exclude<SettingId, 'either'>[];
  allowedContexts: AllowedContextId[];
  companionOptions: CompanionId[];
  requiredMaterials: MaterialGroupId[];
  weatherAllowed: WeatherId[];
  timeWindow: 'any' | 'daylight' | 'night';
  adaptations: SupportNeedId[];
  safetyNote: string;
  agePolicies: Record<AgeBand, ExperienceAgePolicy>;
  review: {
    checklistVersion: string;
    reviewed: boolean;
    reviewedAt: string;
    reviewerRole: string;
    expiresAt: string;
    sourceUrls: readonly string[];
    changeNote: string;
  };
};

export type ExperienceAgePolicy = {
  durationMinutes: 10 | 20 | 30 | 45 | 60;
  companionOptions: CompanionId[];
  safetyNote: string;
};

export type Recommendation = {
  experience: Experience;
  fitReasons: string[];
};

export type RecommendationResult = {
  recommendations: Recommendation[];
  excluded: { experienceId: string; reasons: string[] }[];
};

export type LearningEvidenceKind =
  | 'prediction'
  | 'observation'
  | 'explanation'
  | 'retell'
  | 'safety'
  | 'strategy';

export type LearningEvidence = {
  kind: LearningEvidenceKind;
  statement: string;
};

export type ExperienceOutcome = {
  id: string;
  childProfileId: string;
  experienceId: string;
  state: 'started' | 'completed' | 'unfinished' | 'skipped';
  startedAt?: string;
  endedAt?: string;
  reflection?: 'again' | 'learned' | 'challenging' | 'not-for-me';
  catalogVersion: number;
  evidence: LearningEvidence[];
};

export type ConstellationStar = {
  id: string;
  outcomeId: string;
  primaryDomain: CuriosityAreaId;
  litAt: string;
  positionSeed: string;
};

export type SetupStatus = 'loading' | 'missing' | 'complete' | 'corrupt';

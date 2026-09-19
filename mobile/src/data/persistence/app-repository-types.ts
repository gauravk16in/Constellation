import type { ChildProfile, CompletedSetupDraft, ConstellationStar, ExperienceOutcome, SetupStatus } from '@/types/constellation';
import type { ExperienceSession, MissionReflection, StartMissionInput } from '@/types/mission';
import type { EntitlementSnapshot } from '@/features/entitlements/entitlement-types';
import type { PlanetCommand, PlanetData } from '@/types/pocket-planet';

export interface AppRepository {
  getPlanet(profileId: string): Promise<PlanetData>;
  changePlanet(profileId: string, command: PlanetCommand, family: boolean): Promise<PlanetData>;
  initialize(): Promise<void>;
  getEntitlementSnapshot(): Promise<EntitlementSnapshot>;
  saveEntitlementSnapshot(snapshot: EntitlementSnapshot): Promise<void>;
  getProfile(): Promise<ChildProfile | null>;
  getSetupStatus(): Promise<Exclude<SetupStatus, 'loading'>>;
  completeSetup(draft: CompletedSetupDraft): Promise<ChildProfile>;
  deleteChildData(options: { preserveEntitlement: true }): Promise<void>;
  getActiveSession(profileId: string): Promise<ExperienceSession | null>;
  startExperience(input: StartMissionInput): Promise<ExperienceSession>;
  saveSession(session: ExperienceSession): Promise<ExperienceSession>;
  completeSession(sessionId: string, reflection?: MissionReflection): Promise<ExperienceOutcome>;
  skipSession(sessionId: string): Promise<ExperienceOutcome>;
  listOutcomes(profileId: string): Promise<ExperienceOutcome[]>;
  listStars(profileId: string): Promise<ConstellationStar[]>;
}

export function assertSession(session: ExperienceSession) {
  if (
    !session.id || !session.childProfileId || !session.experienceId || !session.startedAt || !session.updatedAt ||
    !['active', 'paused', 'return'].includes(session.phase) || !session.context || !session.interactionState
  ) throw new Error('Stored experience session is invalid.');
  return session;
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function assertProfile(profile: ChildProfile) {
  if (
    !profile.id || !profile.nickname || !['6-7', '8-9', '10-12'].includes(profile.ageBand) ||
    !Array.isArray(profile.interests) || !Array.isArray(profile.supportNeeds) || !Array.isArray(profile.allowedContexts)
  ) throw new Error('Stored profile is invalid.');
  return profile;
}

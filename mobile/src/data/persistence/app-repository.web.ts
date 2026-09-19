import { getMissionDefinition } from '@/data/catalog/mission-registry';
import { applyPlanetCommand, parsePlanet } from '@/features/planet/paper-post-engine';
import { assertProfile, assertSession, makeId, type AppRepository } from '@/data/persistence/app-repository-types';
import { deriveLearningEvidence } from '@/features/missions/mission-state';
import { assertEntitlementSnapshot, makeFreeEntitlementSnapshot } from '@/features/entitlements/entitlement-types';
import type { ChildProfile, ExperienceOutcome, LearningEvidence } from '@/types/constellation';
import type { ExperienceSession, MissionReflection, StartMissionInput } from '@/types/mission';

const PROFILE_KEY = 'constellation.profile.v1';
const OUTCOMES_KEY = 'constellation.outcomes.v1';
const ACTIVE_SESSION_KEY = 'constellation.active-session.v1';
const ENTITLEMENT_KEY = 'constellation.entitlement.v1';
const PLANET_KEY = 'constellation.planet.v1';

function storage() {
  if (typeof localStorage === 'undefined') throw new Error('Local storage is unavailable.');
  return localStorage;
}

function listStoredOutcomes() {
  const value = storage().getItem(OUTCOMES_KEY);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      catalogVersion: typeof item.catalogVersion === 'number' ? item.catalogVersion : 1,
      evidence: sanitizeEvidence(item.evidence),
    })) as ExperienceOutcome[];
  } catch {
    return [];
  }
}

function sanitizeEvidence(value: unknown): LearningEvidence[] {
  if (!Array.isArray(value)) return [];
  const kinds = new Set(['prediction', 'observation', 'explanation', 'retell', 'safety', 'strategy']);
  return value.filter((item): item is LearningEvidence => (
    typeof item === 'object' && item !== null && kinds.has(String(item.kind)) &&
    typeof item.statement === 'string' && item.statement.length > 0 && item.statement.length <= 180
  )).slice(0, 3);
}

function writeTerminalOutcome(session: ExperienceSession, state: 'completed' | 'skipped', reflection?: MissionReflection) {
  const profileValue = storage().getItem(PROFILE_KEY);
  const ageBand = profileValue ? assertProfile(JSON.parse(profileValue) as ChildProfile).ageBand : '8-9';
  const definition = getMissionDefinition(session.experienceId, ageBand, session.catalogVersion);
  const evidence = state === 'completed' && definition ? deriveLearningEvidence(definition, session.interactionState) : [];
  const outcome = {
    id: `outcome-${session.id}`, childProfileId: session.childProfileId, experienceId: session.experienceId,
    state, startedAt: session.startedAt, endedAt: new Date().toISOString(), reflection,
    catalogVersion: session.catalogVersion, evidence,
  } as const;
  const outcomes = listStoredOutcomes().filter((item) => item.id !== outcome.id);
  storage().setItem(OUTCOMES_KEY, JSON.stringify([outcome, ...outcomes]));
  storage().removeItem(ACTIVE_SESSION_KEY);
  return outcome;
}

export const appRepository: AppRepository = {
  async getPlanet(profileId) {
    const profile = await this.getProfile();
    if (!profile || profile.id !== profileId) throw new Error('Reopen your local profile.');
    return parsePlanet(storage().getItem(PLANET_KEY));
  },
  async changePlanet(profileId, command, family) {
    // No awaits between reading and committing: a single atomic storage write
    // includes the outcome, artifact and removal of the digital draft.
    const profileValue = storage().getItem(PROFILE_KEY);
    const profile = profileValue ? assertProfile(JSON.parse(profileValue)) : null;
    if (!profile || profile.id !== profileId) throw new Error('Reopen your local profile.');
    const next = applyPlanetCommand(parsePlanet(storage().getItem(PLANET_KEY)), command, {
      profileId, ageBand: profile.ageBand, family, now: new Date().toISOString(),
    });
    storage().setItem(PLANET_KEY, JSON.stringify(next));
    return next;
  },
  async initialize() {},
  async getEntitlementSnapshot() {
    const value = storage().getItem(ENTITLEMENT_KEY);
    if (!value) return makeFreeEntitlementSnapshot();
    try { return assertEntitlementSnapshot(JSON.parse(value)); } catch { return makeFreeEntitlementSnapshot(); }
  },
  async saveEntitlementSnapshot(snapshot) {
    storage().setItem(ENTITLEMENT_KEY, JSON.stringify(assertEntitlementSnapshot(snapshot)));
  },
  async getProfile() {
    const value = storage().getItem(PROFILE_KEY);
    return value ? assertProfile(JSON.parse(value) as ChildProfile) : null;
  },
  async getSetupStatus() { try { return (await this.getProfile()) ? 'complete' : 'missing'; } catch { return 'corrupt'; } },
  async completeSetup(draft) {
    const now = new Date().toISOString();
    const profile: ChildProfile = { ...draft, id: makeId('profile'), createdAt: now, updatedAt: now };
    storage().setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  },
  async deleteChildData({ preserveEntitlement }) {
    if (!preserveEntitlement) throw new Error('Child data deletion must preserve the guardian store entitlement.');
    storage().removeItem(PLANET_KEY);
    storage().removeItem(PROFILE_KEY); storage().removeItem(OUTCOMES_KEY); storage().removeItem(ACTIVE_SESSION_KEY);
  },
  async getActiveSession(profileId) {
    const value = storage().getItem(ACTIVE_SESSION_KEY);
    if (!value) return null;
    const session = assertSession(JSON.parse(value) as ExperienceSession);
    return session.childProfileId === profileId ? session : null;
  },
  async startExperience(input: StartMissionInput) {
    if (storage().getItem(ACTIVE_SESSION_KEY)) throw new Error('Another mission is already active.');
    const now = new Date().toISOString();
    const session = assertSession({
      id: makeId('session'), childProfileId: input.childProfileId, experienceId: input.experienceId,
      catalogVersion: input.catalogVersion, phase: 'active', context: input.context,
      interactionState: input.interactionState, startedAt: now, updatedAt: now,
    });
    storage().setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    return session;
  },
  async saveSession(session) {
    const current = await this.getActiveSession(session.childProfileId);
    if (!current || current.id !== session.id) throw new Error('The active mission could not be saved.');
    const next = assertSession({ ...session, updatedAt: new Date().toISOString() });
    storage().setItem(ACTIVE_SESSION_KEY, JSON.stringify(next));
    return next;
  },
  async completeSession(sessionId, reflection) {
    const value = storage().getItem(ACTIVE_SESSION_KEY);
    if (value) {
      const session = assertSession(JSON.parse(value) as ExperienceSession);
      if (session.id === sessionId) return writeTerminalOutcome(session, 'completed', reflection);
    }
    const existing = listStoredOutcomes().find((outcome) => outcome.id === `outcome-${sessionId}`);
    if (!existing) throw new Error('This mission is no longer active.');
    return existing;
  },
  async skipSession(sessionId) {
    const value = storage().getItem(ACTIVE_SESSION_KEY);
    if (value) {
      const session = assertSession(JSON.parse(value) as ExperienceSession);
      if (session.id === sessionId) return writeTerminalOutcome(session, 'skipped');
    }
    const existing = listStoredOutcomes().find((outcome) => outcome.id === `outcome-${sessionId}`);
    if (!existing) throw new Error('This mission is no longer active.');
    return existing;
  },
  async listOutcomes(profileId) {
    return listStoredOutcomes().filter((outcome) => outcome.childProfileId === profileId);
  },
  async listStars(profileId) {
    const outcomes = await this.listOutcomes(profileId);
    const { getExperienceById } = await import('@/data/catalog/experience-catalog');
    return outcomes.flatMap((outcome) => {
      if (outcome.state !== 'completed' || !outcome.endedAt) return [];
      const experience = getExperienceById(outcome.experienceId);
      return experience ? [{ id: `star-${outcome.id}`, outcomeId: outcome.id, primaryDomain: experience.domainId,
        litAt: outcome.endedAt, positionSeed: `${outcome.experienceId}:${outcome.id}` }] : [];
    });
  },
};

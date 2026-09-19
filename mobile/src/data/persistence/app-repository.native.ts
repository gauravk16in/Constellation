import * as SQLite from 'expo-sqlite';

import { getMissionDefinition } from '@/data/catalog/mission-registry';
import { applyPlanetCommand, parsePlanet } from '@/features/planet/paper-post-engine';
import type { PlanetData } from '@/types/pocket-planet';
import { assertProfile, assertSession, makeId, type AppRepository } from '@/data/persistence/app-repository-types';
import { deriveLearningEvidence } from '@/features/missions/mission-state';
import { assertEntitlementSnapshot, makeFreeEntitlementSnapshot } from '@/features/entitlements/entitlement-types';
import type { ChildProfile, CompletedSetupDraft, ConstellationStar, ExperienceOutcome, LearningEvidence } from '@/types/constellation';
import type { ExperienceSession, MissionReflection, StartMissionInput } from '@/types/mission';

type StoredProfileRow = {
  id: string; nickname: string; age_band: string; interests_json: string; support_needs_json: string;
  allowed_contexts_json: string; created_at: string; updated_at: string;
};

type StoredSessionRow = {
  id: string; child_profile_id: string; experience_id: string; catalog_version: number; phase: ExperienceSession['phase'];
  context_json: string; interaction_state_json: string; timer_started_at: string | null; started_at: string; updated_at: string;
};

type StoredOutcomeRow = {
  id: string; child_profile_id: string; experience_id: string; state: ExperienceOutcome['state'];
  started_at: string | null; ended_at: string | null; reflection: ExperienceOutcome['reflection'] | null;
  catalog_version: number | null; evidence_json: string | null;
};

type StoredEntitlementRow = {
  tier: string;
  expires_at: string | null;
  checked_at: string;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase() {
  if (!databasePromise) databasePromise = SQLite.openDatabaseAsync('constellation.db').then(async (database) => {
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS child_profiles (
        id TEXT PRIMARY KEY NOT NULL, nickname TEXT NOT NULL, age_band TEXT NOT NULL,
        interests_json TEXT NOT NULL, support_needs_json TEXT NOT NULL, allowed_contexts_json TEXT NOT NULL,
        created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS experience_outcomes (
        id TEXT PRIMARY KEY NOT NULL, child_profile_id TEXT NOT NULL, experience_id TEXT NOT NULL,
        state TEXT NOT NULL, started_at TEXT, ended_at TEXT, reflection TEXT,
        catalog_version INTEGER NOT NULL DEFAULT 1, evidence_json TEXT NOT NULL DEFAULT '[]'
      );
      CREATE TABLE IF NOT EXISTS experience_sessions (
        id TEXT PRIMARY KEY NOT NULL,
        child_profile_id TEXT NOT NULL UNIQUE,
        experience_id TEXT NOT NULL,
        catalog_version INTEGER NOT NULL,
        phase TEXT NOT NULL,
        context_json TEXT NOT NULL,
        interaction_state_json TEXT NOT NULL,
        timer_started_at TEXT,
        started_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS entitlement_cache (
        id TEXT PRIMARY KEY NOT NULL,
        tier TEXT NOT NULL,
        expires_at TEXT,
        checked_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS experience_outcomes_profile_idx ON experience_outcomes(child_profile_id, ended_at);
    `);
    const outcomeColumns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(experience_outcomes)');
    if (!outcomeColumns.some((column) => column.name === 'catalog_version')) {
      await database.execAsync('ALTER TABLE experience_outcomes ADD COLUMN catalog_version INTEGER NOT NULL DEFAULT 1;');
    }
    if (!outcomeColumns.some((column) => column.name === 'evidence_json')) {
      await database.execAsync("ALTER TABLE experience_outcomes ADD COLUMN evidence_json TEXT NOT NULL DEFAULT '[]';");
    }
    const schemaRow = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    if ((schemaRow?.user_version ?? 0) < 5) {
      await database.withExclusiveTransactionAsync(async (transaction) => {
        await transaction.execAsync(`CREATE TABLE IF NOT EXISTS pocket_planet (
          child_profile_id TEXT PRIMARY KEY NOT NULL, data_json TEXT NOT NULL
        ); PRAGMA user_version = 5;`);
      });
    }
    return database;
  });
  return databasePromise;
}

function parseSession(row: StoredSessionRow) {
  return assertSession({
    id: row.id,
    childProfileId: row.child_profile_id,
    experienceId: row.experience_id,
    catalogVersion: row.catalog_version,
    phase: row.phase,
    context: JSON.parse(row.context_json),
    interactionState: JSON.parse(row.interaction_state_json),
    timerStartedAt: row.timer_started_at ?? undefined,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
  } as ExperienceSession);
}

function parseEvidence(value: string | null): LearningEvidence[] {
  try {
    const parsed = value ? JSON.parse(value) : [];
    if (!Array.isArray(parsed)) return [];
    const kinds = new Set(['prediction', 'observation', 'explanation', 'retell', 'safety', 'strategy']);
    return parsed.filter((item): item is LearningEvidence => (
      typeof item === 'object' && item !== null && kinds.has(String(item.kind)) &&
      typeof item.statement === 'string' && item.statement.length > 0 && item.statement.length <= 180
    )).slice(0, 3);
  } catch {
    return [];
  }
}

function parseOutcome(row: StoredOutcomeRow): ExperienceOutcome {
  return {
    id: row.id, childProfileId: row.child_profile_id, experienceId: row.experience_id, state: row.state,
    startedAt: row.started_at ?? undefined, endedAt: row.ended_at ?? undefined, reflection: row.reflection ?? undefined,
    catalogVersion: row.catalog_version ?? 1, evidence: parseEvidence(row.evidence_json),
  };
}

function parseRow(row: StoredProfileRow) {
  return assertProfile({
    id: row.id, nickname: row.nickname, ageBand: row.age_band,
    interests: JSON.parse(row.interests_json), supportNeeds: JSON.parse(row.support_needs_json),
    allowedContexts: JSON.parse(row.allowed_contexts_json), createdAt: row.created_at, updatedAt: row.updated_at,
  } as ChildProfile);
}

export const appRepository: AppRepository = {
  async getPlanet(profileId) {
    const database = await getDatabase();
    const row = await database.getFirstAsync<{ data_json: string }>('SELECT data_json FROM pocket_planet WHERE child_profile_id = ?', profileId);
    return parsePlanet(row?.data_json ?? null);
  },
  async changePlanet(profileId, command, family) {
    const database = await getDatabase();
    let next: PlanetData | undefined;
    await database.withExclusiveTransactionAsync(async (transaction) => {
      const profileRow = await transaction.getFirstAsync<StoredProfileRow>('SELECT * FROM child_profiles WHERE id = ?', profileId);
      if (!profileRow) throw new Error('Reopen your local profile.');
      const row = await transaction.getFirstAsync<{ data_json: string }>('SELECT data_json FROM pocket_planet WHERE child_profile_id = ?', profileId);
      next = applyPlanetCommand(parsePlanet(row?.data_json ?? null), command, {
        profileId, ageBand: parseRow(profileRow).ageBand, family, now: new Date().toISOString(),
      });
      await transaction.runAsync('INSERT INTO pocket_planet (child_profile_id, data_json) VALUES (?, ?) ON CONFLICT(child_profile_id) DO UPDATE SET data_json = excluded.data_json', profileId, JSON.stringify(next));
    });
    if (!next) throw new Error('Your creation could not be saved. Try again.');
    return next;
  },
  async initialize() { await getDatabase(); },
  async getEntitlementSnapshot() {
    const database = await getDatabase();
    const row = await database.getFirstAsync<StoredEntitlementRow>("SELECT tier, expires_at, checked_at FROM entitlement_cache WHERE id = 'family' LIMIT 1");
    return row ? assertEntitlementSnapshot({
      tier: row.tier,
      expiresAt: row.expires_at ?? undefined,
      checkedAt: row.checked_at,
    }) : makeFreeEntitlementSnapshot();
  },
  async saveEntitlementSnapshot(snapshot) {
    const database = await getDatabase();
    const safe = assertEntitlementSnapshot(snapshot);
    await database.runAsync(
      `INSERT INTO entitlement_cache (id, tier, expires_at, checked_at) VALUES ('family', ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET tier = excluded.tier, expires_at = excluded.expires_at, checked_at = excluded.checked_at`,
      safe.tier, safe.expiresAt ?? null, safe.checkedAt,
    );
  },
  async getProfile() {
    const database = await getDatabase();
    const row = await database.getFirstAsync<StoredProfileRow>('SELECT * FROM child_profiles ORDER BY created_at ASC LIMIT 1');
    return row ? parseRow(row) : null;
  },
  async getSetupStatus() { try { return (await this.getProfile()) ? 'complete' : 'missing'; } catch { return 'corrupt'; } },
  async completeSetup(draft: CompletedSetupDraft) {
    const now = new Date().toISOString();
    const profile: ChildProfile = { ...draft, id: makeId('profile'), createdAt: now, updatedAt: now };
    const database = await getDatabase();
    await database.withTransactionAsync(async () => {
      await database.runAsync('DELETE FROM child_profiles');
      await database.runAsync(
        `INSERT INTO child_profiles (id, nickname, age_band, interests_json, support_needs_json, allowed_contexts_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        profile.id, profile.nickname, profile.ageBand, JSON.stringify(profile.interests), JSON.stringify(profile.supportNeeds),
        JSON.stringify(profile.allowedContexts), profile.createdAt, profile.updatedAt,
      );
    });
    return profile;
  },
  async deleteChildData({ preserveEntitlement }) {
    if (!preserveEntitlement) throw new Error('Child data deletion must preserve the guardian store entitlement.');
    const database = await getDatabase();
    await database.withExclusiveTransactionAsync(async (transaction) => {
      await transaction.runAsync('DELETE FROM pocket_planet');
      await transaction.runAsync('DELETE FROM experience_sessions');
      await transaction.runAsync('DELETE FROM experience_outcomes');
      await transaction.runAsync('DELETE FROM child_profiles');
    });
  },
  async getActiveSession(profileId: string) {
    const database = await getDatabase();
    const row = await database.getFirstAsync<StoredSessionRow>('SELECT * FROM experience_sessions WHERE child_profile_id = ? LIMIT 1', profileId);
    return row ? parseSession(row) : null;
  },
  async startExperience(input: StartMissionInput) {
    const database = await getDatabase();
    const now = new Date().toISOString();
    const session = assertSession({
      id: makeId('session'), childProfileId: input.childProfileId, experienceId: input.experienceId,
      catalogVersion: input.catalogVersion, phase: 'active', context: input.context,
      interactionState: input.interactionState, startedAt: now, updatedAt: now,
    });
    await database.runAsync(
      `INSERT INTO experience_sessions (
        id, child_profile_id, experience_id, catalog_version, phase, context_json,
        interaction_state_json, timer_started_at, started_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      session.id, session.childProfileId, session.experienceId, session.catalogVersion, session.phase,
      JSON.stringify(session.context), JSON.stringify(session.interactionState), null, session.startedAt, session.updatedAt,
    );
    return session;
  },
  async saveSession(session: ExperienceSession) {
    const database = await getDatabase();
    const next = assertSession({ ...session, updatedAt: new Date().toISOString() });
    const result = await database.runAsync(
      `UPDATE experience_sessions SET phase = ?, context_json = ?, interaction_state_json = ?,
       timer_started_at = ?, updated_at = ? WHERE id = ?`,
      next.phase, JSON.stringify(next.context), JSON.stringify(next.interactionState),
      next.timerStartedAt ?? null, next.updatedAt, next.id,
    );
    if (result.changes !== 1) throw new Error('The active mission could not be saved.');
    return next;
  },
  async completeSession(sessionId: string, reflection?: MissionReflection) {
    const database = await getDatabase();
    let outcome: ExperienceOutcome | null = null;
    await database.withExclusiveTransactionAsync(async (transaction) => {
      const row = await transaction.getFirstAsync<StoredSessionRow>('SELECT * FROM experience_sessions WHERE id = ?', sessionId);
      if (!row) {
        const existing = await transaction.getFirstAsync<StoredOutcomeRow>('SELECT * FROM experience_outcomes WHERE id = ?', `outcome-${sessionId}`);
        if (existing) outcome = parseOutcome(existing);
        return;
      }
      const session = parseSession(row);
      const endedAt = new Date().toISOString();
      const profileRow = await transaction.getFirstAsync<StoredProfileRow>('SELECT * FROM child_profiles WHERE id = ? LIMIT 1', session.childProfileId);
      const ageBand = profileRow ? parseRow(profileRow).ageBand : '8-9';
      const definition = getMissionDefinition(session.experienceId, ageBand, session.catalogVersion);
      const evidence = definition ? deriveLearningEvidence(definition, session.interactionState) : [];
      outcome = {
        id: `outcome-${session.id}`, childProfileId: session.childProfileId, experienceId: session.experienceId,
        state: 'completed', startedAt: session.startedAt, endedAt, reflection,
        catalogVersion: session.catalogVersion, evidence,
      };
      await transaction.runAsync(
        `INSERT OR REPLACE INTO experience_outcomes (id, child_profile_id, experience_id, state, started_at, ended_at, reflection, catalog_version, evidence_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        outcome.id, outcome.childProfileId, outcome.experienceId, outcome.state,
        outcome.startedAt ?? null, outcome.endedAt ?? null, outcome.reflection ?? null,
        outcome.catalogVersion, JSON.stringify(outcome.evidence),
      );
      await transaction.runAsync('DELETE FROM experience_sessions WHERE id = ?', sessionId);
    });
    if (!outcome) throw new Error('This mission is no longer active.');
    return outcome;
  },
  async skipSession(sessionId: string) {
    const database = await getDatabase();
    let outcome: ExperienceOutcome | null = null;
    await database.withExclusiveTransactionAsync(async (transaction) => {
      const row = await transaction.getFirstAsync<StoredSessionRow>('SELECT * FROM experience_sessions WHERE id = ?', sessionId);
      if (!row) {
        const existing = await transaction.getFirstAsync<StoredOutcomeRow>('SELECT * FROM experience_outcomes WHERE id = ?', `outcome-${sessionId}`);
        if (existing) outcome = parseOutcome(existing);
        return;
      }
      const session = parseSession(row);
      const endedAt = new Date().toISOString();
      outcome = {
        id: `outcome-${session.id}`, childProfileId: session.childProfileId, experienceId: session.experienceId,
        state: 'skipped', startedAt: session.startedAt, endedAt,
        catalogVersion: session.catalogVersion, evidence: [],
      };
      await transaction.runAsync(
        `INSERT OR REPLACE INTO experience_outcomes (id, child_profile_id, experience_id, state, started_at, ended_at, reflection, catalog_version, evidence_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        outcome.id, outcome.childProfileId, outcome.experienceId, outcome.state,
        outcome.startedAt ?? null, outcome.endedAt ?? null, null, outcome.catalogVersion, '[]',
      );
      await transaction.runAsync('DELETE FROM experience_sessions WHERE id = ?', sessionId);
    });
    if (!outcome) throw new Error('This mission is no longer active.');
    return outcome;
  },
  async listOutcomes(profileId: string) {
    const database = await getDatabase();
    const rows = await database.getAllAsync<StoredOutcomeRow>('SELECT * FROM experience_outcomes WHERE child_profile_id = ? ORDER BY ended_at DESC', profileId);
    return rows.map(parseOutcome);
  },
  async listStars(profileId: string) {
    const outcomes = await this.listOutcomes(profileId);
    const { getExperienceById } = await import('@/data/catalog/experience-catalog');
    return outcomes.flatMap((outcome) => {
      if (outcome.state !== 'completed' || !outcome.endedAt) return [];
      const experience = getExperienceById(outcome.experienceId);
      if (!experience) return [];
      return [{ id: `star-${outcome.id}`, outcomeId: outcome.id, primaryDomain: experience.domainId,
        litAt: outcome.endedAt, positionSeed: `${outcome.experienceId}:${outcome.id}` } satisfies ConstellationStar];
    });
  },
};

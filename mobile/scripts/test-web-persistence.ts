import { getExperienceById } from '../src/data/catalog/experience-catalog';
import { getMissionDefinition } from '../src/data/catalog/mission-registry';
import { createMissionState, setSelected, setValue } from '../src/features/missions/mission-state';
import type { ExperienceContext } from '../src/types/constellation';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
  serialized() { return [...this.values.values()].join('\n'); }
}

const memoryStorage = new MemoryStorage();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: memoryStorage });

async function main() {
const { appRepository } = await import('../src/data/persistence/app-repository.web');
const profile = await appRepository.completeSetup({
  nickname: 'Nova', ageBand: '8-9', interests: ['nature-noticing'], supportNeeds: [], allowedContexts: ['home', 'yard'],
});
const defaultEntitlement = await appRepository.getEntitlementSnapshot();
assert(defaultEntitlement.tier === 'free', 'A new local install must begin with useful free access.');
await appRepository.saveEntitlementSnapshot({ tier: 'family', checkedAt: '2026-08-30T00:00:00.000Z', expiresAt: '2027-08-30T00:00:00.000Z' });
const storedEntitlement = await appRepository.getEntitlementSnapshot();
assert(storedEntitlement.tier === 'family' && storedEntitlement.expiresAt === '2027-08-30T00:00:00.000Z', 'The local entitlement cache must survive independently of child progress.');
const experience = getExperienceById('rose-signal')!;
const mission = getMissionDefinition('rose-signal')!;
let state = createMissionState(mission.briefInteractions, mission.returnInteractions);
const roseInteraction = mission.briefInteractions[0];
if (roseInteraction.kind === 'safety-sequence') {
  state = setValue(state, roseInteraction.id, 'sharp-part', 'prickle');
  state = setValue(state, roseInteraction.id, 'safe-plan', 'stay-back');
}
state = { ...state, preparationChecked: mission.preparation.map((item) => item.id), guardianConfirmed: true };
const context: ExperienceContext = {
  localHour: 14, availableMinutes: 20, setting: 'either', companions: ['guardian'],
  materialsAvailable: ['nothing-special', 'familiar-plant'], weather: 'unknown',
};

const session = await appRepository.startExperience({
  childProfileId: profile.id, experienceId: experience.id, catalogVersion: experience.version, context, interactionState: state,
});
const firstOutcome = await appRepository.completeSession(session.id, 'learned');
const repeatedOutcome = await appRepository.completeSession(session.id, 'learned');
const [outcomes, stars, activeSession] = await Promise.all([
  appRepository.listOutcomes(profile.id), appRepository.listStars(profile.id), appRepository.getActiveSession(profile.id),
]);

assert(firstOutcome.id === repeatedOutcome.id, 'Repeated completion must resolve to the same terminal outcome.');
assert(outcomes.length === 1, 'Repeated completion must not duplicate outcomes.');
assert(stars.length === 1, 'Repeated completion must not duplicate constellation stars.');
assert(activeSession === null, 'Completion must remove the active session.');
assert(firstOutcome.catalogVersion === experience.version, 'The outcome must remember the catalog version used by the mission.');
assert(firstOutcome.evidence.length > 0 && firstOutcome.evidence.length <= 3, 'A flagship outcome must retain one to three approved evidence summaries.');
assert(!memoryStorage.serialized().includes('sharp-part'), 'Safety answers must not remain after the active session is completed.');
assert(!memoryStorage.serialized().includes('stay-back'), 'Story interaction answers must not enter terminal outcome storage.');
assert(!memoryStorage.serialized().includes('guardianConfirmed'), 'Guardian confirmation must not enter terminal outcome storage.');

const storyExperience = getExperienceById('three-object-story')!;
const storyMission = getMissionDefinition('three-object-story')!;
let storyState = createMissionState(storyMission.briefInteractions, storyMission.returnInteractions);
storyState = setValue(storyState, 'story-objects', 'beginning', 'private red cup');
storyState = setValue(storyState, 'story-objects', 'middle', 'private blue key');
storyState = setValue(storyState, 'story-objects', 'ending', 'private green box');
storyState = setValue(storyState, 'story-retell', 'beginning', true);
storyState = setValue(storyState, 'story-retell', 'middle', true);
storyState = setValue(storyState, 'story-retell', 'ending', true);
storyState = { ...storyState, preparationChecked: storyMission.preparation.map((item) => item.id) };
const storySession = await appRepository.startExperience({
  childProfileId: profile.id, experienceId: storyExperience.id, catalogVersion: storyExperience.version,
  context: { ...context, materialsAvailable: [...context.materialsAvailable, 'basic-household'] }, interactionState: storyState,
});
const storyOutcome = await appRepository.completeSession(storySession.id, 'again');
assert(storyOutcome.evidence.some((item) => item.kind === 'retell'), 'Three-Object Story must retain the approved retell summary.');
assert(!memoryStorage.serialized().includes('private red cup'), 'Child-entered object names must disappear with the completed session.');
assert(!memoryStorage.serialized().includes('private blue key'), 'No child-entered story object may enter evidence storage.');

const bridgeExperience = getExperienceById('paper-bridge')!;
const bridgeMission = getMissionDefinition('paper-bridge', '8-9', bridgeExperience.version)!;
let bridgeState = createMissionState(bridgeMission.briefInteractions, bridgeMission.returnInteractions);
bridgeState = setSelected(bridgeState, 'bridge-fold', ['folded']);
bridgeState = setSelected(bridgeState, 'bridge-prediction', ['stiffer']);
const bridgeSession = await appRepository.startExperience({ childProfileId: profile.id, experienceId: bridgeExperience.id,
  catalogVersion: bridgeExperience.version, context: { ...context, availableMinutes: 60, setting: 'indoors', materialsAvailable: ['paper-drawing', 'basic-household'] }, interactionState: bridgeState });
let blocked = false;
try { await appRepository.completeSession(bridgeSession.id); } catch { blocked = true; }
assert(blocked && (await appRepository.getActiveSession(profile.id))?.id === bridgeSession.id, 'An unfinished bridge return cannot create a star or discard the session.');
bridgeState = setSelected(bridgeState, 'bridge-revision', ['shape']);
bridgeState = setSelected(bridgeState, 'bridge-learning', ['folded']);
bridgeState = { ...bridgeState, 'bridge-result.option-1': 2, 'bridge-second-result.objects': 5,
  'bridge-first-confirmed': true, 'bridge-second-confirmed': true, privateNote: 'never remember my raw answer' };
await appRepository.saveSession({ ...bridgeSession, phase: 'return', interactionState: bridgeState });
const bridgeOutcome = await appRepository.completeSession(bridgeSession.id, 'learned');
assert(bridgeOutcome.evidence.length === 3 && bridgeOutcome.evidence[1].statement.includes('2') && bridgeOutcome.evidence[2].statement.includes('5'), 'The bridge star must retain bounded, reported test results.');
assert((await appRepository.completeSession(bridgeSession.id)).id === bridgeOutcome.id, 'A double completion must not create a second bridge star.');
assert(!memoryStorage.serialized().includes('never remember my raw answer'), 'A bridge learning memory must not retain arbitrary session text.');

const storedOutcomes = JSON.parse(memoryStorage.getItem('constellation.outcomes.v1') ?? '[]');
delete storedOutcomes[0].catalogVersion;
storedOutcomes[0].evidence = 'corrupt';
memoryStorage.setItem('constellation.outcomes.v1', JSON.stringify(storedOutcomes));
const legacyOutcomes = await appRepository.listOutcomes(profile.id);
assert(legacyOutcomes[0].catalogVersion === 1, 'Legacy web outcomes must default to catalog version 1.');
assert(legacyOutcomes[0].evidence.length === 0, 'Corrupt or missing legacy evidence must degrade to an empty list.');

await appRepository.deleteChildData({ preserveEntitlement: true });
assert(await appRepository.getProfile() === null, 'Deleting child data must remove the local profile.');
assert((await appRepository.listOutcomes(profile.id)).length === 0, 'Deleting child data must remove outcomes and stars.');
assert((await appRepository.getEntitlementSnapshot()).tier === 'family', 'Deleting child data must preserve the anonymous store entitlement.');

console.log('Persistence checks passed: completion is idempotent, evidence is sanitized, entitlement is separate from deletable child data, free text is discarded, and legacy outcomes recover.');
}

void main();

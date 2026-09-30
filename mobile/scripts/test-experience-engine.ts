import { CURIOSITY_AREAS } from '../src/data/catalog/curiosity-areas';
import { EXPERIENCE_CATALOG, getExperienceById } from '../src/data/catalog/experience-catalog';
import { FLAGSHIP_EXPERIENCE_IDS, MISSION_DEFINITIONS, getMissionDefinition, validateMissionRegistry } from '../src/data/catalog/mission-registry';
import { createMissionState, deriveLearningEvidence, getPrimaryInteraction, isInteractionReady, isMissionReturnReady, isMissionStartReady, setOrder, setSelected, setValue } from '../src/features/missions/mission-state';
import { thinkingMovesForMission } from '../src/features/missions/thinking-engine';
import { evaluateExperience, recommendExperiences } from '../src/features/recommendations/recommendation-engine';
import { canAccessExperience, FREE_MISSION_COUNT } from '../src/features/entitlements/access-policy';
import type { ChildProfile, ExperienceContext } from '../src/types/constellation';
import type { MissionInteraction, MissionInteractionState } from '../src/types/mission';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function satisfyInteraction(interaction: MissionInteraction, state: MissionInteractionState) {
  switch (interaction.kind) {
    case 'choice-board':
      return setSelected(state, interaction.id, interaction.options.slice(0, interaction.minSelections).map((item) => item.id));
    case 'comparison':
      return setSelected(state, interaction.id, [interaction.options[0].id]);
    case 'ordered-cards': {
      const selected = interaction.options.slice(0, interaction.minSelections).map((item) => item.id);
      return setOrder(setSelected(state, interaction.id, selected), interaction.id, selected);
    }
    case 'prompt-deck':
      return setSelected(state, interaction.id, interaction.options.slice(0, interaction.selectionCount).map((item) => item.id));
    case 'slot-input':
      return interaction.slots.reduce((next, slot) => setValue(next, interaction.id, slot.id, 'private test words'), state);
    case 'safety-sequence':
      return interaction.scenes.reduce((next, scene) => setValue(next, interaction.id, scene.id, scene.options.find((option) => option.correct)!.id), state);
    case 'retell-cards':
      return interaction.cards.reduce((next, card) => setValue(next, interaction.id, card.id, true), state);
    case 'arrangement':
    case 'counter':
    case 'marker-board':
      return state;
  }
}

const profile: ChildProfile = {
  id: 'profile-test', nickname: 'Nova', ageBand: '8-9',
  interests: ['nature-noticing', 'test-discover'], supportNeeds: [],
  allowedContexts: ['home', 'yard', 'public-place'], createdAt: '2026-08-20T00:00:00.000Z', updatedAt: '2026-08-20T00:00:00.000Z',
};

const context: ExperienceContext = {
  localHour: 14, availableMinutes: 60, setting: 'either', companions: ['guardian'],
  materialsAvailable: ['nothing-special', 'paper-drawing', 'basic-household', 'outdoor-found', 'familiar-plant'], weather: 'clear',
};

assert(EXPERIENCE_CATALOG.length === 25, 'The catalog must contain exactly 25 reviewed experiences.');
assert(MISSION_DEFINITIONS.length === 25, 'Every reviewed experience must have one authored mission.');
assert(validateMissionRegistry(EXPERIENCE_CATALOG.map((experience) => experience.id)).length === 0, 'The mission registry must match the published catalog exactly.');
assert(MISSION_DEFINITIONS.filter((mission) => mission.startPolicy.kind === 'guardian-confirm').length === 6, 'Exactly six missions require an explicit grown-up handoff after the Rose pilot.');
for (const mission of MISSION_DEFINITIONS) {
  const state = createMissionState(mission.briefInteractions, mission.returnInteractions);
  const primaryInteraction = getPrimaryInteraction(mission);
  assert(typeof state === 'object', `${mission.experienceId} must produce serializable initial mission state.`);
  if (primaryInteraction.kind === 'arrangement' || primaryInteraction.kind === 'counter' || primaryInteraction.kind === 'marker-board') {
    assert(isInteractionReady(primaryInteraction, state), `${mission.experienceId} should initialize its non-input interaction safely.`);
  }
}
assert(MISSION_DEFINITIONS.filter((mission) => mission.narrative).length === 25, 'Every mission must be a living-world story mission.');
assert(new Set(MISSION_DEFINITIONS.map((mission) => mission.narrative.worldId)).size === 6, 'The 25 signals must belong to exactly six reusable worlds.');
assert(new Set(MISSION_DEFINITIONS.map((mission) => mission.narrative.signalId)).size === 25, 'Every mission needs a unique story signal.');
assert(FLAGSHIP_EXPERIENCE_IDS.every((id) => MISSION_DEFINITIONS.find((mission) => mission.experienceId === id)?.narrative), 'Every configured flagship needs complete narrative metadata.');
for (const ageBand of ['6-7', '8-9', '10-12'] as const) {
  for (const experience of EXPERIENCE_CATALOG) {
    const mission = getMissionDefinition(experience.id, ageBand, experience.version)!;
    assert(mission.briefInteractions.length > 0, `${experience.id} ${ageBand} needs an authored interaction.`);
    assert(mission.narrative.signalId === experience.id, `${experience.id} ${ageBand} must resolve its stable signal.`);
    assert(thinkingMovesForMission(mission).length === 3, `${experience.id} must invite three authored thinking moves without a score.`);
    if (ageBand === '6-7') {
      assert(mission.startPolicy.kind === 'guardian-confirm', `${experience.id} ages 6-7 must be guardian-led.`);
      assert(!mission.briefInteractions.some((interaction) => interaction.kind === 'slot-input'), `${experience.id} ages 6-7 cannot require typing.`);
    }
  }
}

for (const experienceId of ['paper-bridge', 'three-object-story', 'window-nature-log']) {
  for (const ageBand of ['6-7', '8-9', '10-12'] as const) {
    const mission = getMissionDefinition(experienceId, ageBand, 2)!;
    assert(![...mission.briefInteractions, ...(mission.returnInteractions ?? [])].some((interaction) => interaction.kind === 'slot-input'), `${experienceId} ${ageBand} must remain touch-first.`);
    const visualOptions = [...mission.briefInteractions, ...(mission.returnInteractions ?? [])].flatMap((interaction) => 'options' in interaction ? interaction.options : []);
    assert(visualOptions.some((option) => option.visualId), `${experienceId} ${ageBand} needs code-native visual choices.`);
    assert(mission.preparation.length >= 3, `${experienceId} ${ageBand} must retain the full readiness and safety boundary.`);
  }
}
const bridgeMission = getMissionDefinition('paper-bridge', '8-9', 2)!;
assert(bridgeMission.briefInteractions.some((interaction) => interaction.id === 'bridge-prediction'), 'Paper Bridge must capture a prediction before the child builds.');
assert(bridgeMission.returnInteractions?.some((interaction) => interaction.id === 'bridge-learning'), 'Paper Bridge must compare the real test with the plan.');
const storyMission = getMissionDefinition('three-object-story', '8-9', 2)!;
assert(storyMission.briefInteractions[0].kind === 'ordered-cards', 'Three-Object Story must let children choose and sequence tangible tokens without typing.');
assert(storyMission.returnInteractions?.some((interaction) => interaction.kind === 'retell-cards'), 'Three-Object Story must end with a spoken beginning-middle-ending retell.');
const windowMission = getMissionDefinition('window-nature-log', '8-9', 2)!;
assert(windowMission.returnInteractions?.some((interaction) => interaction.id === 'window-result'), 'Window Nature Log must let the child report changed, same, or unsure.');
assert(FREE_MISSION_COUNT === 6, 'The useful free Constellation must contain one flagship in every curiosity area.');
assert(FLAGSHIP_EXPERIENCE_IDS.every((id) => canAccessExperience(id, 'free')), 'Every flagship must remain available without a family membership.');
assert(!canAccessExperience('room-rhythm', 'free'), 'A non-flagship mission must require family access.');
assert(canAccessExperience('room-rhythm', 'family'), 'Family access must include the full reviewed catalog.');
for (const flagshipId of FLAGSHIP_EXPERIENCE_IDS) {
  const mission = MISSION_DEFINITIONS.find((item) => item.experienceId === flagshipId)!;
  let state = createMissionState(mission.briefInteractions, mission.returnInteractions);
  for (const interaction of mission.briefInteractions) state = satisfyInteraction(interaction, state);
  state = { ...state, preparationChecked: mission.preparation.map((item) => item.id), guardianConfirmed: mission.startPolicy.kind === 'guardian-confirm' };
  assert(isMissionStartReady(mission, state), `${flagshipId} must become start-ready with valid authored inputs.`);
  for (const interaction of mission.returnInteractions ?? []) state = satisfyInteraction(interaction, state);
  if (flagshipId === 'paper-bridge') state = { ...state, 'bridge-first-confirmed': true, 'bridge-second-confirmed': true };
  const evidence = deriveLearningEvidence(mission, state);
  assert(evidence.length > 0 && evidence.length <= 3, `${flagshipId} must derive one to three approved evidence summaries.`);
  assert(!JSON.stringify(evidence).includes('private test words'), `${flagshipId} evidence must not retain child-entered text.`);
}
const bridgeV3 = getMissionDefinition('paper-bridge', '8-9', 3)!;
const bridgeV4 = getMissionDefinition('paper-bridge', '8-9', 4)!;
assert(!bridgeV3.returnInteractions?.some((item) => item.id === 'bridge-revision'), 'An active v3 bridge must retain its old return definition.');
assert(bridgeV4.returnInteractions?.some((item) => item.id === 'bridge-revision'), 'New bridges need a revision choice.');
let bridgeState = createMissionState(bridgeV4.briefInteractions, bridgeV4.returnInteractions);
bridgeState = setSelected(bridgeState, 'bridge-revision', ['shape']);
assert(!isMissionReturnReady(bridgeV4, bridgeState), 'An unrecorded real test cannot light a star.');
bridgeState = { ...bridgeState, 'bridge-first-confirmed': true, 'bridge-second-confirmed': true,
  'bridge-result.option-1': 2, 'bridge-second-result.objects': 5 };
bridgeState = setSelected(bridgeState, 'bridge-learning', ['folded']);
assert(isMissionReturnReady(bridgeV4, bridgeState), 'Two reported tests may complete the bridge mission.');
const bridgeEvidence = deriveLearningEvidence(bridgeV4, bridgeState);
assert(bridgeEvidence.length === 3 && bridgeEvidence[1].statement.includes('2') && bridgeEvidence[2].statement.includes('5'), 'The star must remember bounded reported results.');
assert(!JSON.stringify(bridgeEvidence).includes('guardian'), 'The memory must not include guardian confirmation.');
for (const area of CURIOSITY_AREAS) {
  const expectedCount = area.id === 'nature-noticing' ? 5 : 4;
  assert(EXPERIENCE_CATALOG.filter((experience) => experience.domainId === area.id).length === expectedCount, `${area.id} must contain ${expectedCount} experiences.`);
}

const roseMission = MISSION_DEFINITIONS.find((mission) => mission.experienceId === 'rose-signal')!;
assert(roseMission.narrative?.hook.heading === 'The Nature Compass lost the Rose Signal.', 'Rose needs its complete story hook.');
assert(roseMission.narrative?.knowledgeReveal.heading === 'Those “thorns” have another name.', 'Rose needs its botanical knowledge reveal.');
assert(roseMission.narrative?.resolvedWorld.heading === 'Rose Signal restored.', 'Rose needs its resolved world state.');
const roseInteraction = getPrimaryInteraction(roseMission);
assert(roseInteraction.kind === 'safety-sequence', 'Rose must use the authored safety sequence.');
assert(roseMission.returnInteractions?.length === 2, 'Rose must collect both return discoveries.');

let roseState = createMissionState(roseMission.briefInteractions, roseMission.returnInteractions);
roseState = { ...roseState, preparationChecked: roseMission.preparation.map((item) => item.id), guardianConfirmed: true };
assert(!isMissionStartReady(roseMission, roseState), 'Rose cannot start before both safety clues are correct.');
if (roseInteraction.kind === 'safety-sequence') {
  const [partScene, planScene] = roseInteraction.scenes;
  roseState = setValue(roseState, roseInteraction.id, partScene.id, 'petal');
  roseState = setValue(roseState, roseInteraction.id, planScene.id, 'grab-stem');
  assert(!isMissionStartReady(roseMission, roseState), 'Unsafe Rose answers cannot start the mission.');
  roseState = setValue(roseState, roseInteraction.id, partScene.id, 'prickle');
  roseState = setValue(roseState, roseInteraction.id, planScene.id, 'stay-back');
}
assert(isMissionStartReady(roseMission, roseState), 'Correct clues, preparation, and guardian confirmation should make Rose ready.');
assert(!isMissionStartReady(roseMission, { ...roseState, guardianConfirmed: false }), 'Rose cannot start without guardian confirmation.');

const snackMission = MISSION_DEFINITIONS.find((mission) => mission.experienceId === 'cold-snack-builder')!;
assert(snackMission.briefInteractions.length === 2, 'Cold Snack needs both ingredient planning and a safety sequence.');
let snackState = createMissionState(snackMission.briefInteractions, snackMission.returnInteractions);
snackState = { ...snackState, preparationChecked: snackMission.preparation.map((item) => item.id), guardianConfirmed: true };
snackState = setValue(snackState, 'snack-parts', 'base', 'approved base');
snackState = setValue(snackState, 'snack-parts', 'fruit-veg', 'approved fruit');
snackState = setValue(snackState, 'snack-parts', 'extra', 'approved extra');
assert(!isMissionStartReady(snackMission, snackState), 'Cold Snack cannot start before both safety checks are correct.');
snackState = setValue(snackState, 'snack-safety', 'ingredients', 'unknown');
snackState = setValue(snackState, 'snack-safety', 'tools', 'sharp-hot');
assert(!isMissionStartReady(snackMission, snackState), 'Unsafe Cold Snack choices cannot start the mission.');
snackState = setValue(snackState, 'snack-safety', 'ingredients', 'approved');
snackState = setValue(snackState, 'snack-safety', 'tools', 'cold-safe');
assert(isMissionStartReady(snackMission, snackState), 'Approved ingredients, safe tools, readiness, and guardian confirmation should make Cold Snack ready.');
assert(!isMissionStartReady(snackMission, { ...snackState, guardianConfirmed: false }), 'Cold Snack cannot start without guardian confirmation.');

const firstRun = recommendExperiences({ profile, context, limit: 3 });
const secondRun = recommendExperiences({ profile, context, limit: 3 });
assert(firstRun.recommendations.length <= 3, 'Recommendations must never exceed three.');
assert(
  firstRun.recommendations.map((item) => item.experience.id).join('|') === secondRun.recommendations.map((item) => item.experience.id).join('|'),
  'The same inputs must produce stable recommendation order.',
);
assert(firstRun.recommendations.every((item) => item.fitReasons.length > 0), 'Every recommendation needs a fit reason.');
const freeRun = recommendExperiences({ profile, context, accessTier: 'free', limit: 3 });
assert(freeRun.recommendations.every((item) => canAccessExperience(item.experience.id, 'free')), 'Free recommendations must never expose family-only missions.');
assert(evaluateExperience(getExperienceById('room-rhythm')!, { profile, context, accessTier: 'free' }).includes('membership'), 'The trusted eligibility layer must reject a family-only mission for free access.');

const familyInterview = getExperienceById('family-interview')!;
assert(evaluateExperience(familyInterview, { profile, context: { ...context, companions: ['solo'] } }).includes('companion'), 'Guardian-only experiences must be excluded when the child is alone.');
assert(evaluateExperience({ ...familyInterview, review: { ...familyInterview.review, reviewed: false } }, { profile, context }).includes('not-published'), 'Unreviewed experiences must be excluded.');
assert(evaluateExperience(familyInterview, { profile: { ...profile, ageBand: '10-12' }, context }).length === 0, 'An eligible age band should pass.');
assert(evaluateExperience({ ...familyInterview, ageBands: ['10-12'] }, { profile, context }).includes('age-band'), 'Age-ineligible experiences must be excluded.');
assert(evaluateExperience(familyInterview, { profile: { ...profile, ageBand: '6-7' }, context: { ...context, companions: ['solo'] } }).includes('companion'), 'Every younger mission must reject a context without a grown-up.');

const paperBridge = getExperienceById('paper-bridge')!;
assert(
  evaluateExperience(paperBridge, { profile, context: { ...context, materialsAvailable: ['nothing-special'] } }).includes('materials'),
  'Experiences requiring unavailable materials must be excluded.',
);

const roseSignal = getExperienceById('rose-signal')!;
assert(roseSignal.review.checklistVersion === 'story-mission-safety-v1' && roseSignal.review.reviewed, 'Rose must pass the story-mission safety review before publication.');
assert(evaluateExperience(roseSignal, { profile, context: { ...context, materialsAvailable: ['nothing-special'] } }).includes('materials'), 'Rose must be excluded without a familiar approved plant.');
assert(evaluateExperience(roseSignal, { profile, context: { ...context, companions: ['solo'] } }).includes('companion'), 'Rose must be excluded without a trusted grown-up present.');
assert(evaluateExperience(roseSignal, { profile, context }).length === 0, 'Rose should pass only with a familiar plant, grown-up, allowed place, and eligible context.');

const roomRhythm = getExperienceById('room-rhythm')!;
assert(
  evaluateExperience(roomRhythm, { profile: { ...profile, supportNeeds: ['lower-sensory'] }, context }).includes('sensory-adaptation'),
  'Experiences without a requested sensory adaptation must be excluded.',
);

const shadowTracing = getExperienceById('shadow-tracing')!;
assert(evaluateExperience(shadowTracing, { profile, context: { ...context, weather: 'unknown' } }).includes('weather'), 'Weather-dependent outdoor experiences must be excluded when weather is unknown.');
assert(evaluateExperience(shadowTracing, { profile, context: { ...context, localHour: 22 } }).includes('time-of-day'), 'Daylight experiences must be excluded at night.');

const homeOnlyProfile = { ...profile, allowedContexts: ['home'] as const };
assert(evaluateExperience(shadowTracing, { profile: { ...homeOnlyProfile, allowedContexts: [...homeOnlyProfile.allowedContexts] }, context }).includes('guardian-boundary'), 'Guardian place boundaries must be hard exclusions.');

const selectedDomains = new Set(firstRun.recommendations.map((item) => item.experience.domainId));
assert(selectedDomains.size === firstRun.recommendations.length, 'Home recommendations should prefer domain variety when possible.');
assert(profile.interests.includes(firstRun.recommendations[0].experience.domainId), 'A selected interest should lead stable ranking when it is eligible.');

console.log('Experience Engine checks passed: 25 catalog story signals, 75 age variants, six reusable worlds, risk-based safety gating, sanitized evidence, stable ranking, and a three-result cap. Independent content review remains a release requirement.');

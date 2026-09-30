import type { MissionDefinition, MissionInteraction, MissionInteractionState } from '@/types/mission';
import type { LearningEvidence } from '@/types/constellation';

const selectedKey = (id: string) => `${id}.selected`;
const orderKey = (id: string) => `${id}.order`;
const valueKey = (id: string, optionId: string) => `${id}.${optionId}`;

export function createInteractionState(interaction: MissionInteraction): MissionInteractionState {
  switch (interaction.kind) {
    case 'arrangement':
      return { [orderKey(interaction.id)]: interaction.items.map((item) => item.id) };
    case 'counter':
      return Object.fromEntries(interaction.counters.map((counter) => [valueKey(interaction.id, counter.id), 0]));
    case 'marker-board':
      return Object.fromEntries(interaction.markers.map((marker) => [valueKey(interaction.id, marker.id), false]));
    case 'retell-cards':
      return Object.fromEntries(interaction.cards.map((card) => [valueKey(interaction.id, card.id), false]));
    case 'slot-input':
      return Object.fromEntries(interaction.slots.map((slot) => [valueKey(interaction.id, slot.id), '']));
    case 'safety-sequence':
      return Object.fromEntries(interaction.scenes.map((scene) => [valueKey(interaction.id, scene.id), '']));
    case 'choice-board':
    case 'comparison':
    case 'ordered-cards':
    case 'prompt-deck':
      return { [selectedKey(interaction.id)]: [], ...(interaction.kind === 'ordered-cards' ? { [orderKey(interaction.id)]: [] } : {}) };
  }
}

export function createMissionState(briefInteractions: MissionInteraction[], returnInteractions: MissionInteraction[] = []) {
  return {
    ...Object.assign({}, ...briefInteractions.map(createInteractionState)),
    ...Object.assign({}, ...returnInteractions.map(createInteractionState)),
    guardianConfirmed: false,
    guidanceIndex: 0,
  } satisfies MissionInteractionState;
}

export function getSelected(state: MissionInteractionState, interactionId: string) {
  const value = state[selectedKey(interactionId)];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function getOrder(state: MissionInteractionState, interactionId: string) {
  const value = state[orderKey(interactionId)];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function getValue(state: MissionInteractionState, interactionId: string, optionId: string) {
  return state[valueKey(interactionId, optionId)];
}

export function setSelected(state: MissionInteractionState, interactionId: string, selected: string[]) {
  return { ...state, [selectedKey(interactionId)]: selected };
}

export function setOrder(state: MissionInteractionState, interactionId: string, order: string[]) {
  return { ...state, [orderKey(interactionId)]: order };
}

export function setValue(
  state: MissionInteractionState,
  interactionId: string,
  optionId: string,
  value: string | number | boolean,
) {
  return { ...state, [valueKey(interactionId, optionId)]: value };
}

export function isInteractionReady(interaction: MissionInteraction, state: MissionInteractionState) {
  if (interaction.required === false) return true;
  switch (interaction.kind) {
    case 'choice-board': {
      const count = getSelected(state, interaction.id).length;
      return count >= interaction.minSelections && count <= interaction.maxSelections;
    }
    case 'comparison':
      return getSelected(state, interaction.id).length === 1;
    case 'ordered-cards': {
      const count = getOrder(state, interaction.id).length;
      return count >= interaction.minSelections && count <= interaction.maxSelections;
    }
    case 'prompt-deck':
      return getSelected(state, interaction.id).length === interaction.selectionCount;
    case 'slot-input':
      return interaction.slots.every((slot) => String(getValue(state, interaction.id, slot.id) ?? '').trim().length > 0);
    case 'safety-sequence':
      return interaction.scenes.every((scene) => {
        const selected = String(getValue(state, interaction.id, scene.id) ?? '');
        return scene.options.some((option) => option.id === selected && option.correct);
      });
    case 'arrangement':
      return getOrder(state, interaction.id).length === interaction.items.length;
    case 'retell-cards':
      return interaction.cards.every((card) => getValue(state, interaction.id, card.id) === true);
    case 'counter':
    case 'marker-board':
      return true;
  }
}

export function isMissionStartReady(definition: MissionDefinition, state: MissionInteractionState) {
  const checked = Array.isArray(state.preparationChecked)
    ? state.preparationChecked.filter((item): item is string => typeof item === 'string')
    : [];
  const preparationReady = definition.preparation.every((item) => checked.includes(item.id));
  const guardianReady = definition.startPolicy.kind === 'child' || state.guardianConfirmed === true;
  return definition.briefInteractions.every((interaction) => isInteractionReady(interaction, state)) && preparationReady && guardianReady;
}

function boundedCount(state: MissionInteractionState, key: string, maximum: number) {
  const value = state[key];
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= maximum ? value : null;
}

export function isMissionReturnReady(definition: MissionDefinition, state: MissionInteractionState) {
  if ((definition.returnInteractions ?? []).some((interaction) => !isInteractionReady(interaction, state))) return false;
  if (definition.experienceId !== 'paper-bridge' || !definition.returnInteractions?.some((item) => item.id === 'bridge-revision')) return true;
  if (state['bridge-first-confirmed'] !== true || boundedCount(state, 'bridge-result.option-1', 10) === null) return false;
  const revision = getSelected(state, 'bridge-revision')[0];
  if (revision === 'none') return true;
  return (revision === 'shape' || revision === 'supports') && state['bridge-second-confirmed'] === true
    && boundedCount(state, 'bridge-second-result.objects', 10) !== null;
}

export function getPrimaryInteraction(definition: MissionDefinition) {
  return definition.briefInteractions[0];
}

export function deriveLearningEvidence(definition: MissionDefinition, state: MissionInteractionState): LearningEvidence[] {
  if (!definition.narrative) return [];
  if (definition.experienceId === 'paper-bridge' && definition.returnInteractions?.some((item) => item.id === 'bridge-revision')) {
    if (!isMissionReturnReady(definition, state)) return [];
    const first = boundedCount(state, 'bridge-result.option-1', 10)!;
    const revision = getSelected(state, 'bridge-revision')[0];
    const second = boundedCount(state, 'bridge-second-result.objects', 10);
    return [
      { kind: 'prediction', statement: 'Predicted how a paper shape might carry a load.' },
      { kind: 'observation', statement: `Reported that the first bridge held ${first} lightweight ${first === 1 ? 'object' : 'objects'}.` },
      revision === 'none'
        ? { kind: 'explanation', statement: 'Compared the real test with the original idea.' }
        : { kind: 'strategy', statement: `Changed the ${revision === 'shape' ? 'paper shape' : 'support distance'} and reported ${second} lightweight ${second === 1 ? 'object' : 'objects'} in a second test.` },
    ];
  }
  const interactions = [...definition.briefInteractions, ...(definition.returnInteractions ?? [])];
  return definition.narrative.evidenceRules.flatMap((rule) => {
    if (!rule.interactionId) return [{ kind: rule.kind, statement: rule.statement }];
    const interaction = interactions.find((item) => item.id === rule.interactionId);
    if (!interaction || !isInteractionReady(interaction, state)) return [];
    return [{ kind: rule.kind, statement: rule.statement }];
  }).slice(0, 3);
}

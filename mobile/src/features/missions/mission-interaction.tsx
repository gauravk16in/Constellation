import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { EverydayStationSafetyArtwork } from '@/features/missions/mission-world-artwork';
import { MissionOptionArtwork } from '@/features/missions/mission-option-artwork';
import { RoseSafetyArtwork } from '@/features/missions/rose-signal-artwork';
import {
  getOrder,
  getSelected,
  getValue,
  setOrder,
  setSelected,
  setValue,
} from '@/features/missions/mission-state';
import { colors, fontFamilies, radius, spacing } from '@/theme';
import type { MissionInteraction, MissionInteractionState, MissionOption } from '@/types/mission';

const PALETTE: Record<string, string> = {
  red: '#D96C6C', orange: '#E59B52', yellow: '#E5C94D', green: '#6E9A69', blue: '#6192B4',
  purple: '#8B75A8', brown: '#8C6B54', black: '#2A2730',
};

type Props = {
  accent: string;
  interaction: MissionInteraction;
  onChange: (state: MissionInteractionState) => void;
  state: MissionInteractionState;
  wash: string;
};

function OptionButton({ option, selected, accent, onPress, palette, role = 'checkbox' }: { option: MissionOption; selected: boolean; accent: string; onPress: () => void; palette?: string; role?: 'checkbox' | 'radio' }) {
  return (
    <Pressable
      aria-checked={selected}
      accessibilityRole={role}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected && { backgroundColor: accent, borderColor: accent },
        palette && { borderColor: palette },
        pressed && styles.pressed,
      ]}
    >
      {option.visualId ? <MissionOptionArtwork accent={accent} id={option.visualId} selected={selected} /> : null}
      {palette ? <View style={[styles.paletteDot, { backgroundColor: palette }]} /> : null}
      <ThemedText selectable={false} style={[styles.optionText, selected && styles.optionTextSelected]} variant="caption">{option.label}</ThemedText>
    </Pressable>
  );
}

function ChoiceBoard({ interaction, state, onChange, accent }: Props & { interaction: Extract<MissionInteraction, { kind: 'choice-board' | 'comparison' | 'prompt-deck' }> }) {
  const selected = getSelected(state, interaction.id);
  const maximum = interaction.kind === 'choice-board' ? interaction.maxSelections : interaction.kind === 'prompt-deck' ? interaction.selectionCount : 1;
  const toggle = (optionId: string) => {
    const exists = selected.includes(optionId);
    const next = exists ? selected.filter((id) => id !== optionId) : selected.length < maximum ? [...selected, optionId] : maximum === 1 ? [optionId] : selected;
    onChange(setSelected(state, interaction.id, next));
  };
  return (
    <View style={styles.optionGrid}>
      {interaction.options.map((option) => (
        <OptionButton key={option.id} accent={accent} onPress={() => toggle(option.id)} option={option} palette={interaction.id === 'colour-palette' ? PALETTE[option.id] : undefined} role={maximum === 1 ? 'radio' : 'checkbox'} selected={selected.includes(option.id)} />
      ))}
    </View>
  );
}

function ReorderList({ interaction, state, onChange, accent }: Props & { interaction: Extract<MissionInteraction, { kind: 'ordered-cards' | 'arrangement' }> }) {
  const options = interaction.kind === 'ordered-cards' ? interaction.options : interaction.items;
  const currentOrder = getOrder(state, interaction.id);
  const maximum = interaction.kind === 'ordered-cards' ? interaction.maxSelections : options.length;
  const toggle = (optionId: string) => {
    if (interaction.kind === 'arrangement') return;
    const next = currentOrder.includes(optionId) ? currentOrder.filter((id) => id !== optionId) : currentOrder.length < maximum ? [...currentOrder, optionId] : currentOrder;
    onChange({ ...setOrder(state, interaction.id, next), [`${interaction.id}.selected`]: next });
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= currentOrder.length) return;
    const next = [...currentOrder];
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...setOrder(state, interaction.id, next), [`${interaction.id}.selected`]: next });
  };
  const optionById = new Map(options.map((option) => [option.id, option]));
  return (
    <View style={styles.reorderWrap}>
      {interaction.kind === 'ordered-cards' ? (
        <View style={styles.optionGrid}>{options.map((option) => <OptionButton key={option.id} accent={accent} onPress={() => toggle(option.id)} option={option} selected={currentOrder.includes(option.id)} />)}</View>
      ) : null}
      <View accessibilityLiveRegion="polite" style={styles.orderList}>
        {currentOrder.map((optionId, index) => {
          const option = optionById.get(optionId);
          if (!option) return null;
          return (
            <View key={optionId} style={styles.orderRow}>
              <View style={[styles.orderNumber, { backgroundColor: accent }]}><ThemedText selectable={false} style={styles.orderNumberText} variant="caption">{index + 1}</ThemedText></View>
              <ThemedText selectable={false} style={styles.orderLabel} variant="label">{option.label}</ThemedText>
              <View style={styles.orderActions}>
                <Pressable accessibilityLabel={`Move ${option.label} earlier`} accessibilityRole="button" disabled={index === 0} onPress={() => move(index, -1)} style={({ pressed }) => [styles.moveButton, index === 0 && styles.disabled, pressed && styles.pressed]}><ThemedText selectable={false} style={styles.moveText} variant="caption">Earlier</ThemedText></Pressable>
                <Pressable accessibilityLabel={`Move ${option.label} later`} accessibilityRole="button" disabled={index === currentOrder.length - 1} onPress={() => move(index, 1)} style={({ pressed }) => [styles.moveButton, index === currentOrder.length - 1 && styles.disabled, pressed && styles.pressed]}><ThemedText selectable={false} style={styles.moveText} variant="caption">Later</ThemedText></Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function MarkerBoard({ interaction, state, onChange, accent }: Props & { interaction: Extract<MissionInteraction, { kind: 'marker-board' }> }) {
  return <View style={styles.markerGrid}>{interaction.markers.map((marker, index) => {
    const found = getValue(state, interaction.id, marker.id) === true;
    return <Pressable key={marker.id} aria-checked={found} accessibilityRole="checkbox" accessibilityState={{ checked: found }} onPress={() => onChange(setValue(state, interaction.id, marker.id, !found))} style={({ pressed }) => [styles.marker, found && { backgroundColor: accent, borderColor: accent }, pressed && styles.pressed]}><View style={[styles.markerDot, found && styles.markerDotFound]} /><ThemedText selectable={false} style={[styles.markerText, found && styles.optionTextSelected]} variant="caption">{index + 1}. {marker.label}</ThemedText></Pressable>;
  })}</View>;
}

function CounterBoard({ interaction, state, onChange, accent }: Props & { interaction: Extract<MissionInteraction, { kind: 'counter' }> }) {
  return <View style={styles.counterGrid}>{interaction.counters.map((counter) => {
    const value = Number(getValue(state, interaction.id, counter.id) ?? 0);
    return <View key={counter.id} style={styles.counter}><ThemedText style={styles.counterLabel} variant="label">{counter.label}</ThemedText><View style={styles.counterControls}><Pressable accessibilityLabel={`Decrease ${counter.label}`} accessibilityRole="button" disabled={value === 0} onPress={() => onChange(setValue(state, interaction.id, counter.id, Math.max(0, value - 1)))} style={({ pressed }) => [styles.counterButton, value === 0 && styles.disabled, pressed && styles.pressed]}><ThemedText selectable={false} style={styles.counterButtonText} variant="title">−</ThemedText></Pressable><ThemedText accessibilityLiveRegion="polite" style={[styles.counterValue, { color: accent }]} variant="title">{value}</ThemedText><Pressable accessibilityLabel={`Increase ${counter.label}`} accessibilityRole="button" disabled={value >= interaction.maximum} onPress={() => onChange(setValue(state, interaction.id, counter.id, Math.min(interaction.maximum, value + 1)))} style={({ pressed }) => [styles.counterButton, value >= interaction.maximum && styles.disabled, pressed && styles.pressed]}><ThemedText selectable={false} style={styles.counterButtonText} variant="title">+</ThemedText></Pressable></View></View>;
  })}</View>;
}

function SlotInputs({ interaction, state, onChange, accent }: Props & { interaction: Extract<MissionInteraction, { kind: 'slot-input' }> }) {
  return <View style={styles.inputList}>{interaction.slots.map((slot, index) => <View key={slot.id} style={styles.inputGroup}><ThemedText nativeID={`${interaction.id}-${slot.id}-label`} style={styles.inputLabel} variant="label">{index + 1}. {slot.label}</ThemedText><TextInput accessibilityLabel={slot.label} autoComplete="off" maxLength={interaction.maxLength} onChangeText={(value) => onChange(setValue(state, interaction.id, slot.id, value))} placeholder="Type a short answer…" placeholderTextColor={colors.onboardingInkMuted} style={[styles.input, { borderColor: accent }]} value={String(getValue(state, interaction.id, slot.id) ?? '')} /></View>)}</View>;
}

function SafetySequence({ interaction, state, onChange, accent }: Props & { interaction: Extract<MissionInteraction, { kind: 'safety-sequence' }> }) {
  return (
    <View style={styles.safetySequence}>
      {interaction.artworkId === 'rose-prickle-map' ? <RoseSafetyArtwork /> : null}
      {interaction.artworkId === 'everyday-station-safety' ? <EverydayStationSafetyArtwork accent={accent} /> : null}
      {interaction.scenes.map((scene, sceneIndex) => {
        const selectedId = String(getValue(state, interaction.id, scene.id) ?? '');
        const selectedOption = scene.options.find((option) => option.id === selectedId);
        return (
          <View key={scene.id} style={styles.safetyScene}>
            <ThemedText style={[styles.safetyStep, { color: accent }]} variant="caption">CHECK {sceneIndex + 1} OF {interaction.scenes.length}</ThemedText>
            <ThemedText accessibilityRole="header" style={styles.safetyPrompt} variant="title">{scene.prompt}</ThemedText>
            <View accessibilityRole="radiogroup" style={styles.safetyOptions}>
              {scene.options.map((option) => {
                const selected = option.id === selectedId;
                return (
                  <Pressable
                    key={option.id}
                    aria-checked={selected}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() => onChange(setValue(state, interaction.id, scene.id, option.id))}
                    style={({ pressed }) => [
                      styles.safetyOption,
                      selected && option.correct && { backgroundColor: accent, borderColor: accent },
                      selected && !option.correct && styles.safetyOptionRetry,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[
                      styles.safetyChoiceMark,
                      selected && option.correct && styles.safetyChoiceMarkCorrect,
                      selected && !option.correct && styles.safetyChoiceMarkRetry,
                    ]}>
                      {selected ? <ThemedText selectable={false} style={[styles.safetyChoiceSymbol, option.correct && styles.optionTextSelected]} variant="caption">{option.correct ? '✓' : '↺'}</ThemedText> : null}
                    </View>
                    <ThemedText selectable={false} style={[styles.safetyOptionLabel, selected && option.correct && styles.optionTextSelected]} variant="label">{option.label}</ThemedText>
                  </Pressable>
                );
              })}
            </View>
            {selectedOption ? (
              <View accessibilityLiveRegion="polite" style={[styles.safetyFeedback, selectedOption.correct ? styles.safetyFeedbackCorrect : styles.safetyFeedbackRetry]}>
                <ThemedText style={styles.safetyFeedbackText} variant="body">{selectedOption.feedback}</ThemedText>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function RetellCards({ interaction, state, onChange, accent }: Props & { interaction: Extract<MissionInteraction, { kind: 'retell-cards' }> }) {
  return (
    <View style={styles.retellList}>
      {interaction.cards.map((card, index) => {
        const complete = getValue(state, interaction.id, card.id) === true;
        return (
          <Pressable
            key={card.id}
            aria-checked={complete}
            accessibilityHint="Say this part aloud, then mark the card complete"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: complete }}
            onPress={() => onChange(setValue(state, interaction.id, card.id, !complete))}
            style={({ pressed }) => [styles.retellCard, complete && { borderColor: accent }, pressed && styles.pressed]}
          >
            <View style={[styles.retellNumber, complete && { backgroundColor: accent }]}>
              <ThemedText selectable={false} style={[styles.retellNumberText, complete && styles.optionTextSelected]} variant="caption">{complete ? '✓' : index + 1}</ThemedText>
            </View>
            <ThemedText selectable={false} style={styles.retellText} variant="label">{card.label}</ThemedText>
          </Pressable>
        );
      })}
      <ThemedText style={styles.retellPrivacy} variant="caption">Your voice and story words are never recorded.</ThemedText>
    </View>
  );
}

export function MissionInteractionView(props: Props) {
  const { interaction, wash } = props;
  return (
    <View style={[styles.surface, { backgroundColor: wash }]}>
      <View style={styles.heading}><ThemedText accessibilityRole="header" style={styles.title} variant="title">{interaction.title}</ThemedText><ThemedText style={styles.instruction} variant="body">{interaction.instruction}</ThemedText></View>
      {interaction.kind === 'choice-board' || interaction.kind === 'comparison' || interaction.kind === 'prompt-deck' ? <ChoiceBoard {...props} interaction={interaction} /> : null}
      {interaction.kind === 'ordered-cards' || interaction.kind === 'arrangement' ? <ReorderList {...props} interaction={interaction} /> : null}
      {interaction.kind === 'marker-board' ? <MarkerBoard {...props} interaction={interaction} /> : null}
      {interaction.kind === 'counter' ? <CounterBoard {...props} interaction={interaction} /> : null}
      {interaction.kind === 'slot-input' ? <SlotInputs {...props} interaction={interaction} /> : null}
      {interaction.kind === 'safety-sequence' ? <SafetySequence {...props} interaction={interaction} /> : null}
      {interaction.kind === 'retell-cards' ? <RetellCards {...props} interaction={interaction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: { borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.four, padding: spacing.four },
  heading: { gap: spacing.two },
  title: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 22, lineHeight: 27 },
  instruction: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 15, lineHeight: 22 },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.two },
  option: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.small, borderWidth: 1.5, flexDirection: 'row', flexGrow: 1, gap: spacing.two, minHeight: 56, minWidth: 132, paddingHorizontal: spacing.three, paddingVertical: spacing.two },
  optionText: { color: colors.onboardingInk, fontFamily: fontFamilies.semibold, fontSize: 13, lineHeight: 18 },
  optionTextSelected: { color: colors.onboardingSurface },
  paletteDot: { borderColor: 'rgba(33,29,39,0.18)', borderRadius: radius.pill, borderWidth: 1, height: 18, width: 18 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.35 },
  reorderWrap: { gap: spacing.four },
  orderList: { gap: spacing.two },
  orderRow: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderCurve: 'continuous', borderRadius: radius.small, flexDirection: 'row', gap: spacing.two, minHeight: 64, padding: spacing.two },
  orderNumber: { alignItems: 'center', borderRadius: radius.pill, height: 32, justifyContent: 'center', width: 32 },
  orderNumberText: { color: colors.onboardingSurface, fontFamily: fontFamilies.bold },
  orderLabel: { color: colors.onboardingInk, flex: 1, fontFamily: fontFamilies.bold, fontSize: 14 },
  orderActions: { gap: spacing.one },
  moveButton: { alignItems: 'center', borderColor: colors.onboardingLine, borderRadius: radius.small, borderWidth: 1, justifyContent: 'center', minHeight: 44, paddingHorizontal: spacing.two },
  moveText: { color: colors.onboardingInk, fontFamily: fontFamilies.semibold, fontSize: 10 },
  markerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.two },
  marker: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.small, borderWidth: 1.5, flexBasis: '47%', flexDirection: 'row', flexGrow: 1, gap: spacing.two, minHeight: 56, padding: spacing.three },
  markerDot: { backgroundColor: colors.onboardingCanvas, borderColor: colors.onboardingInkMuted, borderRadius: radius.pill, borderWidth: 1.5, height: 14, width: 14 },
  markerDotFound: { backgroundColor: colors.starlight, borderColor: colors.starlight },
  markerText: { color: colors.onboardingInk, flex: 1, fontFamily: fontFamilies.semibold, fontSize: 12 },
  counterGrid: { gap: spacing.three },
  counter: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderCurve: 'continuous', borderRadius: radius.medium, gap: spacing.three, padding: spacing.four },
  counterLabel: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  counterControls: { alignItems: 'center', flexDirection: 'row', gap: spacing.four },
  counterButton: { alignItems: 'center', backgroundColor: colors.onboardingCanvas, borderColor: colors.onboardingLine, borderRadius: radius.pill, borderWidth: 1, height: 48, justifyContent: 'center', width: 48 },
  counterButtonText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 24 },
  counterValue: { fontFamily: fontFamilies.bold, fontSize: 32, fontVariant: ['tabular-nums'], minWidth: 52, textAlign: 'center' },
  inputList: { gap: spacing.three },
  inputGroup: { gap: spacing.two },
  inputLabel: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 14 },
  input: { backgroundColor: colors.onboardingSurface, borderCurve: 'continuous', borderRadius: radius.small, borderWidth: 1.5, color: colors.onboardingInk, fontFamily: fontFamilies.semibold, fontSize: 16, minHeight: 52, paddingHorizontal: spacing.four, paddingVertical: spacing.three },
  safetySequence: { gap: spacing.six },
  safetyScene: { borderTopColor: colors.onboardingLine, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.three, paddingTop: spacing.four },
  safetyStep: { color: colors.domainNatureInk, fontFamily: fontFamilies.bold, fontSize: 10, letterSpacing: 1.1 },
  safetyPrompt: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 19, lineHeight: 25 },
  safetyOptions: { gap: spacing.two },
  safetyOption: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.small, borderWidth: 1.5, flexDirection: 'row', gap: spacing.three, minHeight: 56, paddingHorizontal: spacing.three, paddingVertical: spacing.three },
  safetyOptionRetry: { backgroundColor: '#FCE8E6', borderColor: colors.danger },
  safetyChoiceMark: { alignItems: 'center', borderColor: colors.onboardingInkMuted, borderRadius: radius.pill, borderWidth: 1.5, height: 28, justifyContent: 'center', width: 28 },
  safetyChoiceMarkCorrect: { backgroundColor: colors.domainNatureInk, borderColor: colors.onboardingSurface },
  safetyChoiceMarkRetry: { borderColor: colors.danger },
  safetyChoiceSymbol: { color: colors.danger, fontFamily: fontFamilies.bold, fontSize: 15 },
  safetyOptionLabel: { color: colors.onboardingInk, flex: 1, fontFamily: fontFamilies.bold, fontSize: 14, lineHeight: 20 },
  safetyFeedback: { borderCurve: 'continuous', borderRadius: radius.small, padding: spacing.three },
  safetyFeedbackCorrect: { backgroundColor: colors.domainNature },
  safetyFeedbackRetry: { backgroundColor: '#FCE8E6' },
  safetyFeedbackText: { color: colors.onboardingInk, fontFamily: fontFamilies.semibold, fontSize: 14, lineHeight: 21 },
  retellList: { gap: spacing.two },
  retellCard: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.small, borderWidth: 1.5, flexDirection: 'row', gap: spacing.three, minHeight: 64, padding: spacing.three },
  retellNumber: { alignItems: 'center', backgroundColor: colors.onboardingCanvas, borderColor: colors.onboardingLine, borderRadius: radius.pill, borderWidth: 1, height: 36, justifyContent: 'center', width: 36 },
  retellNumberText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  retellText: { color: colors.onboardingInk, flex: 1, fontFamily: fontFamilies.bold, fontSize: 14, lineHeight: 20 },
  retellPrivacy: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.semibold, paddingTop: spacing.one },
});

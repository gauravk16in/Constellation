import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { DomainGlyph } from '@/components/domain-glyph';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { getCuriosityArea } from '@/data/catalog/curiosity-areas';
import { getExperienceAgePolicy, getExperienceById } from '@/data/catalog/experience-catalog';
import { getMissionDefinition } from '@/data/catalog/mission-registry';
import { useAppData } from '@/features/app/app-data-provider';
import { MissionInteractionView } from '@/features/missions/mission-interaction';
import { MissionOptionArtwork } from '@/features/missions/mission-option-artwork';
import { MissionWorldArtwork } from '@/features/missions/mission-world-artwork';
import { createMissionState, getOrder, getPrimaryInteraction, getSelected, isInteractionReady, isMissionReturnReady, isMissionStartReady } from '@/features/missions/mission-state';
import { MissionVoice } from '@/features/voice/mission-voice';
import { useExperienceSession } from '@/features/session/experience-session-provider';
import { ShadowTransfer } from '@/features/planet/shadow-transfer';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import { canAccessExperience } from '@/features/entitlements/access-policy';
import { colors, fontFamilies, motion, radius, spacing } from '@/theme';
import type { CompanionId, MaterialGroupId, SettingId } from '@/types/constellation';
import type { ExperienceSession, MissionInteractionState, MissionReflection } from '@/types/mission';

const COMPANION_COPY: Record<CompanionId, string> = {
  solo: 'By myself', guardian: 'With a grown-up', sibling: 'With a sibling', friend: 'With a friend',
};
const MATERIAL_COPY: Record<MaterialGroupId, string> = {
  'nothing-special': 'Nothing special', 'paper-drawing': 'Paper or drawing tools',
  'basic-household': 'Basic household things', 'outdoor-found': 'Fallen nature finds',
  'familiar-plant': 'A familiar plant',
};
const SETTING_COPY: Record<SettingId, string> = { indoors: 'Indoors', outdoors: 'Outdoors', either: 'Indoors or outdoors' };
const REFLECTIONS: { id: MissionReflection; label: string }[] = [
  { id: 'learned', label: 'I noticed something new' },
  { id: 'again', label: 'I’d try this again' },
  { id: 'challenging', label: 'It was tricky' },
  { id: 'not-for-me', label: 'Not for me today' },
];

function InlineAction({ label, onPress, danger = false, disabled = false }: { label: string; onPress: () => void; danger?: boolean; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.inlineAction, disabled && styles.disabled, pressed && styles.pressed]}>
      <ThemedText selectable={false} style={[styles.inlineActionText, danger && styles.dangerText]} variant="label">{label}</ThemedText>
    </Pressable>
  );
}

function ReadyRow({ checked, label, onPress, signalColor = colors.starlight }: { checked: boolean; label: string; onPress: () => void; signalColor?: string }) {
  return (
    <Pressable aria-checked={checked} accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={onPress} style={({ pressed }) => [styles.readyRow, pressed && styles.pressed]}>
      <View style={[styles.check, checked && styles.checkSelected]}>{checked ? <View style={[styles.checkDot, { backgroundColor: signalColor }]} /> : null}</View>
      <ThemedText selectable={false} style={styles.readyLabel} variant="body">{label}</ThemedText>
    </Pressable>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <View style={styles.fact}><ThemedText style={styles.factLabel} variant="caption">{label}</ThemedText><ThemedText style={styles.factValue} variant="label">{value}</ThemedText></View>;
}

function StarMoment() {
  return (
    <View accessibilityLabel="A new gold star has been lit in your Constellation" accessibilityRole="image" style={styles.starMoment}>
      <Svg height="190" viewBox="0 0 190 190" width="190">
        {[0, 45, 90, 135].map((angle) => <Line key={angle} x1="95" y1="18" x2="95" y2="42" stroke={colors.starlight} strokeLinecap="round" strokeOpacity="0.7" strokeWidth="3" transform={`rotate(${angle} 95 95)`} />)}
        <Circle cx="95" cy="95" fill="none" r="59" stroke={colors.starlight} strokeDasharray="3 10" strokeLinecap="round" strokeOpacity="0.35" strokeWidth="2" />
        <Path d="M95 48l12.7 28.1 30.6 3.3-22.7 20.8 6.2 30.2L95 115.1l-26.8 15.3 6.2-30.2-22.7-20.8 30.6-3.3L95 48z" fill={colors.starlight} stroke={colors.onStarlight} strokeLinejoin="round" strokeWidth="2.5" />
      </Svg>
    </View>
  );
}

function formatTimer(startedAt: string, durationMinutes: number, now: number) {
  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  const remaining = Math.max(0, durationMinutes * 60 - elapsedSeconds);
  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');
  return { finished: remaining === 0, label: `${minutes}:${seconds}` };
}

function ActiveMission({
  session,
  definition,
  state,
  accent,
  wash,
  onStateChange,
  onSave,
  onReturn,
  onFinishLater,
  onStop,
  confirmStop,
}: {
  session: ExperienceSession;
  definition: NonNullable<ReturnType<typeof getMissionDefinition>>;
  state: MissionInteractionState;
  accent: string;
  wash: string;
  onStateChange: (state: MissionInteractionState) => void;
  onSave: (next: Partial<Pick<ExperienceSession, 'phase' | 'interactionState' | 'timerStartedAt'>>) => Promise<unknown>;
  onReturn: () => void;
  onFinishLater: () => void;
  onStop: () => void;
  confirmStop: boolean;
}) {
  const [now, setNow] = useState(() => session.timerStartedAt ? new Date(session.timerStartedAt).getTime() : 0);
  const guidanceVisible = state.guidanceVisible === true;
  useEffect(() => {
    if (!session.timerStartedAt) return;
    const timeout = setTimeout(() => setNow(Date.now()), 0);
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [session.timerStartedAt]);
  const timer = session.timerStartedAt && definition.timerMinutes ? formatTimer(session.timerStartedAt, definition.timerMinutes, now) : null;
  const primaryInteraction = getPrimaryInteraction(definition);
  const showInteractiveCounter = definition.activeGuidance === 'optional-counter' && (primaryInteraction.kind === 'counter' || primaryInteraction.kind === 'marker-board');
  const selectedPrompts = definition.activeGuidance === 'prompt-deck' && 'options' in primaryInteraction
    ? primaryInteraction.options.filter((option) => getSelected(state, primaryInteraction.id).includes(option.id))
    : [];
  const guidanceItems = selectedPrompts.length > 0 ? selectedPrompts.map((option) => option.label) : definition.steps;
  const guidanceIndex = Math.min(guidanceItems.length - 1, Number(state.guidanceIndex ?? 0));
  const planOptions = definition.briefInteractions.flatMap((interaction) => {
    if (!('options' in interaction)) return [];
    const selectedIds = interaction.kind === 'ordered-cards' ? getOrder(state, interaction.id) : getSelected(state, interaction.id);
    return selectedIds.map((id) => interaction.options.find((option) => option.id === id)).filter((option) => option?.visualId);
  });

  const changeState = async (next: MissionInteractionState) => {
    onStateChange(next);
    await onSave({ interactionState: next });
  };

  return (
    <View style={styles.phaseStack}>
      <View style={styles.launchSurface}>
        <View style={styles.launchOrbit}><View style={[styles.launchStar, definition.narrative && styles.launchStarUnlit]} /></View>
        <ThemedText style={[styles.launchEyebrow, definition.narrative && styles.launchEyebrowUnlit]} variant="caption">OUT IN THE REAL WORLD</ThemedText>
        <ThemedText accessibilityRole="header" style={styles.launchCue} variant="display">{definition.memoryCue}</ThemedText>
        <ThemedText style={styles.launchBody} variant="body">{definition.narrative?.realWorldObjective ?? 'The phone can wait here. Come back when you have tried it.'}</ThemedText>
        {definition.narrative ? <ThemedText style={styles.launchAside} variant="caption">The phone can wait here. Come back when you have tried it.</ThemedText> : null}
        {planOptions.length > 0 ? (
          <View accessibilityLabel="The choices you made for this mission" style={styles.memoryPlan}>
            {planOptions.map((option, index) => option?.visualId ? (
              <View key={`${option.id}-${index}`} style={styles.memoryPlanItem}>
                <MissionOptionArtwork accent={accent} id={option.visualId} selected={false} />
                <ThemedText style={styles.memoryPlanLabel} variant="caption">{option.label}</ThemedText>
              </View>
            ) : null)}
          </View>
        ) : null}
      </View>

      {definition.timerMinutes ? (
        <View style={styles.timerLine}>
          <View style={styles.timerCopy}>
            <ThemedText style={styles.timerTitle} variant="label">Gentle timer</ThemedText>
            {timer ? <ThemedText accessibilityLiveRegion="polite" style={styles.timerValue} variant="title">{timer.label}</ThemedText> : <ThemedText style={styles.timerHint} variant="caption">Optional · {definition.timerMinutes} minutes</ThemedText>}
            {timer?.finished ? <ThemedText style={styles.timerFinished} variant="caption">The timer finished. Take the time you need.</ThemedText> : null}
          </View>
          <InlineAction label={session.timerStartedAt ? 'Clear timer' : 'Start timer'} onPress={() => void onSave({ timerStartedAt: session.timerStartedAt ? undefined : new Date().toISOString() })} />
        </View>
      ) : null}

      {showInteractiveCounter ? <MissionInteractionView accent={accent} interaction={primaryInteraction} onChange={(next) => void changeState(next)} state={state} wash={wash} /> : null}

      {definition.activeGuidance !== 'memory-cue' && !showInteractiveCounter ? (
        <View style={styles.guidanceSection}>
          {!guidanceVisible ? <InlineAction label="Show optional guidance" onPress={() => void changeState({ ...state, guidanceVisible: true })} /> : (
            <View style={styles.stepSurface}>
              <View style={styles.stepTop}><ThemedText style={styles.stepCount} variant="caption">STEP {guidanceIndex + 1} OF {guidanceItems.length}</ThemedText><InlineAction label="Hide" onPress={() => void changeState({ ...state, guidanceVisible: false })} /></View>
              <ThemedText style={styles.stepText} variant="title">{guidanceItems[guidanceIndex]}</ThemedText>
              <View style={styles.stepActions}><InlineAction disabled={guidanceIndex === 0} label="Previous" onPress={() => void changeState({ ...state, guidanceIndex: Math.max(0, guidanceIndex - 1) })} /><InlineAction disabled={guidanceIndex >= guidanceItems.length - 1} label="Next step" onPress={() => void changeState({ ...state, guidanceIndex: Math.min(guidanceItems.length - 1, guidanceIndex + 1) })} /></View>
            </View>
          )}
        </View>
      ) : null}

      <View style={styles.primaryActions}>
        <ActionButton label="I did it" onPress={onReturn} variant="ink" />
        <InlineAction label="Finish later" onPress={onFinishLater} />
        <InlineAction danger label="Stop this mission" onPress={onStop} />
        {confirmStop ? <ThemedText accessibilityLiveRegion="polite" style={styles.launchStopConfirm} variant="caption">Tap “Stop this mission” again to end it. No score or progress is lost.</ThemedText> : null}
      </View>
    </View>
  );
}

export function ExperienceMissionScreen() {
  const { experienceId } = useLocalSearchParams<{ experienceId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { context, bridgeHandoff } = useExperienceSession();
  const { accessTier } = useEntitlements();
  const {
    activeSession, completeMission, outcomes, profile, replaceActiveMission, saveMission, skipMission, startMission,
  } = useAppData();
  const experience = getExperienceById(experienceId);
  const definition = getMissionDefinition(
    experienceId,
    profile?.ageBand ?? '8-9',
    activeSession?.experienceId === experienceId ? activeSession.catalogVersion : experience?.version,
  );
  const area = experience ? getCuriosityArea(experience.domainId) : undefined;
  const initialState = useMemo(() => definition ? createMissionState(definition.briefInteractions, definition.returnInteractions) : {}, [definition]);
  const [draftState, setDraftState] = useState<MissionInteractionState>(() => experienceId === 'paper-bridge' && (experience?.version ?? 0) >= 3 && bridgeHandoff
    ? { ...initialState, 'bridge-fold.selected': [bridgeHandoff] } : initialState);
  const [localPhase, setLocalPhase] = useState<'story' | 'brief' | 'ready'>(() => definition?.narrative ? 'story' : 'brief');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showConflict, setShowConflict] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);
  const [completedNow, setCompletedNow] = useState(false);
  const canOpen = !experience || canAccessExperience(experience.id, accessTier) || activeSession?.experienceId === experience.id;

  useEffect(() => {
    if (!canOpen) router.replace('/home');
  }, [canOpen, router]);

  if (!experience || !definition || !area) {
    return <View style={styles.invalid}><Stack.Title>Experience</Stack.Title><ThemedText variant="title">This reviewed mission could not be found.</ThemedText><ActionButton label="Back to ideas" onPress={() => router.back()} variant="ink" /></View>;
  }

  if (!canOpen) return <View style={styles.invalid}><ThemedText variant="body">Returning to today’s ideas…</ThemedText></View>;

  const ownSession = activeSession?.experienceId === experience.id ? activeSession : null;
  const agePolicy = getExperienceAgePolicy(experience, profile?.ageBand ?? '8-9');
  const workingState = ownSession?.interactionState ?? draftState;
  const completedBefore = outcomes.some((outcome) => outcome.experienceId === experience.id && outcome.state === 'completed');
  const checked = Array.isArray(workingState.preparationChecked) ? workingState.preparationChecked.filter((item): item is string => typeof item === 'string') : [];
  const allReady = definition.preparation.every((item) => checked.includes(item.id));
  const guardianReady = definition.startPolicy.kind === 'child' || workingState.guardianConfirmed === true;
  const briefReady = definition.briefInteractions.every((interaction) => isInteractionReady(interaction, workingState));
  const bridgeThinkingLoop = experienceId === 'paper-bridge' && (ownSession?.catalogVersion ?? experience.version) >= 4;
  const revision = getSelected(workingState, 'bridge-revision')[0];
  const voiceText = completedNow ? `${definition.narrative.resolvedWorld.heading} ${definition.narrative.resolvedWorld.body}`
    : ownSession?.phase === 'active' ? `${definition.memoryCue} ${definition.narrative.realWorldObjective}`
    : ownSession?.phase === 'return' ? 'What happened out there? Tell us what your real test showed. A surprising result is useful too.'
    : localPhase === 'ready' ? `Check your place, people, and materials. ${experience.safetyNote}`
    : localPhase === 'story' ? `${definition.narrative.hook.heading} ${definition.narrative.hook.body}`
    : `${experience.title}. ${definition.successCue}`;

  const updateDraft = (next: MissionInteractionState) => {
    setError(null);
    setDraftState(next);
  };

  const toggleReady = (id: string) => {
    const next = checked.includes(id) ? checked.filter((item) => item !== id) : [...checked, id];
    updateDraft({ ...workingState, preparationChecked: next });
  };

  const begin = async (replace = false) => {
    setError(null);
    if (!briefReady) {
      setError('Finish the mission choice above before getting started.');
      setLocalPhase('brief');
      return;
    }
    if (!allReady) {
      setError('Check each ready item before you begin.');
      return;
    }
    if (!guardianReady) {
      setError('A grown-up needs to confirm the safety handoff first.');
      return;
    }
    if (!isMissionStartReady(definition, workingState)) {
      setError('The safety clues and ready check must be complete before this mission begins.');
      return;
    }
    if (activeSession && !ownSession && !replace) {
      setShowConflict(true);
      return;
    }
    setBusy(true);
    try {
      if (replace) await replaceActiveMission(experience.id, context, workingState);
      else await startMission(experience.id, context, workingState);
      setShowConflict(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'This mission could not start. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const changeSessionState = (next: MissionInteractionState) => {
    setError(null);
    const changed = { ...next };
    if (changed['bridge-result.option-1'] !== workingState['bridge-result.option-1']) changed['bridge-first-confirmed'] = false;
    if (changed['bridge-second-result.objects'] !== workingState['bridge-second-result.objects'] ||
      changed['bridge-revision.selected'] !== workingState['bridge-revision.selected']) changed['bridge-second-confirmed'] = false;
    void saveMission({ interactionState: changed }).catch((caught) => setError(caught instanceof Error ? caught.message : 'Your mission could not be saved.'));
  };

  const moveToReturn = async () => {
    try { await saveMission({ phase: 'return' }); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Your mission could not be saved.'); }
  };

  const finishLater = async () => {
    try { await saveMission({ phase: 'paused' }); router.replace('/home'); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Your mission could not be saved.'); }
  };

  const complete = async (reflection?: MissionReflection) => {
    if (!isMissionReturnReady(definition, workingState)) {
      setError('Finish the short result above before lighting this star.');
      setShowReflection(false);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await completeMission(reflection);
      setCompletedNow(true);
      setShowReflection(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Your star could not be saved. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const stop = async () => {
    if (!confirmStop) { setConfirmStop(true); return; }
    setBusy(true);
    try { await skipMission(); router.replace('/home'); } catch (caught) { setError(caught instanceof Error ? caught.message : 'The mission could not be stopped.'); } finally { setBusy(false); }
  };

  const renderContent = () => {
    if (completedNow) return (
      <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(720)} style={styles.completed}>
        {definition.narrative ? <MissionWorldArtwork accent={area.accent} artworkId={definition.narrative.artworkId} resolved sceneId={definition.narrative.artworkSceneId} signalId={definition.narrative.signalId} wash={area.wash} /> : <StarMoment />}
        <ThemedText accessibilityRole="header" style={styles.completedTitle} variant="display">{definition.narrative?.resolvedWorld.heading ?? 'You lit a new star.'}</ThemedText>
        <ThemedText style={styles.completedBody} variant="body">{definition.narrative?.resolvedWorld.body ?? `${experience.title} is now part of your ${area.title.toLowerCase()} branch.`}</ThemedText>
        <View style={styles.completedActions}><ActionButton label="See my Constellation" onPress={() => router.replace('/constellation')} variant="ink" /><InlineAction label={`Back to ${area.title}`} onPress={() => router.replace(`/curiosity/${area.id}`)} /></View>
      </Animated.View>
    );

    if (ownSession?.phase === 'paused') return (
      <View style={styles.phaseStack}>
        <View style={[styles.hero, { backgroundColor: area.wash }]}><DomainGlyph accent={area.accent} id={area.id} size={68} wash={colors.onboardingSurface} /><ThemedText style={styles.eyebrow} variant="caption">SAVED FOR LATER</ThemedText><ThemedText accessibilityRole="header" style={styles.heading} variant="display">Ready when you are.</ThemedText><ThemedText style={styles.body} variant="body">Your choices are safe on this device. Nothing is late and no streak is waiting.</ThemedText></View>
        <ActionButton label="Return to the real world" onPress={() => void saveMission({ phase: 'active' })} variant="ink" />
        <InlineAction label="Stop this mission" onPress={() => void stop()} danger />
        {confirmStop ? <ThemedText accessibilityLiveRegion="polite" style={styles.confirmText} variant="caption">Tap “Stop this mission” again to end it. No score or progress is lost.</ThemedText> : null}
      </View>
    );

    if (ownSession?.phase === 'active') return <ActiveMission accent={area.accent} confirmStop={confirmStop} definition={definition} onFinishLater={() => void finishLater()} onReturn={() => void moveToReturn()} onSave={saveMission} onStateChange={setDraftState} onStop={() => void stop()} session={ownSession} state={workingState} wash={area.wash} />;

    if (ownSession?.phase === 'return') return (
      <View style={styles.phaseStack}>
        <View style={styles.returnIntro}><ThemedText style={[styles.eyebrow, { color: area.accent }]} variant="caption">WELCOME BACK</ThemedText><ThemedText accessibilityRole="header" style={styles.heading} variant="display">What happened out there?</ThemedText><ThemedText style={styles.body} variant="body">Your answer belongs to you. Constellation only needs a small signal to remember this experience.</ThemedText></View>
        {!showKnowledge && !showReflection ? definition.returnInteractions?.map((interaction) => {
          if (bridgeThinkingLoop && interaction.id === 'bridge-second-result' && revision !== 'shape' && revision !== 'supports') return null;
          return <View key={interaction.id} style={{ gap: spacing.two }}>
            <MissionInteractionView accent={area.accent} interaction={interaction} onChange={changeSessionState} state={workingState} wash={area.wash} />
            {bridgeThinkingLoop && interaction.id === 'bridge-result' ? <InlineAction
              label={workingState['bridge-first-confirmed'] === true ? 'First test recorded' : 'Record this first test'}
              onPress={() => changeSessionState({ ...workingState, 'bridge-first-confirmed': true })} /> : null}
            {bridgeThinkingLoop && interaction.id === 'bridge-second-result' ? <InlineAction
              label={workingState['bridge-second-confirmed'] === true ? 'Second test recorded' : 'Record this second test'}
              onPress={() => changeSessionState({ ...workingState, 'bridge-second-confirmed': true })} /> : null}
          </View>;
        }) : null}
        {showKnowledge && definition.narrative ? (
          <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.knowledgeReveal}>
            <View style={styles.knowledgeSignal}><View style={[styles.knowledgeSignalLine, { backgroundColor: area.accent }]} /><View style={[styles.knowledgeSignalDot, { backgroundColor: area.accent }]} /></View>
            <ThemedText accessibilityRole="header" style={styles.reflectionTitle} variant="title">{definition.narrative.knowledgeReveal.heading}</ThemedText>
            <ThemedText style={styles.body} variant="body">{definition.narrative.knowledgeReveal.body}</ThemedText>
            <ActionButton label="Choose a reflection" onPress={() => { setShowKnowledge(false); setShowReflection(true); }} variant="ink" />
          </Animated.View>
        ) : !showReflection ? (
          <View style={styles.returnActions}><ActionButton label="I did it" onPress={() => {
            if (!isMissionReturnReady(definition, workingState)) setError('Record your first result and choose whether you tried a second design.');
            else { setError(null); if (definition.narrative) setShowKnowledge(true); else setShowReflection(true); }
          }} variant="ink" /><InlineAction label="Finish later" onPress={() => void finishLater()} /><InlineAction label="Stop this mission" onPress={() => void stop()} danger />{confirmStop ? <ThemedText accessibilityLiveRegion="polite" style={styles.confirmText} variant="caption">Tap “Stop this mission” again to end it. No score or progress is lost.</ThemedText> : null}</View>
        ) : (
          <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={[styles.reflection, { backgroundColor: area.wash }]}>
            <ThemedText accessibilityRole="header" style={styles.reflectionTitle} variant="title">{definition.reflectionPrompt}</ThemedText>
            <View style={styles.reflectionOptions}>{REFLECTIONS.map((reflection) => <Pressable key={reflection.id} accessibilityRole="button" disabled={busy} onPress={() => void complete(reflection.id)} style={({ pressed }) => [styles.reflectionButton, pressed && styles.pressed]}><View style={[styles.reflectionStar, definition.narrative && { backgroundColor: area.accent }]} /><ThemedText selectable={false} style={styles.reflectionLabel} variant="label">{reflection.label}</ThemedText></Pressable>)}</View>
            <InlineAction disabled={busy} label="Light my star without a reflection" onPress={() => void complete()} />
          </Animated.View>
        )}
      </View>
    );

    if (localPhase === 'ready') return (
      <View style={styles.phaseStack}>
        <View style={styles.returnIntro}><ThemedText style={[styles.eyebrow, { color: area.accent }]} variant="caption">GET READY</ThemedText><ThemedText accessibilityRole="header" style={styles.heading} variant="display">Make the real world ready.</ThemedText><ThemedText style={styles.body} variant="body">Check each item together. These checks do not leave this device.</ThemedText></View>
        <View style={styles.factsSurface}><Fact label="Time" value={`${agePolicy.durationMinutes} minutes`} /><Fact label="Place" value={experience.settings.map((setting) => SETTING_COPY[setting]).join(' or ')} /><Fact label="Who" value={definition.startPolicy.kind === 'guardian-confirm' ? 'Trusted grown-up required' : context.companions.map((item) => COMPANION_COPY[item]).join(' · ')} /><Fact label="Things" value={experience.requiredMaterials.map((item) => MATERIAL_COPY[item]).join(' · ')} /></View>
        <View style={styles.readySurface}>{definition.preparation.map((item) => <ReadyRow key={item.id} checked={checked.includes(item.id)} label={item.label} onPress={() => toggleReady(item.id)} signalColor={definition.narrative ? area.accent : colors.starlight} />)}</View>
        <View style={styles.safety}><View style={styles.safetyOrbit}><View style={[styles.safetyStar, definition.narrative && styles.safetyStarUnlit]} /></View><View style={styles.safetyCopy}><ThemedText style={styles.safetyTitle} variant="label">Safety boundary</ThemedText><ThemedText style={styles.safetyBody} variant="body">{experience.safetyNote}</ThemedText></View></View>
        {definition.startPolicy.kind === 'guardian-confirm' ? <View style={styles.guardianSurface}><ThemedText style={styles.guardianEyebrow} variant="caption">GROWN-UP HANDOFF</ThemedText><ReadyRow checked={workingState.guardianConfirmed === true} label={definition.startPolicy.confirmation} onPress={() => updateDraft({ ...workingState, guardianConfirmed: workingState.guardianConfirmed !== true })} signalColor={definition.narrative ? area.accent : colors.starlight} /></View> : null}
        {showConflict && activeSession ? <View style={styles.conflict}><ThemedText accessibilityRole="header" style={styles.conflictTitle} variant="title">Another mission is waiting.</ThemedText><ThemedText style={styles.body} variant="body">Resume {getExperienceById(activeSession.experienceId)?.title ?? 'your current mission'}, or end it without penalty and begin this one.</ThemedText><ActionButton label="Resume current mission" onPress={() => router.replace(`/experience/${activeSession.experienceId}`)} variant="ink" /><InlineAction label={`End it and begin ${experience.title}`} onPress={() => void begin(true)} danger /></View> : null}
        <ActionButton label="Begin in the real world" loading={busy} onPress={() => void begin()} variant="ink" />
        {definition.narrative ? <InlineAction label="Choose another mission" onPress={() => router.replace(`/curiosity/${area.id}`)} /> : null}
        <InlineAction label="Change my mission choice" onPress={() => setLocalPhase('brief')} />
      </View>
    );

    if (localPhase === 'story' && definition.narrative) return (
      <View style={styles.phaseStack}>
        <View style={[styles.storyHook, { backgroundColor: area.wash }]}>
          <MissionWorldArtwork accent={area.accent} artworkId={definition.narrative.artworkId} sceneId={definition.narrative.artworkSceneId} signalId={definition.narrative.signalId} wash={area.wash} />
          <ThemedText style={[styles.eyebrow, { color: area.accent }]} variant="caption">A {definition.narrative.worldName.toUpperCase()} MISSION</ThemedText>
          <ThemedText accessibilityRole="header" style={styles.heading} variant="display">{definition.narrative.hook.heading}</ThemedText>
          <ThemedText style={styles.promise} variant="body">{definition.narrative.hook.body}</ThemedText>
        </View>
        <ActionButton label={definition.narrative.hook.actionLabel} onPress={() => setLocalPhase('brief')} variant="ink" />
      </View>
    );

    return (
      <View style={styles.phaseStack}>
        <View style={[styles.hero, { backgroundColor: area.wash }]}>
          <View style={styles.heroTop}><DomainGlyph accent={area.accent} id={area.id} size={68} wash={colors.onboardingSurface} />{completedBefore ? <View style={styles.litStatus}><View style={styles.litDot} /><ThemedText style={styles.litStatusText} variant="caption">A star you lit</ThemedText></View> : null}</View>
          <ThemedText style={[styles.eyebrow, { color: area.accent }]} variant="caption">{area.title.toUpperCase()}</ThemedText>
          <ThemedText accessibilityRole="header" style={styles.heading} variant="display">{experience.title}</ThemedText>
          <ThemedText style={styles.promise} variant="body">{experience.promise}</ThemedText>
        </View>
        <View style={styles.successLine}><ThemedText style={styles.successLabel} variant="caption">WHAT DONE LOOKS LIKE</ThemedText><ThemedText style={styles.successText} variant="title">{definition.successCue}</ThemedText></View>
        {definition.briefInteractions.map((interaction) => <MissionInteractionView key={interaction.id} accent={area.accent} interaction={interaction} onChange={updateDraft} state={workingState} wash={area.wash} />)}
        <ActionButton label="Get ready" onPress={() => {
          if (!briefReady) setError('Finish each mission choice above before getting ready.');
          else { setError(null); setLocalPhase('ready'); }
        }} variant="ink" />
      </View>
    );
  };

  return (
    <Screen contentInsetAdjustmentBehavior="automatic" style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + spacing.eight, spacing.eight) }]}>
      <Stack.Title>{experience.title}</Stack.Title>
      <StatusBar style="dark" />
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(motion.standard)} style={styles.main}>
        {error ? <View accessibilityLiveRegion="assertive" style={styles.error}><ThemedText style={styles.errorText} variant="body">{error}</ThemedText></View> : null}
        <MissionVoice text={voiceText} />
        {renderContent()}
        {experienceId === 'shadow-tracing' && (ownSession?.phase === 'return' || completedNow) ? <ShadowTransfer returning /> : null}
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.onboardingCanvas },
  content: { backgroundColor: colors.onboardingCanvas, paddingHorizontal: spacing.six, paddingTop: spacing.six },
  main: { alignSelf: 'center', gap: spacing.four, maxWidth: 580, width: '100%' },
  phaseStack: { gap: spacing.six },
  hero: { borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.four, padding: spacing.six },
  heroTop: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.bold, fontSize: 11, letterSpacing: 1.2 },
  heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 34, letterSpacing: -0.8, lineHeight: 39 },
  promise: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 18, lineHeight: 27 },
  body: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 16, lineHeight: 24 },
  litStatus: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.two, minHeight: 40, paddingHorizontal: spacing.three },
  litDot: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 10, width: 10 },
  litStatusText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  successLine: { borderBottomColor: colors.onboardingLine, borderBottomWidth: 1, gap: spacing.two, paddingBottom: spacing.six },
  successLabel: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.bold, fontSize: 11, letterSpacing: 1 },
  successText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 22, lineHeight: 29 },
  factsSurface: { borderBottomColor: colors.onboardingLine, borderTopColor: colors.onboardingLine, borderWidth: 0, borderBottomWidth: 1, borderTopWidth: 1, flexDirection: 'row', flexWrap: 'wrap', paddingVertical: spacing.three },
  fact: { flexBasis: '50%', gap: spacing.one, minHeight: 70, padding: spacing.three },
  factLabel: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.bold, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  factValue: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 14, lineHeight: 20 },
  readySurface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.medium, borderWidth: 1, overflow: 'hidden' },
  readyRow: { alignItems: 'center', borderBottomColor: colors.onboardingLine, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.three, minHeight: 68, paddingHorizontal: spacing.four, paddingVertical: spacing.three },
  readyLabel: { color: colors.onboardingInk, flex: 1, fontFamily: fontFamilies.semibold, fontSize: 15, lineHeight: 22 },
  check: { alignItems: 'center', borderColor: colors.onboardingInkMuted, borderRadius: radius.pill, borderWidth: 1.5, height: 28, justifyContent: 'center', width: 28 },
  checkSelected: { backgroundColor: colors.onboardingInk, borderColor: colors.onboardingInk },
  checkDot: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 9, width: 9 },
  safety: { alignItems: 'flex-start', backgroundColor: colors.onboardingGlow, borderCurve: 'continuous', borderRadius: radius.medium, flexDirection: 'row', gap: spacing.four, padding: spacing.four },
  safetyOrbit: { alignItems: 'center', borderColor: colors.onboardingInk, borderRadius: radius.pill, borderWidth: 1.5, height: 42, justifyContent: 'center', transform: [{ rotate: '-12deg' }], width: 42 },
  safetyStar: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 10, width: 10 },
  safetyStarUnlit: { backgroundColor: colors.onboardingLine },
  safetyCopy: { flex: 1, gap: spacing.two },
  safetyTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  safetyBody: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 15, lineHeight: 22 },
  guardianSurface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingInk, borderCurve: 'continuous', borderRadius: radius.medium, borderWidth: 1.5, overflow: 'hidden', paddingTop: spacing.three },
  guardianEyebrow: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, letterSpacing: 1.1, paddingHorizontal: spacing.four },
  launchSurface: { alignItems: 'center', backgroundColor: colors.midnight, borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.four, minHeight: 360, paddingHorizontal: spacing.six, paddingVertical: spacing.eight },
  launchOrbit: { alignItems: 'center', borderColor: colors.onMidnightMuted, borderRadius: radius.pill, borderWidth: 1.5, height: 84, justifyContent: 'center', transform: [{ rotate: '-12deg' }], width: 84 },
  launchStar: { backgroundColor: colors.starlight, borderRadius: radius.pill, boxShadow: '0 0 16px rgba(245,199,91,0.45)', height: 18, width: 18 },
  launchStarUnlit: { backgroundColor: colors.onMidnight, boxShadow: 'none' },
  launchEyebrow: { color: colors.starlight, fontFamily: fontFamilies.bold, fontSize: 11, letterSpacing: 1.3 },
  launchEyebrowUnlit: { color: colors.onMidnightMuted },
  launchCue: { color: colors.onMidnight, fontFamily: fontFamilies.bold, fontSize: 30, letterSpacing: -0.6, lineHeight: 36, textAlign: 'center' },
  launchBody: { color: colors.onMidnightMuted, fontFamily: fontFamilies.regular, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  launchAside: { color: colors.onMidnightMuted, fontFamily: fontFamilies.semibold, lineHeight: 19, textAlign: 'center' },
  memoryPlan: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.two, justifyContent: 'center', marginTop: spacing.two },
  memoryPlanItem: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderCurve: 'continuous', borderRadius: radius.small, gap: spacing.one, minHeight: 78, minWidth: 88, padding: spacing.two },
  memoryPlanLabel: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 11, maxWidth: 92, textAlign: 'center' },
  launchStopConfirm: { color: colors.danger, fontFamily: fontFamilies.semibold, lineHeight: 20, textAlign: 'center' },
  timerLine: { alignItems: 'center', borderBottomColor: colors.onboardingLine, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.four, justifyContent: 'space-between', paddingBottom: spacing.four },
  timerCopy: { flex: 1, gap: spacing.one },
  timerTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold },
  timerValue: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 30, fontVariant: ['tabular-nums'] },
  timerHint: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular },
  timerFinished: { color: colors.onboardingInk, fontFamily: fontFamilies.semibold },
  guidanceSection: { alignItems: 'flex-start' },
  stepSurface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.medium, borderWidth: 1, gap: spacing.four, padding: spacing.four, width: '100%' },
  stepTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  stepCount: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.bold, letterSpacing: 1 },
  stepText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 22, lineHeight: 29 },
  stepActions: { flexDirection: 'row', justifyContent: 'space-between' },
  inlineAction: { alignItems: 'center', justifyContent: 'center', minHeight: 48, paddingHorizontal: spacing.three, paddingVertical: spacing.two },
  inlineActionText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 14, textAlign: 'center' },
  dangerText: { color: colors.danger },
  pressed: { opacity: 0.68 },
  disabled: { opacity: 0.38 },
  primaryActions: { gap: spacing.two },
  returnIntro: { gap: spacing.three },
  returnActions: { gap: spacing.two },
  reflection: { borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.four, padding: spacing.four },
  knowledgeReveal: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, gap: spacing.four, padding: spacing.six },
  knowledgeSignal: { alignItems: 'center', flexDirection: 'row', gap: spacing.two },
  knowledgeSignalLine: { height: 2, width: 36 },
  knowledgeSignalDot: { borderRadius: radius.pill, height: 10, width: 10 },
  reflectionTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 23, lineHeight: 29 },
  reflectionOptions: { gap: spacing.two },
  reflectionButton: { alignItems: 'center', backgroundColor: colors.onboardingSurface, borderCurve: 'continuous', borderRadius: radius.small, flexDirection: 'row', gap: spacing.three, minHeight: 56, paddingHorizontal: spacing.four },
  reflectionStar: { backgroundColor: colors.starlight, borderRadius: radius.pill, height: 10, width: 10 },
  reflectionLabel: { color: colors.onboardingInk, flex: 1, fontFamily: fontFamilies.bold, fontSize: 15 },
  conflict: { backgroundColor: colors.onboardingSurface, borderColor: colors.danger, borderCurve: 'continuous', borderRadius: radius.medium, borderWidth: 1, gap: spacing.three, padding: spacing.four },
  conflictTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 21, lineHeight: 27 },
  confirmText: { color: colors.danger, fontFamily: fontFamilies.semibold, textAlign: 'center' },
  error: { backgroundColor: colors.dangerWash, borderCurve: 'continuous', borderRadius: radius.small, padding: spacing.four },
  errorText: { color: colors.danger, fontFamily: fontFamilies.semibold, fontSize: 14, lineHeight: 21 },
  completed: { alignItems: 'center', gap: spacing.four, paddingVertical: spacing.eight },
  starMoment: { alignItems: 'center', height: 190, justifyContent: 'center', width: 190 },
  completedTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 36, lineHeight: 42, textAlign: 'center' },
  completedBody: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.regular, fontSize: 17, lineHeight: 25, textAlign: 'center' },
  completedActions: { gap: spacing.two, paddingTop: spacing.four, width: '100%' },
  storyHook: { alignItems: 'flex-start', borderCurve: 'continuous', borderRadius: radius.large, gap: spacing.four, overflow: 'hidden', padding: spacing.six },
  invalid: { backgroundColor: colors.onboardingCanvas, flex: 1, gap: spacing.four, justifyContent: 'center', padding: spacing.six },
});

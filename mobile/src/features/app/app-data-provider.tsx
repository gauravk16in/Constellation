import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { getExperienceById } from '@/data/catalog/experience-catalog';
import { getMissionDefinition } from '@/data/catalog/mission-registry';
import { appRepository } from '@/data/persistence/app-repository';
import { evaluateExperience } from '@/features/recommendations/recommendation-engine';
import { isMissionStartReady } from '@/features/missions/mission-state';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import type { AccessTier } from '@/features/entitlements/entitlement-types';
import type {
  ChildProfile,
  CompletedSetupDraft,
  ConstellationStar,
  ExperienceContext,
  ExperienceOutcome,
  SetupStatus,
} from '@/types/constellation';
import type { ExperienceSession, MissionInteractionState, MissionReflection } from '@/types/mission';

type AppDataContextValue = {
  completeSetup: (draft: CompletedSetupDraft) => Promise<void>;
  activeSession: ExperienceSession | null;
  completeMission: (reflection?: MissionReflection) => Promise<ExperienceOutcome>;
  outcomes: ExperienceOutcome[];
  profile: ChildProfile | null;
  replaceActiveMission: (experienceId: string, context: ExperienceContext, interactionState: MissionInteractionState) => Promise<ExperienceSession>;
  refreshProgress: () => Promise<void>;
  deleteChildData: (options: { preserveEntitlement: true }) => Promise<void>;
  saveMission: (next: Partial<Pick<ExperienceSession, 'phase' | 'interactionState' | 'timerStartedAt'>>) => Promise<ExperienceSession>;
  skipMission: () => Promise<ExperienceOutcome>;
  startMission: (experienceId: string, context: ExperienceContext, interactionState: MissionInteractionState) => Promise<ExperienceSession>;
  setupStatus: SetupStatus;
  stars: ConstellationStar[];
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

function assertMissionStartReady(
  profile: ChildProfile,
  experienceId: string,
  context: ExperienceContext,
  interactionState: MissionInteractionState,
  accessTier: AccessTier,
) {
  const experience = getExperienceById(experienceId);
  const definition = getMissionDefinition(experienceId, profile.ageBand, experience?.version ?? 2);
  if (!experience || !definition) throw new Error('This reviewed mission could not be found.');
  const reasons = evaluateExperience(experience, { profile, context, accessTier });
  if (reasons.length > 0) throw new Error('This mission no longer fits the time, place, people, or materials. Review what fits in Out There.');
  if (!isMissionStartReady(definition, interactionState)) {
    throw new Error('Finish the mission choice, ready check, and any grown-up safety handoff before beginning.');
  }
  return experience;
}

export function AppDataProvider({ children }: PropsWithChildren) {
  const { accessTier } = useEntitlements();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [setupStatus, setSetupStatus] = useState<SetupStatus>('loading');
  const [activeSession, setActiveSession] = useState<ExperienceSession | null>(null);
  const [outcomes, setOutcomes] = useState<ExperienceOutcome[]>([]);
  const [stars, setStars] = useState<ConstellationStar[]>([]);

  const load = useCallback(async () => {
    await appRepository.initialize();
    const status = await appRepository.getSetupStatus();
    setSetupStatus(status);
    if (status !== 'complete') {
      setProfile(null);
      setOutcomes([]);
      setStars([]);
      setActiveSession(null);
      return;
    }
    const storedProfile = await appRepository.getProfile();
    setProfile(storedProfile);
    if (storedProfile) {
      const [nextOutcomes, nextStars, nextSession] = await Promise.all([
        appRepository.listOutcomes(storedProfile.id),
        appRepository.listStars(storedProfile.id),
        appRepository.getActiveSession(storedProfile.id),
      ]);
      setOutcomes(nextOutcomes);
      setStars(nextStars);
      setActiveSession(nextSession);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void load().catch(() => setSetupStatus('corrupt'));
    }, 0);
    return () => clearTimeout(timeout);
  }, [load]);

  const completeSetup = useCallback(async (draft: CompletedSetupDraft) => {
    const nextProfile = await appRepository.completeSetup(draft);
    setProfile(nextProfile);
    setOutcomes([]);
    setStars([]);
    setActiveSession(null);
    setSetupStatus('complete');
  }, []);

  const refreshProgress = useCallback(async () => {
    if (!profile) return;
    const [nextOutcomes, nextStars, nextSession] = await Promise.all([
      appRepository.listOutcomes(profile.id),
      appRepository.listStars(profile.id),
      appRepository.getActiveSession(profile.id),
    ]);
    setOutcomes(nextOutcomes);
    setStars(nextStars);
    setActiveSession(nextSession);
  }, [profile]);

  const createMission = useCallback(async (
    experienceId: string,
    context: ExperienceContext,
    interactionState: MissionInteractionState,
  ) => {
    if (!profile) throw new Error('Finish local setup before starting a mission.');
    const experience = assertMissionStartReady(profile, experienceId, context, interactionState, accessTier);
    const session = await appRepository.startExperience({
      childProfileId: profile.id, experienceId, catalogVersion: experience.version, context, interactionState,
    });
    setActiveSession(session);
    return session;
  }, [accessTier, profile]);

  const startMission = useCallback(async (
    experienceId: string,
    context: ExperienceContext,
    interactionState: MissionInteractionState,
  ) => {
    if (activeSession) throw new Error('Another mission is already active.');
    return createMission(experienceId, context, interactionState);
  }, [activeSession, createMission]);

  const replaceActiveMission = useCallback(async (
    experienceId: string,
    context: ExperienceContext,
    interactionState: MissionInteractionState,
  ) => {
    if (!profile) throw new Error('Finish local setup before starting a mission.');
    assertMissionStartReady(profile, experienceId, context, interactionState, accessTier);
    if (activeSession) await appRepository.skipSession(activeSession.id);
    setActiveSession(null);
    const session = await createMission(experienceId, context, interactionState);
    if (profile) {
      const nextOutcomes = await appRepository.listOutcomes(profile.id);
      setOutcomes(nextOutcomes);
    }
    return session;
  }, [accessTier, activeSession, createMission, profile]);

  const saveMission = useCallback(async (next: Partial<Pick<ExperienceSession, 'phase' | 'interactionState' | 'timerStartedAt'>>) => {
    if (!activeSession) throw new Error('There is no active mission to save.');
    const session = await appRepository.saveSession({ ...activeSession, ...next });
    setActiveSession(session);
    return session;
  }, [activeSession]);

  const completeMission = useCallback(async (reflection?: MissionReflection) => {
    if (!activeSession || !profile) throw new Error('There is no active mission to complete.');
    const outcome = await appRepository.completeSession(activeSession.id, reflection);
    const [nextOutcomes, nextStars] = await Promise.all([
      appRepository.listOutcomes(profile.id), appRepository.listStars(profile.id),
    ]);
    setActiveSession(null);
    setOutcomes(nextOutcomes);
    setStars(nextStars);
    return outcome;
  }, [activeSession, profile]);

  const skipMission = useCallback(async () => {
    if (!activeSession || !profile) throw new Error('There is no active mission to stop.');
    const outcome = await appRepository.skipSession(activeSession.id);
    const nextOutcomes = await appRepository.listOutcomes(profile.id);
    setActiveSession(null);
    setOutcomes(nextOutcomes);
    return outcome;
  }, [activeSession, profile]);

  const deleteChildData = useCallback(async (options: { preserveEntitlement: true }) => {
    await appRepository.deleteChildData(options);
    setProfile(null);
    setOutcomes([]);
    setStars([]);
    setActiveSession(null);
    setSetupStatus('missing');
  }, []);

  const value = useMemo(
    () => ({
      activeSession, completeMission, completeSetup, outcomes, profile, refreshProgress, replaceActiveMission,
      deleteChildData, saveMission, setupStatus, skipMission, stars, startMission,
    }),
    [
      activeSession, completeMission, completeSetup, outcomes, profile, refreshProgress, replaceActiveMission,
      deleteChildData, saveMission, setupStatus, skipMission, stars, startMission,
    ],
  );

  return <AppDataContext value={value}>{children}</AppDataContext>;
}

export function useAppData() {
  const context = use(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside AppDataProvider.');
  return context;
}

import { createContext, use, useMemo, useState, type PropsWithChildren } from 'react';

import { useAppData } from '@/features/app/app-data-provider';
import type { AgeBand, ExperienceContext } from '@/types/constellation';
import type { PaperShape } from '@/types/pocket-planet';

type SessionContextValue = {
  bridgeHandoff: PaperShape | null;
  setBridgeHandoff: (shape: PaperShape | null) => void;
  context: ExperienceContext;
  updateContext: (next: Partial<ExperienceContext>) => void;
};

const ExperienceSessionContext = createContext<SessionContextValue | null>(null);

function makeDefaultContext(ageBand?: AgeBand): ExperienceContext {
  return {
    localHour: new Date().getHours(),
    availableMinutes: 20,
    setting: 'either',
    companions: ageBand === '6-7' ? ['guardian'] : ['solo'],
    materialsAvailable: ['nothing-special'],
    weather: 'unknown',
  };
}

export function ExperienceSessionProvider({ children }: PropsWithChildren) {
  const { profile } = useAppData();
  const [context, setContext] = useState<ExperienceContext>(() => makeDefaultContext(profile?.ageBand));
  const [bridgeHandoff, setBridgeHandoff] = useState<PaperShape | null>(null);
  const value = useMemo(
    () => ({
      context,
      bridgeHandoff,
      setBridgeHandoff,
      updateContext: (next: Partial<ExperienceContext>) => setContext((current) => ({ ...current, ...next })),
    }),
    [bridgeHandoff, context],
  );
  return <ExperienceSessionContext value={value}>{children}</ExperienceSessionContext>;
}

export function useExperienceSession() {
  const context = use(ExperienceSessionContext);
  if (!context) throw new Error('useExperienceSession must be used inside ExperienceSessionProvider.');
  return context;
}

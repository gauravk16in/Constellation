import { createContext, use, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

import type { SetupDraft } from '@/types/constellation';

const INITIAL_DRAFT: SetupDraft = {
  nickname: '',
  ageBand: null,
  interests: [],
  supportNeeds: [],
  allowedContexts: [],
};

type SetupDraftContextValue = {
  draft: SetupDraft;
  resetDraft: () => void;
  updateDraft: (next: Partial<SetupDraft>) => void;
};

const SetupDraftContext = createContext<SetupDraftContextValue | null>(null);

export function SetupDraftProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<SetupDraft>(INITIAL_DRAFT);

  const updateDraft = useCallback((next: Partial<SetupDraft>) => {
    setDraft((current) => ({ ...current, ...next }));
  }, []);

  const resetDraft = useCallback(() => setDraft(INITIAL_DRAFT), []);

  const value = useMemo(() => ({ draft, resetDraft, updateDraft }), [draft, resetDraft, updateDraft]);

  return <SetupDraftContext value={value}>{children}</SetupDraftContext>;
}

export function useSetupDraft() {
  const context = use(SetupDraftContext);
  if (!context) throw new Error('useSetupDraft must be used inside SetupDraftProvider.');
  return context;
}

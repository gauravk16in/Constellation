import { createContext, use, useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { appRepository } from '@/data/persistence/app-repository';
import { useAppData } from '@/features/app/app-data-provider';
import { useEntitlements } from '@/features/entitlements/entitlement-provider';
import type { PlanetCommand, PlanetData } from '@/types/pocket-planet';

type PlanetContextValue = { data: PlanetData | null; busy: boolean; error: string | null;
  reload: () => Promise<void>; change: (command: PlanetCommand) => Promise<PlanetData | null> };
const PlanetContext = createContext<PlanetContextValue | null>(null);

export function PlanetProvider({ children }: PropsWithChildren) {
  const { profile } = useAppData();
  const { accessTier } = useEntitlements();
  const [data, setData] = useState<PlanetData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const reload = useCallback(async () => {
    if (!profile) return;
    try { setData(await appRepository.getPlanet(profile.id)); setError(null); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Your planet could not be opened. Try again.'); }
  }, [profile]);
  useEffect(() => {
    const timeout = setTimeout(() => { void reload(); }, 0);
    return () => clearTimeout(timeout);
  }, [reload]);
  const change = useCallback(async (command: PlanetCommand) => {
    if (!profile || lock.current) return null;
    lock.current = true; setBusy(true); setError(null);
    try {
      const next = await appRepository.changePlanet(profile.id, command, accessTier === 'family');
      setData(next); return next;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'That change could not be saved. Your previous work is safe.');
      return null;
    } finally { lock.current = false; setBusy(false); }
  }, [accessTier, profile]);
  return <PlanetContext value={{ data, busy, error, reload, change }}>{children}</PlanetContext>;
}

export function usePlanet() {
  const value = use(PlanetContext);
  if (!value) throw new Error('PlanetProvider is required.');
  return value;
}

import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { appRepository } from '@/data/persistence/app-repository';
import {
  makeFreeEntitlementSnapshot,
  resolveAccessTier,
  type AccessTier,
  type EntitlementSnapshot,
  type MembershipStatus,
  type PaywallResult,
  type RevenueCatConfigurationStatus,
} from '@/features/entitlements/entitlement-types';
import { revenueCatAdapter } from '@/features/entitlements/revenuecat-adapter';

type EntitlementContextValue = {
  accessTier: AccessTier;
  configurationStatus: RevenueCatConfigurationStatus;
  error: string | null;
  membershipStatus: MembershipStatus;
  checkedAt: string | null;
  clearError: () => void;
  manageMembership: () => Promise<void>;
  presentFamilyPaywall: () => Promise<PaywallResult>;
  restoreMembership: () => Promise<boolean>;
};

const EntitlementContext = createContext<EntitlementContextValue | null>(null);

function friendlyError(error: unknown) {
  if (error instanceof Error && error.message.includes('not configured')) return error.message;
  return 'Family plans could not be reached. The free Constellation remains available.';
}

export function EntitlementProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState<EntitlementSnapshot>(makeFreeEntitlementSnapshot());
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const configurationStatus = revenueCatAdapter.getConfigurationStatus();
  const accessTier = resolveAccessTier(snapshot);

  useEffect(() => {
    let current = true;
    void appRepository.initialize().then(() => appRepository.getEntitlementSnapshot()).then(async (stored) => {
      if (!current) return;
      setSnapshot(stored);
      setMembershipStatus(resolveAccessTier(stored) === 'family' ? 'family' : 'free');

      // A guardian already consented before this device received Family access. Refresh only
      // that existing purchase state so renewals and expirations do not depend on reopening settings.
      if (stored.tier !== 'family' || configurationStatus !== 'ready') return;
      try {
        await revenueCatAdapter.configureForGuardian();
        const refreshed = await revenueCatAdapter.getEntitlementSnapshot();
        await appRepository.saveEntitlementSnapshot(refreshed);
        if (!current) return;
        setSnapshot(refreshed);
        setMembershipStatus(resolveAccessTier(refreshed) === 'family' ? 'family' : 'free');
      } catch {
        // Keep the sanitized cached snapshot. Expired cache still resolves to free safely.
      }
    }).catch(() => {
      if (current) setMembershipStatus('free');
    });
    return () => { current = false; };
  }, [configurationStatus]);

  const persistSnapshot = useCallback(async (next: EntitlementSnapshot) => {
    await appRepository.saveEntitlementSnapshot(next);
    setSnapshot(next);
    setMembershipStatus(resolveAccessTier(next) === 'family' ? 'family' : 'free');
  }, []);

  const presentFamilyPaywall = useCallback(async () => {
    setError(null);
    if (configurationStatus !== 'ready') {
      setMembershipStatus('unavailable');
      setError(configurationStatus === 'missing-key'
        ? 'Family plans are not configured for this build.'
        : 'Family purchases are available in the iOS and Android app.');
      return 'not-presented' as const;
    }
    setMembershipStatus('loading');
    try {
      await revenueCatAdapter.configureForGuardian();
      const result = await revenueCatAdapter.presentPaywall();
      if (result === 'purchased' || result === 'restored' || result === 'not-presented') {
        await persistSnapshot(await revenueCatAdapter.getEntitlementSnapshot());
      } else {
        setMembershipStatus(accessTier === 'family' ? 'family' : 'free');
      }
      if (result === 'error') setError('The store could not complete that purchase. Nothing was charged by Constellation.');
      return result;
    } catch (nextError) {
      setError(friendlyError(nextError));
      setMembershipStatus('error');
      return 'error' as const;
    }
  }, [accessTier, configurationStatus, persistSnapshot]);

  const restoreMembership = useCallback(async () => {
    setError(null);
    if (configurationStatus !== 'ready') {
      setMembershipStatus('unavailable');
      setError(configurationStatus === 'missing-key'
        ? 'Family plans are not configured for this build.'
        : 'Restore is available in the iOS and Android app.');
      return false;
    }
    setMembershipStatus('loading');
    try {
      await revenueCatAdapter.configureForGuardian();
      const next = await revenueCatAdapter.restorePurchases();
      await persistSnapshot(next);
      if (resolveAccessTier(next) !== 'family') {
        setError('No active Constellation Family purchase was found for this store account.');
        return false;
      }
      return true;
    } catch (nextError) {
      setError(friendlyError(nextError));
      setMembershipStatus('error');
      return false;
    }
  }, [configurationStatus, persistSnapshot]);

  const manageMembership = useCallback(async () => {
    setError(null);
    if (configurationStatus !== 'ready') {
      setError('Membership management is available in the iOS and Android app.');
      return;
    }
    setMembershipStatus('loading');
    try {
      await revenueCatAdapter.configureForGuardian();
      await revenueCatAdapter.presentCustomerCenter();
      await persistSnapshot(await revenueCatAdapter.getEntitlementSnapshot());
    } catch (nextError) {
      setError(friendlyError(nextError));
      setMembershipStatus('error');
    }
  }, [configurationStatus, persistSnapshot]);

  const value = useMemo(() => ({
    accessTier,
    checkedAt: membershipStatus === 'loading' ? null : snapshot.checkedAt,
    clearError: () => setError(null),
    configurationStatus,
    error,
    manageMembership,
    membershipStatus,
    presentFamilyPaywall,
    restoreMembership,
  }), [accessTier, configurationStatus, error, manageMembership, membershipStatus, presentFamilyPaywall, restoreMembership, snapshot.checkedAt]);

  return <EntitlementContext value={value}>{children}</EntitlementContext>;
}

export function useEntitlements() {
  const context = use(EntitlementContext);
  if (!context) throw new Error('useEntitlements must be used inside EntitlementProvider.');
  return context;
}

export type AccessTier = 'free' | 'family';

export type EntitlementSnapshot = {
  tier: AccessTier;
  expiresAt?: string;
  checkedAt: string;
};

export type RevenueCatConfigurationStatus = 'ready' | 'missing-key' | 'unsupported';

export type PaywallResult = 'purchased' | 'restored' | 'cancelled' | 'not-presented' | 'error';

export type MembershipStatus = 'loading' | 'free' | 'family' | 'unavailable' | 'error';

export const FAMILY_ENTITLEMENT_ID = 'constellation_family';

export function makeFreeEntitlementSnapshot(now = new Date().toISOString()): EntitlementSnapshot {
  return { tier: 'free', checkedAt: now };
}

export function resolveAccessTier(snapshot: EntitlementSnapshot, now = Date.now()): AccessTier {
  if (snapshot.tier !== 'family') return 'free';
  if (!snapshot.expiresAt) return 'family';
  return Date.parse(snapshot.expiresAt) > now ? 'family' : 'free';
}

export function assertEntitlementSnapshot(value: unknown): EntitlementSnapshot {
  if (!value || typeof value !== 'object') return makeFreeEntitlementSnapshot();
  const item = value as Partial<EntitlementSnapshot>;
  if (!['free', 'family'].includes(String(item.tier)) || typeof item.checkedAt !== 'string') {
    return makeFreeEntitlementSnapshot();
  }
  return {
    tier: item.tier as AccessTier,
    checkedAt: item.checkedAt,
    expiresAt: typeof item.expiresAt === 'string' ? item.expiresAt : undefined,
  };
}

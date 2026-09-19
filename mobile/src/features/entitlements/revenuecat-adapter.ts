import type { EntitlementSnapshot, PaywallResult, RevenueCatConfigurationStatus } from '@/features/entitlements/entitlement-types';

export interface RevenueCatAdapter {
  getConfigurationStatus(): RevenueCatConfigurationStatus;
  configureForGuardian(): Promise<void>;
  getEntitlementSnapshot(): Promise<EntitlementSnapshot>;
  presentPaywall(): Promise<PaywallResult>;
  restorePurchases(): Promise<EntitlementSnapshot>;
  presentCustomerCenter(): Promise<void>;
}

// TypeScript resolves this neutral declaration while Metro selects the native or web
// implementation beside it at bundle time.
export declare const revenueCatAdapter: RevenueCatAdapter;

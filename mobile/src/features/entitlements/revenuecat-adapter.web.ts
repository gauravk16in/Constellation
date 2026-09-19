import { makeFreeEntitlementSnapshot } from '@/features/entitlements/entitlement-types';
import type { RevenueCatAdapter } from '@/features/entitlements/revenuecat-adapter';

const unavailable = () => new Error('Family purchases are available in the iOS and Android app.');

export const revenueCatAdapter: RevenueCatAdapter = {
  getConfigurationStatus: () => 'unsupported',
  async configureForGuardian() { throw unavailable(); },
  async getEntitlementSnapshot() { return makeFreeEntitlementSnapshot(); },
  async presentPaywall() { return 'not-presented'; },
  async restorePurchases() { throw unavailable(); },
  async presentCustomerCenter() { throw unavailable(); },
};

import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, type CustomerInfo } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

import {
  FAMILY_ENTITLEMENT_ID,
  makeFreeEntitlementSnapshot,
  type EntitlementSnapshot,
  type PaywallResult,
} from '@/features/entitlements/entitlement-types';
import type { RevenueCatAdapter } from '@/features/entitlements/revenuecat-adapter';

let configured = false;

function platformApiKey() {
  if (Platform.OS === 'ios') return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY?.trim();
  if (Platform.OS === 'android') return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY?.trim();
  return undefined;
}

function snapshotFromCustomerInfo(customerInfo: CustomerInfo): EntitlementSnapshot {
  const family = customerInfo.entitlements.active[FAMILY_ENTITLEMENT_ID];
  if (!family?.isActive) return makeFreeEntitlementSnapshot(customerInfo.requestDate);
  return {
    tier: 'family',
    checkedAt: customerInfo.requestDate,
    expiresAt: family.expirationDate ?? undefined,
  };
}

function paywallResult(result: PAYWALL_RESULT): PaywallResult {
  switch (result) {
    case PAYWALL_RESULT.PURCHASED: return 'purchased';
    case PAYWALL_RESULT.RESTORED: return 'restored';
    case PAYWALL_RESULT.CANCELLED: return 'cancelled';
    case PAYWALL_RESULT.NOT_PRESENTED: return 'not-presented';
    case PAYWALL_RESULT.ERROR: return 'error';
  }
}

export const revenueCatAdapter: RevenueCatAdapter = {
  getConfigurationStatus() {
    if (!['ios', 'android'].includes(Platform.OS)) return 'unsupported';
    return platformApiKey() ? 'ready' : 'missing-key';
  },
  async configureForGuardian() {
    if (configured) return;
    const apiKey = platformApiKey();
    if (!apiKey) throw new Error('Family plans are not configured for this build.');
    await Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.WARN : LOG_LEVEL.ERROR);
    // RevenueCat creates an anonymous purchase identity. Never pass a child profile ID or attributes.
    Purchases.configure({ apiKey });
    configured = true;
  },
  async getEntitlementSnapshot() {
    await this.configureForGuardian();
    return snapshotFromCustomerInfo(await Purchases.getCustomerInfo());
  },
  async presentPaywall() {
    await this.configureForGuardian();
    const result = await RevenueCatUI.presentPaywall({ displayCloseButton: true, fontFamily: 'Quicksand_400Regular' });
    return paywallResult(result);
  },
  async restorePurchases() {
    await this.configureForGuardian();
    return snapshotFromCustomerInfo(await Purchases.restorePurchases());
  },
  async presentCustomerCenter() {
    await this.configureForGuardian();
    await RevenueCatUI.presentCustomerCenter();
  },
};

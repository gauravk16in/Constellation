import { FLAGSHIP_EXPERIENCE_IDS } from '@/data/catalog/mission-registry';
import type { AccessTier } from '@/features/entitlements/entitlement-types';

const FREE_EXPERIENCE_IDS = new Set<string>(FLAGSHIP_EXPERIENCE_IDS);

export const FREE_MISSION_COUNT = FLAGSHIP_EXPERIENCE_IDS.length;

export function canAccessExperience(experienceId: string, tier: AccessTier) {
  return tier === 'family' || FREE_EXPERIENCE_IDS.has(experienceId);
}

export function getExperienceAccessTier(experienceId: string): AccessTier {
  return FREE_EXPERIENCE_IDS.has(experienceId) ? 'free' : 'family';
}

import { EXPERIENCE_CATALOG, getExperienceAgePolicy } from '@/data/catalog/experience-catalog';
import { canAccessExperience } from '@/features/entitlements/access-policy';
import type { AccessTier } from '@/features/entitlements/entitlement-types';
import type {
  ChildProfile,
  CuriosityAreaId,
  Experience,
  ExperienceContext,
  Recommendation,
  RecommendationResult,
} from '@/types/constellation';

export type RecommendationQuery = {
  profile: ChildProfile;
  context: ExperienceContext;
  domainId?: CuriosityAreaId;
  completedExperienceIds?: string[];
  limit?: 1 | 2 | 3;
  offset?: number;
  accessTier?: AccessTier;
};

function isNight(hour: number) {
  return hour < 6 || hour >= 19;
}

export function evaluateExperience(experience: Experience, query: RecommendationQuery) {
  const { profile, context, domainId } = query;
  const agePolicy = getExperienceAgePolicy(experience, profile.ageBand);
  const reasons: string[] = [];

  if (experience.status !== 'published' || !experience.review.reviewed) reasons.push('not-published');
  if (!canAccessExperience(experience.id, query.accessTier ?? 'family')) reasons.push('membership');
  if (domainId && experience.domainId !== domainId) reasons.push('different-domain');
  if (!experience.ageBands.includes(profile.ageBand)) reasons.push('age-band');
  if (agePolicy.durationMinutes > context.availableMinutes) reasons.push('duration');
  if (
    context.setting !== 'either' &&
    !experience.settings.includes(context.setting)
  ) reasons.push('setting');
  if (!experience.allowedContexts.some((place) => profile.allowedContexts.includes(place))) reasons.push('guardian-boundary');
  if (!agePolicy.companionOptions.some((companion) => context.companions.includes(companion))) reasons.push('companion');
  if (!experience.requiredMaterials.every((material) => context.materialsAvailable.includes(material))) reasons.push('materials');
  if (!experience.weatherAllowed.includes(context.weather)) reasons.push('weather');
  if (experience.timeWindow === 'night' && !isNight(context.localHour)) reasons.push('time-of-day');
  if (experience.timeWindow === 'daylight' && isNight(context.localHour)) reasons.push('time-of-day');
  if (
    profile.supportNeeds.includes('guardian-alongside') &&
    !context.companions.includes('guardian')
  ) reasons.push('guardian-support');
  if (
    profile.supportNeeds.includes('low-movement') &&
    !experience.adaptations.includes('low-movement')
  ) reasons.push('movement-adaptation');
  if (
    profile.supportNeeds.includes('lower-sensory') &&
    !experience.adaptations.includes('lower-sensory')
  ) reasons.push('sensory-adaptation');

  return reasons;
}

function scoreExperience(experience: Experience, query: RecommendationQuery) {
  const agePolicy = getExperienceAgePolicy(experience, query.profile.ageBand);
  const completed = query.completedExperienceIds ?? [];
  let score = 0;
  if (query.profile.interests.includes(experience.domainId)) score += 40;
  if (query.context.setting !== 'either' && experience.settings.includes(query.context.setting)) score += 12;
  if (agePolicy.durationMinutes === query.context.availableMinutes) score += 10;
  else score += Math.max(0, 8 - Math.abs(query.context.availableMinutes - agePolicy.durationMinutes) / 5);
  if (experience.requiredMaterials.includes('nothing-special')) score += 6;
  if (!completed.includes(experience.id)) score += 12;
  if (experience.adaptations.some((need) => query.profile.supportNeeds.includes(need))) score += 4;
  return score;
}

function fitReasons(experience: Experience, query: RecommendationQuery) {
  const agePolicy = getExperienceAgePolicy(experience, query.profile.ageBand);
  const reasons = [`${agePolicy.durationMinutes} minutes`];
  if (experience.requiredMaterials.includes('nothing-special')) reasons.push('nothing special needed');
  else if (experience.requiredMaterials.includes('paper-drawing')) reasons.push('uses paper or drawing tools');
  if (agePolicy.companionOptions.includes('solo') && query.context.companions.includes('solo')) reasons.push('works independently');
  else if (agePolicy.companionOptions.includes('guardian') && query.context.companions.includes('guardian')) reasons.push('with a grown-up');
  else if (agePolicy.companionOptions.includes('friend') && query.context.companions.includes('friend')) reasons.push('with a friend');
  else if (agePolicy.companionOptions.includes('sibling') && query.context.companions.includes('sibling')) reasons.push('with a sibling');
  return reasons.slice(0, 2);
}

function diversify(scored: { experience: Experience; score: number }[], limit: number) {
  const chosen: typeof scored = [];
  const usedDomains = new Set<CuriosityAreaId>();

  for (const candidate of scored) {
    if (!usedDomains.has(candidate.experience.domainId)) {
      chosen.push(candidate);
      usedDomains.add(candidate.experience.domainId);
    }
    if (chosen.length === limit) return chosen;
  }

  for (const candidate of scored) {
    if (!chosen.includes(candidate)) chosen.push(candidate);
    if (chosen.length === limit) break;
  }
  return chosen;
}

export function recommendExperiences(query: RecommendationQuery): RecommendationResult {
  const excluded: RecommendationResult['excluded'] = [];
  const eligible = EXPERIENCE_CATALOG.flatMap((experience) => {
    const reasons = evaluateExperience(experience, query);
    if (reasons.length > 0) {
      excluded.push({ experienceId: experience.id, reasons });
      return [];
    }
    return [{ experience, score: scoreExperience(experience, query) }];
  }).sort((a, b) => b.score - a.score || a.experience.id.localeCompare(b.experience.id));

  const limit = query.limit ?? 3;
  const offset = query.offset ?? 0;
  const ordered = query.domainId ? eligible : diversify(eligible, Math.min(eligible.length, limit + offset));
  const selected = ordered.slice(offset, offset + limit);
  const recommendations: Recommendation[] = selected.map(({ experience }) => ({
    experience,
    fitReasons: fitReasons(experience, query),
  }));

  return { recommendations, excluded };
}

// @ts-nocheck -- build-only Node script; Expo's app tsconfig intentionally omits Node types.
import fs from 'node:fs';
import { EXPERIENCE_CATALOG } from '../src/data/catalog/experience-catalog';

// This gate checks evidence records, not the truth of a human's attestation.
// Never fill these fields with invented reviewer names or test results.
if (process.argv.includes('--build') && process.env.EAS_BUILD_PROFILE !== 'production') process.exit(0);
const evidence = JSON.parse(fs.readFileSync(new URL('../release/evidence.json', import.meta.url), 'utf8'));
const errors: string[] = [];
const record = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.reviewer === 'string' && v.reviewer.trim().length > 2 && typeof v.reference === 'string' && v.reference.trim().length > 3 &&
    typeof v.date === 'string' && Number.isFinite(Date.parse(v.date)) && Date.parse(v.date) <= Date.now();
};
for (const key of ['policyReview', 'familyPilot', 'billingDeviceTest']) if (!record(evidence[key])) errors.push(`Missing attributable ${key} evidence.`);
if (!evidence.supportEmail || !evidence.supportInboxVerifiedAt) errors.push('A monitored support inbox must be verified.');
for (const experience of EXPERIENCE_CATALOG) for (const ageBand of ['6-7', '8-9', '10-12']) {
  const review = evidence.contentReviews?.find((v: { experienceId: string; ageBand: string }) => v.experienceId === experience.id && v.ageBand === ageBand);
  if (!record(review) || review?.approved !== true || !review?.expiresAt || Date.parse(review.expiresAt) <= Date.now()) errors.push(`Needs qualified content/safety review: ${experience.id} / ${ageBand}`);
}
if (process.argv.includes('--submission')) {
  for (const key of ['publicPlayUrl', 'firstPublicReleaseAt', 'usAvailabilityVerifiedAt', 'revenueCatProjectId', 'judgeAccessVerifiedAt', 'demoUrl', 'devpostScreenshot']) {
    if (!evidence[key]) errors.push(`Missing submission evidence: ${key}`);
  }
}
if (errors.length) {
  console.error(`RELEASE BLOCKED: ${errors.length} unresolved checks.\n${errors.join('\n')}\nSee release/README.md. Development previews remain available.`);
  process.exit(1);
}
console.log('Release evidence records present. Verify references and store status independently before submission.');

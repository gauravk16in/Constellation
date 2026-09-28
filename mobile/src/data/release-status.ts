import evidence from '../../release/evidence.json';

const configuredEmail: unknown = evidence.supportEmail;
export const supportEmail = typeof configuredEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail) && evidence.supportInboxVerifiedAt ? configuredEmail : null;
export const supportContactCopy = supportEmail
  ? `Contact ${supportEmail}. Do not include a child’s name, school, photos, recordings or precise location.`
  : 'Public support is not available in this preview. Contact the person who invited you to test; do not send child-identifying information.';
export const policyReviewed = Boolean(evidence.policyReview);

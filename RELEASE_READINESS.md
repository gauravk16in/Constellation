# Constellation 1.0 Release Readiness

Last updated: September 4, 2026

This is the operational handoff for the Android Google Play and RevenueCat Shipaton release. A checked local item means it exists in the repository; it does not claim that an external console, store, legal review, or family pilot has been completed.

## Locked release contract

| Item | Value |
|---|---|
| Product name | Constellation: Kids Missions |
| Android package | `com.constellation.app` |
| Release audience | Ages 6–12; Google Play target groups 6–8 and 9–12 |
| Free access | Six flagship missions, one in every curiosity area |
| Family access | All 25 reviewed missions |
| RevenueCat entitlement | `constellation_family` |
| RevenueCat offering | `default` |
| Monthly product | `constellation_family_monthly` — US $7.99, no trial |
| Annual product | `constellation_family_annual` — US $39.99, 14-day trial |
| Store category | Education |
| Ads | No |
| Initial store | Google Play; United States and supported English-language regions |

## Implemented locally

- [x] Twenty-five stable experience IDs and unique living-world signals.
- [x] Seventy-five mission variants: guardian-led 6–7, together 8–9, and increasing-independence 10–12.
- [x] Ages 6–7 require a guardian in both deterministic eligibility and trusted start validation.
- [x] Six reusable code-native instruments; gold appears only after the completed outcome is persisted.
- [x] One active local session, resumable phone-down mode, optional reflection, idempotent completion, learning memory, and deterministic star derivation.
- [x] Six free flagships remain useful if billing is unavailable, cancelled, or expired.
- [x] RevenueCat adapter initializes only after a grown-up enters membership actions, except refresh of a previously approved Family cache.
- [x] No custom RevenueCat user ID, child attributes, child analytics, advertising, camera, microphone, photo picker, or precise-location flow.
- [x] Protected grown-up hub for membership, privacy/local data, and safety/support.
- [x] Child-data deletion removes profile, session, outcomes, reflections, and derived stars while preserving the anonymous store entitlement.
- [x] Static Expo routes at `/privacy`, `/terms`, `/safety`, and `/support`.
- [x] Android package and AAB build profile; advertising-ID permission explicitly blocked.
- [x] Automated catalog, 75-variant, eligibility, evidence sanitization, idempotency, legacy parsing, and deletion-boundary checks.

## External setup required

- [ ] Confirm the EAS project owner and generated `projectId`; never invent or copy one from another app.
- [ ] Add `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` to the EAS `production` environment.
- [ ] Create both subscription products in Google Play Console with the locked IDs and pricing.
- [ ] Configure the annual 14-day trial in Google Play; do not simulate it in app code.
- [ ] Import/attach both products in RevenueCat, attach entitlement `constellation_family`, and publish offering `default`.
- [ ] Publish a RevenueCat Paywall with annual first and configure Customer Center.
- [ ] Deploy the static web export with EAS Hosting; record the production base URL and set `EXPO_PUBLIC_CONSTELLATION_SITE_URL`.
- [ ] Replace draft support/privacy email aliases if those mailboxes are not monitored.
- [ ] Have qualified child-privacy and store-policy reviewers approve the actual policies and Google Play declarations.
- [ ] Complete Google Play app access, target audience, Families, content rating, ads, and Data Safety forms truthfully.
- [ ] Upload a signed production AAB, complete real Play billing lifecycle tests, then publish publicly in eligible regions.
- [ ] Run and document the five-family pilot before production approval.
- [ ] Complete at least one genuine RevenueCat-powered transaction in the publicly available build.

## Release gates

Do not publish when any of these is unresolved:

1. A 6–7 mission can start without a grown-up present.
2. A child can reach pricing, purchase, restore, external links, or Customer Center without the grown-up gate.
3. A mission can turn gold or create a star before persistence succeeds.
4. Child text, safety attempts, guardian confirmations, reflections, or progress appear in RevenueCat, logs, URLs, analytics, or screenshots.
5. Store declarations do not match the inspected production build.
6. A family pilot reveals a safety or comprehension failure.
7. Privacy, support, or terms URLs are inaccessible publicly.

## Known toolchain advisory

`npm audit` still reports an upstream high-severity `image-size` denial-of-service advisory through Metro plus moderate Expo CLI/router transitive advisories. `npm audit fix --force` proposes incompatible Expo downgrades, so it was deliberately not run. These packages process trusted project assets during development/build rather than child input in the shipped experience, but the audit must be rechecked before the production candidate and resolved through an Expo-compatible patch when available.

## Required commands

From `mobile/`:

```bash
npm run typecheck
npm run lint
npm run test:engine
npm run test:persistence
npx expo-doctor
npx expo export --platform web
npx expo export --platform android
eas build --platform android --profile production
```

Store purchase tests must use a Play-installed development/internal/production build. Expo Go or a web preview is not evidence that Google Play billing works.

# Constellation mobile

Constellation is an Expo and React Native app for children ages 6–12 and their grown-ups. Pocket Planet includes Paper Post, a light-and-shadow lesson, simpler creation/planning tools, and a Maker’s Workbench with shape drawing and a paired-gear model. The linked Out There library contains 25 authored real-world missions. Digital finds are separate from child-reported real-world stars. Ages 6–7 are guardian-led; age variants are generated adaptations pending independent review.

Current build status: local prototype. See [release evidence](release/README.md) and [critical audit](../store/shipaton-audit-2026-09-27.md) before making public-release, safety-review, or learning-outcome claims.

The Maker’s Workbench adapts guided→memory→free drawing and assemble→test patterns from a teammate prototype. Its sketches and gear arrangements are session-local, unscored digital practice, not saved finds or gold stars. The open paper prompt works without Family; the full Three-Colour Picture mission is shown only to an already-entitled Family profile and still uses the catalog safety flow.

## Run locally

```bash
npm install
npx expo start
```

Expo Go is useful for ordinary UI work and RevenueCat Preview API mode. Real App Store and Play Store purchases require a development build:

```bash
npx expo start --dev-client
```

The repository includes `eas.json` development, preview APK, and production Android App Bundle profiles. The permanent Android package is `com.constellation.app`; do not change it after Play and RevenueCat products are configured.

## RevenueCat for the Next Gen prototype

The app already contains the SDK, privacy-minimizing adapter, grown-up gate, membership surface, restore, customer center, local entitlement cache, and trusted access enforcement. Store configuration remains external.

For the student prototype, use [RevenueCat Test Store](https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store) to demonstrate the actual SDK flow without a Play Console account. The installed React Native Purchases SDK supports Test Store. Its simulated purchases update `CustomerInfo` and `constellation_family`, but they are **sandbox transactions, not real revenue or Google Play purchases**.

1. In RevenueCat, create a project and a **Test Store** under **Apps & providers → Test configuration**. Copy its public `test_` SDK key.
2. Create entitlement `constellation_family`. In **Product catalog**, create monthly and annual Test Store products, attach both to that entitlement, and add them as the monthly and annual packages of offering `default`. Set `default` as the current offering.
3. Create a restrained guardian-facing Paywall for that offering, with accurate Family benefits, displayed plan terms, close/restore access, privacy/terms links, and no child-directed sales copy. **Publish** the Paywall; a draft is not served to the app. Configure Customer Center if you want to demonstrate management.
4. In the ignored `.env.local`, set `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=test_your_key` (and the iOS variable only if testing iOS). Never commit the file. This is a *debug-build-only* key.
5. Build and run a **debug development client** once with `npx expo run:android`; it may start Metro for you. On later launches use `npx expo start --dev-client`. On this Mac, set `ANDROID_HOME=/Users/kr/Library/Android/sdk` and `JAVA_HOME=/opt/homebrew/opt/openjdk@21` if your shell does not already find the SDK and Java 21. From the app, enter **Grown-ups → Family membership → See family plans**. Expo Go and the web preview do not prove a native transaction.
6. Simulate purchase, cancellation, and failure in Test Store. Verify Family access only after a successful purchase; restart, restore, expiry, and free access afterward. In RevenueCat, enable sandbox data to see the test customer and transaction.

**Do not use a `test_` key in `assembleRelease`, the existing release-mode APK, TestFlight, or a Google Play build.** RevenueCat intentionally rejects Test Store keys in non-debuggable release builds. React Native does not expose the native override. Swap to a platform-specific `goog_`/`appl_` key when you later test actual store billing. See [RevenueCat's Test Store guidance](https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store).

No production purchase, store listing, price, trial or restore is established by this repository alone. `npm run check:release` blocks production builds until attributable reviews and native purchase tests are recorded. Do not bypass it by adding placeholder evidence.

## Later Google Play setup

1. Create the Android app in Google Play Console using `com.constellation.app`.
2. Create the matching Android app in one RevenueCat project.
3. Create entitlement `constellation_family`.
4. Attach `constellation_family_monthly` and `constellation_family_annual` to packages in offering `default`; configure the 14-day trial only on annual.
5. Build and publish a RevenueCat Paywall and configure Customer Center.
6. Copy `.env.example` to `.env.local` and add the platform's **public SDK key**:

```bash
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_...
```

Never put an App Store shared secret, service-account credential, RevenueCat secret key, or private API key in an `EXPO_PUBLIC_` value. The mobile SDK needs only RevenueCat's public platform key.

The app deliberately does not pass a custom RevenueCat App User ID or attributes. RevenueCat receives an anonymous purchase identifier and store purchase history; it does not receive the child's nickname, age band, interests, session context, mission answers, reflections, outcomes, or constellation. Free devices do not initialize RevenueCat at launch. Once a guardian has activated Family on a device, the app may refresh that anonymous entitlement at launch so renewals and expirations remain accurate.

## Sandbox release check

Test both platforms using a development or store build:

- fresh anonymous install and paywall display;
- monthly and annual purchase;
- cancellation without false success;
- entitlement activation and family mission access;
- app restart, offline cache, expiry, and return to free access;
- restore using the same store account on a clean install;
- Customer Center opening and returning;
- network/store failure while the six free flagships remain usable;
- a mission already in progress can still be completed after entitlement expiry.

## Verification

```bash
npm run typecheck
npm run lint
npm run test:engine
npm run test:persistence
npm run test:planet
npm run check:release # deliberately fails until external release evidence exists
npx expo-doctor
npx expo export --platform all --output-dir dist
```

Durable product and engineering decisions live in [`plan.md`](../plan.md), [`architecture.md`](../architecture.md), and [`decision.md`](../decision.md).

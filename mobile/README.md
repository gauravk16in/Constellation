# Constellation mobile

Constellation is an Expo and React Native app that guides children ages 6–12 into safe, reviewed real-world story-missions. The phone is a brief guide; the meaningful action happens away from the screen. Ages 6–7 are guardian-led; 8–9 and 10–12 receive increasingly independent variants.

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

## RevenueCat setup

The app already contains the SDK, privacy-minimizing adapter, grown-up gate, membership surface, restore, customer center, local entitlement cache, and trusted access enforcement. Store configuration remains external.

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
npx expo-doctor
npx expo export --platform all --output-dir dist
```

Durable product and engineering decisions live in [`plan.md`](../plan.md), [`architecture.md`](../architecture.md), and [`decision.md`](../decision.md).

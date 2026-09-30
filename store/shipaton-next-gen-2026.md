# Constellation — Shipaton 2026 Next Gen submission

This is submission copy for the **Next Gen Award**, not evidence of a public app-store launch. The demo video is being prepared separately. Do not claim that subscriptions, child learning, content review, or store release have been independently verified.

## Project title

Constellation — A little world shaped by your big ideas

## One-line description

Constellation lets children play with an idea on a small digital planet, try a related activity in the real world, and keep an honest memory of what they explored.

## Project description

Most children's apps try to keep children on the screen. Constellation asks a different question: what could a child go and do because of the app?

Pocket Planet gives children ages 6–12 a place to manipulate ideas rather than just read activity cards. In Paper Post, they change a bridge shape and test a parcel crossing. In Borrow a Shadow, they move a model light, predict where shade will fall, and test the result. Other open paths invite arranging a three-part story, sorting finds, planning a calm movement sequence, drawing shapes, and exploring number patterns. Children can revisit their digital creations without scores, streaks, rankings, or pressure to keep playing.

An optional **Out There** path connects an idea to a real-world mission. The app checks age, place, companions, materials, and other authored safety conditions before a physical mission can start. It then offers a short phone-down cue. On return, a child can report an observation or reflection. **My Finds** labels digital creations “Made here” and child-reported physical completions “Tried out there.” A gold star marks the latter only after it has been saved. The app does not photograph children, record their voices, verify physical completion, or grade understanding.

The guardian sets local safety boundaries and controls purchases. Constellation's RevenueCat integration is confined to the grown-up area: an anonymous entitlement determines access to Family content; child nicknames, answers, reflections, and progress are not sent as RevenueCat attributes. The repository implements a paywall, restore, Customer Center, and free-versus-Family access policy. **Live store products and a real purchase have not been verified**, so the video and submission must not depict a completed payment or claim revenue.

For this student prototype, the next native test is [RevenueCat Test Store](https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store), which can demonstrate an SDK-backed *sandbox* entitlement without Play publication. If shown in the demo, label it **test purchase**; do not present it as real revenue or a Google Play transaction. The [mobile setup guide](../mobile/README.md) contains the dashboard and debug-build steps.

This is a working student prototype, not a publicly released or independently certified children's product. Its authored 25-mission catalog and three age bands need qualified editorial/safety review and family testing before public launch. The Next Gen entry shows the product idea, playable implementation, engineering choices, and the specific boundaries still to validate.

## What is distinctive

- A playable digital experiment can lead to a related physical activity without making either mode compulsory.
- Revisions change a bridge, shadow, story, or plan instead of awarding points for tapping.
- Digital finds and child-reported real-world stars remain visibly distinct.
- The recommendation engine applies deterministic safety eligibility before ranking; a missing safe match is not bypassed.
- The app stores child setup and progress locally, has no child analytics or advertising, and keeps purchasing behind a grown-up gate.

## Technical implementation

Expo, React Native, TypeScript, Expo Router, local SQLite on Android/iOS, web storage in the web preview, authored mission catalog, pure game reducers, and RevenueCat's React Native SDK. See the [README](../README.md), [architecture](../architecture.md), and [release evidence boundary](../mobile/release/README.md).

## How judges can inspect it

1. Open the public repository: <https://github.com/gauravk16in/Constellation>.
2. Follow the root README: `cd mobile`, `npm ci`, `npx expo start --web` for a quick preview. Native device testing needs an Expo development build; RevenueCat purchases require real store configuration and are not demonstrated as completed.
3. Watch the separate public video for the intended on-device interaction and physical handoff.
4. Inspect `mobile/src/features/planet/`, `mobile/src/features/missions/`, `mobile/src/data/catalog/`, `mobile/src/features/entitlements/`, and the tests in `mobile/scripts/`.

## Submission fields and assets

- **Award:** Next Gen Award only. Confirm active enrollment and a qualifying student/academic email on Devpost. A minor entrant also needs the consent required by the official rules.
- **Public open-source repository:** <https://github.com/gauravk16in/Constellation> — verify the pushed commit, root license, assets, and README before submission.
- **Public video under two minutes:** add the YouTube or Vimeo URL after recording. Show the actual app functioning on a device; do not show an unverified purchase.
- **App icon, 1024×1024:** [`mobile/assets/images/icon.png`](../mobile/assets/images/icon.png).
- **Unframed app screenshot, 1179×2556:** [`store/next-gen-planet-1179x2556.png`](next-gen-planet-1179x2556.png), captured from the local Android release-mode build after guardian setup. It shows Little Landing; it is not a composited mockup.
- **Store URL and judge trial/promo code:** not required for Next Gen.
- **Deadline:** September 30, 2026, 11:45 p.m. PDT (October 1, 2026, 12:15 p.m. India time). Submit the completed Devpost form, not just a saved draft.

Official requirements: <https://revenuecat-shipaton-2026.devpost.com/rules>.

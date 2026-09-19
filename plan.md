# Constellation MVP Plan

## One-line goal

Ship a trustworthy Expo mobile MVP that gives an 8–12-year-old and their guardian a small number of safe, context-aware real-world experiences, helps them leave the screen, and lights a meaningful star when they return.

## Product promise

Constellation should make this sequence real:

> Explore → try things → discover interests → develop skills → understand yourself → imagine who you might become.

The MVP proves the first three links. It does not claim to understand a child’s identity or future after a few activities.

## Current state

### Known

- The workspace contains generated HTML and PNG design prototypes but no runnable application manifest at the repository root.
- Several prototypes contain unrelated potty-training and generic parenting content. `AGENTS.md` excludes that material from the product.
- Constellation-specific prototype ideas include activity categories, real-world prompts, a five-panel comic activity, and a completion flow.
- The intended stack is Expo and React Native.
- The project is intended for a YC Summer 2027 application after an MVP and family testing.
- The project is also intended for RevenueCat Shipathon 2026.

### External submission constraint

Shipaton closes **September 30, 2026 at 11:45 PM PDT**. The app must be first publicly released between August 1 and September 30, be publicly downloadable in the United States, and use the RevenueCat SDK for at least one purchase. Submission assets include a public demo video under two minutes, store URL, 1024px icon, 1179×2556 screenshot without a device frame, and a free trial or judge access. Source: [RevenueCat Shipaton 2026 rules](https://revenuecat-shipaton-2026.devpost.com/rules).

### Provisional defaults

- First public cohort: children ages 6–12 in three authored bands: 6–7, 8–9, and 10–12. Ages 6–7 are guardian-led throughout.
- Initial persistence: on-device, with no required family account or cloud sync.
- Initial catalog: 25 reviewed experiences across 6 constellation domains: five in Nature & Noticing and four in every other area.
- Initial recommendation set: at most 3 options at a time.
- Initial monetization: guardian-facing family subscription; children never see purchase pressure or locked activity cards.
- Initial public release target: Android in the United States and supported English-language regions. iOS remains a later release from the same Expo codebase.

Each default is reversible and must be validated with family testing.

### Implemented main-experience foundation — August 25, 2026

- Guardian setup now ends after Allowed Places and commits the full draft atomically to on-device SQLite.
- A truthful “Getting your Constellation ready” transition replaces setup with the child-facing app; completed setup cannot be reopened with Back.
- The child-facing shell has three calm tabs: Home, Curiosity, and Constellation. Progress is part of Constellation rather than a separate Stats tab.
- Home collects ephemeral time, place, companion, and broad-material context and shows at most three deterministic, explainable recommendations.
- Curiosity exposes all six areas through one typed, data-driven area route. Chosen interests affect ordering, never access.
- The bundled catalog contains 25 reviewed, versioned experiences—five in Nature & Noticing and four in every other area—with a publishing gate and deterministic eligibility tests.
- Every published activity now has an authored interactive mission built from accessible selection, ordering, prompt, marker, counter, comparison, slot-input, arrangement, or risk-based safety-sequence primitives.
- The mission loop persists one active mission per child through preparation, a concise safety check, phone-down real-world mode, pause or return, optional reflection, and atomic completion.
- Six activities require an explicit grown-up handoff from trusted catalog configuration; eligibility is rechecked immediately before launch and cannot be weakened by the UI.
- Rose Signal is the first complete story-mission pilot: it restores a code-native Nature Compass only after a two-clue safety interaction, grown-up-accompanied observation, two local discovery answers, optional reflection, and atomic completion.
- Rose Signal, Build a Paper Bridge, Three-Object Story, Shadow Tracing, Build a Cold Snack, and Floor-Line Balance now form the first six living-world flagships. They share one story-to-real-world learning spine while using six distinct, non-character instruments and different forms of play.
- Completed flagships derive at most three reviewed learning-evidence statements from trusted mission rules. Raw child text, safety attempts, preparation state, and guardian confirmation are discarded with the completed session.
- A completed star now remembers the mission date, truthful learning evidence, and optional reflection. It never claims mastery, a grade, or a developmental assessment.
- The Constellation screen derives stable gold-star positions only from completed local outcomes, reveals the experience behind each star, and has a non-pressuring first-run state.
- All 25 missions now use the living-world story spine and resolve to three age-authored presentation variants. The six original flagships remain the free proof set.
- RevenueCat is integrated behind a grown-up arithmetic gate. The free tier contains the six flagships and all six curiosity areas; Family unlocks the complete reviewed 25-mission catalog.
- RevenueCat initializes first after a grown-up chooses a purchase, restore, or management action. A device that already holds a guardian-approved Family cache may refresh that anonymous entitlement at launch so renewals and expirations stay correct. RevenueCat never receives the child profile, context, mission answers, reflections, outcomes, or constellation.
- A sanitized entitlement snapshot is cached locally and enforced again in the recommendation engine and trusted mission-start layer. A mission already in progress may still be completed if an entitlement later expires.
- Live store validation remains blocked on the final bundle identifiers, RevenueCat public platform keys, App Store/Play products, and sandbox accounts.

## Why families download, return, and pay

### Download promise

> One good real-world thing to do together today—chosen for the time, place, people, and materials you actually have.

Constellation is not sold as another library of children's content. Its first value is removing the parent's effort of finding a safe, age-suitable activity that works *right now*. The child's reward is agency, a memorable story-mission, and a personal constellation made from things they genuinely did.

### Free-to-family model

| Free Constellation | Constellation Family |
|---|---|
| Six complete flagship missions, one per curiosity area | All 25 reviewed missions |
| Every curiosity area remains open | The same six open areas with greater variety |
| Constellation and learning memories | The same constellation and learning memories |
| No ads or child-facing upgrade prompts | No ads or child-facing upgrade prompts |

The subscription sells trusted breadth and continuing reviewed missions, not relief from artificial frustration. The app never labels child-facing activities as locked. When a free family asks for ideas, ranking uses the six complete flagships; the guardian surface explains the larger library separately.

RevenueCat owns localized pricing and renewal terms through its remote paywall. The locked launch configuration is entitlement `constellation_family`, offering `default`, products `constellation_family_monthly` and `constellation_family_annual`, **$7.99/month** with no trial, and **$39.99/year** with a **14-day annual trial**. Prices and trial terms live in Google Play and RevenueCat, never hard-coded into child-facing UI.

### Growth loop

1. **Acquire:** show one concrete mission transformation in 20–40 seconds—problem, phone-down action, discovery, lit star—rather than a tour of app screens.
2. **Activate:** setup completed → first flagship started in the first visit → first star lit within 24 hours.
3. **Retain:** the family returns two or three times a week because Constellation answers “what could we do now?” with a small relevant set, not a feed.
4. **Build trust:** star details remember what was predicted, observed, retold, practised, or decided safely without claiming mastery or collecting surveillance evidence.
5. **Convert:** after the guardian has seen a real completed mission, the grown-up area can explain the full catalog. Children never deliver the sales message.
6. **Learn publicly:** publish two or three #Shipaton build notes each week about decisions, failures, and family feedback without names, faces, recordings, raw child text, or identifiable family details.

Initial acquisition should concentrate on 5–20 consented pilot families plus parent, homeschool, nature-play, science-learning, and family-activity communities. The founder story is unusually clear: most technology competes for children's attention; Constellation competes for their curiosity.

### Metrics that match the mission

- download → completed guardian setup;
- setup → first mission start;
- mission start → safe completion or intentional pause;
- first star → guardian return within 7 days;
- grown-up membership view → trial start;
- trial → paid and paid renewal;
- eligible recommendation rate and “no result” rate.

Do not optimize child screen minutes, streaks, push-notification opens, raw answer collection, or mission volume. For the first pilot, use aggregate store and RevenueCat purchase metrics plus consented interviews rather than adding a child analytics SDK.

## Shipaton 2026 winning plan

Constellation should deliberately compete for three judged prizes while remaining eligible for the Grand Prize:

- **Peace Prize:** the social outcome is the core product—technology prompts safe learning, relationships, movement, creativity, and outdoor observation away from the screen.
- **Design Award:** demonstrate the six unresolved-to-restored instruments, phone-down mode, accessible interactions, and gold-after-persistence rule.
- **HAMM Award:** demonstrate a thoughtful family package, remote localized paywall, clear trial and renewal language, restore and customer center, and a useful free product without child pressure.
- **Grand Prize:** publish as early as quality allows because real RevenueCat revenue creates the shortlist; then show activation, trial, revenue, retention, and concrete family-learning evidence.

### Release calendar

- **August 30–September 3:** create store apps and RevenueCat project; lock immutable bundle/package identifiers; configure entitlement, monthly/annual products, current offering, paywall, customer center, and sandbox accounts.
- **September 4–7:** run Android development builds; complete Play purchase, cancel, expiry, refund, restore, offline, and reinstall tests.
- **September 5–10:** test the complete first-star and purchase journey with at least five families; fix safety, comprehension, accessibility, and payment blockers.
- **By September 15:** submit the first Google Play production candidate, leaving review and rejection buffer. Public release should happen immediately after approval rather than waiting for the deadline.
- **September 11–23:** improve activation and retention from real evidence; continue #Shipaton build-in-public posts; capture only consented, non-identifying demo material.
- **September 24–27:** record the under-two-minute public demo; finalize store link, icon, required screenshot, privacy disclosures, support page, and judge trial/access.
- **September 28–29:** run the exact installed store build, purchase, restore, and submission links on clean devices; submit before the final day.

## MVP success criteria

The MVP is successful when all of the following are observable:

1. A guardian can set up one child profile without creating a cloud account.
2. The guardian can choose an age band, broad interests, accessibility needs, and allowed experience contexts.
3. The app can obtain or accept time, weather, available duration, companion, and indoor/outdoor context without requiring precise location.
4. The eligibility layer removes experiences that conflict with age, context, materials, accessibility, or safety rules.
5. The app presents no more than 3 strong recommendations and can explain the main reason for each.
6. A child can open an experience, understand preparation and safety information, and deliberately enter a low-screen “go do it” state.
7. A child can return, mark the experience complete or skipped, add one brief reflection, and light a star.
8. The constellation view shows exploration across domains without rankings, public comparison, streak pressure, or generic XP.
9. Core discovery and completion continue to work offline with the bundled catalog.
10. Purchases are managed only in the guardian surface through RevenueCat.
11. The app passes TypeScript, Expo diagnostics, accessibility checks, and device-size visual review.
12. At least 5 families can complete the core loop and provide structured feedback before the YC application is prepared.

## MVP scope

### Included

- Shared welcome screen and guardian handoff.
- Guardian setup and local consent record.
- One or more local child profiles, with one profile free for the public MVP.
- Age-band, interest, accessibility, and household-context setup.
- Reviewed local experience catalog with structured metadata.
- Deterministic safety and context eligibility.
- Explainable ranking of eligible experiences.
- Three-option recommendation surface.
- Experience preparation and safety screen.
- Low-screen launch state with optional timer.
- Complete, skip, and brief reflection outcomes.
- Personal constellation visualization by exploration domain.
- Guardian settings, data reset/export explanation, and purchases.
- RevenueCat entitlement integration for a family subscription.
- Offline behavior, basic diagnostics, crash reporting with child-safe data boundaries, and submission assets.

### Explicitly out of scope

- Open-ended child-to-AI chat.
- User-generated public content, messaging, friends, leaderboards, or social comparison.
- Photo, microphone, contacts, or precise-location collection.
- School dashboards, assignments, grades, or curriculum alignment.
- A marketplace for creators.
- Fully autonomous AI-generated experiences.
- Psychological profiling or predictions about a child’s personality or career.
- Advertising in the child experience.
- A catalog intended to serve every age from early childhood through late teens in one release.
- Cloud accounts, cross-device sync, and web dashboards unless local beta evidence makes them necessary.

## Core user flow

### Guardian setup

1. Open Constellation.
2. Understand that the app helps a child do things away from the screen.
3. Continue together with a guardian.
4. Review plain-language privacy and safety boundaries.
5. Create a local child profile using a nickname and age band.
6. Select interests, support preferences, and allowed places.
7. Save the complete setup locally, then enter Home through the getting-ready transition.

### Child discovery

1. Open the child profile.
2. Confirm available time, who is present, and indoor/outdoor preference.
3. Receive up to 3 eligible experiences.
4. See why each fits now: for example, “20 minutes, indoors, with Dad.”
5. Open one mission and personalize its authored interaction.
6. Review preparation and safety, then deliberately begin.

### Real-world action

1. The app shows one memorable cue; complex missions may offer optional steps, prompts, a counter, or a gentle timer.
2. The child completes the activity away from the screen.
3. The app does not send engagement notifications during the experience.

### Return and progress

1. Mark complete, finish later, or stop the mission without penalty.
2. Optionally choose one short reflection such as “I noticed something new,” “I’d try this again,” or “Not for me today.”
3. Light a star in the relevant constellation domain.
4. Return to a calm home screen rather than an autoplaying next activity.

## Experience catalog slice

The first 25 experiences are distributed across:

- Nature & observation
- Creativity & making
- Communication & relationships
- Science & investigation
- Practical skills & contribution
- Courage & movement

Nature & Noticing contains 5 experiences after the Rose Signal pilot; each other domain contains 4. Every experience receives a manual safety review before it can be marked `published`.

Example MVP experiences include:

- Backyard Sound Map
- Leaf Detective
- Cloud Story
- Three-Object Story
- Family Interview
- Five-Panel Comic
- Shadow Tracing
- Recycled Sculpture
- Kitchen Measurement Hunt
- Build a Paper Bridge
- Teach Someone One Small Skill
- Neighbourhood Shape Walk

These examples are seeds, not automatically approved catalog entries.

## Quality bars

### Child trust and safety

- Unsafe or ineligible experiences are removed before ranking.
- Missing context produces conservative eligibility, not optimistic guesses.
- Every activity has a no-penalty skip path.
- Safety copy states what to do, who should help, and when to stop.
- No child profile information appears in analytics payloads, logs, screenshots, or crash breadcrumbs.

### Product coherence

- Every first-session screen explains or advances real-world action.
- The app never resembles a generic parenting chatbot, education worksheet feed, or mobile game economy.
- The constellation metaphor appears in the core loop and progress model, not only in branding.
- The child is addressed as capable; the guardian is addressed as responsible.

### Design and accessibility

- Interactive targets are at least 44×44 pt.
- Dynamic type, screen readers, high contrast, reduced motion, and small phone layouts are supported.
- Body copy maintains readable contrast and does not rely on pale gray text.
- Screen structure remains clear without color or animation.
- Important screens use one memorable Constellation-specific visual move rather than decorative clutter.

### Engineering

- TypeScript strict mode remains enabled.
- Routes contain route concerns only; screen bodies, components, domain logic, and persistence remain separated.
- Business and safety rules have deterministic tests.
- The app starts in Expo Go unless a later dependency requires a development client.
- New dependencies are version-compatible with the installed Expo SDK and are justified by the current slice.

## Implementation phases

- [x] Phase 1: Establish the walking skeleton and first onboarding screen

      Done when: the Expo project launches in Expo Go and web, `/` renders the approved first Constellation onboarding screen, TypeScript passes, and rendered visual QA has no P0–P2 findings.

      Steps:
      - Scaffold the Expo Router TypeScript app in an isolated application directory.
      - Create the root stack, theme tokens, text primitive, action button, and onboarding screen body.
      - Implement the shared welcome screen with a guardian-together CTA and Constellation-specific visual identity.
      - Add accessibility labels, large-text resilience, small/large phone checks, and basic route tests.

- [ ] Phase 2: Build guardian onboarding and local child profile setup

      Done when: a guardian can complete setup, restart the app, and see the same local profile without transmitting data.

      Steps:
      - Add privacy and safety boundary screens.
      - Add nickname, age band, interests, accessibility, and household-context inputs.
      - Persist setup locally with a versioned schema.
      - Add edit, reset, validation, empty, and recovery states.

- [x] Phase 3: Define and seed the Experience Engine catalog

      Done when: 25 reviewed fixture experiences validate against one schema and unsafe combinations are rejected by tests.

      Steps:
      - Define experience, constraint, adaptation, and review-status types.
      - Create catalog validation and publishing gates.
      - Write 25 reviewed seed experiences with provenance and safety metadata.
      - Add deterministic eligibility tests for age, time, weather, setting, materials, companion, and accessibility.

- [x] Phase 4: Implement context collection and explainable recommendations

      Done when: the same profile receives different, explainable eligible results as context changes, with no more than 3 visible options.

      Steps:
      - Collect available time, companion, and indoor/outdoor preference manually.
      - Treat weather as unknown until a later guardian-approved coarse-weather adapter exists.
      - Run eligibility before ranking.
      - Rank by context fit, novelty, interests, and skill progression.
      - Surface short human-readable fit reasons.

- [x] Phase 5: Build experience preparation and low-screen launch

      Done when: a child can select an experience, understand requirements and safety, start it, and leave the phone without further interaction.

      Steps:
      - Compose all 25 published experiences from authored interaction definitions.
      - Revalidate eligibility and show guardian confirmation only where configured by reviewed mission data.
      - Add phone-down launch mode with timestamp-derived optional guidance and timers.
      - Prevent autoplay, pressure, automatic failure, or immediate next-experience prompts.

- [x] Phase 6: Add completion, skipping, reflection, and progress state

      Done when: each outcome is persisted correctly and skipping never reduces a score or streak.

      Steps:
      - Persist one active or paused mission separately from terminal completed and skipped outcomes.
      - Add low-friction optional one-tap reflection choices without collecting evidence.
      - Atomically create the completed outcome and derived constellation star while clearing the active mission.
      - Recover interrupted missions and prioritize their resumption on Home.

- [x] Phase 7: Build the personal constellation

      Done when: completed experiences light distinct stars across domains and two different histories produce visibly different constellations without comparative scoring.

      Steps:
      - Define deterministic star placement and domain paths.
      - Render an accessible constellation summary plus visual map.
      - Add star details showing the real-world experience behind each star.
      - Support reduced motion and nonvisual navigation.

- [ ] Phase 8: Add guardian controls and ethical RevenueCat monetization

      Status: code integration and child-safe entitlement enforcement are complete; App Store/Play configuration and sandbox purchase validation remain.

      Done when: a guardian can view offerings, purchase, restore, and manage entitlement while the child surface contains no paywall pressure.

      Steps:
      - Define free and family-entitlement boundaries around guardian value.
      - Integrate RevenueCat using environment-based configuration.
      - Build guardian-only paywall, restore, loading, cancellation-information, and failure states.
      - Verify sandbox purchase flows on both platforms.

- [ ] Phase 9: Harden privacy, accessibility, offline behavior, and observability

      Done when: the app’s core loop works offline, accessibility checks pass, and diagnostics contain no child-identifying data.

      Steps:
      - Add offline and stale-weather behavior.
      - Run screen-reader, large-text, contrast, touch-target, and reduced-motion reviews.
      - Add minimal child-safe crash and product-event instrumentation.
      - Add local data reset and plain-language data explanation.

- [ ] Phase 10: Test with families and prepare public release

      Done when: at least 5 families complete the core loop, high-severity findings are resolved, and a store-ready build plus Shipathon materials exist.

      Steps:
      - Run consented family sessions and record observable outcomes, not private child content.
      - Revise confusing, unsafe, overly young, or overly screen-heavy interactions.
      - Prepare icon, screenshots, privacy disclosures, store listing, and first-two-minute demo.
      - Validate RevenueCat integration, bundle identifiers, store access, and required submission fields.

## Risks and adaptations

| Risk | Adaptation |
|---|---|
| The app becomes an activity feed | Cap recommendations at 3 and end sessions after a deliberate choice. |
| AI generates unsafe or incoherent activities | Use a reviewed catalog, deterministic eligibility, bounded adaptation, and a non-AI fallback. |
| One visual style cannot serve ages 8–17 | Test one cohort first and keep content presentation variants separate from catalog meaning. |
| Guardian setup creates too much friction | Keep data local, ask only for context that immediately improves safety or relevance, and defer accounts. |
| Monetization pressures children | Place offerings, locks, and purchase recovery only in the guardian surface. |
| Precise location creates privacy risk | Prefer manual context and coarse weather; do not collect precise location in the MVP. |
| The constellation becomes cosmetic XP | Connect every star to a completed experience and describe exploration, never rank or score the child. |
| Shipathon schedule encourages overbuilding | Protect the core loop; cut catalog breadth, cloud sync, and AI before cutting safety, accessibility, or completion quality. |
| Generated prototypes contaminate the product | Use `AGENTS.md` source hygiene and prohibit legacy parenting/potty language in delivered surfaces. |

## Validation questions for family testing

- Can the child use the visual plan from Paper Bridge, Three-Object Story, or Window Nature Log after putting the phone down?
- Does the child understand that “I couldn’t tell yet” is a valid observation rather than a failed mission?

- Can the child explain what Constellation is after the welcome screen?
- Can the guardian explain what information stays on the device?
- Does the child choose an experience in under 2 minutes without scrolling through a long feed?
- Does the child leave the phone voluntarily after tapping start?
- Can the child complete or skip without confusion or shame?
- Does the star feel connected to what the child actually did?
- Does the tone feel capable rather than babyish?
- Would the guardian trust another experience recommendation tomorrow?

## Stop rules

Pause feature expansion when any of these occur:

- A safety constraint cannot be represented deterministically.
- The app requires more child data than the feature benefit justifies.
- The core loop cannot be completed offline.
- Family testers interpret the app as a game, chatbot, homework tool, or parenting tracker.
- The first session takes longer than the real-world experience it recommends.
- A new feature improves time-in-app but not real-world action.

The MVP should remain small enough that its central promise is obvious in the first 30 seconds.

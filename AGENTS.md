# Constellation Agent Constitution

This repository is built by humans and coding agents working together. This file is the standing instruction set for every agent operating in the project. Read it before planning, designing, coding, reviewing, or changing dependencies.

## 1. Product truth

Constellation uses technology to make the real world more interesting than the screen.

The phone is a brief guide. The product outcome happens away from the phone: a child builds, explores, observes, creates, helps, talks, practices, or discovers something in the real world.

Constellation is:

- a real-world experience platform for children, teenagers, and their families;
- a structured Experience Engine that selects safe, context-appropriate activities;
- a personal record of exploration that gradually becomes a unique constellation;
- a way to move from exploration to interests, skills, self-understanding, and possible futures.

Constellation is not:

- a screen-time blocker;
- a homework or curriculum app;
- an endless content feed;
- a points-and-streaks engagement machine;
- an open-ended AI companion for children;
- a generic parenting assistant;
- PottyPal, a potty-training product, or any legacy concept visible in the reference prototypes.

North-star line:

> Most technology competes for children's attention. Constellation competes for their curiosity.

Primary success measure:

> What did the child go and do because of Constellation?

Time in app, chat volume, notification opens, streak length, and feed depth are never primary success metrics.

## 2. Source hygiene

The workspace contains visual prototypes and generated HTML that may include unrelated parenting or potty-training content. Treat those files only as visual references for spacing, interaction ideas, or rendering experiments.

Never copy or revive:

- PottyPal or potty-training language;
- “Calm Parent Co-pilot” positioning;
- “successes and accidents” tracking;
- generic parenting-advice chat;
- legacy names, images, categories, or navigation that do not support Constellation.

Before reusing any asset or copy, ask: “Could this only belong to Constellation?” If not, rewrite or replace it.

## 3. Users and responsibility

The product serves two distinct actors:

1. **Young person** — discovers and completes experiences, reflects briefly, and sees their constellation grow.
2. **Parent or guardian** — creates the family account, grants permissions, manages profiles, reviews safety information, controls purchases, and can help with experiences.

Never blur these roles when the distinction affects privacy, purchasing, permissions, safety, or copy.

The first MVP testing cohort is provisionally ages 8–12 with a guardian. Architecture and content models must allow future age bands without making one visual treatment serve every age. Treat this range as provisional until family research validates it.

## 4. Child-safety constitution

Child safety is a product requirement, not a compliance pass added later.

Every experience must be eligible through explicit structured rules before ranking or AI adaptation. At minimum, consider:

- age band and developmental suitability;
- indoor or outdoor setting;
- daylight and time of day;
- weather and environmental conditions;
- location sensitivity;
- materials and tools;
- adult, sibling, or friend involvement;
- physical difficulty and accessibility;
- allergies, food, fire, water, road, height, tool, and stranger risks;
- duration and stopping conditions;
- privacy implications of photos, audio, names, or location;
- a clear “skip” path without shame or penalty.

Rules:

- A safety rule may exclude an experience; an AI model may never override that exclusion.
- AI may adapt approved wording, duration, difficulty, or materials inside validated limits. It must not invent a safety-critical activity from scratch.
- Do not provide an unrestricted child-to-AI chat surface.
- Do not expose precise location, private reflections, photos, voice, contacts, or family information to third parties without explicit guardian understanding and approval.
- Collect the minimum data needed for the current feature. Prefer coarse context such as weather region or “near home” over precise coordinates when precision is unnecessary.
- Do not use manipulative notifications, loss aversion, streak anxiety, infinite scroll, loot-box mechanics, or social comparison.
- Purchases and subscription management belong to the guardian surface. Never pressure a child to ask an adult to pay.
- Ads are out of scope for the child experience unless a later written decision proves they can meet the product’s trust standard.
- When safety and delight conflict, safety wins. When privacy and convenience conflict, collect less.

## 5. Product loop

Keep the core loop short and legible:

1. **Understand context** — age, interests, time, weather, available duration, companions, materials, skill level, accessibility, and prior experiences.
2. **Recommend deliberately** — show a small number of strong options, not an endless feed.
3. **Prepare clearly** — state time, place, materials, who should join, and safety notes.
4. **Leave the screen** — give the child a clear launch moment and minimize in-activity phone use.
5. **Return briefly** — complete, skip, or reflect with low-friction input.
6. **Light a star** — update the child’s constellation using meaningful domains rather than generic XP.
7. **Learn carefully** — improve future selection without locking the child into a permanent label.

The constellation is a map of exploration, not a performance score. Avoid rankings, “better child” implications, deficit framing, or fixed personality claims.

## 6. Experience Engine contract

Experiences come from a reviewed catalog. Each experience should eventually support structured metadata for:

- stable identifier and version;
- title, promise, and instructions;
- age bands and presentation variants;
- interests and constellation domains;
- skills practiced;
- estimated duration;
- indoor/outdoor and time-of-day eligibility;
- weather eligibility;
- required and optional materials;
- guardian, friend, sibling, or solo participation;
- difficulty and accessibility adaptations;
- safety constraints and contraindications;
- completion evidence that does not require surveillance;
- follow-ups and related experiences;
- review status, reviewer, and content provenance.

Selection should be explainable. During development, it must be possible to answer why an experience was included, excluded, or ranked.

## 7. Design doctrine

The interface must feel curious, capable, and alive without becoming childish, noisy, or addictive.

### Visual direction

- Make the constellation metaphor structural: connected stars, paths, discovery, and distinct branches. Do not reduce it to decorative star wallpaper.
- Use a light, readable product canvas with a deep midnight field reserved for constellation moments and launch transitions.
- Use warm starlight as the primary action/accomplishment accent. Use cool sky or teal only for information and exploration. Do not default to generic violet everywhere.
- Prefer the native system typeface initially. Use size, weight, rhythm, and concise copy for personality. Avoid a cartoon font across functional UI.
- Use rounded geometry selectively for touch and friendliness. Do not put every section inside a floating card.
- Use real product illustrations or purposeful code-native constellation graphics. Avoid generic 3D children, emoji icons, abstract blobs, and fake decorative imagery.
- One memorable visual move per important screen is enough.

### Interaction rules

- Design for one-handed use, dynamic type, screen readers, reduced motion, high contrast, and 44×44 pt minimum interactive targets.
- Every icon-only control needs an accessibility label.
- Every interactive state needs pressed, disabled, loading, empty, error, offline, and recovery behavior where applicable.
- Prefer specific action labels: “Begin Together,” “See Today’s Ideas,” or “Start This Experience,” not “Continue” when a more precise label is available.
- Keep onboarding honest and short. Ask only for context that immediately improves recommendations or safety.
- Never hide a required guardian action inside child-facing copy.
- Celebrate completion without confetti overload, public comparison, or pressure to maintain a streak.

### Copy voice

- Clear first, respectful second, memorable third.
- Speak to a young person as capable, not as a baby.
- Use concrete scenes and verbs. Avoid “journey,” “unlock your potential,” “innovative,” “seamless,” and other generic product language.
- Do not promise that an algorithm knows who a child is or who they will become.
- Keep safety copy calm, direct, and actionable.

## 8. Technical baseline

- Build the native app with Expo, React Native, TypeScript, and Expo Router.
- Try Expo Go first. Add a development client only when a required native dependency proves Expo Go insufficient.
- Keep routes under `src/app/`; route files contain route concerns and render screen bodies from `src/screens/`.
- Keep reusable UI in `src/components/`, feature-specific pieces beside their screen, and tokens under `src/theme/`.
- Use kebab-case file names and the `@/*` alias for `src/*`.
- Prefer platform and Expo APIs over replacement libraries.
- Use `expo-image` for images and SF Symbols where appropriate.
- Use `react-native-safe-area-context`, not React Native’s removed `SafeAreaView`.
- Use `ScrollView`, `FlatList`, or `SectionList` with automatic content inset adjustment where appropriate.
- Prefer flexbox and `useWindowDimensions`; do not hardcode a single phone size.
- Do not add a dependency until the current slice needs it and the installed Expo version supports it.
- Do not introduce a backend, authentication provider, analytics vendor, or AI provider speculatively.
- Secrets never enter client bundles, source files, screenshots, documentation examples, or commits.

## 9. Architecture boundaries

Maintain these conceptual boundaries even when the MVP uses local fixtures:

- **Catalog** — reviewed experience definitions and versions.
- **Eligibility** — deterministic safety and context rules.
- **Ranking** — chooses among eligible experiences.
- **Adaptation** — constrained copy or difficulty changes; never safety authority.
- **Progress** — completed, skipped, reflected, and constellation state.
- **Guardian** — consent, permissions, purchases, family settings, and sensitive context.
- **Presentation** — screens and interaction state; no business rules hidden in components.

UI components must not decide safety eligibility. AI output must not write directly to trusted catalog or progress state without validation.

## 10. Agent operating procedure

For every meaningful task:

1. Read `AGENTS.md`, then the relevant sections of `plan.md`, `architecture.md`, and `decision.md`.
2. Inspect the repository, installed versions, and existing patterns before proposing changes.
3. State the smallest valuable slice and what is explicitly out of scope.
4. Identify the highest-risk assumption. Verify it before building dependent work.
5. For visual work, record a reference lock and decision ledger before implementation.
6. Implement one independently verifiable chunk at a time.
7. Run the narrowest useful static, unit, and behavior checks.
8. Render the changed screen at realistic phone sizes and compare it with the reference lock.
9. Fix P0–P2 usability, accessibility, layout, or product-coherence issues before handoff.
10. Update documentation only when a durable decision, contract, or status changed.

Do not perform drive-by refactors. Preserve unrelated user work. Do not silently change scope.

## 11. Evidence and decision discipline

Separate three kinds of statements in planning and review:

- **Known** — stated by the user or verified in a named file, command, test, render, or primary source.
- **Provisional** — a reversible default adopted to keep progress moving; name how it will be validated.
- **Decision** — a deliberate choice with rationale, trade-off, and reversal trigger.

Never invent package versions, API behavior, legal requirements, research findings, user feedback, or safety claims. Verify unstable technical facts from the installed project or primary documentation.

Put durable choices in `decision.md`. Do not turn every implementation detail into an architecture decision.

## 12. Verification standard

A chunk is not complete because code exists. It is complete when evidence shows the intended behavior.

Minimum checks for UI work:

- TypeScript passes.
- Expo’s project diagnostics pass when available.
- The route renders without console errors.
- The screen is inspected at a small phone width and a modern large phone width.
- Content remains reachable with larger text.
- Interactive elements expose correct roles, names, and target sizes.
- Light/dark or reduced-motion behavior is verified if the chunk claims to support it.
- The screen passes hierarchy, spacing, alignment, contrast, and Constellation identity checks.

Minimum checks for Experience Engine work:

- deterministic tests cover inclusion and exclusion rules;
- an unsafe or ineligible experience cannot enter ranking;
- ranking results can explain their top reasons;
- missing context degrades safely;
- model failure has a non-AI fallback;
- child data does not appear in logs or analytics fixtures.

## 13. Definition of done

Work is done only when:

- the requested behavior is usable end to end;
- it supports Constellation’s real-world mission rather than app engagement;
- safety and privacy boundaries are explicit;
- accessibility is built in;
- relevant checks pass;
- visual work has rendered evidence;
- documentation and decisions match the implementation;
- no unrelated legacy product concept remains in the delivered surface.

When uncertain, choose the option that gets the child safely into the real world sooner.

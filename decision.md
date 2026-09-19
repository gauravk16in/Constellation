# Constellation Decision Log and Build Chunks

This file records durable product and engineering choices. It also divides the MVP into independently verifiable chunks. Update a decision only when new evidence changes its trade-off; do not rewrite history silently.

## Status vocabulary

- **Accepted** — governs implementation now.
- **Provisional** — safe default chosen to move forward; requires named validation.
- **Superseded** — replaced by a later decision with a link or identifier.
- **Rejected** — considered and intentionally not used.

## Evidence used for the initial decisions

### Product evidence

- The user’s Constellation brief: technology should make the real world more interesting than the screen.
- The user’s core progression: explore → try → discover interests → develop skills → understand yourself → possible futures.
- The user’s Experience Engine concept: reviewed activities with structured age, duration, setting, weather, materials, participation, difficulty, skills, safety, and follow-up metadata.
- Existing Constellation-specific renders: calm spacing, large controls, tangible activity names, and guided creative steps.
- Existing unrelated renders: evidence that generated references can contaminate the product when copied without source hygiene.

### Craft and platform evidence

- Expo project structure guidance: isolate a new Router app, keep `src/app` routes-only, and place shared UI, screens, domain logic, and theme tokens beside it.
- Expo native UI guidance: native type and semantics, automatic insets, responsive layout, continuous corners, correct touch behavior, and Expo Go first.
- Expo design-system guidance: one token source, reusable components only after real reuse, and visual QA through hierarchy, spacing, repetition, and alignment.
- Refero bundled craft guidance: research before design, preserve reference roles, avoid cards everywhere, avoid generic violet, preserve a meaningful media role, use specific copy, and validate the rendered result.

Live Refero search was unavailable when these initial choices were made. The existing renders plus bundled craft guidance form the reference set for the first screen. A later design-research pass may supersede the visual direction after family feedback.

## Design brief

Designing the first shared Constellation onboarding screen for children ages 8–12 and their guardians on iOS and Android.

- **Goal:** explain in seconds that Constellation suggests safe real-world experiences and is meant to help the child leave the screen.
- **Tone:** curious, capable, trustworthy, and slightly wondrous; never babyish or hyper-stimulating.
- **Main objection:** a guardian may fear another addictive or unsafe AI app, while a child may fear another homework tool.
- **Must remember:** the constellation is built from things the child actually does.
- **Constraints:** no legacy parenting/potty content, no open AI chat, accessible type and touch, one codebase, Expo Go first.
- **Research used:** user renders for touch scale and warmth; Expo for native behavior; Refero craft references for typography, color, copy, accessibility, and anti-generic design.
- **Path:** direct build from an explicit reference lock, then rendered visual QA.

## Reference lock: first onboarding screen

### Direction name

**Curiosity in Motion**

### Primary foundation

The user-provided `constellation- onboarding` prototype supplies the full-screen mobile composition, four-part story progress, rounded type personality, generous pacing, and tactile slide control. Constellation supplies entirely new product copy and a code-native growing-star visual.

### Preserve

- Full-screen mobile storytelling without a simulated phone frame inside the app.
- Four progress segments, one bold headline, a short explanation, a dominant visual, and a bottom slide control.
- The prototype’s soft lavender canvas and confident rounded typography.
- One meaningful constellation graphic with connected nodes rather than generic parenting icons.
- A visible guardian handoff line and an accessible tap alternative to the drag gesture.

### Borrow only

- Warm starlight highlights from Constellation’s established token set.
- Expo-native safe areas, reduced-motion handling, and continuous corners on interactive surfaces.

### Color-role rules

- **Canvas:** pale lavender; owns this onboarding story sequence only.
- **Ink:** near-black; owns type, progress, and the slide handle.
- **Starlight:** owns active stars and the small brand spark; it is not a page background.
- **White surface:** owns the constellation orbit and slide track, not general card repetition.
- **Safety colors:** remain semantic and never decorative.

### Media strategy

Use a screen-specific code-native constellation inside the prototype’s dominant circular media slot. It shows several real paths beginning from one idea. Do not import the prototype’s remote parenting icon or any PottyPal imagery.

### Reject

- Potty or generic parenting imagery and language.
- A thick white device frame, fixed 393×852 layout, or web-page shadow around the entire app.
- Auto-advancing copy that moves before a child finishes reading.
- Rounded display typography outside the onboarding/brand role unless later testing supports it.
- Multiple CTAs competing for attention.
- Claims that Constellation knows who a child is.
- A non-semantic drag-only control without a tap or screen-reader path.

### Token commitments

- Pale lavender onboarding canvas and near-black text for readability.
- Off-white circular media surface with near-black and warm-gold stars.
- Near-black slide handle on a translucent off-white track.
- Quicksand in regular, semibold, and bold weights for this onboarding story.
- 4-point spacing grid and restrained continuous radius.
- No drop-shadow decoration unless required to separate an interactive control.

## Decision ledger

| ID | Status | Decision | Rationale | Reversal trigger |
|---|---|---|---|---|
| D-001 | Accepted | Build the runnable application under `mobile/` and preserve root prototypes as references. | The current root is not an Expo project and contains unrelated generated artifacts. Isolation prevents route/config collisions and accidental deletion. | Move only if the workspace is later converted into a deliberate monorepo. |
| D-002 | Accepted | Use Expo, React Native, TypeScript strict mode, and Expo Router. | This matches the requested stack and supports one native codebase with fast Expo Go iteration. | A required, validated product capability cannot be delivered reliably in Expo. |
| D-003 | Accepted | Keep `mobile/src/app/` routes-only and place screen bodies in `src/screens/`. | Prevents Router file-system coupling from spreading through components and domain logic. | None expected; this is a structural invariant. |
| D-004 | Accepted | Release for ages 6–12 using authored 6–7, 8–9, and 10–12 variants; 6–7 is always guardian-led. | Reading load, interaction, independence, and safety must change with age rather than merely shrinking the same mission. | Family testing may exclude a variant that cannot pass review; safety is never weakened to retain coverage. |
| D-005 | Accepted | Start local-first with no required cloud account. | Reduces privacy exposure, setup friction, credentials, and backend work while preserving the core loop. | Families require restore, sharing, or multi-device use strongly enough to justify accounts. |
| D-006 | Accepted | Use a reviewed catalog and deterministic eligibility before ranking. | Safety constraints need auditable inclusion and exclusion behavior. | Never reverse the ordering; implementations may evolve. |
| D-007 | Accepted | AI adaptation is optional, bounded, server-side, and unable to override safety or publish content. | The product benefits from contextual adaptation but cannot delegate child safety to generative output. | The boundary may become stricter; it must not become weaker without formal review. |
| D-008 | Accepted | Do not build unrestricted child-to-AI chat. | It adds screen time, weakens the real-world proposition, and creates disproportionate trust and safety risk. | Only a new safety review and validated child need could reopen this. |
| D-009 | Accepted | Show at most 3 recommendations at once. | A deliberate choice supports action; a long feed supports browsing. | Usability testing demonstrates a different small number produces faster confident selection. |
| D-010 | Accepted | The constellation records exploration, not XP, streaks, rarity, or rank. | Progress must represent a unique childhood without performance pressure or social comparison. | Never reverse for engagement metrics. |
| D-011 | Accepted | Purchases and RevenueCat UI exist only in guardian-controlled routes. | Children should not experience purchase pressure or visible locked categories. | None; entitlement packaging may change without moving purchase UI. |
| D-012 | Accepted | Use “Curiosity in Motion” for the first screen, grounded in the user-provided onboarding prototype. | It preserves the user’s stronger mobile storytelling and tactile character while replacing all legacy parenting content with Constellation. | Rendered QA or family feedback shows the direction is too young, unclear, or inaccessible. |
| D-013 | Accepted | Use Quicksand across onboarding, guardian setup, and the child-facing shell. | The approved mobile reference depends on this rounded typographic personality, and consistent use makes the product feel like one world. | Readability, language coverage, or age testing favors a different brand face. |
| D-014 | Accepted | Use one screen-specific vector constellation instead of a reusable cosmic component. | The first screen needs a strong media role; premature abstraction would flatten the identity. | A second screen proves a stable shared API. |
| D-015 | Accepted | Use on-device SQLite for profiles and outcomes; derive stars from completed outcomes. | It supports atomic local setup, structured progress, and stable offline constellation reconstruction without a remote dependency. | Platform testing reveals a blocker or validated multi-device requirements justify a new repository adapter. |
| D-016 | Accepted | Weather remains `unknown` until a guardian-approved coarse-weather adapter is added. | Weather-dependent ideas must fail conservatively without collecting precise location or inventing conditions. | Families validate a privacy-preserving coarse-weather flow and its value outweighs the setup cost. |
| D-017 | Accepted | No backend, global state library, analytics vendor, or AI provider is added before a slice needs it. | Prevents speculative architecture and minimizes child-data exposure. | A named slice has a verified requirement that local React state and adapters cannot satisfy. |
| D-018 | Accepted | Onboarding uses four horizontally paged stories with manual swipe and a 6.5-second auto-advance that stops on the final story. | It fulfills the approved prototype’s storytelling rhythm without trapping users in an infinite loop. Reduced-motion and native screen-reader users keep manual control. | Family testing shows timed movement harms comprehension or completion. |
| D-019 | Accepted | Guardian setup continues the lavender, Quicksand, near-black, and starlight onboarding language with a calmer adult hierarchy. | The guardian handoff should feel like the same trusted product without retaining the child-facing story carousel or becoming a generic settings page. | Guardian testing shows the shared visual language reduces trust or makes adult responsibility unclear. |
| D-020 | Accepted | The local profile asks only for a nickname and the `6–7`, `8–9`, or `10–12` age band. | The band selects reviewed mission policy and presentation without collecting a birth date or identity. | Family research shows another minimal field is essential for safety. |
| D-021 | Accepted | Guardian setup ends after Allowed Places; companion is session context on Home. | “Who is here now?” changes from moment to moment and should not become another permanent label or setup step. | Family testing shows a persistent household boundary is needed in addition to per-session company. |
| D-022 | Accepted | The child-facing shell has Home, Curiosity, and Constellation tabs; there is no separate Stats tab. | Discovery, open exploration, and meaningful progress are the three durable destinations. | Navigation testing shows one destination cannot remain understandable or reachable inside this shell. |
| D-023 | Accepted | All six curiosity areas stay open, while chosen interests sort first and strengthen ranking. | Starting interests should improve relevance without becoming identity labels or locked branches. | Never reverse to locked interests; ranking weight may change through testing. |
| D-024 | Accepted | Store the setup draft in a typed onboarding provider and commit it atomically after Allowed Places. | Failed persistence must create no partial profile and must leave guardian choices recoverable. | A future multi-profile flow requires a broader transactional boundary. |
| D-025 | Superseded | Use one reviewed 24-item bundled catalog and run deterministic eligibility before ranking. | Offline discovery, auditability, and child safety require a stable source whose exclusions can be tested. | Superseded by D-028 when Rose Signal became the reviewed 25th experience. |
| D-026 | Accepted | Curiosity areas share one typed dynamic screen and one domain registry. | Six separate implementations would drift in safety copy, recommendation limits, and accessibility. | A domain proves it needs a meaningfully different interaction model, not merely different color or copy. |
| D-027 | Accepted | Gold represents completed real-world action; area colors only identify branches; midnight is reserved for the constellation field. | Clear color roles keep the interface coherent and prevent completion from becoming generic decoration. | Accessibility testing requires token adjustments while preserving semantic roles. |
| D-028 | Accepted | The bundled catalog contains 25 reviewed living-world story missions; Rose Signal established the model and all other missions now use it. | Story gives each mission a memorable problem and consequence while the common spine remains predictable and brief. | Family tests show a particular story delays or confuses the real-world action. |
| D-029 | Accepted | Safety mini-games are risk-based and enforced by one pure start-readiness rule in both UI and data layers. | Repeated quizzes would become friction, while a real plant hazard needs demonstrated recognition, a safe plan, and a guardian handoff that UI state cannot bypass. | Qualified safety review identifies a different stronger control. |
| D-030 | Accepted | Rose copy uses the botanically accurate term “prickles,” supported by Illinois Extension and NC State Extension. | The mission should correct a common misconception without overstating what the child can identify. | Authoritative botanical guidance changes. |
| D-031 | Accepted | Story-mission completion never requires camera, microphone, photo, location, upload, or other surveillance evidence. | The child’s completion is trusted, and evidence collection would add privacy risk while pulling attention back to the phone. | This boundary may become stricter; it is not relaxed without privacy and safety review. |
| D-032 | Accepted | Organize 25 unique story signals inside six recurring non-character instruments; the original six flagships form the free tier. | A shared learning spine creates coherence while unique signals and play forms keep missions distinct without attention-demanding mascots. | Family testing shows a world or interaction distracts from the real-world mission. |
| D-033 | Accepted | Store no more than three registry-authored learning-evidence statements with a completed outcome. | Stars can truthfully help a child and grown-up remember what was predicted, observed, retold, or practised without retaining raw child text, safety attempts, readiness data, or guardian confirmation. | Privacy review requires a stricter boundary or family testing shows the summaries are confusing or unhelpful. |
| D-034 | Accepted | A flagship world resolves and displays gold only after atomic completion succeeds. | Visual celebration must represent saved real-world action, never an unfinished interaction or optimistic write. | Never relax the persistence requirement; motion and color treatment may change for accessibility. |
| D-035 | Accepted | Free Constellation includes the six complete flagships and every curiosity area; Family includes all 25 reviewed missions. | Free must prove the product honestly, while Family sells trusted variety rather than removing artificial frustration. | Family conversion or retention evidence supports a different generous boundary without weakening child access or safety. |
| D-036 | Accepted | Family-only missions are filtered from free recommendations rather than rendered as locks, and all purchase controls remain behind the grown-up gate. | A child should never encounter prices, scarcity pressure, ads, or be recruited into asking for a purchase. | Never reverse the child-pressure boundary; guardian packaging may change. |
| D-037 | Accepted | RevenueCat initializes lazily with an anonymous identity and receives no child profile, context, progress, mission answers, or attributes; only a device with prior guardian-approved Family state refreshes entitlement at launch. | Purchase infrastructure does not need child data, free families need no purchase-network call, and paid renewals still need accurate access. | A qualified privacy review may make the boundary stricter; product convenience cannot make it weaker. |
| D-038 | Accepted | Launch at US $7.99 monthly without a trial and $39.99 annually with a 14-day annual trial, configured remotely in Google Play and RevenueCat. | The annual plan receives a meaningful trial while the monthly option stays simple; localized store terms remain authoritative. | Store policy, family evidence, affordability, or unit economics support a remotely configured revision. |
| D-041 | Accepted | Android launches first as `com.constellation.app`; public privacy, terms, safety, and support pages are static Expo routes deployed through EAS Hosting. | One store reduces release risk while meeting Shipaton’s new-public-app requirement and creates stable trust URLs. | Android publication becomes impossible before the competition deadline. |
| D-042 | Accepted | “Delete child profile and constellation” removes all local child state but preserves the anonymous RevenueCat/Google Play entitlement. | Privacy deletion must not silently cancel or erase a guardian’s purchase. | A qualified privacy or store-policy review requires stricter separation. |
| D-039 | Accepted | Optimize for first mission start, first star, guardian return, trial, paid conversion, and retention—not child screen time, streaks, or notification opens. | Business growth must reinforce the promise that the important behavior happens away from the phone. | Metrics may expand only when they remain aggregate, privacy-minimizing, and aligned with real-world action. |
| D-040 | Accepted | Shipaton focus is Peace Prize, Design Award, and HAMM Award while an early public launch preserves Grand Prize eligibility. | Constellation's strongest evidence is social impact, original interaction design, and ethical monetization; Grand Prize additionally needs early RevenueCat revenue and growth. | Official rules change or release timing makes a category unavailable. |
| D-041 | Accepted | Make mission choices touch-first and carry the chosen visual plan into phone-down mode; pilot the rule with Paper Bridge, Three-Object Story, and Window Nature Log. | A child should manipulate a prediction, sequence, or observation focus—not complete a disposable form. Reusing the selection as a memory cue connects screen preparation to real-world action while avoiding required typing and recording. | Family testing shows the visual plan causes confusion or keeps children on-screen longer. |

## Decision ledger for the first screen

| Decision | Source | Preserved rule | Implementation consequence |
|---|---|---|---|
| Shared child-and-guardian welcome | Product brief + safety constitution | Guardian responsibility must be visible before data collection | Supporting line states that a parent or guardian joins setup. |
| Full-screen story composition | User-provided HTML/PNG reference | Preserve mobile theatre without copying the web device frame | Safe-area-aware native ScrollView fills the device; four segments show step 1. |
| One dominant constellation orbit | Constellation metaphor + Refero media-role rule | Imagery must carry identity, not decorate empty space | The central circular slot contains an original code-native star path. |
| Lavender story canvas | User reference | Lavender belongs to onboarding atmosphere, not every product surface | Pale lavender fills the screen; off-white is reserved for orbit and control surfaces. |
| Quicksand with three weights | User reference + typography craft | Rounded personality remains bounded and readable | Regular body, semibold support, bold brand/headline/action. |
| Specific promise copy | User brief + copywriting craft | The product philosophy should be understood immediately | Headline is “Make the real world more interesting than the screen.” |
| Tactile slide control | User reference + Expo gesture guidance | Preserve the memorable interaction without excluding assistive users | Native pan gesture plus a double-tap/click fallback on the handle. |
| No permission request on screen one | Privacy principle | Explain value before requesting data | Completion navigates to the guardian boundary; permissions come later. |

## Reference lock: guardian handoff

- **Primary direction:** continue “Curiosity in Motion” with a calmer guardian-facing composition.
- **Preserve:** lavender canvas, Quicksand, near-black ink, warm-gold star accents, off-white surfaces, rounded code-native SVG strokes, and 24-point edge spacing.
- **Shift:** replace the story carousel and tactile slider with one protected-star illustration, one three-row assurance surface, and one direct guardian action.
- **Color roles:** gold marks the meaningful star inside each illustration; near-black owns the guardian action and primary type; lavender owns setup atmosphere; off-white owns the single trust surface.
- **Reject:** teal eyebrow styling, generic white settings pages, violet CTA treatment, emoji or 3D characters, generic lock artwork, card-per-promise repetition, and any account or permission request on this screen.
- **Motion:** one restrained 240 ms entrance only, removed when reduced motion is enabled.

## Reference lock: local profile

- **Primary direction:** continue the guardian handoff’s lavender setup canvas, Quicksand hierarchy, off-white single surface, near-black action, and gold star details.
- **Form structure:** one nickname input and one two-choice age-band radio group inside a single surface; helper and validation copy stay immediately beside their field.
- **Privacy boundary:** accept names in any language, request a nickname rather than a legal name, do not place profile values in URLs or logs, and commit it only with the complete setup draft after Allowed Places.
- **Interaction:** “Choose interests” validates both fields, focuses or announces the first error, and advances only when the nickname is 2–24 trimmed characters and an age band is selected.
- **Reject:** full name, birth date, school, photo, avatar picker, account creation, disabled-without-explanation submission, and playful controls that obscure the guardian’s responsibility.

## Reference lock: interests

- **Primary direction:** continue the guardian setup language with one calm, tactile list of six curiosity areas mapped directly to the first catalog domains.
- **Choice framing:** ask for at least two starting points with no maximum, explicitly say they are not labels, and keep discovery beyond current interests visible in the copy.
- **Domain mapping:** Nature & noticing, Make & create, Talk & connect, Test & discover, Everyday skills, and Move & be brave map to the six reviewed MVP experience domains without exposing internal taxonomy language.
- **Interaction:** each full row is an accessible checkbox with a code-native line icon, gold detail, clear selected state, live selected count, and inline validation. Values remain in the typed setup draft until the full draft is committed atomically.
- **Visual continuity:** lavender canvas, Quicksand hierarchy, one off-white continuous surface, near-black action, warm-gold checks, continuous corners, 24-point edge spacing, and one reduced-motion-aware 240 ms entrance.
- **Reject:** personality tests, ranking a child, permanent identity claims, emoji or stock-category artwork, interest limits that box the child in, route-param profile data, and noisy card grids.

## Reference lock: support needs

- **Primary direction:** preserve the interests screen’s continuous selection surface and “starting points, not labels” philosophy, shifting from curiosity categories to practical experience adaptations.
- **Language boundary:** collect no diagnosis or medical label. Ask only what may make an experience work better, and state that adaptations guide how an experience flexes rather than defining the child.
- **MVP adaptations:** clearer shorter steps, lower-sensory ideas, seated or low-movement choices, flexible pacing, and guardian participation. Each maps to a future deterministic catalog adaptation or eligibility rule.
- **Choice behavior:** every option is independent and optional, with no required disclosure. Empty submission remains valid; selected state and count are accessible and join the final atomic setup commit.
- **Visual continuity:** lavender canvas, Quicksand hierarchy, one off-white selection surface, code-native rounded icons, warm-gold state details, near-black action, and reduced-motion-aware 240 ms entrance.
- **Reject:** diagnoses, disability severity, behavioural scoring, free-text medical details, promises that every experience can be adapted, mandatory disclosure, or language that treats support as a deficit.

## Reference lock: allowed places

- **Primary direction:** continue the setup flow’s single continuous selection surface, now framed as guardian-set boundaries before the recommendation engine makes suggestions.
- **MVP context mapping:** Inside home, Yard or shared outdoor space, Nearby neighbourhood, and Public places map exactly to `home`, `yard`, `neighbourhood`, and `public-place` in guardian settings.
- **Safety boundary:** require at least one allowed setting, but never interpret a selected setting as permission for a child to go there alone. Companion requirements remain explicit on every eligible experience.
- **Privacy boundary:** collect category choices only. Do not ask for an address, map pin, place name, school, route, geofence, background location, or precise coordinates.
- **Visual continuity:** lavender canvas, Quicksand hierarchy, code-native place icons, one off-white checkbox surface, warm-gold selected states, a lavender “Categories, not coordinates” assurance, and the near-black guardian action.
- **Reject:** maps, location permissions, distance sliders, implied unsupervised travel, preselected safety boundaries, or generic settings toggles that hide the meaning of each place choice.

## Reference lock: main Constellation experience

- **Primary direction:** the child-facing app continues the approved onboarding world rather than switching to a generic dashboard or game shell.
- **Preserve:** lavender canvas, Quicksand, near-black ink, off-white surfaces, warm-gold meaningful stars, code-native SVG, continuous corners, restrained shadows, and 24-point edge spacing.
- **Navigation:** Home, Curiosity, and Constellation are the only primary tabs. Curiosity areas and experiences push above the tabs with native Back behavior.
- **Domain color roles:** sage, coral, sky, teal, amber, and lilac identify the six open branches. They never imply locks, rarity, rank, or completion.
- **Progress:** one deep-midnight map holds deterministic branches and stars derived from completed outcomes. Supporting journey information uses counts and plain-language branch summaries, never percentages, targets, XP, streaks, or comparison.
- **Recommendation rhythm:** Home and area screens show at most three reviewed ideas. Empty states suggest changing context and never loosen eligibility.
- **Reject:** PottyPal material, photographs, adult avatars, generic charts, violet navigation, locked categories, autoplay, endless feeds, decorative looping motion, or internal product-development language in child-facing copy.

## Reference lock: interactive curiosity missions

- **Primary direction:** turn each reviewed recommendation into a short authored mission: choose, prepare, leave the screen, return, reflect, and light a star.
- **Visual continuity:** preserve the main experience's lavender canvas, Quicksand hierarchy, near-black ink, off-white interactive surfaces, quiet domain accents, continuous corners, and 24-point edge spacing. Gold appears only after completed real-world action.
- **Interaction model:** one shared mission shell owns reliable phases, persistence, safety, and recovery; each of the 25 experiences composes a distinct tactile object from accessible selection, ordering, prompt, marker, counter, comparison, slot-input, arrangement, or risk-based safety-sequence primitives.
- **Phone-down rule:** simple missions collapse to one memorable cue after launch. Complex build, conversation, and experiment missions may expose optional guidance, but never require repeated tapping to count as complete.
- **Safety and privacy:** eligibility is checked again at launch, configured guardian confirmations are explicit, typed child input stays local, and no camera, microphone, precise location, evidence upload, or open-ended AI is introduced.
- **Motion:** presses use brief feedback, phase changes use a restrained 240 ms entrance, and star lighting is the only expressive completion moment. Reduced motion removes spatial movement and looping animation is prohibited.
- **Reject:** static specification pages, identical activity cards, step-by-step screen dependence, countdown pressure, badges, scores, streaks, confetti, surveillance evidence, or a card around every non-interactive section.

| Mission decision | Source | Preserved rule | Implementation consequence |
|---|---|---|---|
| Shared shell with 25 authored definitions | Approved interactive-missions plan + architecture boundary | Presentation may vary; persistence and safety may not drift | One typed registry validates every published experience and renders composable interaction primitives. |
| Featured mission plus two alternatives | Approved plan + recommendation cap | Deliberate choice, not feed depth | Area pages give the first recommendation visual priority and keep the remaining two compact. |
| Optional, timestamp-derived timer | Approved plan + phone-down product rule | Time assists but never judges | Timer survives backgrounding, never auto-completes, and shows no failure state. |
| One-tap reflection | Approved plan + data minimization | Return should be brief and private | Four reviewed responses are stored locally; no required note, photo, audio, or proof. |
| Activity-based guardian handoff | Approved plan + child-safety constitution | Required adult action must be explicit | Guardian confirmation is configured in trusted mission data and cannot be bypassed by UI state. |

## Reference lock: Rose Signal pilot

- **Story shape:** story problem → two-clue safety interaction → ready handoff → phone-down observation → two local discoveries → botanical reveal → optional reflection → persisted world change.
- **Visual anchor:** one screen-specific code-native Nature Compass connected to a rose outline. The unresolved state uses ink, off-white, and Nature sage; the Compass aligns, the Rose Signal turns gold, and a star appears only after completion is saved.
- **Safety interaction:** labeled nonvisual choices remain equivalent to the rose diagram, targets stay at least 44 points, feedback is calm and retryable, and color is never the only correctness signal.
- **Botanical truth:** use “prickles” rather than “true thorns,” based on [Illinois Extension](https://extension.illinois.edu/roses/roses-types) and [NC State Extension](https://plants.ces.ncsu.edu/plants/rosa/common-name/roses/) guidance. Do not invite a child to identify an unknown plant species.
- **Phone-down rule:** the active surface keeps only “Eyes first. Hands back. Let the grown-up point,” the observation objective, and return/pause/stop actions. There is no timer, looping animation, or step dependency.
- **Privacy boundary:** story choices live only in active-session JSON and disappear with it on terminal completion. No photo, camera, microphone, location, evidence, analytics content, or generated imagery is added.
- **Reject:** mascot treatment, gold before saved completion, badges, unlocks, meters, scores, repeated safety quizzes, autoplay, picking, touching, tasting, or tool use.

## Reference lock: six living Curiosity flagships

- **Shared spine:** story signal → predict or create → prepare safely → phone down → act in the real world → return with evidence → understand → light a star → change the world.
- **Six instruments:** Nature Compass, Maker's Workbench, Story Archive, Discovery Lens, Everyday Station, and Courage Path. They are silent tools with no faces, speech, personality demands, or mascot behavior.
- **Different play:** Rose uses risk-based plant observation; Paper Bridge uses prediction and testing; Three-Object Story uses local prompts and verbal retelling; Shadow Tracing uses two observations; Cold Snack uses safety decisions and planning; Floor-Line Balance uses sequencing and strategy reflection.
- **Evidence boundary:** outcomes may contain up to three authored summaries selected by trusted registry rules. Never retain raw slot text, story words, unsafe choices, preparation state, guardian confirmation, or full session JSON.
- **World state:** unresolved art uses ink and its domain accent. Gold, the resolved instrument, and its completion motion appear only after the outcome transaction succeeds; reduced motion reveals the resolved state immediately.
- **Rollout:** the other 19 missions keep their current behavior until the flagship wave is tested with families.
- **Reject:** mascots, badges, mastery claims, grades, developmental assessment, voice recording, surveillance proof, scores, comparison, locked missions, or a separate progress table.

## Build chunks

Each chunk must leave the app runnable and include its own evidence. A chunk is complete only after its acceptance checks pass.

### C-00 — Project constitution and build documents

**Status:** complete in the current working session.

**Deliverables:**

- `AGENTS.md`
- `plan.md`
- `architecture.md`
- `decision.md`

**Acceptance:** the four documents agree on product truth, scope, safety boundaries, architecture, and the first screen reference lock.

### C-01 — Expo walking skeleton

**Depends on:** C-00

**Status:** complete — Expo SDK 57 scaffold, strict TypeScript, root stack, and compatible dependency checks pass.

**Deliverables:**

- `mobile/` Expo Router TypeScript project
- root stack and `/` route
- `@/*` alias
- lint, typecheck, and start scripts

**Acceptance:** dependency install succeeds, TypeScript passes, and the app starts without route errors in Expo Go-compatible mode.

### C-02 — Initial theme and primitives

**Depends on:** C-01

**Status:** complete — initial tokens and accessible screen, text, and action primitives are implemented.

**Deliverables:**

- semantic color, spacing, typography, radius, shadow, and motion tokens
- `Screen`, `ThemedText`, and `ActionButton`
- reduced-motion and pressed/disabled behavior where relevant

**Acceptance:** no repeated visual value is hardcoded outside the theme, and primitives expose accessible roles and labels.

### C-03 — First shared onboarding screen

**Depends on:** C-02

**Status:** complete — rendered and interaction-tested at 390×844 and 320×568 with no P0–P2 findings.

**Deliverables:**

- screen-specific vector constellation hero
- wordmark, promise, explanation, “Begin Together” action, and guardian note
- placeholder navigation target for the next guardian step

**Acceptance:**

- the screen communicates real-world action within the first viewport;
- no legacy product copy or asset appears;
- 320 pt and large-phone layouts remain readable and reachable;
- large text remains scrollable without overlap;
- screen reader order and labels are coherent;
- rendered QA has no unresolved P0, P1, or P2 issue.

### C-04 — Guardian boundary and consent explanation

**Depends on:** C-03

**Deliverables:** guardian role explanation, local-data promise, safety boundary, and consent record model.

**Acceptance:** a guardian can explain what is stored, what is not collected, and why setup needs adult participation.

### C-05 — Local child profile

**Depends on:** C-04

**Deliverables:** nickname, age band, interests, accessibility needs, allowed contexts, persistence, edit, reset, and validation.

**Acceptance:** a profile survives restart, contains no unnecessary identity field, and can be reset with confirmation.

### C-06 — Catalog schema and publishing gate

**Depends on:** C-05

**Status:** complete — typed definitions, runtime publishing checks, review metadata, and bundled loading are implemented.

**Deliverables:** experience types, runtime validation, review status, safety metadata, versioning, and seed-catalog loader.

**Acceptance:** invalid, unreviewed, or retired experiences cannot enter the published catalog.

### C-07 — First reviewed experience pack

**Depends on:** C-06

**Status:** complete — 25 reviewed experiences are bundled: five in Nature & Noticing and four in every other area, with safety notes and checklist metadata.

**Deliverables:** 25 reviewed experiences across 6 domains with provenance and safety notes.

**Acceptance:** every experience validates and passes a documented manual review checklist; category count alone is not sufficient.

### C-08 — Context and eligibility

**Depends on:** C-06

**Status:** complete — Home supplies ephemeral context and deterministic tests cover age, time, weather, place, companion, materials, and support boundaries.

**Deliverables:** manual time, setting, companions, materials, weather context, deterministic rules, and exclusion reasons.

**Acceptance:** rule fixtures cover age, darkness, weather, guardian requirement, materials, accessibility, and unknown context.

### C-09 — Explainable recommendation set

**Depends on:** C-07, C-08

**Status:** complete — eligible results are stably ranked, interest-aware, domain-diverse on Home, capped at three, and paired with plain-language fit reasons.

**Deliverables:** ranking, diversity, novelty, interest fit, at-most-three results, fit reasons, and empty-result recovery.

**Acceptance:** only eligible experiences rank, results are stable for the same inputs, and every recommendation has a human-readable reason.

### C-10 — Experience preparation and launch

**Depends on:** C-09

**Status:** complete — one mission route renders all 25 authored interactions, rechecks eligibility before start, applies six reviewed guardian handoffs, and enters a low-screen mode with optional non-pressuring guidance.

**Deliverables:** authored interaction, preparation, materials, companions, safety notes, guardian-required state, phone-down launch, optional steps or prompts, and timestamp-derived optional timer.

**Acceptance:** a tester can understand preparation and leave the phone without further prompts.

### C-11 — Outcome and reflection

**Depends on:** C-10

**Status:** complete — one persisted session per child supports pause, restart recovery, return, no-penalty stop, optional one-tap reflection, and idempotent atomic completion.

**Deliverables:** complete, finish later, stop, optional reflection, resume, interrupted-session recovery, and local session/outcome persistence.

**Acceptance:** stopping carries no penalty; interrupted sessions recover; child-entered mission text remains local and out of diagnostics; repeated completion cannot create duplicate outcomes or stars.

### C-12 — Personal constellation

**Depends on:** C-11

**Status:** complete — completed outcomes derive deterministic gold stars across six branches, with accessible journey summaries and details that trace each star to its real-world mission.

**Deliverables:** star derivation, deterministic placement, domain paths, accessible summary, star details, and reduced motion.

**Acceptance:** two histories create distinct maps; every star traces to a completed experience; no comparative score appears.

### C-13 — Guardian entitlements and RevenueCat

**Depends on:** C-05, C-09

**Status:** implementation complete; external store and sandbox validation pending — the anonymous RevenueCat adapter, local entitlement cache, grown-up gate, membership comparison, paywall/restore/customer-center actions, free/family recommendation filter, and trusted start check are implemented.

**Deliverables:** entitlement interface, offerings, guardian-only paywall, purchase, restore, cached state, and errors.

**Acceptance:** sandbox purchase and restore work on both target platforms, free child flow remains usable, and child routes cannot open purchase UI.

### C-14 — Privacy, accessibility, and offline hardening

**Depends on:** C-09 through C-13

**Deliverables:** offline behavior, data reset, diagnostics allowlist, screen-reader pass, large text, contrast, reduced motion, and recovery states.

**Acceptance:** the full core loop works offline; diagnostic inspection contains no child identifiers or content; accessibility release blockers are resolved.

### C-15 — Family beta and release evidence

**Depends on:** C-14

**Deliverables:** consented test script, findings log, resolved high-severity issues, store assets, demo video, build, and Shipathon submission fields.

**Acceptance:** at least 5 families complete the core loop, app behavior matches the submission video, and store/RevenueCat validation passes.

## Chunk execution rule

For every chunk:

1. Re-read its dependencies and relevant decisions.
2. Inspect installed versions and existing code before editing.
3. State what the chunk will not include.
4. Write tests for domain behavior before implementation where applicable.
5. Implement the smallest complete path.
6. Run type, lint, test, Expo diagnostic, device, and visual checks in proportion to the change.
7. Fix P0–P2 issues before marking complete.
8. Update the decision log only if evidence changes a durable choice.

## Open validation items

These items do not block the first screen:

- Validate the 8–12 cohort with actual families.
- Validate whether the “Daylight Observatory” direction feels capable rather than too young.
- Validate the first free-versus-family entitlement boundary before implementing a paywall.
- Verify the installed Expo SDK and package compatibility during C-01.
- Obtain qualified child-privacy and store-policy review before public release.
- Confirm whether automatic weather creates enough value to justify any region input.
# Pocket Planet implementation lock — 2026-09-13

The user-approved Pocket Planet plan supersedes earlier real-world-only, no-character, and form-first Home decisions. Digital creation and reported physical exploration are equally valuable, explicitly distinguished origins. Gold remains exclusive to saved real-world completion.

Reference lock: original layered cut-paper Little Landing, Tinybop-inspired manipulable environments and Toca-inspired ownership; Quicksand, lavender chrome, stronger environmental sky/foliage/coral, 48dp controls, finite result motion and tap alternatives. Pip is an authored paper courier, never a chat companion or dependent pet.

Delivery gate: implement the complete Paper Post vertical slice and shared local game foundation first. Observe five children before building Shadow and Theatre. Those places must not masquerade as working games before implementation. No store publication or family-test claims follow from a successful export.

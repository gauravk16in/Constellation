# Constellation: critical Shipaton audit

## Fix-pass update · 28 September 2026

This audit is a historical diagnosis. The current local working tree now repairs the reproduced Paper Post draft dead end with explicit resume/replace choices, removes unsupported revision claims from learning memories, preserves saved compositions when editing, and carries the saved shadow model into a spoken real-world comparison. Home features the light-and-shadow experiment with a responsive two-position preview. The text-only theatre and movement activity have more truthful names and feedback; the tab symbols and configured icon have been replaced. Membership, README, listing, and legal-preview copy now distinguish digital play from physical missions and identify what remains unverified.

Local verification after those changes: TypeScript, lint, planet/game tests, engine tests, persistence tests, Expo Doctor (21/21), and web and Android production exports pass. The web preview was inspected and its light control responded to keyboard input. These checks are not native device, child, editorial, policy, billing, or public-store evidence.

The release gate at `mobile/release/README.md` deliberately blocks production builds and submission claims until attributable evidence is supplied. It currently reports 79 unresolved build checks: qualified review of 75 mission/age variants, policy review, family pilot, native billing test, and monitored support inbox. Public listing, judge access, demo assets, and final submission remain additional external checks. No review or outcome has been fabricated. A transitive `image-size` advisory remains in Metro's build tooling; the Expo-compatible pinned version has no patched 1.x release, so forcing an untested major override would risk the build. Reassess it with an upstream Expo/Metro update. The dependency is not part of a child-upload image path in this app.

27 September 2026 · Current local working tree, not a certified production build

## Verdict

Constellation currently has a more convincing safety and persistence foundation than a convincing game. Borrow a Shadow is the clearest learning interaction; the wider planet is still largely a menu of small exercises. The digital-to-physical connection is promising, but the product does not yet consistently demonstrate the connection that its pitch describes.

Do not build another world before submission. Establish eligibility, repair the broken navigation and inaccurate learning memories, foreground one complete experiment-to-real-world journey, and make every submission claim match the released build.

The largest immediate risk is not losing a design comparison. It is submitting without verified public-store availability and a working RevenueCat purchase path.

### Evidence boundaries

- **Verified now:** source inspection; current 393×852 web Home; Paper Post draft-conflict error reproduced; icon viewed; TypeScript, lint, planet tests, catalog/engine tests and web persistence tests passed.
- **Previously tested in this workspace:** Shadow lesson progression and small-screen web rendering; Android/web exports. These are not native device or family tests.
- **Not verified:** public store release, U.S. installation, production RevenueCat configuration, actual prices/trial, successful purchase/restore/refund, hosted policy URLs, monitored support inboxes, independent editorial review, family outcomes, revenue, retention, public demo, or final Devpost submission.
- **Inference:** likely child/judge reactions below. These are product judgments, not observed research results.
- **Recommendation:** all proposed changes below. This audit does not implement them.

Repository: `/Users/kr/Downloads/constellation-ui`. Paths below are relative to it. Latest local commit is `f4a1909`; several new game and lesson files are untracked and other files modified. Those changes are not contained in that commit. Remote parity was not verified.

## 1. Competition: requirements are not judging criteria

### Eligibility

The ordinary entry needs a working native app, first public store release during the eligible submission window, U.S. availability, and RevenueCat-powered purchasing or RevenueCat Ads. A localhost preview or testing-track build is not sufficient. Entrant age, residence, ownership and other legal eligibility must also be confirmed. The formal rules specify a July 31 opening; some organizer articles say August 1. Use the formal rules if that boundary affects you. Deadline: September 30, 2026, 11:45 p.m. PDT—October 1, 12:15 p.m. India time. [Official competition](https://revenuecat-shipaton-2026.devpost.com/), [rules](https://revenuecat-shipaton-2026.devpost.com/rules).

### Submission assets

Prepare the public store URL, English description, accessible video under two minutes, RevenueCat project ID, 1024×1024 icon, unframed 1179×2556 screenshot, and trial/promo access to premium features. Provide category-specific evidence. A saved Devpost draft is not a submitted entry. [Organizer submission guide](https://www.shipaton.com/blog/how-to-submit-your-app-for-shipaton).

The icon has the required dimensions, but the configured `mobile/assets/images/icon.png` is visibly an Expo-style template mark, not Constellation branding. `store/shipaton-submission.md` is a draft with unchecked release items, not evidence of submission.

### Judging versus strategy

The category-specific criteria appear in section 5. A polished README, regression log and concise demo help communicate the work; they do not substitute for eligibility or create additional official judging criteria. No universal scoring weights are assumed here.

## 2. What actually exists

| Capability | Classification | Evidence and limitation |
|---|---|---|
| Guardian setup, local profiles, boundaries | IMPLEMENTED | Existing setup/provider/repository paths; no account required. Fresh native setup was not rerun in this audit. |
| 25 physical story-missions | IMPLEMENTED framework; PARTIAL educational differentiation | Registry and engine tests pass. Count does not establish equivalent quality across activities. |
| Three age bands | PARTIAL | `mission-registry-v2.ts:790` generates variants. Ages 8–9 and 10–12 reuse most interactions and steps; younger steps are sliced to three. Not 75 independently authored lessons. |
| Safety eligibility, active mission, completion/star persistence | IMPLEMENTED | Engine and web persistence tests; native release behavior remains unverified. |
| Paper Post | IMPLEMENTED core; PARTIAL integration | Shape/gap/load model and saved bridges exist. Cross-game conflict produces a dead end. |
| Borrow a Shadow | IMPLEMENTED pilot | Prediction, manipulation, comparison, explanation and target challenge exist. Not an adaptive curriculum. |
| Object Theatre | PARTIAL | `StoryControls` builds a text retelling after selections; it does not deliver the promised animated three-scene performance. |
| Parcel Room / Delivery Path | PARTIAL | Fixed grouping assumptions and a simple movement boolean masquerade as richer systems. |
| Persistent planet ownership | PARTIAL | Creations save; some “Change my creation” actions start from initial state instead of editing the saved composition. |
| Digital-to-physical handoff | PARTIAL | Routes and safety checks exist; selected digital composition is not consistently carried into the physical mission. |
| Learning memories | PARTIAL | Registry-owned summaries exist, but repeated button presses can produce false revision claims. |
| RevenueCat | PARTIAL end-to-end | Native SDK adapter, paywall, restore, Customer Center and entitlement logic exist. Store configuration and billing lifecycle are Not verified. |
| Trust pages | PARTIAL | Routes exist. Legal copy still includes instructions to obtain review; inbox/domain operation is Not verified. |
| Submission/release proof pack | MISSING from inspected materials | No supplied public demo, verified listing, purchase evidence or final screenshot set. May exist externally. |
| More worlds, AI companions, sponsor SDK collection | UNNECESSARY now | Adds scope without resolving current product or release failures. |

## 3. Product definition

**Constellation helps families with curious children ages 6–12 turn “what can we do?” into hands-on discovery by pairing small digital experiments with safe real-world missions and a local record of what they tried.**

- **Buyer:** guardian. **Player:** child; younger children require co-play. The current strongest learning pilot is a more credible starting point for ages 8–12 than a validated promise for the entire range.
- **Opening trigger:** a parent wants a worthwhile activity without searching for materials and instructions; a child wants something interesting to make happen. These are different needs. Home currently serves the second unevenly, while setup serves the first.
- **Loop:** choose an experiment → manipulate → observe → optionally try nearby → report/reflection → revisit a saved creation or star.
- **Return reason:** revisit or alter a creation. Currently weak because many game states exhaust quickly and editing can reset the creation.
- **Aha:** moving a light changes the shadow on the opposite side, then trying a related observation outside.
- **Difference:** an explicit bridge between simulated exploration and actual family activity, with modest learning memories instead of grades.
- **Why mobile:** available beside the table or outdoors, saves local progress, and deliberately supports putting the device down. Nothing here inherently needs a powerful game platform.
- **24-hour memory:** ideally “the shadow I moved and then looked for outside.” Currently a judge may instead remember lavender screens and activity lists.

The focus problem is real: “real-world mission guide,” “Pocket Planet,” “learning app” and “creative game” are all competing for the first sentence. Use one promise; treat the planet as its interface, not a second product.

## 4. Judge’s first experience — inference, not a user study

**First five seconds:** returning Home reads as a pleasant illustrated children’s activity app. The inspected state showed a static numbered movement path, then a sentence beginning “Your The Wobbly Delivery Path…”. It does not immediately show something manipulable.

**First thirty seconds:** a returning visitor sees Continue, Try Paper Post, Arrange, then more games further down. A fresh profile is routed to Paper Post. Neither path guarantees discovery of the newer, stronger Shadow lesson.

**First two minutes:** the mission/safety concept can become clear, but meaningful experimentation depends on which route the judge chooses. Purchasing is protected, appropriately, but cannot be assumed demonstrated. Technical depth is mostly invisible. The current draft’s early setup tour would spend scarce video time on prerequisites instead of the distinctive behavior.

**Exact loss-of-interest point:** “Open the curtains” produces a sentence rather than a performed story; or “Try Paper Post” produces “Finish or pause your current digital game…” without an actionable resolution on that screen. The second was reproduced live.

**Strongest existing moment:** Shadow’s responsive light/shadow relationship followed by the independent shade-target challenge. This is a credible small learning interaction, not yet a spectacular world transformation.

**Small proposed improvement:** make that interaction the featured experiment, and show its digital memory beside the related reported physical observation. Do not fake a seamless carry-over that is not implemented.

## 5. Award fit

Official criteria, compressed: **Design** considers innovation and aesthetics, not business viability. **Peace** considers impact and feasibility. **Best Game** considers engagement, distinctive play/replayability and monetization. **HAMM** considers integrated, sustainable and distinctive monetization. **Grand Prize** uses RevenueCat revenue for shortlisting, then release/growth evidence; highest revenue does not automatically win. **BuildInPublic** considers the public journey, engagement and lessons. **Catvertising** considers natural ad integration and audience/revenue fit. **Next Gen** considers concept, working progress, RevenueCat and thoughtful execution. **OneSignal** considers implementation, user value and creativity; **Layers**, growth hypothesis, observed signals and iteration; **Noise**, virality, scalability and conversion relevance. [Published criteria](https://revenuecat-shipaton-2026.devpost.com/rules).

| Relevant category | Present evidence | Missing evidence / biggest weakness | Most valuable improvement |
|---|---|---|---|
| Peace Prize | Offline family missions; privacy restraint; safe preparation; no child purchase pressure | Positive impact is an intention, not a demonstrated family result | Observe a small consented pilot; report what children actually attempted and understood, including failures |
| Design Award | Cohesive palette, original paper illustrations, Shadow manipulation, phone-down distinction | Uneven interaction craft; dense button menus; template icon; navigation failure | Polish one continuous journey and remove dead ends; replace template branding |
| Best Game | Paper Post experiments, Shadow challenge, persistent creations | Limited systemic depth and replayability; Theatre/Movement promises exceed behavior | Show voluntary experimentation; keep shallow modes out of the lead experience until honest and useful |
| HAMM | Guardian gate, RC adapter, entitlement-based access, useful free missions | No verified live paywall, transaction or conversion; paid benefit mostly catalog quantity | Verify a real Play billing journey and explain a concrete Family use case |
| Grand Prize | Release scaffolding | Revenue, public availability and post-launch growth all Not verified | Gather genuine existing store/RevenueCat evidence; do not fabricate a traction narrative |
| BuildInPublic | Local development history and iterations | Public posts and feedback-driven changes Not verified | Share the actual “selection form → shadow experiment” lesson, with real feedback if available |
| Next Gen, conditional | Working code and technical choices | Entrant student eligibility and licensed public repository Not verified | Check eligibility before treating this as an alternative submission route |

Next Gen is about **the developer being an eligible student**, not the app being for children. It permits a video/open-source submission without a store release; that exception does not transfer to other awards. [Student category](https://www.shipaton.com/students).

**Strongest factual alignment: Peace, Design, then Best Game.** This is alignment, not a win prediction. Evidence is still thin for all three. HAMM is currently an integration story rather than a proven monetization story.

### Categories not worth changing the product to pursue

Catvertising needs RevenueCat Ads; OneSignal needs its integration and a deployed campaign; Layers requires its SDK and growth experiment; Noise requires platform use. Galaxy requires its store release; JetBrains requires Kotlin/Compose Multiplatform on both mobile platforms; Replit requires its build workflow and public posts; Stripe requires a RevenueCat Funnels/Stripe funnel. None is evidenced here. [Submission prerequisites](https://www.shipaton.com/blog/how-to-submit-your-app-for-shipaton).

Do not introduce child advertising, messaging or tracking to chase these categories. The influencer briefs address other specific products; one snack or movement mission does not make Constellation fit them. Sponsor-employee eligibility for Conflict of Interest is Not verified and is not a product strategy.

## 6. Product quality audit

**Problem:** understandable, but “children’s future” is not a purchase trigger. “A worthwhile ten-minute thing to try together, without planning” is testable.

**Differentiation:** currently more visible in the philosophy than in the first screen. The linked physical activity is the distinction; foreground it after the child discovers something, not as a separate catalog they must interpret.

**Core experience:** Shadow has cause and effect. Theatre and movement often have selections followed by authored feedback. A completion state is not automatically a learning experience.

**UI:** Quicksand, lavender, rounded controls and domain colors are consistent. The 393px Home has generous spacing but spends most of the first viewport on a non-interactive saved illustration and stacked actions. Other destinations sit below the fold. The bottom navigation shows triangle-like glyphs in the inspected web rendering; verify native icons rather than assuming this is platform-wide. Large text, TalkBack and lower-cost Android rendering are Not verified.

**UX:** the physical handoff collects readiness and then explicitly sends users to another full ready check. Combine duplicated questions without weakening eligibility. “Arrange my creations” versus “My Finds” versus “Constellation” adds terminology. “Change” should reopen the actual creation. An error explaining a draft conflict should offer a route to that draft.

**Empty/loading/error states:** loading and retry controls exist. The reproduced draft-conflict screen is a semantic dead end: retrying cannot resolve the underlying conflict. Fresh-profile and zero-progress native states need device testing.

**Accessibility:** 48px minimum controls and gesture alternatives are useful code-level provisions. Screen-reader labels alone do not prove comprehensible sequence, focus transitions or successful independent operation. Do not claim accessibility certification.

**Polish:** the Expo-style icon, grammar “Your The…”, remote-paywall setup instructions shown in unconfigured builds, and legal-review TODO copy are concrete prototype signals. More shadows or decorative motion will not fix these.

**Technical depth:** deterministic eligibility before ranking, explicit age/guardian policies, legacy session handling, atomic completion, idempotency, separate entitlements and deletable child data are substantive. The shallow parts are gameplay predicates and generated age variants, not the database foundation.

**Monetization:** purchases occur in the correct adult surface. `revenuecat-adapter.native.ts` calls native paywall/restore/Customer Center and avoids child attributes. This is real implementation, but no production transaction was verified. `membership-screen.tsx` sells six versus 25 physical missions and omits the new digital experience. Proposed $7.99/month and $39.99/year are not verified live prices. A finite catalog needs repeat-use value to justify recurring payment; do not promise monthly content unless delivery is funded and scheduled.

**Retention:** there is no compelling reason yet to repeat a fixed exercise after solving it. Prefer one meaningful variation and true edit/resume over streaks or notifications. Track this through consented observation, not child analytics added at deadline.

**Growth:** no verified organic referral loop. A parent can talk about an activity, but the app does not yet generate an obvious shareable artifact. For this release, use an adult-made demonstration of an experiment and its physical counterpart; no child identity or in-app social system is needed.

## 7. Ten most important weaknesses

Effort estimates concern engineering/editorial work; store approval and human review are external dependencies.

| # | Problem and evidence | Why it matters | Exact fix | Effort | Impact |
|---|---|---|---|---|---|
| 1 | Release/billing eligibility is unproven. Store checklist unchecked; RC configuration external | A good demo cannot substitute for an eligible app | Verify public U.S. listing, first-release date, RC project and working purchase/restore; retain evidence | HIGH/external | HIGH |
| 2 | Paper Post conflicts with another digital draft. Reproduced live; `paper-post-screen.tsx:37`, engine `:84` | An ordinary Home action stops the experience | Add the same resume/explicit-replace choices available in PathGameScreen; regression-test both switching directions | MEDIUM | HIGH |
| 3 | Learning memories overstate actions. `path-game-engine.ts`, `evidence()` checks playCount/tests/runs > 1 | Undermines the central parent-trust claim | Either remove “changed/revised” or compare distinct configurations between runs; test two identical runs produce no revision claim | LOW | HIGH |
| 4 | “Reviewed” is metadata, not verified review. Shared REVIEW object and generic reviewer role; generated age variants | Safety/age claims exceed supplied evidence | Obtain attributable review of release content; hide unsupported variants or qualify claims. Never treat schema success as expert sign-off | HIGH/external | HIGH |
| 5 | Game labels promise more than mechanics. Theatre renders text; movement succeeds when one of three tokens is present | Children test possibilities and discover shallow rules quickly | Prioritize Shadow/Paper; rename Theatre as a storyboard until playback exists; remove deterministic “safe/steady” implication from arbitrary token presence | MEDIUM | HIGH |
| 6 | Strongest lesson is buried. Home iterates games below large saved art and actions | First impression rewards the weakest state | Add one featured “Move the light. Find the shade.” entry near the top; preserve resume priority | LOW | HIGH |
| 7 | Digital work is not carried through the physical counterpart. `path-nearby-screen.tsx` passes context, not composition | The distinctive product connection becomes two unrelated exercises | For one flagship only, carry allowlisted selected conditions into a comparison prompt; say explicitly when models differ | MEDIUM | HIGH |
| 8 | “Change my creation” initializes a new draft. `PathGameScreen.restart()` → `start-path` → `initialPathState()` | Breaks ownership and makes revisiting unrewarding | Clone the saved allowlisted configuration into an editable draft, or honestly label “Make another version” | LOW–MEDIUM | MEDIUM |
| 9 | Release presentation is stale/template-like. Viewed icon; mission-only membership/README/submission; legal TODOs | Makes the product look unfinished and misstates the offer | Replace icon/adaptive assets, verify contact details, remove internal instructions after actual review, synchronize released feature inventory | MEDIUM | HIGH |
| 10 | No demonstrated child appeal or parent willingness to pay | Tests establish state transitions, not enjoyment, understanding or subscription value | Observe a few consented sessions; record first meaningful action, voluntary retry, explanation and parent offer comprehension. Report actual results only | MEDIUM/external | HIGH |

## 8. Ruthless scope

**STOP BUILDING:** more worlds; more thin minigames; broad 75-lesson rewrite; AI chat; AR; camera/voice evidence; sponsor integrations; a separate parent analytics dashboard.

**SIMPLIFY:** one featured learning journey; one explanation of digital versus physical memories; one readiness handoff where possible; membership copy tied to the actual release.

**KEEP:** local storage, eligibility engine, guardian gate, free missions, reduced-motion provisions, Quicksand/palette, idempotent completion, explicit uncertainty in physical observations.

**DOUBLE DOWN:** a child changes a condition, sees why the result changes, tries a related physical experiment, and can revisit an honest memory. That sequence is the product—not the number of branches.

## 9. Small things with disproportionate value

1. Feature the Shadow experiment without requiring a catalog search.
2. Replace “Your The…” with “Your delivery path is here.”
3. Correct learning-memory verbs before adding any new memory UI.
4. Give every draft-conflict error an actionable Resume button.
5. Show “Observed in the game” versus “Reported after trying it” on relevant memories.
6. Show concrete Family examples to the guardian, not only counts.
7. Replace the configured template icon; verify Android adaptive assets too.
8. Add a release-evidence checklist with actual links/build number and test date, not only checkboxes.

These are recommendations, not completed changes. No AI feature is necessary.

## 10. Competitors and originality

Primary vendor sources describe features, not independent proof of educational effectiveness. The comparisons below are product judgments, not hands-on competitive testing.

| Product | Overlap / what it does better | Constellation opportunity | Do not copy |
|---|---|---|---|
| [Tinybop Weather](https://tinybop.com/apps/weather) | Manipulable weather relationships and supporting family discussion materials; clearer systemic experimentation | Turn one digital relationship into an accessible physical investigation with a local memory | Its entire science sandbox breadth; build one defensible relationship first |
| [Pok Pok](https://playpokpok.com/) | Open-ended digital toys, a growing playroom and clear parent positioning; many immediate manipulation possibilities | More explicit screen-to-real-world continuity and older-child explanation | Its whole toy library or vendor claims such as “non-addictive” without evidence |
| [Toca Boca World](https://www.tocaboca.com/toca-boca-world) | World arrangement, characters and child-created stories; stronger ownership proposition | Keep small creations useful, then connect stories to nearby objects and people | Content-volume competition, store complexity or a massive character system |
| [KiwiCo](https://www.kiwico.com/) | Hands-on projects and supplied materials; makes the physical activity tangible | Low-preparation activities using family-approved ordinary materials | Logistics, kit fulfillment or claims that digital models replace physical experiments |
| [Duolingo](https://blog.duolingo.com/duolingo-teaching-method/) — adjacent | Focused practice with feedback and structured progression; clearer skill being exercised | Make prediction → manipulation → explanation → transfer equally legible | Streak pressure, grades for creativity, or a language-course layout applied to every curiosity activity |

SpeakX and DataCamp are useful analogies for practising a specific skill, but not the closest substitutes for a family choosing a children's activity. Constellation should borrow the clarity of task and feedback, not pretend to offer equivalent curriculum depth.

**Is differentiation visible? Partly, and too late.** The “Try it nearby” link exists, but the strongest bridge is still explained. Show a digital light/shadow result, the physical ready screen, then two clearly labeled memories in the demo. A paired-memory presentation is a proposed improvement; do not present it as shipped yet.

## 11. Demo: target 115 seconds, not exactly two minutes

No final video was supplied. This is a proposed edit using existing functions except where marked.

| Time | Show | Narration / purpose |
|---|---|---|
| 0:00–0:10 | Shadow responds to moving the light, immediately | “What if a game gave a child an idea to try away from the screen?” No logo sequence |
| 0:10–0:30 | Prediction, change light side, record observation | Establish a concrete learning task, not an activity directory |
| 0:30–1:00 | Explanation and shade challenge; save digital finding | Show the child applying the relationship. Say “practised,” not “mastered” |
| 1:00–1:30 | Try nearby → safety preparation → phone-down; cut to return and saved star | Clearly label the edit as a later return. A real physical demonstration can be newly filmed; never imply the app verified it |
| 1:30–1:50 | Grown-up entry, actual native RC paywall, restore path | This segment is BLOCKED until a real configured device build is verified. Never substitute a mock purchase-success screen |
| 1:50–1:55 | Digital find versus physical star, then live listing | “Play with an idea. Try it nearby. Remember what you discovered.” End before 2:00 |

Do not spend time on every onboarding slide, six area menus, all 25 titles, architecture diagrams, typing a profile or a future roadmap. Use a staged non-identifying test profile; do not expose real child information.

## 12. Submission presentation

- **Title:** Constellation. Optional subtitle: “Play an idea. Try it for real.” Avoid another rebrand before launch.
- **One-line description:** “Small interactive experiments that lead children into safe, hands-on discoveries with their families.”
- **Tagline:** “Move a light. Build a bridge. Take the idea outside.”
- **Devpost structure:** the concrete family situation; one demonstrated loop; what works today; safety/data boundary; exact RevenueCat integration; evidence and limitations; build lesson. Write the personal build story yourself and use this audit to fact-check it.
- **Screenshots:** strongest interaction, its changed result, physical ready/phone-down screen, honest memory/star, guardian membership. Do not imply a before/after is an automatic detection feature.
- **Icon:** current configured file is a template mark. Replace with one recognizable Constellation symbol at small size; this is a required polish task, not a full brand exercise.
- **README:** lead with a current screenshot and run instructions, then feature status, test commands and limitations. Remove the contradiction that all meaningful action happens off-screen while digital play is now an equal mode.
- **GitHub:** inspect and commit the current files after fixes; public presentation must correspond to the demo build. Add a visible license only with the owner's choice, especially if pursuing Next Gen. Do not expose environment credentials.
- **Demo title:** “Constellation — from a shadow game to a real-world discovery.”
- **Thumbnail:** actual light/shadow scene with a small “Try it nearby” cue; no wall of feature badges.
- **Feature explanation:** distinguish digital games from physical missions and generated variants from independently authored lessons.
- **Monetization explanation:** useful free experiments and six free missions; Family expands the physical library and available paid scenarios. List only paid digital scenarios that actually ship. Verify store-localized price/trial text before publishing figures.

## 13. Build priorities until deadline

These estimates are rough focused-work ranges, not promises. Store review and human validation cannot be scheduled like code changes.

### Must fix before submission

| Task | Effort | Impact | Dependency | Exact objective |
|---|---|---|---|---|
| Eligibility verification | 1–2 hours to establish status; release may take days | HIGH | Play/RC owner access | Know whether a qualifying public listing and live billing exist; stop treating local preview as release proof |
| Draft-conflict repair | 2–4 hours | HIGH | Existing session engine | Paper↔other game offers resume/explicit replacement, never a retry-only dead end |
| Evidence correction | 1–2 hours | HIGH | Reducer tests | Identical repeated tests never claim a revision |
| Review/age claim audit | Several hours plus qualified reviewer availability | HIGH | Human review | Remove unsupported claims; exclude any variant whose safety cannot be justified |
| Billing and judge access | Half to one day plus store dependencies | HIGH | Native build, products, RC offering | Purchase/cancel/restore/expiry tested; premium access available for judging |
| Icon, policies, current copy | Half day plus legal/contact verification | HIGH | Approved assets and verified contacts | No template icon, TODO policy copy or inaccurate membership promise |
| Submission evidence | Half day after release readiness | HIGH | Actual build/store/assets | Under-two-minute native demo, correct images, working links and final Submitted status |

### High-leverage improvements

| Task | Effort | Impact | Dependency | Exact objective |
|---|---|---|---|---|
| Feature Shadow near Home top | 1–2 hours | HIGH | Existing route | Reach meaningful manipulation without scrolling through several options |
| Preserve creation when editing | 2–4 hours | MEDIUM | Allowlisted draft initializer | “Change” starts from what the child made |
| One carried-over physical comparison | Half day | HIGH | Session compatibility review | One safe, explicit comparison connects digital experiment to physical report |
| Small family observation sessions | Half day plus recruitment | HIGH | Consent and safe build | Obtain actual observations, not testimonials scripted around desired results |
| Focused Android QA | Half day | HIGH | Device/build | Check resume, Back, offline, text size, TalkBack and gate; document failures honestly |

### Ignore for now

New worlds, subscriptions with new backend infrastructure, accounts/sync, a second store platform, AI, notifications, ads, sponsor SDKs, elaborate sharing, new analytics, expanded badges/collections, and broad UI refactoring. Their dependencies and regression risk exceed their value before this deadline.

**Order:** determine release feasibility today; fix trust/navigation defects; validate one journey; record the real build. If the required public release cannot happen, investigate Next Gen only if personally eligible. Do not imply ordinary-entry eligibility while waiting for approval.

## 14. Simulated judge notes

**What the app is:** A children's discovery app combining small digital experiments and local, guardian-bounded physical missions.

**Strongest aspect:** The deliberate boundary between app-observed interaction and reported real-world action, supported by meaningful safety and persistence engineering—though some digital summaries currently violate that intended honesty.

**Most memorable moment:** Moving the light and solving the shade problem, followed by a related real-world invitation.

**Biggest concern:** The breadth of the promise exceeds the depth and validation of the exercises; release and commercial evidence are unverified.

**What feels unfinished:** Draft-switching error, template icon, textual theatre, inconsistent editing, generated age distinctions and outdated marketing.

**What differentiates it:** Potentially the continuous experiment-to-family-activity journey, not the planet artwork alone.

**Evidence relevant to its strongest categories:** Design has a coherent visual base and one stronger interaction. Peace has a feasible positive-use mechanism but lacks demonstrated impact. Best Game has manipulable prototypes but weak replay evidence. None is established by catalog size.

**What would materially strengthen it:** A publicly installable, billing-verified build; one uninterrupted and honestly described journey; accurate learning memories; a small amount of real family evidence; and a concise native demo that shows the idea before explaining the vision.

## Verification appendix

Passed during this audit: `npm run typecheck`, `npm run lint`, `npm run test:planet`, `npm run test:engine`, `npm run test:persistence`. The persistence command tests web behavior; it is not a native SQLite device test. Assertions labeled “reviewed” validate data structure, not human review.

Live web inspected at 393×852; Home and the Paper Post conflict were examined. No console errors were returned for that inspected tab, but a visible handled application error was reproduced. This is not a full runtime certification. Earlier Expo Doctor reported patch-version mismatches; it was not rerun here. Native device performance, final build permissions, production billing and every mission flow remain Not verified.

The local server was restarted for inspection at `http://localhost:8091`. No product code, dependencies, purchases, store configuration or submission state were changed by this audit.

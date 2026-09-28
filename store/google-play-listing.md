# Google Play Listing Draft

## Store identity

- App name: **Constellation: Kids Missions**
- Package: `com.constellation.app`
- Category: Education
- Target audience: 6–8 and 9–12
- Ads: No
- Initial language: English

## Short description

Play with an idea, then try a related real-world activity together.

## Full description

Constellation helps children ages 6–12 experiment on screen, then investigate related ideas in the real world with a grown-up when needed.

In Pocket Planet, fold and test a paper bridge or move a light to investigate shadows. Save a digital find, then choose a related real-world mission when the place, people and materials fit. Other tools let children arrange storyboards, sort objects and plan movements. The real-world catalog includes rose observation, paper building, family storytelling, shadow tracing and everyday projects.

Every mission follows a thoughtful rhythm: understand the story signal, make a choice or prediction, prepare safely, put the phone down, try the experience, return with an observation or reflection, and light a star.

Built for families:

- age-adapted prompts for 6–7, 8–9, and 10–12;
- guardian-led missions for ages 6–7;
- rule-based eligibility for time, place, company, materials, weather, and support needs;
- no ads, streaks, rankings, XP, social feed, or open-ended AI chat;
- no camera, microphone, photo proof, or precise location;
- child profile and progress stored locally on the device;
- grown-up-only membership, restore, privacy, deletion, and support controls.

Digital experiments and six real-world missions—one in each curiosity area—are free. Constellation Family adds two Paper Post challenges and access to all 25 real-world missions. Subscription terms and any trial are shown by Google Play before purchase. This copy is a draft; public publication requires the review and billing evidence in `mobile/release/`.

Most technology competes for children’s attention. Constellation competes for their curiosity.

## Screenshot sequence

1. **Move the light** — Pocket Planet's responsive shadow experiment.
2. **Predict, observe, explain** — a complete light-and-shadow lesson.
3. **Take the idea nearby** — an eligibility-gated physical shadow activity.
4. **Now put the phone down** — the midnight memory-cue screen.
5. **A star remembers what they did** — resolved world and truthful learning memory.
6. **Membership stays with grown-ups** — protected Family comparison and restore controls.

Do not show child-entered text, real child names, purchase test accounts, debug UI, console output, or framed Devpost imagery. Retain one unframed 1179×2556 export and the existing 1024×1024 icon.

## Data Safety working notes

These notes are an engineering inventory, not a substitute for completing the current Play Console form against the final AAB.

- Child profile and mission progress: stored locally; not transmitted by Constellation.
- Purchase information: processed only after grown-up action by Google Play and RevenueCat; used for app functionality and subscription management.
- Advertising: none.
- Third-party child analytics: none.
- Account creation: none.
- Precise/approximate location: not requested.
- Photos, video, audio, contacts, school, legal name: not requested.
- Deletion: local child data can be deleted in-app; purchase entitlement is preserved.

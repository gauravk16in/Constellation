# Release evidence — do not replace facts with checkmarks

`npm run check:release` checks production prerequisites. The production EAS post-install hook runs it; development and preview builds are unaffected. `npm run check:submission` additionally checks submission fields. Both deliberately fail until actual evidence is supplied.

Each review/test record needs `reviewer`, ISO `date`, and `reference` to a real review or test log. No child-identifying information belongs here. Content reviews additionally need `experienceId`, `ageBand`, `approved: true`, and ISO `expiresAt`. Supply one qualified review for each of the 75 advertised variants; the generated registry metadata is not that review. If a variant cannot be approved, exclude it through catalog policy and adjust this gate deliberately—not by fabricating approval.

## Owner inputs still needed

- Verified support inbox and legal entity details; qualified policy review.
- Qualified editorial/safety sign-off, particularly younger variants.
- Consented family observations: first interaction, independent change, voluntary retry, physical-task explanation, guardian membership understanding. Report failed observations too.
- Actual Play/RevenueCat setup: public Android SDK key in EAS production, offering `default`, entitlement `constellation_family`, monthly and annual products, configured paywall and Customer Center.
- Native billing log: build number, device, purchase, cancellation, restore, restart/offline, expiry/refund, saved-creation preservation, child-data deletion. Never store credentials or transaction PII here.
- Public U.S. Play listing and eligible first-release date, RevenueCat project ID, judge-access test, public demo under two minutes and unframed 1179×2556 screenshot.

Proposed pricing remains $7.99 monthly / $39.99 annually with a 14-day annual trial. Only the actual store offering can establish availability and localized terms. Do not display a fabricated purchase success for a demo.

## Five-family observation sheet

For each consented session record anonymous session code, age band, build, whether setup needed help, seconds until meaningful interaction, what condition the child changed, whether they voluntarily tried another possibility, what they said they would do physically, and any confusion/safety failure. Do not put names, recordings or private child answers in Git. A test script is not a completed pilot.

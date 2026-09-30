import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { policyReviewed, supportContactCopy, supportEmail } from '@/data/release-status';
import { colors, fontFamilies, radius, spacing } from '@/theme';

type LegalKind = 'privacy' | 'terms' | 'safety' | 'support';
type Section = { heading: string; body: string };

const PAGES: Record<LegalKind, { eyebrow: string; title: string; intro: string; sections: Section[] }> = {
  privacy: {
    eyebrow: 'CONSTELLATION INC. · LAST UPDATED SEPTEMBER 4, 2026',
    title: 'Privacy should be understandable.',
    intro: 'Constellation is designed for children ages 6–12 and their grown-ups. Child setup, mission work, reflections, and progress stay on the device in this release.',
    sections: [
      { heading: 'Information stored locally', body: 'A nickname, age band, selected curiosity areas, support preferences, allowed places, one active physical mission, one digital draft, digital creations and experiment state, mission outcomes, optional reflections, learning-memory statements, and constellation stars.' },
      { heading: 'Information we do not ask children for', body: 'A legal name, school, email, phone number, photos, recordings, contacts, precise location, advertising identifier, or open-ended AI conversation.' },
      { heading: 'Optional read-aloud voice', body: 'A child can tap to hear fixed, authored prompts. Constellation does not use the microphone or send child answers to a voice service. The device’s speech provider supplies the voice; its installed voices and processing may vary by device.' },
      { heading: 'Purchases', body: 'A grown-up initiates purchases in protected membership controls. RevenueCat and the store process an anonymous purchase identifier, product information and transaction status. Devices with an existing Family entitlement may refresh that purchase status at launch. Constellation does not attach child profiles, answers or progress.' },
      { heading: 'Analytics and advertising', body: 'This release contains no third-party child analytics, behavioral advertising, ad network, or sale of personal information.' },
      { heading: 'Control and deletion', body: 'A grown-up can delete the local child profile, physical and digital drafts, creations, outcomes, reflections, and stars inside Grown-up controls. Store entitlement remains because deleting child data must not cancel a purchase.' },
      { heading: 'Contact', body: supportContactCopy },
    ],
  },
  terms: {
    eyebrow: 'CONSTELLATION INC. · LAST UPDATED SEPTEMBER 4, 2026',
    title: 'Terms for exploring safely.',
    intro: 'A grown-up should review setup, safety boundaries, and purchases. Constellation offers digital experiments and optional real-world activities; neither is an assessment of a child.',
    sections: [
      { heading: 'What Constellation provides', body: 'Authored digital experiments and prompts for real-world learning and play. Constellation is a guide, not childcare, medical advice, emergency guidance, formal education, or a guarantee of mastery.' },
      { heading: 'Grown-up responsibility', body: 'A trusted grown-up chooses allowed places and support needs, checks materials and surroundings, and stays present whenever a mission or the child’s age variant requires it.' },
      { heading: 'Family membership', body: 'Six flagship missions remain available without membership. Constellation Family provides access to the complete current mission library while the store entitlement is active. Prices, trials, renewals, cancellation, and refunds are shown and managed by Google Play.' },
      { heading: 'Safe use', body: 'Stop a mission if the place, person, material, weather, or instruction no longer feels safe. Never use the app as permission to touch, taste, pick, climb, enter, or approach something a grown-up has not approved.' },
      { heading: 'Changes and availability', body: 'Mission content may change after review. Individual age variants can be removed when they cannot meet editorial or safety standards. Local data may be lost if the app or device storage is removed.' },
      { heading: 'Contact', body: supportContactCopy },
    ],
  },
  safety: {
    eyebrow: 'HOW CONSTELLATION REVIEWS MISSIONS',
    title: 'Safety is part of the mission model.',
    intro: 'Constellation uses an authored catalog and deterministic eligibility checks. It does not randomly generate children’s activities or loosen a rule when no mission fits. Automated checks do not replace qualified safety review or grown-up judgment.',
    sections: [
      { heading: 'Before publication', body: 'Every published mission requires a version, age policies, factual sources, reviewer role, review and expiry dates, change note, settings, companions, materials, adaptations, and a concise safety rule.' },
      { heading: 'Before recommendation', body: 'The engine checks age band, available time, allowed place, current setting, people present, materials, weather status, time of day, support needs, and membership access.' },
      { heading: 'Before starting', body: 'The app repeats eligibility and requires the authored interaction, preparation checks, risk-based safety sequence, and grown-up confirmation where configured. Ages 6–7 are always guardian-led.' },
      { heading: 'Phone-down boundary', body: 'The phone offers one memory cue, then the real product happens away from the screen. Timers are optional, survive backgrounding, and never mark success or failure.' },
      { heading: 'Evidence without surveillance', body: 'Children may return with a prediction, observation, retell, explanation, safety decision, or strategy. The saved learning memory is authored and modest; Constellation never claims verified mastery or requires photographic proof.' },
      { heading: 'Report a concern', body: `Stop the mission first. ${supportContactCopy}` },
    ],
  },
  support: {
    eyebrow: 'HELP FOR GROWN-UPS',
    title: 'We’ll help you find the next step.',
    intro: 'Support covers setup, local mission progress, membership recovery, accessibility, and safety concerns.',
    sections: [
      { heading: 'Membership and restore', body: 'Open Grown-up controls, pass the parental gate, then choose Family membership. Purchases and restore are initiated only there.' },
      { heading: 'Local data', body: 'Mission progress is device-local. It does not sync across devices. Removing the app or clearing its storage may remove the child’s Constellation.' },
      { heading: 'Accessibility', body: 'Constellation provides screen-reader labels, non-drag alternatives, large touch targets, reduced-motion support, and scrollable small-screen layouts. Tell us where an experience still creates a barrier.' },
      { heading: 'Contact support', body: supportContactCopy },
    ],
  },
};

export function LegalPageScreen({ kind }: { kind: LegalKind }) {
  const page = PAGES[kind];
  return <Screen style={styles.screen} contentContainerStyle={styles.content}><View style={styles.main}>
    {!policyReviewed ? <ThemedText style={styles.body} variant="body">Preview information · Independent policy and content review is pending. This preview is not a certified learning or safety product.</ThemedText> : null}
    <View style={styles.intro}><ThemedText style={styles.eyebrow} variant="caption">{page.eyebrow}</ThemedText><ThemedText accessibilityRole="header" style={styles.heading} variant="display">{page.title}</ThemedText><ThemedText style={styles.lead} variant="body">{page.intro}</ThemedText></View>
    <View style={styles.surface}>{page.sections.map((section, index) => <View key={section.heading} style={[styles.section, index > 0 && styles.sectionBorder]}><ThemedText accessibilityRole="header" style={styles.sectionTitle} variant="title">{section.heading}</ThemedText><ThemedText style={styles.body} variant="body">{section.body}</ThemedText></View>)}</View>
    {supportEmail ? <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(`mailto:${supportEmail}`)} style={styles.contact}><ThemedText style={styles.contactText} variant="label">Email Constellation →</ThemedText></Pressable> : null}
  </View></Screen>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: colors.onboardingCanvas }, content: { alignItems: 'center', padding: spacing.six, paddingBottom: spacing.twelve }, main: { gap: spacing.six, maxWidth: 720, width: '100%' }, intro: { gap: spacing.three }, eyebrow: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.bold, fontSize: 11, letterSpacing: 1 }, heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 36, lineHeight: 42 }, lead: { color: colors.onboardingInkMuted, fontSize: 18, lineHeight: 27 }, surface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, overflow: 'hidden' }, section: { gap: spacing.two, padding: spacing.six }, sectionBorder: { borderColor: colors.onboardingLine, borderTopWidth: 1 }, sectionTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 20, lineHeight: 26 }, body: { color: colors.onboardingInkMuted, fontSize: 16, lineHeight: 24 }, contact: { justifyContent: 'center', minHeight: 48 }, contactText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold } });

import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { colors, fontFamilies, radius, spacing } from '@/theme';

type LegalKind = 'privacy' | 'terms' | 'safety' | 'support';
type Section = { heading: string; body: string };

const PAGES: Record<LegalKind, { eyebrow: string; title: string; intro: string; sections: Section[] }> = {
  privacy: {
    eyebrow: 'CONSTELLATION INC. · LAST UPDATED SEPTEMBER 4, 2026',
    title: 'Privacy should be understandable.',
    intro: 'Constellation is designed for children ages 6–12 and their grown-ups. Child setup, mission work, reflections, and progress stay on the device in this release.',
    sections: [
      { heading: 'Information stored locally', body: 'A nickname, age band, selected curiosity areas, support preferences, allowed places, one active mission, mission outcomes, optional reflections, learning-memory statements, and constellation stars.' },
      { heading: 'Information we do not ask children for', body: 'A legal name, school, email, phone number, photos, recordings, contacts, precise location, advertising identifier, or open-ended AI conversation.' },
      { heading: 'Purchases', body: 'Only after a grown-up passes the parental gate and opens membership controls, RevenueCat and Google Play process an anonymous app-user identifier, product and entitlement information, and store transaction status. Constellation does not attach child profile or mission data to it.' },
      { heading: 'Analytics and advertising', body: 'This release contains no third-party child analytics, behavioral advertising, ad network, or sale of personal information.' },
      { heading: 'Control and deletion', body: 'A grown-up can delete the local child profile, active session, outcomes, reflections, and stars inside Grown-up controls. Store entitlement remains because deleting child data must not cancel a purchase.' },
      { heading: 'Contact', body: 'For privacy questions or requests, email privacy@constellation.family. A qualified privacy reviewer should approve this policy before public production release.' },
    ],
  },
  terms: {
    eyebrow: 'CONSTELLATION INC. · LAST UPDATED SEPTEMBER 4, 2026',
    title: 'Terms for exploring safely.',
    intro: 'These terms describe Constellation’s first public Android release. A grown-up should review setup, safety boundaries, and purchases.',
    sections: [
      { heading: 'What Constellation provides', body: 'Reviewed prompts for real-world learning and play. Constellation is a guide, not childcare, medical advice, emergency guidance, formal education, or a guarantee of mastery.' },
      { heading: 'Grown-up responsibility', body: 'A trusted grown-up chooses allowed places and support needs, checks materials and surroundings, and stays present whenever a mission or the child’s age variant requires it.' },
      { heading: 'Family membership', body: 'Six flagship missions remain available without membership. Constellation Family provides access to the complete current mission library while the store entitlement is active. Prices, trials, renewals, cancellation, and refunds are shown and managed by Google Play.' },
      { heading: 'Safe use', body: 'Stop a mission if the place, person, material, weather, or instruction no longer feels safe. Never use the app as permission to touch, taste, pick, climb, enter, or approach something a grown-up has not approved.' },
      { heading: 'Changes and availability', body: 'Mission content may change after review. Individual age variants can be removed when they cannot meet editorial or safety standards. Local data may be lost if the app or device storage is removed.' },
      { heading: 'Contact', body: 'Questions about these terms can be sent to support@constellation.family. Final store terms require legal review before publication.' },
    ],
  },
  safety: {
    eyebrow: 'HOW CONSTELLATION REVIEWS MISSIONS',
    title: 'Safety is part of the mission model.',
    intro: 'Constellation uses a reviewed catalog and deterministic eligibility checks. It does not randomly generate children’s activities or loosen a rule when no mission fits.',
    sections: [
      { heading: 'Before publication', body: 'Every published mission requires a version, age policies, factual sources, reviewer role, review and expiry dates, change note, settings, companions, materials, adaptations, and a concise safety rule.' },
      { heading: 'Before recommendation', body: 'The engine checks age band, available time, allowed place, current setting, people present, materials, weather status, time of day, support needs, and membership access.' },
      { heading: 'Before starting', body: 'The app repeats eligibility and requires the authored interaction, preparation checks, risk-based safety sequence, and grown-up confirmation where configured. Ages 6–7 are always guardian-led.' },
      { heading: 'Phone-down boundary', body: 'The phone offers one memory cue, then the real product happens away from the screen. Timers are optional, survive backgrounding, and never mark success or failure.' },
      { heading: 'Evidence without surveillance', body: 'Children may return with a prediction, observation, retell, explanation, safety decision, or strategy. The saved learning memory is authored and modest; Constellation never claims verified mastery or requires photographic proof.' },
      { heading: 'Report a concern', body: 'Stop the mission first. Then email safety@constellation.family with the mission title, age band, and concern. Do not include a child’s name, photo, voice, or precise location.' },
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
      { heading: 'Contact support', body: 'Email support@constellation.family. Do not send a child’s legal name, school, photo, voice recording, or precise location.' },
    ],
  },
};

export function LegalPageScreen({ kind }: { kind: LegalKind }) {
  const page = PAGES[kind];
  return <Screen style={styles.screen} contentContainerStyle={styles.content}><View style={styles.main}><View style={styles.intro}><ThemedText style={styles.eyebrow} variant="caption">{page.eyebrow}</ThemedText><ThemedText accessibilityRole="header" style={styles.heading} variant="display">{page.title}</ThemedText><ThemedText style={styles.lead} variant="body">{page.intro}</ThemedText></View><View style={styles.surface}>{page.sections.map((section, index) => <View key={section.heading} style={[styles.section, index > 0 && styles.sectionBorder]}><ThemedText accessibilityRole="header" style={styles.sectionTitle} variant="title">{section.heading}</ThemedText><ThemedText style={styles.body} variant="body">{section.body}</ThemedText></View>)}</View><Pressable accessibilityRole="link" onPress={() => void Linking.openURL(`mailto:${kind === 'privacy' ? 'privacy' : kind === 'safety' ? 'safety' : 'support'}@constellation.family`)} style={styles.contact}><ThemedText style={styles.contactText} variant="label">Email Constellation →</ThemedText></Pressable></View></Screen>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: colors.onboardingCanvas }, content: { alignItems: 'center', padding: spacing.six, paddingBottom: spacing.twelve }, main: { gap: spacing.six, maxWidth: 720, width: '100%' }, intro: { gap: spacing.three }, eyebrow: { color: colors.onboardingInkMuted, fontFamily: fontFamilies.bold, fontSize: 11, letterSpacing: 1 }, heading: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 36, lineHeight: 42 }, lead: { color: colors.onboardingInkMuted, fontSize: 18, lineHeight: 27 }, surface: { backgroundColor: colors.onboardingSurface, borderColor: colors.onboardingLine, borderCurve: 'continuous', borderRadius: radius.large, borderWidth: 1, overflow: 'hidden' }, section: { gap: spacing.two, padding: spacing.six }, sectionBorder: { borderColor: colors.onboardingLine, borderTopWidth: 1 }, sectionTitle: { color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 20, lineHeight: 26 }, body: { color: colors.onboardingInkMuted, fontSize: 16, lineHeight: 24 }, contact: { justifyContent: 'center', minHeight: 48 }, contactText: { color: colors.onboardingInk, fontFamily: fontFamilies.bold } });

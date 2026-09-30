import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { getExperienceById } from '@/data/catalog/experience-catalog';
import { useAppData } from '@/features/app/app-data-provider';
import { LittleLandingArtwork } from '@/features/planet/little-landing-artwork';
import { PlayTrailMap } from '@/features/planet/play-trail-map';
import { initialPaper, paperFeedback, reducePaper } from '@/features/planet/paper-post-engine';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { usePlanet } from '@/features/planet/planet-provider';
import { PATH_GAMES } from '@/features/planet/path-game-engine';
import { MissionVoice } from '@/features/voice/mission-voice';
import { spacing } from '@/theme';
import { planetInk, planetStyles as s } from '@/theme/planet';
import type { PaperState } from '@/types/pocket-planet';

export function PlanetScreen() {
  const { data, error, reload } = usePlanet();
  const { activeSession, outcomes } = useAppData();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [previewPaper, setPreviewPaper] = useState<PaperState>(() => initialPaper('first-parcel'));
  const starCount = outcomes.filter((outcome) => outcome.state === 'completed').length;
  const nextShape = previewPaper.shape === 'flat' ? 'folded' : previewPaper.shape === 'folded' ? 'accordion' : 'flat';
  return <ScrollView contentInsetAdjustmentBehavior="automatic" style={s.page} contentContainerStyle={[s.content, { paddingTop: Math.max(insets.top, spacing.four), paddingBottom: insets.bottom + spacing.eight }]}>
    <View style={[s.row, { justifyContent: 'space-between' }]}><ThemedText style={s.label}>POCKET PLANET</ThemedText><PlanetChoice label="Grown-ups" onPress={() => router.push('/grown-ups')} /></View>
    <View style={{ gap: spacing.one }}><ThemedText accessibilityRole="header" style={s.title}>Little Landing</ThemedText><ThemedText style={s.body}>A little world shaped by your big ideas.</ThemedText></View>
    {!data && !error ? <ActivityIndicator accessibilityLabel="Opening your planet" /> : null}
    {error ? <View style={s.surface}><ThemedText accessibilityRole="alert" style={s.body}>{error}</ThemedText><PlanetChoice label="Try again" onPress={() => void reload()} /></View> : null}
    {data ? <>
      {data.pathSession || data.session || activeSession ? <View style={s.surface}>
        <ThemedText style={s.caption}>PICK UP WHERE YOU LEFT OFF</ThemedText>
        {data.pathSession ? <ActionButton variant="ink" label={`Continue ${PATH_GAMES[data.pathSession.gameId].title}`} onPress={() => router.push(`/play/${data.pathSession!.gameId}`)} /> : data.session ? <ActionButton variant="ink" label="Continue Paper Post" onPress={() => router.push('/play/paper-post')} /> : null}
        {activeSession ? <PlanetChoice label={`Return to ${getExperienceById(activeSession.experienceId)?.title ?? 'my real-world mission'}`} onPress={() => router.push(`/experience/${activeSession.experienceId}`)} /> : null}
      </View> : null}
      <View style={[s.section, { backgroundColor: planetInk.landingWash, borderRadius: 28, borderCurve: 'continuous', padding: spacing.four }]}>
        <ThemedText style={s.caption}>AT THE PAPER CROSSING</ThemedText>
        <ThemedText accessibilityRole="header" style={s.prompt}>Can this paper carry the parcel?</ThemedText>
        <ThemedText style={s.body}>Tap the paper to change its fold. Tap the parcel to test your idea.</ThemedText>
        <View style={{ alignSelf: 'center', maxWidth: 380, width: '100%' }}><LittleLandingArtwork state={previewPaper}
          onFold={() => setPreviewPaper((current) => reducePaper(current, { type: 'shape', value: nextShape }))}
          onTest={() => setPreviewPaper((current) => reducePaper(current, { type: 'test' }))} /></View>
        <ThemedText accessibilityLiveRegion="polite" style={s.body}>{previewPaper.result ? paperFeedback(previewPaper) : `Your paper is ${previewPaper.shape === 'flat' ? 'flat' : previewPaper.shape === 'folded' ? 'folded at the edges' : 'folded like an accordion'}. What do you think will happen?`}</ThemedText>
        <View style={s.row}><PlanetChoice label="Change the fold" onPress={() => setPreviewPaper((current) => reducePaper(current, { type: 'shape', value: nextShape }))} /><PlanetChoice label="Test the parcel" onPress={() => setPreviewPaper((current) => reducePaper(current, { type: 'test' }))} /></View>
        <ActionButton variant="ink" label="Play Paper Post" onPress={() => router.push(`/play/paper-post?shape=${previewPaper.shape}`)} />
        <MissionVoice text="Can this paper carry Pip's parcel? Change the fold, test it, and see what happens." />
      </View>
      <PlayTrailMap data={data} />
      <View style={s.surface}><ThemedText accessibilityRole="header" style={s.prompt}>Take an idea outside</ThemedText><ThemedText style={s.body}>Build a real paper bridge with approved materials, or explore {starCount === 1 ? 'your star' : `${starCount} stars`} in My Finds. Real-world missions check your family’s safety choices before starting.</ThemedText><PlanetChoice label="Try a real paper bridge nearby" onPress={() => router.push('/bridge-nearby')} /></View>
    </> : null}
  </ScrollView>;
}

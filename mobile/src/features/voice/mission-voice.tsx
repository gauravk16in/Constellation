import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import * as Speech from 'expo-speech';

import { ThemedText } from '@/components/themed-text';
import { colors, fontFamilies, radius, spacing } from '@/theme';

type AvailableVoice = Pick<Speech.Voice, 'identifier' | 'language' | 'name'>;

export function chooseIndianEnglishVoice(voices: AvailableVoice[]) {
  const indian = voices.filter((voice) => /^en[-_]IN$/i.test(voice.language));
  // Platforms do not expose a reliable gender field. Prefer named feminine voices only when installed.
  return indian.find((voice) => /female|woman|heera|raveena|veena|lekha|kavya/i.test(voice.name)) ?? indian[0];
}

export function MissionVoice({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => () => { void Speech.stop().catch(() => {}); }, [text]);

  const toggle = async () => {
    if (speaking) {
      await Speech.stop();
      setSpeaking(false);
      return;
    }
    try {
      await Speech.stop();
      const voice = chooseIndianEnglishVoice(await Speech.getAvailableVoicesAsync());
      Speech.speak(text.slice(0, Speech.maxSpeechInputLength), {
        language: 'en-IN',
        voice: voice?.identifier,
        rate: 0.88,
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => { setSpeaking(false); setUnavailable(true); },
      });
      setSpeaking(true);
      setUnavailable(false);
    } catch {
      setSpeaking(false);
      setUnavailable(true);
    }
  };

  return <View style={{ gap: spacing.one }}>
    <Pressable accessibilityRole="button" accessibilityLabel={speaking ? 'Stop reading aloud' : 'Hear this aloud; Indian English when available'}
      onPress={() => void toggle()} style={({ pressed }) => ({ alignSelf: 'flex-start', alignItems: 'center', borderColor: colors.onboardingLine,
        borderCurve: 'continuous', borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', gap: spacing.two,
        minHeight: 48, opacity: pressed ? 0.65 : 1, paddingHorizontal: spacing.four })}>
      <ThemedText selectable={false} style={{ color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 17 }}>◖))</ThemedText>
      <ThemedText selectable={false} style={{ color: colors.onboardingInk, fontFamily: fontFamilies.bold, fontSize: 14 }}>{speaking ? 'Stop voice' : 'Hear this'}</ThemedText>
    </Pressable>
    {unavailable ? <ThemedText accessibilityRole="alert" style={{ color: colors.onboardingInkMuted, fontSize: 13 }}>Voice is unavailable here. You can still read every step.</ThemedText> : null}
  </View>;
}

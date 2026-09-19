import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Svg from 'react-native-svg';
import { ThemedText } from '@/components/themed-text';
import { BridgeDrawing } from '@/features/planet/little-landing-artwork';
import { PlanetChoice } from '@/features/planet/planet-controls';
import { usePlanet } from '@/features/planet/planet-provider';
import { bridgeColors, planetStyles as s } from '@/theme/planet';

export function PlanetFinds() {
  const { data, error, busy, change } = usePlanet();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();
  const selected = data?.artifacts.find((item) => item.id === selectedId);
  const outcome = data?.outcomes.find((item) => item.id === selected?.outcomeId);
  return <View style={s.section}>
    <ThemedText style={s.body}>Creations you made and tested inside the game. These memories describe actions the app observed, not verified learning.</ThemedText>
    {error ? <ThemedText accessibilityRole="alert" style={s.body}>{error}</ThemedText> : null}
    {!data?.artifacts.length ? <View style={s.surface}><ThemedText style={s.label}>A space for your ideas.</ThemedText><ThemedText style={s.body}>Keep a bridge in Paper Post and it will live here.</ThemedText><PlanetChoice label="Play Paper Post" onPress={() => router.push('/play/paper-post')} /></View> : null}
    {data?.artifacts.map((item, index) => <PlanetChoice key={item.id} label={`Bridge ${index + 1} · ${item.color} · ${item.shape}`} selected={item.id === selectedId} onPress={() => setSelectedId(item.id)}>
      <Svg accessibilityElementsHidden width="100%" height={55} viewBox="-10 -8 220 55"><BridgeDrawing shape={item.shape} color={bridgeColors[item.color]} /></Svg>
    </PlanetChoice>)}
    {selected ? <View style={s.surface}>
      <ThemedText accessibilityRole="header" style={s.label}>What this creation remembers</ThemedText>
      <ThemedText style={s.caption}>Made here · {new Date(selected.createdAt).toLocaleDateString()}</ThemedText>
      {outcome?.evidence.map((statement) => <ThemedText key={statement} style={s.body}>{statement}</ThemedText>)}
      <ThemedText style={s.body}>Talk together: where else could you try this idea?</ThemedText>
      <ThemedText style={s.label}>Choose a place in Little Landing</ThemedText>
      <View style={s.row}>{(['workshop', 'hill', 'theatre'] as const).map((position) => <PlanetChoice key={position} label={position === 'workshop' ? 'The crossing' : position === 'hill' ? 'On the hill' : 'By the theatre'} selected={selected.position === position} disabled={busy} onPress={() => void change({ type: 'move', artifactId: selected.id, position })} />)}</View>
      <PlanetChoice label="See it on my planet" onPress={() => router.push('/home')} />
    </View> : null}
    {data?.replacement ? <View style={s.surface}><ThemedText style={s.body}>The previous bridge is still recoverable. Undo restores it in place of the replacement; the experiment memory remains.</ThemedText><PlanetChoice label="Undo last replacement" disabled={busy} onPress={() => void change({ type: 'undo-replacement' })} /></View> : null}
  </View>;
}

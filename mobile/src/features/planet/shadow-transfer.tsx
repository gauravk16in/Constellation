import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { usePlanet } from '@/features/planet/planet-provider';
import { planetStyles as s } from '@/theme/planet';
import { shadowProjection } from '@/features/planet/shadow-lesson';

/** Reads an allowlisted saved model, never route parameters or child free text. */
export function ShadowTransfer({ returning = false }: { returning?: boolean }) {
  const { data } = usePlanet();
  const find = data?.pathFinds?.find((item) => item.gameId === 'borrow-a-shadow');
  if (find?.state.kind !== 'shadow' || !find.state.lesson) return null;
  const side = shadowProjection(find.state.lesson.lightPosition).side;
  return <View style={s.surface}>
    <ThemedText accessibilityRole="header" style={s.label}>{returning ? 'Compare with your saved experiment' : 'Bring your shadow idea nearby'}</ThemedText>
    <ThemedText style={s.caption}>OBSERVED IN THE GAME · {new Date(find.createdAt).toLocaleDateString()}</ThemedText>
    <ThemedText style={s.body}>In your saved flashlight model, the shadow ended {side === 'under' ? 'under the tree' : `to the ${side} of the tree`}.</ThemedText>
    <ThemedText style={s.body}>{returning ? 'Tell someone: what changed between your two real tracings? What was similar to the model, different, or hard to compare?' : 'Predict together: will the real shadow stay in the same place between two tracings? Keep the object still and compare later.'}</ThemedText>
    <ThemedText style={s.caption}>The model uses a movable light. Outdoors, Earth’s rotation changes the Sun’s apparent position. Never look at the Sun. Talk together; no recording or typed answer is needed.</ThemedText>
  </View>;
}

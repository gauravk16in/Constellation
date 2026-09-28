import { PaperPostScreen } from '@/screens/planet/paper-post-screen';
import { PathGameScreen } from '@/screens/planet/path-game-screen';
import { useLocalSearchParams } from 'expo-router';
export default function PlayRoute() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  return gameId === 'paper-post' ? <PaperPostScreen /> : <PathGameScreen />;
}

import type { AgeBand } from '@/types/constellation';
import type { PathCommand, PathFind, PathGameSession, PathOutcome } from '@/types/path-games';

export type PlayMode = 'digital' | 'real-world';
export type PaperShape = 'flat' | 'folded' | 'accordion';
export type BridgeColor = 'coral' | 'sage' | 'sky';
export type BridgePosition = 'workshop' | 'hill' | 'theatre';
export type PaperScenario = 'first-parcel' | 'wide-gap' | 'heavy-post' | 'sandbox';
export type PaperConfiguration = { shape: PaperShape; gap: 'short' | 'wide'; parcels: 1 | 2 | 3 };
export type PaperTrial = PaperConfiguration & { holds: boolean };
export type PaperState = PaperConfiguration & {
  color: BridgeColor;
  position: BridgePosition;
  trials: PaperTrial[];
  result: PaperTrial | null;
  guardianIntroduced: boolean;
};
export type PaperAction =
  | { type: 'shape'; value: PaperShape }
  | { type: 'gap'; value: PaperConfiguration['gap'] }
  | { type: 'parcels'; value: PaperConfiguration['parcels'] }
  | { type: 'color'; value: BridgeColor }
  | { type: 'position'; value: BridgePosition }
  | { type: 'test' | 'reset' | 'introduce' };

export type GameSession = {
  id: string; profileId: string; gameId: 'paper-post'; gameVersion: 1;
  scenarioId: PaperScenario; ageBand: AgeBand; state: PaperState; updatedAt: string;
};
export type CreativeArtifact = {
  id: string; gameId: 'paper-post'; origin: 'digital'; kind: 'bridge';
  shape: PaperShape; color: BridgeColor; position: BridgePosition;
  createdAt: string; outcomeId: string;
};
export type GameOutcome = {
  id: string; sessionId: string; gameId: 'paper-post'; gameVersion: 1;
  scenarioId: PaperScenario; completedAt: string; evidence: string[];
};
export type PlanetData = {
  version: 1; revision: number; session: GameSession | null;
  artifacts: CreativeArtifact[]; outcomes: GameOutcome[];
  replacement: { previous: CreativeArtifact; replacementId: string } | null;
  numberLessons?: { id: 'near-base'; ageBand: AgeBand; completedAt: string }[];
  pathSession?: PathGameSession | null;
  pathFinds?: PathFind[];
  pathOutcomes?: PathOutcome[];
  pathReplacement?: { previous: PathFind; replacementId: string } | null;
};
export type PlanetCommand = PathCommand
  | { type: 'complete-number-lesson'; lessonId: 'near-base' }
  | { type: 'start'; id: string; scenarioId: PaperScenario; initialShape?: PaperShape; replaceSessionId?: string; replacePathSessionId?: string; editArtifactId?: string }
  | { type: 'act'; sessionId: string; action: PaperAction }
  | { type: 'finish'; sessionId: string; replaceArtifactId?: string }
  | { type: 'undo-replacement' }
  | { type: 'move'; artifactId: string; position: BridgePosition };

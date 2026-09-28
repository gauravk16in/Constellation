import type { AgeBand } from '@/types/constellation';

export type PathGameId = 'object-theatre' | 'borrow-a-shadow' | 'parcel-room' | 'delivery-path';
export type StoryObject = 'parcel' | 'leaf' | 'cup' | 'key' | 'sock' | 'spoon';
export type StoryAction = 'arrive' | 'hide' | 'find';
export type StoryBackdrop = 'workshop' | 'hill' | 'theatre';
export type StoryScene = { object: StoryObject | null; action: StoryAction; backdrop: StoryBackdrop };
export type StoryState = { kind: 'story'; scenes: [StoryScene, StoryScene, StoryScene]; activeScene: 0 | 1 | 2; played: boolean; playCount: number };
export type ShadowObject = 'tree' | 'post' | 'parcel';
export type ShadowTrial = { light: number; object: ShadowObject; mat: number; shade: boolean; length: number };
export type ShadowLessonPhase = 'predict' | 'explore' | 'compare' | 'challenge' | 'complete';
export type ShadowSide = 'left' | 'right' | 'under';
export type ShadowExplanation = 'opposite' | 'same' | 'unrelated';
export type ShadowLesson = {
  phase: ShadowLessonPhase;
  lightPosition: number;
  prediction: ShadowSide | null;
  observations: number[];
  explanation: ShadowExplanation | null;
  explanationAttempts: number;
  challengeAttempts: number;
};
/** `lesson` is optional so previously saved version-1 drafts remain playable. */
export type ShadowState = { kind: 'shadow'; light: number; object: ShadowObject; mat: number; trials: ShadowTrial[]; lesson?: ShadowLesson };
export type SortRule = 'shape' | 'size' | 'purpose';
export type SortObject = 'ball' | 'cup' | 'book' | 'parcel' | 'leaf' | 'sock';
export type SortState = { kind: 'sort'; rule: SortRule; groups: Record<SortObject, 'left' | 'right' | null>; tested: boolean; tests: number };
export type MoveCard = 'slow-step' | 'side-step' | 'pause' | 'look-ahead' | 'wide-step' | 'seated-reach';
export type MoveState = { kind: 'move'; sequence: [MoveCard, MoveCard, MoveCard]; runs: number; steady: boolean | null };
export type PathGameState = StoryState | ShadowState | SortState | MoveState;
export type PathGameSession = { id: string; profileId: string; gameId: PathGameId; version: 1; ageBand: AgeBand; guardianIntroduced: boolean; state: PathGameState; updatedAt: string };
export type PathFind = { id: string; gameId: PathGameId; outcomeId: string; createdAt: string; state: PathGameState };
export type PathOutcome = { id: string; gameId: PathGameId; completedAt: string; evidence: string[] };
export type PathCommand =
  | { type: 'start-path'; id: string; gameId: PathGameId; replaceSessionId?: string; replacePaperSessionId?: string }
  | { type: 'act-path'; sessionId: string; action: PathAction }
  | { type: 'introduce-path'; sessionId: string }
  | { type: 'finish-path'; sessionId: string }
  | { type: 'undo-path-replacement' };
export type PathAction =
  | { type: 'story-scene'; scene: 0 | 1 | 2 }
  | { type: 'story-object'; value: StoryObject }
  | { type: 'story-action'; value: StoryAction }
  | { type: 'story-backdrop'; value: StoryBackdrop }
  | { type: 'story-swap'; from: 0 | 1; to: 1 | 2 }
  | { type: 'story-play' }
  | { type: 'shadow-light' | 'shadow-mat'; value: number }
  | { type: 'shadow-object'; value: ShadowObject }
  | { type: 'shadow-test' }
  | { type: 'shadow-predict'; value: ShadowSide }
  | { type: 'shadow-reveal' }
  | { type: 'shadow-move-light'; value: number }
  | { type: 'shadow-record' }
  | { type: 'shadow-explain'; value: ShadowExplanation }
  | { type: 'shadow-try-shade' }
  | { type: 'sort-rule'; value: SortRule }
  | { type: 'sort-place'; object: SortObject; value: 'left' | 'right' }
  | { type: 'sort-test' }
  | { type: 'move-card'; slot: 0 | 1 | 2; value: MoveCard }
  | { type: 'move-run' };

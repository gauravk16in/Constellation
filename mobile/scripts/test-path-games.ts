import assert from './test-assert';
import { applyPlanetCommand, emptyPlanet, parsePlanet } from '../src/features/planet/paper-post-engine';
import { PATH_GAMES, canSavePath, pathFeedback, shadowResult } from '../src/features/planet/path-game-engine';
import { hasComparedBothSides, shadowProjection } from '../src/features/planet/shadow-lesson';
import { canAdvanceStudio, gearAngles, nextStudioPhase, placeGearPart, shapePoints, strokePath } from '../src/features/planet/maker-studio-engine';
import type { PathAction, PathGameId, ShadowState } from '../src/types/path-games';

const context = { profileId: 'child-fixture', ageBand: '8-9' as const, family: false, now: '2026-09-26T10:00:00Z' };
function act(data: ReturnType<typeof emptyPlanet>, id: string, action: PathAction) {
  return applyPlanetCommand(data, { type: 'act-path', sessionId: id, action }, context);
}
for (const gameId of Object.keys(PATH_GAMES) as PathGameId[]) {
  const sessionId = `run-${gameId}`;
  let data = applyPlanetCommand(emptyPlanet(), { type: 'start-path', id: sessionId, gameId }, context);
  assert.throws(() => applyPlanetCommand(data, { type: 'finish-path', sessionId }, context), /Try/);
  assert.throws(() => applyPlanetCommand(data, { type: 'start-path', id: 'other', gameId }, context), /Resume/);
  if (gameId === 'object-theatre') {
    for (const [scene, object] of ['parcel', 'leaf', 'cup'].entries()) {
      data = act(data, sessionId, { type: 'story-scene', scene: scene as 0 | 1 | 2 });
      data = act(data, sessionId, { type: 'story-object', value: object as 'parcel' | 'leaf' | 'cup' });
    }
    data = act(data, sessionId, { type: 'story-play' });
    data = act(data, sessionId, { type: 'story-swap', from: 0, to: 1 });
    assert.equal(canSavePath(data.pathSession!.state), false);
    data = act(data, sessionId, { type: 'story-play' });
  } else if (gameId === 'borrow-a-shadow') {
    assert.equal(shadowProjection(18).side, 'right');
    data = act(data, sessionId, { type: 'shadow-predict', value: 'left' });
    assert.equal(canSavePath(data.pathSession!.state), false);
    data = act(data, sessionId, { type: 'shadow-reveal' });
    data = act(data, sessionId, { type: 'shadow-move-light', value: 85 });
    data = act(data, sessionId, { type: 'shadow-record' });
    assert.equal(hasComparedBothSides((data.pathSession!.state as ShadowState).lesson!.observations), true);
    data = act(data, sessionId, { type: 'shadow-explain', value: 'same' });
    assert.equal((data.pathSession!.state as ShadowState).lesson!.phase, 'compare');
    data = act(data, sessionId, { type: 'shadow-explain', value: 'opposite' });
    data = act(data, sessionId, { type: 'shadow-try-shade' });
    assert.equal((data.pathSession!.state as ShadowState).lesson!.phase, 'challenge');
    data = act(data, sessionId, { type: 'shadow-move-light', value: 0 });
    data = act(data, sessionId, { type: 'shadow-try-shade' });
    assert.equal((data.pathSession!.state as ShadowState).lesson!.phase, 'complete');
    assert.equal(shadowProjection(0).coversMat, true);
  } else if (gameId === 'parcel-room') {
    assert.throws(() => act(data, sessionId, { type: 'sort-test' }), /six/);
    for (const object of ['ball', 'cup', 'book', 'parcel', 'leaf', 'sock'] as const) data = act(data, sessionId, { type: 'sort-place', object, value: object === 'ball' || object === 'cup' ? 'left' : 'right' });
    data = act(data, sessionId, { type: 'sort-test' });
    assert.equal(pathFeedback(data.pathSession!.state).includes('grouped all six'), true);
  } else {
    data = act(data, sessionId, { type: 'move-run' });
    assert.equal(pathFeedback(data.pathSession!.state).includes('wobbles'), false);
  }
  data = applyPlanetCommand(data, { type: 'finish-path', sessionId }, context);
  assert.equal(data.pathSession, null);
  assert.equal(data.pathFinds?.length, 1);
  assert.equal(data.pathOutcomes?.length, 1);
  assert.deepEqual(applyPlanetCommand(data, { type: 'finish-path', sessionId }, context), data);
  assert.deepEqual(parsePlanet(JSON.stringify(data)), data);
}
const young = { ...context, ageBand: '6-7' as const };
let youngData = applyPlanetCommand(emptyPlanet(), { type: 'start-path', id: 'young', gameId: 'borrow-a-shadow' }, young);
assert.throws(() => applyPlanetCommand(youngData, { type: 'act-path', sessionId: 'young', action: { type: 'shadow-predict', value: 'right' } }, young), /Read/);
youngData = applyPlanetCommand(youngData, { type: 'introduce-path', sessionId: 'young' }, young);
assert.doesNotThrow(() => applyPlanetCommand(youngData, { type: 'act-path', sessionId: 'young', action: { type: 'shadow-predict', value: 'right' } }, young));
const legacyShadow = applyPlanetCommand(emptyPlanet(), { type: 'start-path', id: 'legacy-shadow', gameId: 'borrow-a-shadow' }, context);
legacyShadow.pathSession!.state = { kind: 'shadow', light: 0, object: 'tree', mat: 4, trials: [shadowResult({ light: 0, object: 'tree', mat: 4 })] };
assert.doesNotThrow(() => parsePlanet(JSON.stringify(legacyShadow)));
assert.equal(canSavePath(legacyShadow.pathSession!.state), true);
const paperDraft = applyPlanetCommand(emptyPlanet(), { type: 'start', id: 'paper-draft', scenarioId: 'first-parcel' }, context);
assert.throws(() => applyPlanetCommand(paperDraft, { type: 'start-path', id: 'from-paper', gameId: 'object-theatre' }, context), /Resume Paper Post/);
const switched = applyPlanetCommand(paperDraft, { type: 'start-path', id: 'from-paper', gameId: 'object-theatre', replacePaperSessionId: 'paper-draft' }, context);
assert.equal(switched.session, null);
assert.equal(switched.pathSession?.gameId, 'object-theatre');
assert.throws(() => applyPlanetCommand(switched, { type: 'start', id: 'back', scenarioId: 'first-parcel' }, context), /Resume/);
assert.throws(() => applyPlanetCommand(switched, { type: 'start', id: 'back', scenarioId: 'first-parcel', replacePathSessionId: 'stale-id' }, context), /Resume/);
const backToPaper = applyPlanetCommand(switched, { type: 'start', id: 'back', scenarioId: 'first-parcel', replacePathSessionId: 'from-paper' }, context);
assert.equal(backToPaper.pathSession, null);
assert.equal(backToPaper.session?.id, 'back');
let repeat = applyPlanetCommand(emptyPlanet(), { type: 'start-path', id: 'repeat', gameId: 'delivery-path' }, context);
repeat = act(repeat, 'repeat', { type: 'move-card', slot: 0, value: 'pause' });
repeat = act(repeat, 'repeat', { type: 'move-run' });
repeat = act(repeat, 'repeat', { type: 'move-run' });
repeat = applyPlanetCommand(repeat, { type: 'finish-path', sessionId: 'repeat' }, context);
assert.deepEqual(repeat.pathOutcomes![0].evidence, ['Chose three movements and reviewed a plan.']);
const reopened = applyPlanetCommand(repeat, { type: 'start-path', id: 'edit', gameId: 'delivery-path' }, context);
assert.equal(reopened.pathSession!.state.kind === 'move' && reopened.pathSession!.state.sequence[0], 'pause');
assert.equal(canSavePath(reopened.pathSession!.state), false);
repeat.pathOutcomes![0].evidence = ['Arranged three moves and ran the route.', 'Changed the movement plan and tried it again.'];
assert.deepEqual(parsePlanet(JSON.stringify(repeat)).pathOutcomes![0].evidence, ['Chose three movements and reviewed a plan.']);
assert.deepEqual(parsePlanet(JSON.stringify(emptyPlanet())), emptyPlanet(), 'legacy empty planet remains readable');
assert.equal(shapePoints('triangle').length, 4);
assert.equal(shapePoints('circle').length, 49);
assert.equal(strokePath(shapePoints('square')).startsWith('M85 45'), true);
assert.equal(canAdvanceStudio('guided', []), false);
assert.equal(canAdvanceStudio('guided', [{ points: [{ x: 10, y: 10 }], color: '#000' }]), false);
assert.equal(canAdvanceStudio('guided', [{ points: shapePoints('triangle'), color: '#000' }]), true);
assert.equal(nextStudioPhase('guided'), 'memory');
assert.equal(nextStudioPhase('memory'), 'create');
assert.deepEqual(placeGearPart([], 'driver', 'partner'), []);
assert.deepEqual(placeGearPart([], 'driver', 'driver'), ['driver']);
assert.deepEqual(placeGearPart(['driver'], 'driver', 'driver'), ['driver']);
assert.deepEqual(gearAngles(2), { driver: 90, partner: -90 });
console.log('Four curiosity games: start, manipulate, validate, save, restart, idempotency, younger handoff and legacy parsing passed.');

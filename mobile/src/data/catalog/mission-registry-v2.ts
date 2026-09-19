import type { AgeBand, CuriosityAreaId, LearningEvidenceKind } from '@/types/constellation';
// Frozen pre-Pocket-Planet baseline. Do not revise interaction IDs in this file.
import type {
  MissionDefinition,
  MissionInteraction,
  MissionNarrative,
  MissionOption,
  StartPolicy,
} from '@/types/mission';

const REFLECTION = 'What feels most true after trying it?';
const childStart: StartPolicy = { kind: 'child' };
const guardianStart = (confirmation: string): StartPolicy => ({ kind: 'guardian-confirm', confirmation });
const options = (...labels: string[]): MissionOption[] => labels.map((label, index) => ({ id: `option-${index + 1}`, label }));
const namedOptions = (...items: [string, string][]): MissionOption[] => items.map(([id, label]) => ({ id, label }));
const preparation = (...labels: string[]) => labels.map((label, index) => ({ id: `ready-${index + 1}`, label }));

export const FLAGSHIP_EXPERIENCE_IDS = [
  'rose-signal',
  'paper-bridge',
  'three-object-story',
  'shadow-tracing',
  'cold-snack-builder',
  'floor-line-balance',
] as const;

type LegacyNarrative = Omit<MissionNarrative, 'worldId' | 'signalId' | 'artworkSceneId' | 'knowledgeReview'> & {
  worldId: string;
  knowledgeReview: { sourceLabels: string[]; reviewedAt: string };
};

type LegacyMissionDefinition = Omit<MissionDefinition, 'narrative' | 'variants'> & {
  narrative?: LegacyNarrative;
};

const LEGACY_MISSION_DEFINITIONS: LegacyMissionDefinition[] = [
  {
    experienceId: 'backyard-sound-map', previewLabel: 'Build a five-point listening map.',
    successCue: 'You have a map with five real sounds and where each one came from.',
    memoryCue: 'Stay still. Listen near, far, left, right, and above.',
    briefInteractions: [{ kind: 'marker-board', id: 'sound-points', title: 'Your listening map', instruction: 'Tap the five points to see how you will mark each sound.', markers: options('Near', 'Far', 'Left', 'Right', 'Above') }],
    preparation: preparation('Choose one family-approved listening spot.', 'Bring paper and something to draw with.', 'Stay where you can listen without walking into roads or unknown places.'),
    activeGuidance: 'optional-counter', steps: ['Stand or sit in one safe spot.', 'Listen until one sound stands out.', 'Mark its direction on paper. Repeat until you have five.'],
    timerMinutes: 10, startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'leaf-detective', previewLabel: 'Choose the order of four detective lenses.',
    successCue: 'You can name ways three fallen leaves match and differ.',
    memoryCue: 'Look through four lenses: shape, texture, colour, and size.',
    briefInteractions: [{ kind: 'arrangement', id: 'leaf-lenses', title: 'Arrange your detective lenses', instruction: 'Move the lenses into the order you want to use.', items: options('Shape', 'Texture', 'Colour', 'Size') }],
    preparation: preparation('Find three fallen leaves without pulling from a plant.', 'Use only leaves that are safe to touch.', 'Leave insects, fungi, and unknown plants alone.'),
    activeGuidance: 'optional-steps', steps: ['Place the three leaves side by side.', 'Use each detective lens on every leaf.', 'Name the closest match and the biggest difference.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'rose-signal', previewLabel: 'Teach the Nature Compass how to investigate a rose safely.',
    successCue: 'You can find the flower, leaves, stem, and any sharp parts without touching or picking the plant.',
    memoryCue: 'Eyes first. Hands back. Let the grown-up point.',
    briefInteractions: [{
      kind: 'safety-sequence', id: 'rose-safety', artworkId: 'rose-prickle-map',
      title: 'Read the plant clues',
      instruction: 'Solve both clues with your eyes before going near the plant.',
      scenes: [
        {
          id: 'sharp-part', prompt: 'Which part of this rose may poke?',
          options: [
            { id: 'petal', label: 'The soft-looking petal', correct: false, feedback: 'Look lower. The sharp point grows from the stem, not the petal.' },
            { id: 'leaf', label: 'The flat leaf', correct: false, feedback: 'Look along the stem. The sharp point sticks out from its outer surface.' },
            { id: 'prickle', label: 'The pointed stem prickle', correct: true, feedback: 'Yes. A rose has sharp prickles growing from the stem’s outer surface.' },
          ],
        },
        {
          id: 'safe-plan', prompt: 'What is the safe investigation plan?',
          options: [
            { id: 'stay-back', label: 'Look from a little distance while a grown-up points.', correct: true, feedback: 'That plan keeps hands away while your eyes do the investigating.' },
            { id: 'grab-stem', label: 'Grab the stem to inspect it.', correct: false, feedback: 'Hands back. A grown-up can point without anyone grabbing the stem.' },
          ],
        },
      ],
    }],
    returnInteractions: [
      {
        kind: 'comparison', id: 'rose-stem-result', title: 'What did the stem have?', instruction: 'Choose what you could see from your safe observation spot.',
        options: namedOptions(['sharp-prickles', 'Sharp prickles'], ['no-sharp-parts', 'No sharp parts I could see'], ['could-not-tell', 'I couldn’t tell']),
      },
      {
        kind: 'choice-board', id: 'rose-safety-result', title: 'What kept you safe?', instruction: 'Choose every safety action you used.',
        options: namedOptions(['stayed-back', 'I stayed back'], ['grown-up-pointed', 'A grown-up pointed'], ['left-plant', 'I left the plant where it was']), minSelections: 1, maxSelections: 3,
      },
    ],
    preparation: preparation(
      'A trusted grown-up recognizes and approves this familiar rose or flowering plant.',
      'The grown-up will stay beside you and point while everyone keeps hands back.',
      'Use no tools. Do not touch, pick, taste, or move any part of the plant.',
    ),
    activeGuidance: 'memory-cue',
    steps: ['Find the flower and leaves with your eyes.', 'Follow the plant down to its stem.', 'Notice where any sharp parts grow while the grown-up points.'],
    startPolicy: guardianStart('I recognize this plant and will stay with the child. We will observe without touching or picking it.'),
    reflectionPrompt: REFLECTION,
    narrative: {
      worldId: 'nature-compass',
      worldName: 'Nature Compass',
      artworkId: 'nature-compass-rose',
      archetype: 'field-mystery',
      hook: {
        heading: 'The Nature Compass lost the Rose Signal.',
        body: 'It can see petals, but it cannot tell which plant parts may poke. Help it learn before you investigate.',
        actionLabel: 'Read the plant clues',
      },
      knowledgeReveal: {
        heading: 'Those “thorns” have another name.',
        body: 'The sharp parts on a rose stem are called prickles. They grow from the stem’s outer surface and can make the plant harder for animals to eat.',
      },
      resolvedWorld: {
        heading: 'Rose Signal restored.',
        body: 'You noticed how a plant protects itself—and investigated without harming it.',
      },
      realWorldObjective: 'Find the flower, leaves, stem, and any sharp parts. Notice where each one grows.',
      evidenceRules: [
        { kind: 'safety', statement: 'Used a hands-back plan to observe a familiar plant safely.', interactionId: 'rose-safety' },
        { kind: 'observation', statement: 'Observed the flower, leaves, stem, and any sharp parts without touching.', interactionId: 'rose-stem-result' },
        { kind: 'explanation', statement: 'Discovered that a rose’s sharp stem parts are called prickles.' },
      ],
      knowledgeReview: {
        sourceLabels: ['Illinois Extension — Roses & Their Types', 'NC State Extension — Rosa'],
        reviewedAt: '2026-08-27',
      },
    },
  },
  {
    experienceId: 'cloud-shape-story', previewLabel: 'Choose three shapes and put a story in order.',
    successCue: 'Three cloud shapes become one beginning, middle, and ending.',
    memoryCue: 'Find three shapes. Let each one change the story.',
    briefInteractions: [{ kind: 'ordered-cards', id: 'cloud-story', title: 'Pick your story sparks', instruction: 'Choose three, then move them into story order.', options: options('A giant', 'A tiny creature', 'A flying machine', 'A hidden island', 'A surprising visitor', 'A changing animal'), minSelections: 3, maxSelections: 3 }],
    preparation: preparation('Choose a safe place with a clear view of the sky.', 'Stay still while looking upward.', 'Never look directly at the sun.'),
    activeGuidance: 'memory-cue', steps: ['Spot the first shape and begin.', 'Let the second shape change what happens.', 'Use the third shape to end the story.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'window-nature-log', previewLabel: 'Choose one detail to watch for change.',
    successCue: 'You notice at least one change in the same outdoor spot.',
    memoryCue: 'Keep watching one spot. Small changes count.',
    briefInteractions: [{
      kind: 'choice-board', id: 'window-focus', title: 'Choose one signal to follow', instruction: 'This symbol will be your memory cue while you watch the same small place.',
      options: [
        { id: 'light', label: 'Light & shadow', visualId: 'window-light' },
        { id: 'weather', label: 'Weather', visualId: 'window-weather' },
        { id: 'living', label: 'Living things', visualId: 'window-living' },
        { id: 'movement', label: 'Movement', visualId: 'window-movement' },
      ], minSelections: 1, maxSelections: 1,
    }],
    returnInteractions: [
      {
        kind: 'comparison', id: 'window-result', title: 'What happened to your signal?', instruction: 'Choose the closest answer. “I couldn’t tell” is a real observation too.',
        options: [
          { id: 'same', label: 'It stayed mostly the same', visualId: 'window-same' },
          { id: 'changed', label: 'I noticed a change', visualId: 'window-changed' },
          { id: 'unsure', label: 'I couldn’t tell yet', visualId: 'window-unsure' },
        ],
      },
      {
        kind: 'choice-board', id: 'window-evidence', title: 'Which clue helped you decide?', instruction: 'Choose what your eyes noticed. You can choose more than one.',
        options: [
          { id: 'light', label: 'A light or shadow clue', visualId: 'window-light' },
          { id: 'weather', label: 'A weather clue', visualId: 'window-weather' },
          { id: 'living', label: 'A living-thing clue', visualId: 'window-living' },
          { id: 'movement', label: 'A movement clue', visualId: 'window-movement' },
        ], minSelections: 1, maxSelections: 4,
      },
    ],
    preparation: preparation('Choose one closed or safely secured window.', 'Bring paper if you want to make notes.', 'Pick one outdoor spot and keep your view there.'),
    activeGuidance: 'memory-cue', steps: ['Look carefully at the spot now.', 'Watch without switching places.', 'Record what changed and what stayed the same.'],
    timerMinutes: 10, startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'three-colour-picture', previewLabel: 'Build a palette from exactly three colours.',
    successCue: 'You finish a picture using only the three colours you chose.',
    memoryCue: 'Three colours only. Mixing and empty space are allowed.',
    briefInteractions: [{ kind: 'choice-board', id: 'colour-palette', title: 'Choose your three colours', instruction: 'Tap exactly three colours for your picture.', options: namedOptions(['red', 'Red'], ['orange', 'Orange'], ['yellow', 'Yellow'], ['green', 'Green'], ['blue', 'Blue'], ['purple', 'Purple'], ['brown', 'Brown'], ['black', 'Black']), minSelections: 3, maxSelections: 3 }],
    preparation: preparation('Choose washable, age-appropriate art materials.', 'Protect the surface underneath.', 'Put every other colour aside for this experiment.'),
    activeGuidance: 'memory-cue', steps: ['Use only your chosen palette.', 'Try lines, shapes, mixing, or empty space.', 'Stop when the picture feels complete to you.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'paper-bridge', previewLabel: 'Choose a fold idea before you test the bridge.',
    successCue: 'Your paper bridge holds at least one lightweight object, or teaches you why it did not.',
    memoryCue: 'Fold for strength. Test with one light object at a time.',
    briefInteractions: [
      { kind: 'choice-board', id: 'bridge-fold', title: 'Choose your bridge shape', instruction: 'Tap the shape you will build first. The picture becomes your phone-down memory cue.', options: [
        { id: 'folded', label: 'Folded edges', visualId: 'bridge-folded' },
        { id: 'accordion', label: 'Accordion', visualId: 'bridge-accordion' },
        { id: 'arch', label: 'Curved arch', visualId: 'bridge-arch' },
      ], minSelections: 1, maxSelections: 1 },
      { kind: 'choice-board', id: 'bridge-prediction', title: 'What do you predict?', instruction: 'Choose the picture that shows what you think the shape will change.', options: [
        { id: 'stiffer', label: 'It will bend less', visualId: 'bridge-folded' },
        { id: 'spread', label: 'It will spread the load', visualId: 'bridge-arch' },
        { id: 'more', label: 'It will hold more than flat paper', visualId: 'bridge-accordion' },
      ], minSelections: 1, maxSelections: 1 },
    ],
    returnInteractions: [
      { kind: 'counter', id: 'bridge-result', title: 'How many objects did it hold?', instruction: 'Count only lightweight test objects.', counters: options('Objects held'), maximum: 5 },
      { kind: 'comparison', id: 'bridge-learning', title: 'What did your test show?', instruction: 'Compare the bridge with your prediction. A surprising result is useful.', options: [
        { id: 'folded', label: 'Folded edges helped', visualId: 'bridge-folded' },
        { id: 'accordion', label: 'Accordion folds helped', visualId: 'bridge-accordion' },
        { id: 'arch', label: 'The curved arch helped', visualId: 'bridge-arch' },
        { id: 'flat', label: 'Flat paper worked similarly', visualId: 'bridge-flat' },
        { id: 'unsure', label: 'I couldn’t tell yet', visualId: 'window-unsure' },
      ] },
    ],
    preparation: preparation('Bring paper and five lightweight test objects.', 'Use a stable table or clear floor.', 'Keep fingers away from sharp paper edges.'),
    activeGuidance: 'optional-steps', steps: ['Place two supports a short distance apart.', 'Fold the paper into your chosen shape.', 'Add one light object at a time and notice what changes.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
    narrative: {
      worldId: 'makers-workbench', worldName: 'Maker’s Workbench', artworkId: 'makers-workbench-bridge', archetype: 'build-test',
      hook: {
        heading: 'The Maker’s Workbench cannot carry a tiny delivery across its Starway.',
        body: 'A flat sheet keeps bending. Choose a shape, make a prediction, and test what helps paper hold a load.',
        actionLabel: 'Plan the Starway bridge',
      },
      knowledgeReveal: {
        heading: 'A sheet can become a structure.',
        body: 'Folds, curves, and a shorter span can help paper resist bending by changing how the load is carried. Your test showed which idea worked best this time.',
      },
      resolvedWorld: {
        heading: 'The Starway is steady.',
        body: 'You made a prediction, tested a real bridge, and used the result to understand its shape.',
      },
      realWorldObjective: 'Build your paper shape across two supports, then add one lightweight object at a time.',
      evidenceRules: [
        { kind: 'prediction', statement: 'Predicted how a shape could help paper carry a load.', interactionId: 'bridge-prediction' },
        { kind: 'observation', statement: 'Tested a paper bridge with lightweight objects.', interactionId: 'bridge-result' },
        { kind: 'explanation', statement: 'Compared which bridge idea helped most.', interactionId: 'bridge-learning' },
      ],
      knowledgeReview: {
        sourceLabels: ['Illinois 4-H — Bridge Building Challenge'],
        reviewedAt: '2026-08-29',
      },
    },
  },
  {
    experienceId: 'room-rhythm', previewLabel: 'Compose a four-beat rhythm from room sounds.',
    successCue: 'You can repeat your four-beat pattern twice.',
    memoryCue: 'Four beats. Repeat them softly, then change one.',
    briefInteractions: [{ kind: 'ordered-cards', id: 'rhythm-sequence', title: 'Build your rhythm', instruction: 'Choose four sound cards and arrange the order.', options: options('Clap', 'Tap knees', 'Tap a safe surface', 'Finger rub', 'Quiet pause', 'Soft footstep'), minSelections: 4, maxSelections: 4 }],
    preparation: preparation('Choose a room where soft sounds will not disturb anyone.', 'Use hands, feet, or safe unbreakable surfaces only.', 'Keep every sound comfortable for nearby people.'),
    activeGuidance: 'prompt-deck', steps: ['Try the four sounds in order.', 'Repeat the same pattern.', 'Change one beat and listen to the difference.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'recycled-sculpture', previewLabel: 'Choose a creature or machine and safe shapes to combine.',
    successCue: 'Clean packaging becomes a creature or machine that can stand or hold its shape.',
    memoryCue: 'Big shape first. Add smaller shapes one at a time.',
    briefInteractions: [{ kind: 'choice-board', id: 'sculpture-kind', title: 'What will it become?', instruction: 'Choose one direction. Your idea can change while you build.', options: options('Imaginary creature', 'Imaginary machine'), minSelections: 1, maxSelections: 1 }],
    preparation: preparation('Collect only clean, dry household packaging.', 'Ask a grown-up to remove anything sharp, dirty, or made of glass.', 'Choose age-appropriate tape or joining materials.'),
    activeGuidance: 'optional-steps', steps: ['Choose the largest shape as the body.', 'Test where smaller shapes can join.', 'Add details only after the main shape stands.'],
    startPolicy: guardianStart('I checked these materials. They are clean, age-appropriate, and have no sharp edges or glass.'), reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'three-object-story', previewLabel: 'Give three real objects a role in your story.',
    successCue: 'Your three objects make a beginning, middle, and ending.',
    memoryCue: 'Object one begins. Object two changes things. Object three helps it end.',
    briefInteractions: [{
      kind: 'ordered-cards', id: 'story-objects', title: 'Build your three-object cast', instruction: 'Choose three safe object tokens, then arrange them as beginning, change, and ending. Find matching real objects—or let a nearby object pretend to be one.',
      options: [
        { id: 'cup', label: 'Cup', visualId: 'story-cup' },
        { id: 'key', label: 'Key', visualId: 'story-key' },
        { id: 'leaf', label: 'Leaf', visualId: 'story-leaf' },
        { id: 'sock', label: 'Sock', visualId: 'story-sock' },
        { id: 'spoon', label: 'Spoon', visualId: 'story-spoon' },
        { id: 'box', label: 'Box', visualId: 'story-box' },
      ], minSelections: 3, maxSelections: 3,
    }],
    returnInteractions: [{
      kind: 'retell-cards', id: 'story-retell', title: 'Retell it in three parts', instruction: 'Say each part aloud to your companion, then mark the card complete. Constellation does not record your words.',
      cards: namedOptions(['beginning', 'Beginning — Who was there and where did it start?'], ['middle', 'Middle — What surprising change happened?'], ['ending', 'Ending — How did the objects help it finish?']),
    }],
    preparation: preparation('Choose three ordinary, unbreakable objects.', 'Ask someone approved by your family to listen.', 'Put the objects where both of you can see them.'),
    activeGuidance: 'prompt-deck', steps: ['Introduce the first object and the place.', 'Let the second object cause a change.', 'Use the third object to help the story end.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
    narrative: {
      worldId: 'story-archive', worldName: 'Story Archive', artworkId: 'story-archive-objects', archetype: 'co-play-story',
      hook: {
        heading: 'The Story Archive found three objects, but the story connecting them disappeared.',
        body: 'Give each safe object a part to play, then build the missing story with someone already approved by your family.',
        actionLabel: 'Choose the three objects',
      },
      knowledgeReveal: {
        heading: 'A change gives a story its shape.',
        body: 'A beginning introduces what matters, the middle changes something, and the ending shows what happened because of that change.',
      },
      resolvedWorld: {
        heading: 'The missing story has returned.',
        body: 'You connected three ordinary objects and retold what happened in a clear sequence.',
      },
      realWorldObjective: 'Take turns telling what happens to the three objects, then retell the whole story from beginning to ending.',
      evidenceRules: [
        { kind: 'strategy', statement: 'Assigned three real objects a beginning, change, and ending.', interactionId: 'story-objects' },
        { kind: 'retell', statement: 'Retold the story aloud in three parts.', interactionId: 'story-retell' },
        { kind: 'explanation', statement: 'Used a change in the middle to connect the story.' },
      ],
      knowledgeReview: {
        sourceLabels: ['SALTO-YOUTH — storytelling basket and three-part story pattern', 'Constellation story-learning editorial review'],
        reviewedAt: '2026-08-29',
      },
    },
  },
  {
    experienceId: 'family-interview', previewLabel: 'Choose five questions for a trusted grown-up.',
    successCue: 'You hear five answers about something a grown-up loved learning.',
    memoryCue: 'Ask. Listen. Follow one answer with “What happened next?”',
    briefInteractions: [{ kind: 'prompt-deck', id: 'interview-questions', title: 'Build your question deck', instruction: 'Choose exactly five reviewed questions.', options: options('What did you love learning?', 'How did you first begin?', 'What was difficult at first?', 'Who helped you?', 'What mistake taught you something?', 'What are you proud of?', 'What would you teach me first?', 'What would you try next?'), selectionCount: 5 }],
    preparation: preparation('Choose a trusted grown-up who is already with you.', 'Ask whether this is a good time to talk.', 'Remember that either person may skip any question.'),
    activeGuidance: 'prompt-deck', steps: ['Ask one chosen question.', 'Listen without rushing the answer.', 'Choose the next card or ask one safe follow-up.'],
    startPolicy: guardianStart('I am the trusted grown-up joining this interview, and either of us can skip a question.'), reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'teach-one-small-skill', previewLabel: 'Name one skill and prepare a show–explain–try lesson.',
    successCue: 'Someone gets one safe chance to try the skill you taught.',
    memoryCue: 'Show it. Explain one part. Let them try.',
    briefInteractions: [{ kind: 'slot-input', id: 'skill-name', title: 'What will you teach?', instruction: 'Name one small, safe skill.', slots: namedOptions(['skill', 'The skill']), maxLength: 32 }],
    preparation: preparation('Choose a skill with no heat, blades, roads, deep water, or heavy tools.', 'Choose someone approved by your family.', 'Make enough clear space for both of you.'),
    activeGuidance: 'optional-steps', steps: ['Show the whole skill once.', 'Explain one small part at a time.', 'Let the other person try and ask what would help.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'two-minute-explanation', previewLabel: 'Choose a topic and three clear speaking cues.',
    successCue: 'Someone hears how one thing works and gets to ask a question.',
    memoryCue: 'What is it? How does it work? What is surprising?',
    briefInteractions: [{ kind: 'slot-input', id: 'explanation-topic', title: 'Choose your topic', instruction: 'Name something safe that you understand.', slots: namedOptions(['topic', 'I will explain…']), maxLength: 32 }],
    preparation: preparation('Choose someone approved by your family.', 'Pick a topic that does not require dangerous tools or demonstrations.', 'Decide whether the optional two-minute timer would help.'),
    activeGuidance: 'optional-steps', steps: ['Say what the thing is.', 'Explain how its main parts work.', 'Share one surprising detail and invite a question.'],
    timerMinutes: 2, startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'kitchen-measurement-hunt', previewLabel: 'Prepare a five-clue measurement scavenger board.',
    successCue: 'You find five measurement clues and compare what their marks mean.',
    memoryCue: 'Look for numbers, units, lines, tools, and different amounts.',
    briefInteractions: [{ kind: 'marker-board', id: 'measurement-clues', title: 'Your five clues', instruction: 'Tap each clue to preview the hunt.', markers: options('A number with a unit', 'Tiny measurement lines', 'A measuring tool', 'Two different amounts', 'The smallest or largest mark') }],
    preparation: preparation('A grown-up stays with you in the kitchen.', 'Use only items the grown-up places in the search area.', 'Do not touch heat, blades, appliances, chemicals, or glass.'),
    activeGuidance: 'optional-counter', steps: ['Find one clue without opening unknown containers.', 'Ask what its number and unit mean.', 'Compare it with another clue before moving on.'],
    startPolicy: guardianStart('I prepared a safe search area and will stay here. It contains no heat, blades, appliances, chemicals, or glass.'), reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'shadow-tracing', previewLabel: 'Choose a shadow shape and compare two moments.',
    successCue: 'Two tracings show how one shadow moved or changed.',
    memoryCue: 'Trace once. Wait. Trace the same object again.',
    briefInteractions: [
      { kind: 'choice-board', id: 'shadow-shape', title: 'Choose a useful shadow', instruction: 'Pick the kind of object you want to look for.', options: options('Tall', 'Wide', 'Round', 'An interesting shape'), minSelections: 1, maxSelections: 1 },
      { kind: 'choice-board', id: 'shadow-prediction', title: 'Predict the second outline', instruction: 'What do you think will change after you wait?', options: options('It will move sideways', 'It will become longer', 'It will become shorter', 'It will barely change'), minSelections: 1, maxSelections: 1 },
    ],
    returnInteractions: [{ kind: 'comparison', id: 'shadow-result', title: 'What changed most?', instruction: 'Choose the closest result.', options: options('It moved sideways', 'It became longer', 'It became shorter', 'It barely changed') }],
    preparation: preparation('Work in a family-approved outdoor place.', 'Bring paper and something to draw with.', 'Stay in shade or gentle sunlight and never look at the sun.'),
    activeGuidance: 'optional-steps', steps: ['Place the paper and trace the first shadow.', 'Leave the object and paper in the same safe place.', 'Wait, then trace the shadow again.'],
    timerMinutes: 10, startPolicy: childStart, reflectionPrompt: REFLECTION,
    narrative: {
      worldId: 'discovery-lens', worldName: 'Discovery Lens', artworkId: 'discovery-lens-shadow', archetype: 'field-mystery',
      hook: {
        heading: 'The Discovery Lens recorded the same shadow twice—but the outlines no longer match.',
        body: 'Choose one useful shadow, predict what will change, then collect two real outlines for the Lens.',
        actionLabel: 'Make a shadow prediction',
      },
      knowledgeReveal: {
        heading: 'The object stayed. The light changed.',
        body: 'An object blocks sunlight to make a shadow. As Earth rotates, the Sun appears to move across the sky, so the shadow’s position and length can change.',
      },
      resolvedWorld: {
        heading: 'The Discovery Lens is aligned.',
        body: 'You compared a prediction with two observations from the same real shadow.',
      },
      realWorldObjective: 'Trace one object’s shadow, wait in a safe place, then trace the same shadow again without looking at the Sun.',
      evidenceRules: [
        { kind: 'prediction', statement: 'Predicted how the shadow might change.', interactionId: 'shadow-prediction' },
        { kind: 'observation', statement: 'Compared two tracings of the same shadow.', interactionId: 'shadow-result' },
        { kind: 'explanation', statement: 'Connected the changing shadow with changing sunlight direction.' },
      ],
      knowledgeReview: {
        sourceLabels: ['NASA Sun–Earth Day — Changing Shadows', 'NASA Science — Our World: Sun’s Position'],
        reviewedAt: '2026-08-29',
      },
    },
  },
  {
    experienceId: 'paper-tower-test', previewLabel: 'Choose the order for three paper tower shapes.',
    successCue: 'You test three paper towers and can identify the tallest stable shape.',
    memoryCue: 'Build one shape. Test it. Keep the paper amount fair.',
    briefInteractions: [{ kind: 'arrangement', id: 'tower-shapes', title: 'Set your test order', instruction: 'Move the three shapes into the order you will build them.', items: options('Rolled tube', 'Folded triangle', 'Accordion column') }],
    returnInteractions: [{ kind: 'comparison', id: 'tower-result', title: 'Which stood tallest?', instruction: 'Choose the winning shape from your real test.', options: options('Rolled tube', 'Folded triangle', 'Accordion column') }],
    preparation: preparation('Use equal-sized pieces of paper.', 'Build on a stable table or clear floor.', 'Use paper only—no sharp tools or heavy test objects.'),
    activeGuidance: 'optional-steps', steps: ['Build the first shape and stand it up.', 'Repeat with the same amount of paper.', 'Compare height and whether each tower stayed standing.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'count-a-piece-of-sky', previewLabel: 'Prepare two simple star-counting frames.',
    successCue: 'You compare two small sky patches using your own counts.',
    memoryCue: 'Choose a small patch, count slowly, then choose another.',
    briefInteractions: [{ kind: 'counter', id: 'sky-counts', title: 'Two sky patches', instruction: 'Use these counters only if they help. No camera is used.', counters: namedOptions(['patch-a', 'Patch A'], ['patch-b', 'Patch B']), maximum: 99 }],
    preparation: preparation('A grown-up stays beside you after dark.', 'Use a familiar, family-approved outdoor place.', 'Stand still, watch your footing, and never walk while looking upward.'),
    activeGuidance: 'optional-counter', steps: ['Frame one small patch with your hands.', 'Count slowly and remember or tap the total.', 'Choose a second patch of the same size and compare.'],
    startPolicy: guardianStart('I will stay beside the child in this familiar, family-approved place for the whole activity.'), reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'ten-minute-tidy-system', previewLabel: 'Choose one organising rule for a small space.',
    successCue: 'One small shelf or drawer becomes easier to use.',
    memoryCue: 'Small space. One rule. Put back only what belongs.',
    briefInteractions: [{ kind: 'choice-board', id: 'tidy-rule', title: 'Choose your organising rule', instruction: 'Pick the pattern you want to test.', options: options('Group by type', 'Group by how often it is used', 'Group by size'), minSelections: 1, maxSelections: 1 }],
    preparation: preparation('Choose one low, lightweight shelf or drawer.', 'Make a nearby place for items that need a grown-up decision.', 'Do not touch medicines, chemicals, tools, or breakables.'),
    activeGuidance: 'memory-cue', steps: ['Take out only the safe lightweight items.', 'Use your chosen rule to make groups.', 'Put groups back and test whether one item is easier to find.'],
    timerMinutes: 10, startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'cold-snack-builder', previewLabel: 'Name three grown-up-approved parts of a cold snack.',
    successCue: 'You assemble one simple snack using only approved ingredients and tools.',
    memoryCue: 'Clean hands. Approved ingredients. No heat or sharp tools.',
    briefInteractions: [
      { kind: 'slot-input', id: 'snack-parts', title: 'Build your snack idea', instruction: 'A grown-up approves each ingredient before you type its short name.', slots: namedOptions(['base', 'Base'], ['fruit-veg', 'Fruit or vegetable'], ['extra', 'Extra part']), maxLength: 24 },
      {
        kind: 'safety-sequence', id: 'snack-safety', artworkId: 'everyday-station-safety', title: 'Prepare the safe routine', instruction: 'Choose the safe plan for both Station checks.',
        scenes: [
          {
            id: 'ingredients', prompt: 'Which ingredients may enter the Station?',
            options: [
              { id: 'approved', label: 'Only ingredients a grown-up checked for allergies and safety.', correct: true, feedback: 'Yes. The grown-up checks every ingredient before the mission begins.' },
              { id: 'unknown', label: 'Anything nearby that looks tasty.', correct: false, feedback: 'Pause. Unknown or unapproved food stays out of this mission.' },
            ],
          },
          {
            id: 'tools', prompt: 'Which preparation plan fits this mission?',
            options: [
              { id: 'cold-safe', label: 'Clean hands, a clean surface, and only approved no-heat tools.', correct: true, feedback: 'That keeps this a cold, grown-up-supervised mission.' },
              { id: 'sharp-hot', label: 'Use a sharp knife or heat if it seems faster.', correct: false, feedback: 'Hands back. This mission uses no heat, blades, appliances, or unapproved tools.' },
            ],
          },
        ],
      },
    ],
    returnInteractions: [{
      kind: 'choice-board', id: 'snack-safe-result', title: 'What kept the routine safe?', instruction: 'Choose every action you used.',
      options: namedOptions(['clean-hands', 'Clean hands and surface'], ['approved-food', 'Only grown-up-approved ingredients'], ['safe-tools', 'No heat, blades, or unapproved tools'], ['put-away', 'Ingredients put away with the grown-up']), minSelections: 1, maxSelections: 4,
    }],
    preparation: preparation('A grown-up checks allergies and every ingredient.', 'Wash and dry your hands and work surface.', 'Use no heat, blades, appliances, or unapproved tools.'),
    activeGuidance: 'optional-steps', steps: ['Place the approved ingredients on the clean surface.', 'Assemble one part at a time.', 'Put ingredients away with the grown-up when finished.'],
    startPolicy: guardianStart('I checked allergies, ingredients, hygiene, and every tool. I will stay for the whole activity.'), reflectionPrompt: REFLECTION,
    narrative: {
      worldId: 'everyday-station', worldName: 'Everyday Station', artworkId: 'everyday-station-snack', archetype: 'safe-practice',
      hook: {
        heading: 'The Everyday Station needs a safe no-heat snack plan before it can arrange the supplies.',
        body: 'Plan three approved parts, solve the Station’s safety checks, and prepare the real snack with a grown-up.',
        actionLabel: 'Plan the safe supplies',
      },
      knowledgeReveal: {
        heading: 'The safe routine begins before the first bite.',
        body: 'Checking allergies and ingredients, washing hands, cleaning the surface, and choosing safe tools all happen before food preparation starts.',
      },
      resolvedWorld: {
        heading: 'The Everyday Station is ready.',
        body: 'You planned first, followed the safety routine, and assembled a real cold snack with a grown-up.',
      },
      realWorldObjective: 'Wash your hands, use only approved ingredients and tools, assemble the snack, and tidy the supplies with your grown-up.',
      evidenceRules: [
        { kind: 'safety', statement: 'Completed the ingredient and no-heat safety plan.', interactionId: 'snack-safety' },
        { kind: 'strategy', statement: 'Planned three grown-up-approved snack parts.', interactionId: 'snack-parts' },
        { kind: 'observation', statement: 'Identified the routine used to prepare the snack safely.', interactionId: 'snack-safe-result' },
      ],
      knowledgeReview: {
        sourceLabels: ['USDA — Children’s Food Safety Knowledge', 'USDA Food and Nutrition Service — Food Safety in Schools'],
        reviewedAt: '2026-08-29',
      },
    },
  },
  {
    experienceId: 'set-a-table-pattern', previewLabel: 'Arrange three place-setting symbols before making it real.',
    successCue: 'You create one clear place-setting pattern and explain it.',
    memoryCue: 'Place, cup, napkin. Make the pattern easy to explain.',
    briefInteractions: [{ kind: 'arrangement', id: 'table-order', title: 'Arrange your pattern', instruction: 'Move the symbols into the order you will place them.', items: options('Plate', 'Cup', 'Napkin') }],
    preparation: preparation('Ask which table space you may use.', 'Choose unbreakable items unless a grown-up is helping.', 'Carry one item at a time.'),
    activeGuidance: 'memory-cue', steps: ['Place the first item at each setting.', 'Repeat with the second and third items.', 'Explain the pattern to someone nearby.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'tomorrow-mini-plan', previewLabel: 'Write three useful cards in first–next–finally order.',
    successCue: 'Three useful things for tomorrow have a clear, flexible order.',
    memoryCue: 'First. Next. Finally. Keep all three small enough to change.',
    briefInteractions: [{ kind: 'slot-input', id: 'tomorrow-cards', title: 'Make your three-card plan', instruction: 'Use short phrases. This plan stays on this device.', slots: namedOptions(['first', 'First'], ['next', 'Next'], ['finally', 'Finally']), maxLength: 32 }],
    preparation: preparation('Bring paper if you want a plan you can carry.', 'Keep each item small and realistic.', 'A grown-up decides any travel or schedule change.'),
    activeGuidance: 'memory-cue', steps: ['Read the three cards in order.', 'Check whether the order makes sense.', 'Copy the final plan to paper if it will help tomorrow.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'floor-line-balance', previewLabel: 'Choose and order three careful ways to follow a line.',
    successCue: 'You follow one safe floor line in three different ways without rushing.',
    memoryCue: 'Clear floor. Slow body. Stop whenever balance feels uncertain.',
    briefInteractions: [{ kind: 'ordered-cards', id: 'balance-sequence', title: 'Build your movement sequence', instruction: 'Choose three moves and put them in order.', options: options('Heel to toe', 'Side steps', 'Pause on one foot', 'Tiny steps', 'Arms wide'), minSelections: 3, maxSelections: 3 }],
    returnInteractions: [{ kind: 'comparison', id: 'balance-strategy', title: 'What adjustment helped most?', instruction: 'Choose the closest answer. Stopping and resetting counts as a strong strategy.', options: options('Slowing down', 'Looking ahead', 'Changing my arm position', 'Stopping and resetting', 'I could not tell yet') }],
    preparation: preparation('Choose a clear, dry floor line away from stairs.', 'Move furniture, toys, and breakables out of the way.', 'Wear something that will not catch under your feet.'),
    activeGuidance: 'optional-steps', steps: ['Follow the line with the first movement.', 'Stop, reset, and try the second.', 'Try the third only while you still feel steady.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
    narrative: {
      worldId: 'courage-path', worldName: 'Courage Path', artworkId: 'courage-path-balance', archetype: 'movement-challenge',
      hook: {
        heading: 'The Courage Path is wobbling. It needs three calm ways across—not the fastest one.',
        body: 'Choose a safe movement sequence, clear the space, and notice which adjustment helps you stay steady.',
        actionLabel: 'Build the calm sequence',
      },
      knowledgeReveal: {
        heading: 'Steady does not mean perfectly still.',
        body: 'Balance uses small adjustments. Slowing down, looking ahead, changing your arm position, or stopping and resetting can all be useful strategies.',
      },
      resolvedWorld: {
        heading: 'The Courage Path is steady.',
        body: 'You tried three careful movements and noticed how your body adjusted without turning it into a score.',
      },
      realWorldObjective: 'Try the three movements on one clear floor line, pausing whenever you need to reset.',
      evidenceRules: [
        { kind: 'strategy', statement: 'Planned three calm ways to follow a safe floor line.', interactionId: 'balance-sequence' },
        { kind: 'observation', statement: 'Noticed an adjustment that helped with balance.', interactionId: 'balance-strategy' },
        { kind: 'explanation', statement: 'Practised balance as adjustment rather than speed or scoring.' },
      ],
      knowledgeReview: {
        sourceLabels: ['Constellation movement-safety editorial review'],
        reviewedAt: '2026-08-29',
      },
    },
  },
  {
    experienceId: 'mirror-movement', previewLabel: 'Choose the first leader and a slow movement sequence.',
    successCue: 'Two people take turns leading and copying slow movements.',
    memoryCue: 'Move slowly enough for your partner to mirror you.',
    briefInteractions: [{ kind: 'choice-board', id: 'mirror-leader', title: 'Who leads first?', instruction: 'Choose the first leader. You will switch halfway.', options: options('I lead first', 'My partner leads first'), minSelections: 1, maxSelections: 1 }],
    preparation: preparation('Choose an approved partner already with you.', 'Clear enough space for both people to move slowly.', 'Agree that either person can pause or stop.'),
    activeGuidance: 'optional-steps', steps: ['The leader makes one slow movement.', 'The partner mirrors it as closely as comfortable.', 'Switch leader after a few movements.'],
    timerMinutes: 5, startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'soft-ball-skill', previewLabel: 'Choose one ball skill and optionally count ten tries.',
    successCue: 'You try one roll, throw, or catch ten times and notice a change.',
    memoryCue: 'One skill. Ten calm tries. Notice, do not score yourself.',
    briefInteractions: [{ kind: 'choice-board', id: 'ball-skill', title: 'Choose one skill', instruction: 'Pick one skill for all ten tries.', options: options('Roll to a target', 'Soft underarm throw', 'Two-hand catch'), minSelections: 1, maxSelections: 1 }],
    returnInteractions: [{ kind: 'counter', id: 'ball-tries', title: 'How many tries did you make?', instruction: 'This is a memory helper, not a score.', counters: options('Tries'), maximum: 10, required: false }],
    preparation: preparation('Use a soft ball only.', 'Choose a clear area away from roads, windows, people, and animals.', 'Stop if anything hurts or the space becomes busy.'),
    activeGuidance: 'optional-counter', steps: ['Make the first calm try.', 'Change one small thing if it would help.', 'Continue toward ten without rushing.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
  {
    experienceId: 'slow-motion-animal-walk', previewLabel: 'Choose four animal movements and build a sequence.',
    successCue: 'Four careful animal movements connect into one short sequence.',
    memoryCue: 'Move like the idea, not at full speed. Gentle and steady wins.',
    briefInteractions: [{ kind: 'ordered-cards', id: 'animal-sequence', title: 'Build your animal sequence', instruction: 'Choose four cards and arrange the order.', options: options('Tall giraffe steps', 'Quiet cat stretch', 'Slow turtle crawl', 'Careful crab steps', 'Wide-wing bird', 'Gentle bear walk'), minSelections: 4, maxSelections: 4 }],
    preparation: preparation('Clear a dry floor away from stairs and furniture edges.', 'Choose only movements that feel comfortable today.', 'Stop if anything hurts or feels unsteady.'),
    activeGuidance: 'optional-steps', steps: ['Try the first movement slowly.', 'Connect each next card without speeding up.', 'Repeat the sequence only if it still feels comfortable.'],
    startPolicy: childStart, reflectionPrompt: REFLECTION,
  },
];

type WorldConfig = {
  id: CuriosityAreaId;
  name: string;
  artworkId: MissionNarrative['artworkId'];
  sourceLabels: string[];
  sourceUrls: string[];
};

const WORLD_CONFIG: Record<CuriosityAreaId, WorldConfig> = {
  'nature-noticing': {
    id: 'nature-noticing', name: 'Nature Compass', artworkId: 'nature-compass-rose',
    sourceLabels: ['NASA Kids Club', 'American Academy of Pediatrics — Outdoor Play'],
    sourceUrls: ['https://www.nasa.gov/learning-resources/nasa-kids-club/', 'https://www.healthychildren.org/English/family-life/power-of-play/Pages/playing-outside-why-its-important-for-kids.aspx'],
  },
  'make-create': {
    id: 'make-create', name: "Maker's Workbench", artworkId: 'makers-workbench-bridge',
    sourceLabels: ['Illinois 4-H — Bridge Building Challenge', 'American Academy of Pediatrics — Safe Play'],
    sourceUrls: ['https://4h.extension.illinois.edu/resources/projects/bridge-building', 'https://www.healthychildren.org/English/safety-prevention/at-play/Pages/default.aspx'],
  },
  'talk-connect': {
    id: 'talk-connect', name: 'Story Archive', artworkId: 'story-archive-objects',
    sourceLabels: ['SALTO-YOUTH — Storytelling Methods', 'Reading Rockets — Story Maps'],
    sourceUrls: ['https://www.salto-youth.net/tools/toolbox/tool/storytelling-methods.2795/', 'https://www.readingrockets.org/classroom/classroom-strategies/story-maps'],
  },
  'test-discover': {
    id: 'test-discover', name: 'Discovery Lens', artworkId: 'discovery-lens-shadow',
    sourceLabels: ['NASA Space Place', 'NASA Kids Club'],
    sourceUrls: ['https://spaceplace.nasa.gov/menu/play/', 'https://www.nasa.gov/learning-resources/nasa-kids-club/'],
  },
  'everyday-skills': {
    id: 'everyday-skills', name: 'Everyday Station', artworkId: 'everyday-station-snack',
    sourceLabels: ['USDA — Food Safety for Children', 'American Academy of Pediatrics — Home Safety'],
    sourceUrls: ['https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/children-under-five', 'https://www.healthychildren.org/English/safety-prevention/at-home/Pages/default.aspx'],
  },
  'move-brave': {
    id: 'move-brave', name: 'Courage Path', artworkId: 'courage-path-balance',
    sourceLabels: ['CDC — Physical Activity for Children', 'American Academy of Pediatrics — Safe Play'],
    sourceUrls: ['https://www.cdc.gov/physical-activity/php/about/children.html', 'https://www.healthychildren.org/English/safety-prevention/at-play/Pages/default.aspx'],
  },
};

const EXPERIENCE_DOMAINS: Record<string, CuriosityAreaId> = {
  'backyard-sound-map': 'nature-noticing', 'leaf-detective': 'nature-noticing', 'rose-signal': 'nature-noticing',
  'cloud-shape-story': 'nature-noticing', 'window-nature-log': 'nature-noticing',
  'three-colour-picture': 'make-create', 'paper-bridge': 'make-create', 'room-rhythm': 'make-create', 'recycled-sculpture': 'make-create',
  'three-object-story': 'talk-connect', 'family-interview': 'talk-connect', 'teach-one-small-skill': 'talk-connect', 'two-minute-explanation': 'talk-connect',
  'kitchen-measurement-hunt': 'test-discover', 'shadow-tracing': 'test-discover', 'paper-tower-test': 'test-discover', 'count-a-piece-of-sky': 'test-discover',
  'ten-minute-tidy-system': 'everyday-skills', 'cold-snack-builder': 'everyday-skills', 'set-a-table-pattern': 'everyday-skills', 'tomorrow-mini-plan': 'everyday-skills',
  'floor-line-balance': 'move-brave', 'mirror-movement': 'move-brave', 'soft-ball-skill': 'move-brave', 'slow-motion-animal-walk': 'move-brave',
};

type NarrativeSeed = {
  hook: string;
  body: string;
  action: string;
  revealHeading: string;
  revealBody: string;
  resolvedHeading: string;
  resolvedBody: string;
  objective: string;
  evidence: { kind: LearningEvidenceKind; statement: string; interactionId?: string }[];
  archetype?: MissionNarrative['archetype'];
};

const NARRATIVE_SEEDS: Record<string, NarrativeSeed> = {
  'backyard-sound-map': {
    hook: 'The Nature Compass can hear five signals—but their directions are missing.', body: 'Stand in one safe place and help each sound find its point on the listening ring.', action: 'Set the listening points',
    revealHeading: 'A place has more than one layer of sound.', revealBody: 'Listening for direction and distance helps separate nearby sounds from the wider soundscape.',
    resolvedHeading: 'Listening bearings aligned.', resolvedBody: 'You stayed still, noticed five real sounds, and mapped where they came from.', objective: 'Listen from one approved spot and mark five sound directions on paper.',
    evidence: [{ kind: 'observation', statement: 'Listened for five sounds from one safe place.' }, { kind: 'explanation', statement: 'Used direction and distance to build a sound map.' }], archetype: 'field-mystery',
  },
  'leaf-detective': {
    hook: 'The Nature Compass mixed up four leaf readings.', body: 'Compare fallen leaves through shape, texture, colour, and size to put the lenses back in order.', action: 'Arrange the leaf lenses',
    revealHeading: 'One leaf can hold many clues.', revealBody: 'Comparing the same features across several leaves makes similarities and differences easier to notice.',
    resolvedHeading: 'Leaf lenses restored.', resolvedBody: 'You compared three fallen leaves without disturbing a living plant.', objective: 'Compare three safe fallen leaves using four observation lenses.',
    evidence: [{ kind: 'observation', statement: 'Compared fallen leaves by four visible features.' }, { kind: 'explanation', statement: 'Named a similarity and a difference between leaves.' }], archetype: 'field-mystery',
  },
  'cloud-shape-story': {
    hook: 'Three cloud signals are drifting apart.', body: 'Notice three shapes, give each one a role, and connect them before the sky changes.', action: 'Choose three story sparks',
    revealHeading: 'Clouds change while we watch.', revealBody: 'Wind and changing cloud edges can turn one imagined shape into another, giving a story a natural beginning, change, and ending.',
    resolvedHeading: 'Sky trail connected.', resolvedBody: 'You turned three changing cloud shapes into one story.', objective: 'Watch from a safe place and tell a three-part story from cloud shapes.',
    evidence: [{ kind: 'observation', statement: 'Noticed three changing cloud shapes.' }, { kind: 'retell', statement: 'Connected the shapes into a beginning, change, and ending.' }], archetype: 'co-play-story',
  },
  'window-nature-log': {
    hook: 'The Nature Compass change dial is frozen.', body: 'Choose one outdoor detail, watch it from a safe window, and find what changes over time.', action: 'Choose a change signal',
    revealHeading: 'Careful observation makes change visible.', revealBody: 'Watching the same small place for a while can reveal movement, light, weather, and living things that a quick glance misses.',
    resolvedHeading: 'Change dial moving again.', resolvedBody: 'You watched one place closely and noticed what changed.', objective: 'Observe one outdoor spot through a safe window and mark the changes you notice.',
    evidence: [{ kind: 'observation', statement: 'Watched one outdoor place over time.' }, { kind: 'explanation', statement: 'Identified a change that a quick look could miss.' }], archetype: 'field-mystery',
  },
  'three-colour-picture': {
    hook: "The Maker's Workbench colour panel is overloaded.", body: 'Choose exactly three colours and discover how limits can make a new idea clearer.', action: 'Focus the colour beam',
    revealHeading: 'A limit can become a creative tool.', revealBody: 'Using only three colours encourages mixing, repeating, and choosing where each colour matters most.',
    resolvedHeading: 'Colour beam focused.', resolvedBody: 'You made a complete picture from three deliberate colour choices.', objective: 'Create a picture using only the three colours you chose.',
    evidence: [{ kind: 'strategy', statement: 'Chose a three-colour creative limit.' }, { kind: 'explanation', statement: 'Used repetition or mixing to work within the limit.' }], archetype: 'build-test',
  },
  'room-rhythm': {
    hook: "The Maker's Workbench pulse has scattered into four pieces.", body: 'Arrange claps, taps, quiet sounds, and pauses into a pattern the room can remember.', action: 'Build the pulse pattern',
    revealHeading: 'A pause is part of a rhythm.', revealBody: 'Rhythm comes from an ordered pattern of sounds and silences that can be repeated.',
    resolvedHeading: 'Rhythm wheel turning.', resolvedBody: 'You composed and repeated a pattern with sound and silence.', objective: 'Perform your four-part rhythm at a comfortable volume.',
    evidence: [{ kind: 'strategy', statement: 'Arranged four sounds or pauses into a sequence.' }, { kind: 'observation', statement: 'Repeated the rhythm and listened for its pattern.' }], archetype: 'build-test',
  },
  'recycled-sculpture': {
    hook: "The Maker's Workbench has materials but no safe blueprint.", body: 'Choose a creature or machine, let a grown-up check every piece, and plan how the shapes might join.', action: 'Prepare the blueprint',
    revealHeading: 'A new form can begin with an old shape.', revealBody: 'Boxes, tubes, and lids can suggest different structures when their shapes are combined and supported.',
    resolvedHeading: 'Assembly bay restored.', resolvedBody: 'You transformed approved clean materials into a new sculpture.', objective: 'Build one creature or machine from materials a grown-up has checked.',
    evidence: [{ kind: 'safety', statement: 'Used only materials checked by a grown-up.' }, { kind: 'strategy', statement: 'Combined reused shapes into a planned sculpture.' }], archetype: 'build-test',
  },
  'family-interview': {
    hook: 'Five pages in the Story Archive have gone blank.', body: 'Choose five questions and listen for how a trusted grown-up learned, struggled, and kept going.', action: 'Build the question deck',
    revealHeading: 'Learning stories include change.', revealBody: 'Questions about beginnings, difficulty, help, and next steps reveal how skills grow over time.',
    resolvedHeading: 'Learning pages restored.', resolvedBody: 'You listened to a real story about learning from someone you trust.', objective: 'Ask five chosen questions and listen without recording the answers.',
    evidence: [{ kind: 'retell', statement: 'Asked five reviewed questions about learning.' }, { kind: 'observation', statement: 'Listened for a beginning, a difficulty, and what helped.' }], archetype: 'co-play-story',
  },
  'teach-one-small-skill': {
    hook: 'The Story Archive lost the order of a tiny lesson.', body: 'Choose one safe skill and rebuild the sequence: show it, explain it, then let someone try.', action: 'Repair the teaching cards',
    revealHeading: 'Teaching makes steps easier to see.', revealBody: 'Showing, explaining, and inviting a try can reveal steps that an experienced person does without noticing.',
    resolvedHeading: 'Teaching sequence restored.', resolvedBody: 'You broke one safe skill into steps another person could try.', objective: 'Teach one safe skill using show, explain, and try.',
    evidence: [{ kind: 'explanation', statement: 'Explained a safe skill in a clear sequence.' }, { kind: 'strategy', statement: 'Used show, explain, and try while teaching.' }], archetype: 'co-play-story',
  },
  'two-minute-explanation': {
    hook: 'A topic star reached the Story Archive without a route.', body: 'Choose a topic and three speaking cues so another person can follow how it works.', action: 'Connect the speaking route',
    revealHeading: 'A clear explanation has landmarks.', revealBody: 'Naming the main idea, ordering key parts, and inviting a question helps a listener follow unfamiliar information.',
    resolvedHeading: 'Explanation route connected.', resolvedBody: 'You guided a listener through one idea and welcomed a question.', objective: 'Explain one safe topic using three cues, then invite one question.',
    evidence: [{ kind: 'explanation', statement: 'Explained one topic using three speaking cues.' }, { kind: 'strategy', statement: 'Invited a listener to ask a question.' }], archetype: 'co-play-story',
  },
  'kitchen-measurement-hunt': {
    hook: 'The Discovery Lens sees marks and numbers—but not what they measure.', body: 'With a grown-up, find five measurement clues without using heat, blades, appliances, or glass.', action: 'Calibrate the clue board',
    revealHeading: 'A number needs a unit.', revealBody: 'Measurement marks only make sense when they are connected to a unit and the quantity being compared.',
    resolvedHeading: 'Measurement grid calibrated.', resolvedBody: 'You found five ways objects communicate amount and scale.', objective: 'Find five safe measurement clues while a grown-up stays beside you.',
    evidence: [{ kind: 'observation', statement: 'Found five measurement clues with a grown-up.' }, { kind: 'explanation', statement: 'Connected a number or mark with what it measured.' }], archetype: 'field-mystery',
  },
  'paper-tower-test': {
    hook: 'The Discovery Lens cannot tell which paper shape will stand tallest.', body: 'Choose a test order, build three shapes, and compare what happens on the same stable surface.', action: 'Arrange the tower test',
    revealHeading: 'Shape changes how paper stands.', revealBody: 'Folds, curves, and wider bases can change how paper resists bending and balances its weight.',
    resolvedHeading: 'Structure scan aligned.', resolvedBody: 'You tested three tower shapes and compared the result.', objective: 'Build and compare three paper towers under the same conditions.',
    evidence: [{ kind: 'prediction', statement: 'Chose an order for testing three paper shapes.' }, { kind: 'observation', statement: 'Compared which paper tower stood tallest.' }], archetype: 'build-test',
  },
  'count-a-piece-of-sky': {
    hook: 'Two windows in the Discovery Lens show different pieces of night sky.', body: 'Count each small patch with a grown-up and compare them without walking or looking near bright lights.', action: 'Prepare the sky windows',
    revealHeading: 'A sample helps us compare a big sky.', revealBody: 'Counting equal-sized patches does not count every star; it creates two small observations that can be compared.',
    resolvedHeading: 'Sky windows aligned.', resolvedBody: 'You counted two small patches and compared what you could see.', objective: 'With a grown-up, count two small sky patches from one safe place.',
    evidence: [{ kind: 'observation', statement: 'Counted two small night-sky patches with a grown-up.' }, { kind: 'explanation', statement: 'Compared two samples rather than claiming to count the whole sky.' }], archetype: 'field-mystery',
  },
  'ten-minute-tidy-system': {
    hook: 'The Everyday Station has forgotten where a small group of things belongs.', body: 'Choose one safe shelf or drawer and invent a rule based on type, use, or size.', action: 'Choose the sorting rule',
    revealHeading: 'A useful system has a rule people can repeat.', revealBody: 'Grouping by type, use, or size makes it easier to decide where an item belongs later.',
    resolvedHeading: 'Sorter aligned.', resolvedBody: 'You made one small space easier to understand and use.', objective: 'Organise one approved small space using the rule you chose.',
    evidence: [{ kind: 'strategy', statement: 'Chose a repeatable rule for organising a small space.' }, { kind: 'explanation', statement: 'Used the rule to decide where items belonged.' }], archetype: 'safe-practice',
  },
  'set-a-table-pattern': {
    hook: 'The Everyday Station place signals are scattered.', body: 'Arrange plate, cup, and napkin symbols, then recreate the same pattern with safe items.', action: 'Set the pattern',
    revealHeading: 'A pattern helps someone repeat an arrangement.', revealBody: 'Relative positions—beside, above, and in front—can describe where each item belongs.',
    resolvedHeading: 'Table pattern settled.', resolvedBody: 'You planned an arrangement and recreated it in the real world.', objective: 'Recreate your planned place setting with safe, approved items.',
    evidence: [{ kind: 'strategy', statement: 'Planned a place-setting arrangement before making it.' }, { kind: 'explanation', statement: 'Used positions to explain the pattern.' }], archetype: 'safe-practice',
  },
  'tomorrow-mini-plan': {
    hook: 'Three tomorrow signals reached the Everyday Station out of order.', body: 'Choose three small useful tasks and arrange them as first, next, and finally.', action: 'Order tomorrow’s signals',
    revealHeading: 'A plan is a guide, not a promise.', revealBody: 'Putting a few tasks in order can make the next step clearer while leaving room for a grown-up to change the schedule.',
    resolvedHeading: 'Tomorrow rail aligned.', resolvedBody: 'You made a small, flexible plan with a clear first step.', objective: 'Say or write three small tasks in first–next–finally order.',
    evidence: [{ kind: 'strategy', statement: 'Put three useful tasks in a planned order.' }, { kind: 'explanation', statement: 'Identified a clear first step while keeping the plan flexible.' }], archetype: 'safe-practice',
  },
  'mirror-movement': {
    hook: 'Two tracks on the Courage Path have slipped out of sync.', body: 'Choose the first leader and copy slow movements carefully enough to notice each change.', action: 'Set the mirror sequence',
    revealHeading: 'Careful copying begins with watching.', revealBody: 'Slower movement gives a partner more time to notice direction, level, speed, and shape.',
    resolvedHeading: 'Mirror paths synchronized.', resolvedBody: 'You watched, copied, and took turns without rushing.', objective: 'Take turns leading and copying slow movements in a clear space.',
    evidence: [{ kind: 'observation', statement: 'Watched a partner’s slow movements closely.' }, { kind: 'strategy', statement: 'Took turns leading and copying without rushing.' }], archetype: 'movement-challenge',
  },
  'soft-ball-skill': {
    hook: 'A practice arc on the Courage Path has disappeared.', body: 'Choose roll, throw, or catch and use ten calm tries to notice one adjustment—not to make a score.', action: 'Choose the practice arc',
    revealHeading: 'Practice is information, not a score.', revealBody: 'Repeating one safe movement can reveal how position, force, attention, or timing changes the result.',
    resolvedHeading: 'Practice arc visible.', resolvedBody: 'You stayed with one movement long enough to notice an adjustment.', objective: 'Try one soft-ball skill ten calm times in an approved clear space.',
    evidence: [{ kind: 'strategy', statement: 'Practised one movement without turning attempts into a score.' }, { kind: 'observation', statement: 'Noticed an adjustment across repeated tries.' }], archetype: 'movement-challenge',
  },
  'slow-motion-animal-walk': {
    hook: 'Four movement tracks on the Courage Path are mixed up.', body: 'Choose four gentle animal-inspired movements and connect them without speeding up.', action: 'Arrange the movement tracks',
    revealHeading: 'Slow movement makes control easier to notice.', revealBody: 'Moving slowly creates time to adjust balance, range, and comfort between one shape and the next.',
    resolvedHeading: 'Animal trail connected.', resolvedBody: 'You joined four careful movements into one controlled sequence.', objective: 'Try your four-part movement sequence gently on a clear floor.',
    evidence: [{ kind: 'strategy', statement: 'Arranged four gentle movements into a sequence.' }, { kind: 'observation', statement: 'Adjusted the sequence to stay comfortable and controlled.' }], archetype: 'movement-challenge',
  },
};

const YOUNGER_CONFIRMATIONS: Record<string, string> = {
  'three-object-story': 'We found three safe objects and gave them story parts together.',
  'teach-one-small-skill': 'We chose one safe skill to show, explain, and try together.',
  'two-minute-explanation': 'We chose a safe topic and three ideas to say together.',
  'cold-snack-builder': 'The grown-up approved three ingredients before we begin.',
  'tomorrow-mini-plan': 'We chose three small tasks and said their order together.',
};

function adaptInteractionForYoungChild(interaction: MissionInteraction, experienceId: string): MissionInteraction {
  if (interaction.kind === 'slot-input') {
    return {
      kind: 'choice-board', id: interaction.id, title: interaction.title,
      instruction: 'A grown-up reads this aloud. Choose the check when you have decided together.',
      options: [{ id: 'decided-together', label: YOUNGER_CONFIRMATIONS[experienceId] ?? 'We made this choice together.' }],
      minSelections: 1, maxSelections: 1,
    };
  }
  return { ...interaction, instruction: `Read this together. ${interaction.instruction}` };
}

function normalizeNarrative(definition: LegacyMissionDefinition): MissionNarrative {
  const domainId = EXPERIENCE_DOMAINS[definition.experienceId];
  const world = WORLD_CONFIG[domainId];
  const legacy = definition.narrative;
  const seed = NARRATIVE_SEEDS[definition.experienceId];
  if (!world || (!legacy && !seed)) throw new Error(`Missing living-world story for ${definition.experienceId}`);
  return {
    worldId: world.id,
    signalId: definition.experienceId,
    artworkSceneId: `${world.id}:${definition.experienceId}`,
    worldName: world.name,
    artworkId: world.artworkId,
    archetype: legacy?.archetype ?? seed.archetype ?? 'field-mystery',
    hook: legacy?.hook ?? { heading: seed.hook, body: seed.body, actionLabel: seed.action },
    knowledgeReveal: legacy?.knowledgeReveal ?? { heading: seed.revealHeading, body: seed.revealBody },
    resolvedWorld: legacy?.resolvedWorld ?? { heading: seed.resolvedHeading, body: seed.resolvedBody },
    realWorldObjective: legacy?.realWorldObjective ?? seed.objective,
    evidenceRules: legacy?.evidenceRules ?? seed.evidence,
    knowledgeReview: {
      sourceLabels: legacy?.knowledgeReview.sourceLabels ?? world.sourceLabels,
      sourceUrls: world.sourceUrls,
      reviewerRole: 'Constellation editorial and child-safety review',
      reviewedAt: legacy?.knowledgeReview.reviewedAt ?? '2026-09-04',
      expiresAt: '2027-03-01',
      changeNote: legacy ? 'Migrated the reviewed flagship into the 25-signal living-world model.' : 'Added an authored story, learning reveal, and age-band review record.',
    },
  };
}

function makeVariants(definition: LegacyMissionDefinition, narrative: MissionNarrative): MissionDefinition['variants'] {
  const baseReturn = definition.returnInteractions ?? [];
  const youngerPreparation = [
    { id: 'ready-grown-up', label: 'A grown-up is here to read, prepare, and do this mission with me.' },
    ...definition.preparation,
  ];
  const youngerEvidence = narrative.evidenceRules.map((rule) => ({
    ...rule,
    statement: `Worked with a grown-up and ${rule.statement.charAt(0).toLowerCase()}${rule.statement.slice(1)}`,
  }));
  return {
    '6-7': {
      participationMode: 'guardian-led',
      previewLabel: `Try together: ${definition.previewLabel}`,
      successCue: `Together, ${definition.successCue.charAt(0).toLowerCase()}${definition.successCue.slice(1)}`,
      memoryCue: `Stay together. ${definition.memoryCue}`,
      briefInteractions: definition.briefInteractions.map((item) => adaptInteractionForYoungChild(item, definition.experienceId)) as MissionDefinition['briefInteractions'],
      returnInteractions: baseReturn.map((item) => adaptInteractionForYoungChild(item, definition.experienceId)),
      preparation: youngerPreparation,
      steps: definition.steps.slice(0, 3),
      evidenceRules: youngerEvidence,
    },
    '8-9': {
      participationMode: 'together', previewLabel: definition.previewLabel, successCue: definition.successCue,
      memoryCue: definition.memoryCue, briefInteractions: definition.briefInteractions, returnInteractions: baseReturn,
      preparation: definition.preparation, steps: definition.steps, evidenceRules: narrative.evidenceRules,
    },
    '10-12': {
      participationMode: 'increasing-independence', previewLabel: definition.previewLabel, successCue: definition.successCue,
      memoryCue: definition.memoryCue, briefInteractions: definition.briefInteractions, returnInteractions: baseReturn,
      preparation: definition.preparation, steps: definition.steps,
      evidenceRules: narrative.evidenceRules.map((rule) => ({ ...rule, statement: rule.statement.replace(/^Used /, 'Chose and used ') })),
    },
  };
}

export const MISSION_DEFINITIONS: MissionDefinition[] = LEGACY_MISSION_DEFINITIONS.map((legacy) => {
  const narrative = normalizeNarrative(legacy);
  return { ...legacy, narrative, variants: makeVariants(legacy, narrative) };
});

export const MISSION_REGISTRY = Object.fromEntries(
  MISSION_DEFINITIONS.map((definition) => [definition.experienceId, definition]),
) as Record<string, MissionDefinition>;

export function getMissionDefinition(experienceId: string, ageBand: AgeBand = '8-9', catalogVersion = 2) {
  const definition = MISSION_REGISTRY[experienceId];
  if (!definition) return undefined;
  const resolvedAgeBand: AgeBand = catalogVersion < 2 && ageBand === '6-7' ? '8-9' : ageBand;
  const variant = definition.variants[resolvedAgeBand];
  const startPolicy = resolvedAgeBand === '6-7'
    ? guardianStart('I am the grown-up leading this mission. I checked the place, materials, and safety boundary and will stay with the child.')
    : definition.startPolicy;
  return {
    ...definition,
    ...variant,
    returnInteractions: variant.returnInteractions,
    startPolicy,
    narrative: { ...definition.narrative, evidenceRules: variant.evidenceRules },
  };
}

function validateInteraction(experienceId: string, interaction: MissionInteraction, errors: string[]) {
  if (interaction.kind !== 'safety-sequence') return;
  if (interaction.scenes.length === 0) errors.push(`empty safety sequence: ${experienceId}`);
  for (const scene of interaction.scenes) {
    if (scene.options.filter((option) => option.correct).length !== 1) errors.push(`safety scene needs one correct choice: ${experienceId}/${scene.id}`);
    if (scene.options.some((option) => !option.feedback)) errors.push(`safety choice missing feedback: ${experienceId}/${scene.id}`);
  }
}

export function validateMissionRegistry(experienceIds: string[]) {
  const errors: string[] = [];
  const expected = new Set(experienceIds);
  const signalIds = new Set<string>();
  const worldIds = new Set<CuriosityAreaId>();
  const seen = new Set<string>();
  const ageBands: AgeBand[] = ['6-7', '8-9', '10-12'];
  for (const definition of MISSION_DEFINITIONS) {
    if (seen.has(definition.experienceId)) errors.push(`duplicate mission: ${definition.experienceId}`);
    seen.add(definition.experienceId);
    if (!expected.has(definition.experienceId)) errors.push(`mission without published experience: ${definition.experienceId}`);
    if (!definition.narrative.hook.heading || !definition.narrative.hook.body || !definition.narrative.hook.actionLabel) errors.push(`incomplete narrative hook: ${definition.experienceId}`);
    if (!definition.narrative.knowledgeReveal.heading || !definition.narrative.knowledgeReveal.body) errors.push(`incomplete knowledge reveal: ${definition.experienceId}`);
    if (!definition.narrative.resolvedWorld.heading || !definition.narrative.resolvedWorld.body) errors.push(`incomplete world change: ${definition.experienceId}`);
    if (!definition.narrative.realWorldObjective) errors.push(`missing narrative objective: ${definition.experienceId}`);
    if (signalIds.has(definition.narrative.signalId)) errors.push(`duplicate story signal: ${definition.narrative.signalId}`);
    signalIds.add(definition.narrative.signalId);
    worldIds.add(definition.narrative.worldId);
    const review = definition.narrative.knowledgeReview;
    if (!review.reviewedAt || !review.expiresAt || !review.reviewerRole || review.sourceUrls.length === 0) errors.push(`narrative knowledge is not reviewed: ${definition.experienceId}`);
    for (const ageBand of ageBands) {
      const variant = definition.variants[ageBand];
      if (!variant || !variant.successCue || !variant.memoryCue || variant.steps.length === 0) errors.push(`incomplete ${ageBand} mission: ${definition.experienceId}`);
      if (!variant || variant.briefInteractions.length === 0) errors.push(`mission without ${ageBand} interaction: ${definition.experienceId}`);
      if (variant?.steps.length > 4) errors.push(`too many ${ageBand} steps: ${definition.experienceId}`);
      if (variant?.evidenceRules.length === 0 || variant?.evidenceRules.length > 3) errors.push(`invalid ${ageBand} evidence: ${definition.experienceId}`);
      if (ageBand === '6-7' && variant?.briefInteractions.some((item) => item.kind === 'slot-input')) errors.push(`ages 6-7 cannot require typing: ${definition.experienceId}`);
      for (const interaction of [...(variant?.briefInteractions ?? []), ...(variant?.returnInteractions ?? [])]) validateInteraction(definition.experienceId, interaction, errors);
    }
  }
  if (worldIds.size !== 6) errors.push('the catalog must use exactly six living worlds');
  if (signalIds.size !== experienceIds.length) errors.push('every published mission needs one unique story signal');
  for (const experienceId of expected) if (!seen.has(experienceId)) errors.push(`published experience without mission: ${experienceId}`);
  return errors;
}

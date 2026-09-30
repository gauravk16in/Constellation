import type { AgeBand, Experience } from '@/types/constellation';
import { validateMissionRegistry } from '@/data/catalog/mission-registry';

const REVIEW_EXPIRY = '2027-03-01';
const GENERAL_SOURCES = [
  'https://www.nasa.gov/learning-resources/nasa-kids-club/',
  'https://www.healthychildren.org/English/safety-prevention/at-play/Pages/default.aspx',
] as const;

const REVIEW = {
  checklistVersion: 'prototype-safety-v1',
  reviewed: true,
  reviewedAt: '2026-08-20',
  reviewerRole: 'Constellation editorial and child-safety review',
  expiresAt: REVIEW_EXPIRY,
  sourceUrls: [...GENERAL_SOURCES],
  changeNote: 'Expanded for the three-band story-mission release.',
} as const;

const ROSE_REVIEW = {
  checklistVersion: 'story-mission-safety-v1',
  reviewed: true,
  reviewedAt: '2026-08-27',
  reviewerRole: 'Constellation editorial and child-safety review',
  expiresAt: REVIEW_EXPIRY,
  sourceUrls: [
    'https://extension.illinois.edu/roses/roses-types',
    'https://plants.ces.ncsu.edu/plants/rosa/common-name/roses/',
  ],
  changeNote: 'Preserved the reviewed hands-back Rose Signal safety boundary.',
} as const;

const COMMON_ADAPTATIONS: Experience['adaptations'] = [
  'clearer-steps',
  'flexible-pacing',
  'guardian-alongside',
];

type ExperienceSeed = Omit<Experience, 'agePolicies'>;

const RAW_CATALOG: ExperienceSeed[] = [
  {
    id: 'backyard-sound-map', version: 1, status: 'published', title: 'Backyard Sound Map',
    promise: 'Listen for five sounds and draw where each one came from.', domainId: 'nature-noticing',
    ageBands: ['8-9', '10-12'], durationMinutes: 20, settings: ['outdoors'],
    allowedContexts: ['yard', 'neighbourhood', 'public-place'], companionOptions: ['solo', 'guardian', 'sibling', 'friend'],
    requiredMaterials: ['paper-drawing'], weatherAllowed: ['clear', 'cloudy', 'cold'], timeWindow: 'daylight',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Stay in a family-approved place and listen from a safe, stationary spot.', review: REVIEW,
  },
  {
    id: 'leaf-detective', version: 1, status: 'published', title: 'Leaf Detective',
    promise: 'Compare three fallen leaves by shape, texture, colour, and size.', domainId: 'nature-noticing',
    ageBands: ['8-9', '10-12'], durationMinutes: 20, settings: ['outdoors'],
    allowedContexts: ['yard', 'neighbourhood', 'public-place'], companionOptions: ['solo', 'guardian', 'sibling', 'friend'],
    requiredMaterials: ['outdoor-found'], weatherAllowed: ['clear', 'cloudy', 'cold'], timeWindow: 'daylight',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Use fallen leaves only. Do not touch unknown plants, insects, or fungi.', review: REVIEW,
  },
  {
    id: 'rose-signal', version: 1, status: 'published', title: 'Rose Signal',
    promise: 'Observe a familiar rose with a grown-up and discover how it protects itself without touching it.', domainId: 'nature-noticing',
    ageBands: ['8-9', '10-12'], durationMinutes: 10, settings: ['indoors', 'outdoors'],
    allowedContexts: ['home', 'yard'], companionOptions: ['guardian'],
    requiredMaterials: ['familiar-plant'], weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Observe only a familiar, grown-up-approved plant. Keep hands back; do not touch, pick, taste, or use tools.', review: ROSE_REVIEW,
  },
  {
    id: 'cloud-shape-story', version: 1, status: 'published', title: 'Cloud Shape Story',
    promise: 'Spot three cloud shapes and connect them into a tiny story.', domainId: 'nature-noticing',
    ageBands: ['8-9', '10-12'], durationMinutes: 10, settings: ['outdoors'],
    allowedContexts: ['yard', 'neighbourhood', 'public-place'], companionOptions: ['solo', 'guardian', 'sibling', 'friend'],
    requiredMaterials: ['nothing-special'], weatherAllowed: ['clear', 'cloudy'], timeWindow: 'daylight',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Look from a safe place and never look directly at the sun.', review: REVIEW,
  },
  {
    id: 'window-nature-log', version: 1, status: 'published', title: 'Window Nature Log',
    promise: 'Watch one outdoor spot for ten minutes and record what changes.', domainId: 'nature-noticing',
    ageBands: ['8-9', '10-12'], durationMinutes: 20, settings: ['indoors'],
    allowedContexts: ['home'], companionOptions: ['solo', 'guardian', 'sibling', 'friend'],
    requiredMaterials: ['paper-drawing'], weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'daylight',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Observe through a closed or safely secured window.', review: REVIEW,
  },
  {
    id: 'three-colour-picture', version: 1, status: 'published', title: 'Three-Colour Picture',
    promise: 'Create a picture using only three colours you choose.', domainId: 'make-create',
    ageBands: ['8-9', '10-12'], durationMinutes: 30, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['solo', 'guardian', 'sibling', 'friend'], requiredMaterials: ['paper-drawing'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Use washable, age-appropriate art materials on a protected surface.', review: REVIEW,
  },
  {
    id: 'paper-bridge', version: 1, status: 'published', title: 'Build a Paper Bridge',
    promise: 'Predict, build, and compare what a paper bridge can carry.', domainId: 'make-create',
    ageBands: ['8-9', '10-12'], durationMinutes: 30, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['solo', 'guardian', 'sibling', 'friend'], requiredMaterials: ['paper-drawing', 'basic-household'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Use lightweight test objects and keep fingers away from paper edges.', review: REVIEW,
  },
  {
    id: 'room-rhythm', version: 1, status: 'published', title: 'Room Rhythm',
    promise: 'Make a short rhythm using claps, taps, and quiet room sounds.', domainId: 'make-create',
    ageBands: ['8-9', '10-12'], durationMinutes: 10, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['solo', 'guardian', 'sibling', 'friend'], requiredMaterials: ['nothing-special'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'low-movement'],
    safetyNote: 'Keep sounds comfortable for everyone nearby and do not strike breakable objects.', review: REVIEW,
  },
  {
    id: 'recycled-sculpture', version: 1, status: 'published', title: 'Recycled Sculpture',
    promise: 'Turn clean household packaging into an imaginary creature or machine.', domainId: 'make-create',
    ageBands: ['8-9', '10-12'], durationMinutes: 45, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['guardian', 'sibling', 'friend'], requiredMaterials: ['basic-household'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'A grown-up checks materials first. Use clean packaging with no sharp edges or glass.', review: REVIEW,
  },
  {
    id: 'three-object-story', version: 1, status: 'published', title: 'Three-Object Story',
    promise: 'Choose three safe objects and give them a beginning, middle, and ending.', domainId: 'talk-connect',
    ageBands: ['8-9', '10-12'], durationMinutes: 20, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['guardian', 'sibling', 'friend'], requiredMaterials: ['basic-household'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Choose ordinary, unbreakable objects that are safe to handle.', review: REVIEW,
  },
  {
    id: 'family-interview', version: 1, status: 'published', title: 'Family Interview',
    promise: 'Ask a grown-up five questions about something they loved learning.', domainId: 'talk-connect',
    ageBands: ['8-9', '10-12'], durationMinutes: 20, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['guardian'], requiredMaterials: ['nothing-special'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Interview only a trusted grown-up already with you. Any question may be skipped.', review: REVIEW,
  },
  {
    id: 'teach-one-small-skill', version: 1, status: 'published', title: 'Teach One Small Skill',
    promise: 'Teach someone one thing you know how to do, step by step.', domainId: 'talk-connect',
    ageBands: ['8-9', '10-12'], durationMinutes: 20, settings: ['indoors', 'outdoors'],
    allowedContexts: ['home', 'yard'], companionOptions: ['guardian', 'sibling', 'friend'], requiredMaterials: ['nothing-special'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Choose a safe skill with no heat, blades, roads, water, or heavy tools.', review: REVIEW,
  },
  {
    id: 'two-minute-explanation', version: 1, status: 'published', title: 'Two-Minute Explanation',
    promise: 'Explain how something works, then invite one curious question.', domainId: 'talk-connect',
    ageBands: ['8-9', '10-12'], durationMinutes: 10, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['guardian', 'sibling', 'friend'], requiredMaterials: ['nothing-special'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Share only with someone already approved by your family.', review: REVIEW,
  },
  {
    id: 'kitchen-measurement-hunt', version: 1, status: 'published', title: 'Kitchen Measurement Hunt',
    promise: 'Find five measuring marks and compare what each one means.', domainId: 'test-discover',
    ageBands: ['8-9', '10-12'], durationMinutes: 20, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['guardian'], requiredMaterials: ['basic-household'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'A grown-up stays with you. Do not use heat, blades, appliances, or glass containers.', review: REVIEW,
  },
  {
    id: 'shadow-tracing', version: 1, status: 'published', title: 'Shadow Tracing',
    promise: 'Trace one object’s shadow twice and compare how it moved.', domainId: 'test-discover',
    ageBands: ['8-9', '10-12'], durationMinutes: 30, settings: ['outdoors'],
    allowedContexts: ['yard', 'public-place'], companionOptions: ['guardian', 'sibling', 'friend'],
    requiredMaterials: ['paper-drawing'], weatherAllowed: ['clear'], timeWindow: 'daylight',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Work in shade or gentle sunlight, stay in an approved place, and never look at the sun.', review: REVIEW,
  },
  {
    id: 'paper-tower-test', version: 1, status: 'published', title: 'Paper Tower Test',
    promise: 'Build three paper towers and discover which shape stands tallest.', domainId: 'test-discover',
    ageBands: ['8-9', '10-12'], durationMinutes: 30, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['solo', 'guardian', 'sibling', 'friend'], requiredMaterials: ['paper-drawing'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Build on the floor or a stable table and use paper only.', review: REVIEW,
  },
  {
    id: 'count-a-piece-of-sky', version: 1, status: 'published', title: 'Count a Piece of Sky',
    promise: 'Choose one small patch of night sky, count its stars, then compare another patch.', domainId: 'test-discover',
    ageBands: ['8-9', '10-12'], durationMinutes: 20, settings: ['outdoors'],
    allowedContexts: ['yard', 'public-place'], companionOptions: ['guardian'], requiredMaterials: ['nothing-special'],
    weatherAllowed: ['clear'], timeWindow: 'night', adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'A grown-up must stay beside you in a familiar, family-approved place after dark.', review: REVIEW,
  },
  {
    id: 'ten-minute-tidy-system', version: 1, status: 'published', title: 'Invent a Tidy System',
    promise: 'Choose one small shelf or drawer and make a system that is easier to use.', domainId: 'everyday-skills',
    ageBands: ['8-9', '10-12'], durationMinutes: 20, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['solo', 'guardian', 'sibling'], requiredMaterials: ['nothing-special'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Choose a low, lightweight storage space with no medicines, chemicals, tools, or breakables.', review: REVIEW,
  },
  {
    id: 'cold-snack-builder', version: 1, status: 'published', title: 'Build a Cold Snack',
    promise: 'Plan and assemble a simple snack without heat or sharp tools.', domainId: 'everyday-skills',
    ageBands: ['8-9', '10-12'], durationMinutes: 30, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['guardian'], requiredMaterials: ['basic-household'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'A grown-up checks allergies, ingredients, hygiene, and every tool before you begin.', review: REVIEW,
  },
  {
    id: 'set-a-table-pattern', version: 1, status: 'published', title: 'Set a Table Pattern',
    promise: 'Arrange a place setting, then explain the pattern you used.', domainId: 'everyday-skills',
    ageBands: ['8-9', '10-12'], durationMinutes: 10, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['solo', 'guardian', 'sibling'], requiredMaterials: ['basic-household'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Use unbreakable items unless a grown-up is helping. Carry one item at a time.', review: REVIEW,
  },
  {
    id: 'tomorrow-mini-plan', version: 1, status: 'published', title: 'Tomorrow Mini-Plan',
    promise: 'Choose three useful things for tomorrow and put them in a sensible order.', domainId: 'everyday-skills',
    ageBands: ['8-9', '10-12'], durationMinutes: 10, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['solo', 'guardian'], requiredMaterials: ['paper-drawing'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Keep the plan small and flexible. A grown-up decides any travel or schedule changes.', review: REVIEW,
  },
  {
    id: 'floor-line-balance', version: 1, status: 'published', title: 'Floor-Line Balance',
    promise: 'Follow a safe floor line in three different ways without rushing.', domainId: 'move-brave',
    ageBands: ['8-9', '10-12'], durationMinutes: 10, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['solo', 'guardian', 'sibling', 'friend'], requiredMaterials: ['nothing-special'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: ['clearer-steps', 'flexible-pacing', 'guardian-alongside'],
    safetyNote: 'Use a clear, dry floor away from stairs, furniture edges, and breakable objects.', review: REVIEW,
  },
  {
    id: 'mirror-movement', version: 1, status: 'published', title: 'Mirror Movement',
    promise: 'Take turns copying a partner’s slow movements as precisely as you can.', domainId: 'move-brave',
    ageBands: ['8-9', '10-12'], durationMinutes: 10, settings: ['indoors', 'outdoors'],
    allowedContexts: ['home', 'yard'], companionOptions: ['guardian', 'sibling', 'friend'], requiredMaterials: ['nothing-special'],
    weatherAllowed: ['clear', 'cloudy', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: [...COMMON_ADAPTATIONS, 'lower-sensory', 'low-movement'],
    safetyNote: 'Move slowly in a clear space and stop if either person feels uncomfortable.', review: REVIEW,
  },
  {
    id: 'soft-ball-skill', version: 1, status: 'published', title: 'One Soft-Ball Skill',
    promise: 'Choose one throw, catch, or roll and notice how it improves over ten tries.', domainId: 'move-brave',
    ageBands: ['8-9', '10-12'], durationMinutes: 20, settings: ['outdoors'],
    allowedContexts: ['yard', 'public-place'], companionOptions: ['guardian', 'sibling', 'friend'], requiredMaterials: ['basic-household'],
    weatherAllowed: ['clear', 'cloudy', 'cold'], timeWindow: 'daylight',
    adaptations: ['clearer-steps', 'flexible-pacing', 'guardian-alongside'],
    safetyNote: 'Use a soft ball in a clear area away from roads, windows, people, and animals.', review: REVIEW,
  },
  {
    id: 'slow-motion-animal-walk', version: 1, status: 'published', title: 'Slow-Motion Animal Walk',
    promise: 'Invent four careful animal movements and connect them into a short sequence.', domainId: 'move-brave',
    ageBands: ['8-9', '10-12'], durationMinutes: 10, settings: ['indoors'], allowedContexts: ['home'],
    companionOptions: ['solo', 'guardian', 'sibling', 'friend'], requiredMaterials: ['nothing-special'],
    weatherAllowed: ['clear', 'cloudy', 'rain', 'hot', 'cold', 'unknown'], timeWindow: 'any',
    adaptations: ['clearer-steps', 'flexible-pacing', 'guardian-alongside'],
    safetyNote: 'Use a clear floor, keep movements gentle, and stop if anything hurts or feels unsteady.', review: REVIEW,
  },
];

function validateExperience(experience: Experience) {
  const errors: string[] = [];
  if (!experience.id || !experience.title || !experience.promise) errors.push('missing identity or copy');
  if (!experience.ageBands.length) errors.push('missing age band');
  if (!experience.allowedContexts.length) errors.push('missing allowed context');
  if (!experience.companionOptions.length) errors.push('missing companion rule');
  if (!experience.weatherAllowed.length) errors.push('missing weather rule');
  if (!experience.safetyNote) errors.push('missing safety note');
  if (experience.status === 'published' && !experience.review.reviewed) errors.push('published without review');
  if (!experience.review.reviewerRole || !experience.review.expiresAt || experience.review.sourceUrls.length === 0) errors.push('missing review provenance');
  for (const ageBand of ['6-7', '8-9', '10-12'] as AgeBand[]) {
    const policy = experience.agePolicies[ageBand];
    if (!policy?.safetyNote || policy.companionOptions.length === 0) errors.push(`missing ${ageBand} policy`);
    if (ageBand === '6-7' && (policy?.companionOptions.length !== 1 || policy.companionOptions[0] !== 'guardian')) errors.push('ages 6-7 must be guardian-led');
  }
  return errors;
}

function withAgePolicies(experience: ExperienceSeed): Experience {
  const sharedPolicy = {
    durationMinutes: experience.durationMinutes,
    companionOptions: experience.companionOptions,
    safetyNote: experience.safetyNote,
  };
  return {
    ...experience,
    version: experience.id === 'paper-bridge' ? 4 : 2,
    ageBands: ['6-7', '8-9', '10-12'],
    agePolicies: {
      '6-7': {
        durationMinutes: experience.durationMinutes,
        companionOptions: ['guardian'],
        safetyNote: `A grown-up leads this mission. ${experience.safetyNote}`,
      },
      '8-9': sharedPolicy,
      '10-12': sharedPolicy,
    },
  };
}

export function getExperienceAgePolicy(experience: Experience, ageBand: AgeBand) {
  return experience.agePolicies[ageBand];
}

export const EXPERIENCE_CATALOG = RAW_CATALOG.map(withAgePolicies).filter((experience) => {
  const errors = validateExperience(experience);
  if (errors.length > 0 && experience.status === 'published') {
    throw new Error(`Invalid published experience ${experience.id}: ${errors.join(', ')}`);
  }
  return experience.status === 'published' && experience.review.reviewed;
});

const missionErrors = validateMissionRegistry(EXPERIENCE_CATALOG.map((experience) => experience.id));
if (missionErrors.length > 0) throw new Error(`Invalid mission registry: ${missionErrors.join(', ')}`);

export function getExperienceById(id: string) {
  return EXPERIENCE_CATALOG.find((experience) => experience.id === id);
}

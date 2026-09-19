export default {
  equal(actual: unknown, expected: unknown, message = 'Values differ') { if (actual !== expected) throw new Error(message); },
  deepEqual(actual: unknown, expected: unknown, message = 'Structures differ') { if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(message); },
  throws(run: () => unknown, pattern: RegExp) {
    try { run(); } catch (error) { if (error instanceof Error && pattern.test(error.message)) return; throw error; }
    throw new Error(`Expected an error matching ${pattern}`);
  },
  doesNotThrow(run: () => unknown) { run(); },
};

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  applyContactDamage,
  buildGuardLoadout,
  canFireShot,
  formatHealthValue,
  registerGuardHit,
  resolveGameMode,
} = require("../public/game-helpers.js");

test("resolveGameMode enables test mode from the URL query", () => {
  assert.deepEqual(resolveGameMode("?testMode=1"), { testMode: true });
  assert.deepEqual(resolveGameMode("?foo=bar"), { testMode: false });
});

test("buildGuardLoadout spawns two guards in normal mode and keeps guards available in test mode", () => {
  assert.equal(buildGuardLoadout({ testMode: false }).length, 2);
  assert.equal(buildGuardLoadout({ testMode: true }).length, 2);
});

test("applyContactDamage is time-based rather than frame-based", () => {
  const oneStep = applyContactDamage({
    currentHealth: 100,
    damagePerSecond: 30,
    deltaSeconds: 1,
  });

  const twoSteps = applyContactDamage({
    currentHealth: applyContactDamage({
      currentHealth: 100,
      damagePerSecond: 30,
      deltaSeconds: 0.5,
    }),
    damagePerSecond: 30,
    deltaSeconds: 0.5,
  });

  assert.equal(oneStep, 70);
  assert.equal(twoSteps, 70);
});

test("formatHealthValue does not over-report the remaining HP", () => {
  assert.equal(formatHealthValue(99.55), 99);
  assert.equal(formatHealthValue(0.1), 0);
  assert.equal(formatHealthValue(-3), 0);
});

test("registerGuardHit stuns guards after the configured number of hits", () => {
  assert.deepEqual(
    registerGuardHit({ currentHits: 0, hitsToStun: 3 }),
    { hitCount: 1, stunned: false },
  );
  assert.deepEqual(
    registerGuardHit({ currentHits: 2, hitsToStun: 3 }),
    { hitCount: 0, stunned: true },
  );
});

test("canFireShot blocks spam until the cooldown expires", () => {
  assert.equal(
    canFireShot({ nowMs: 1000, lastShotTimeMs: 800, cooldownMs: 350 }),
    false,
  );
  assert.equal(
    canFireShot({ nowMs: 1200, lastShotTimeMs: 800, cooldownMs: 350 }),
    true,
  );
});

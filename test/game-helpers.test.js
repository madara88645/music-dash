const test = require("node:test");
const assert = require("node:assert/strict");

const {
  applyContactDamage,
  buildGuardLoadout,
  formatHealthValue,
  resolveGameMode,
} = require("../public/game-helpers.js");

test("resolveGameMode enables test mode from the URL query", () => {
  assert.deepEqual(resolveGameMode("?testMode=1"), { testMode: true });
  assert.deepEqual(resolveGameMode("?foo=bar"), { testMode: false });
});

test("buildGuardLoadout keeps normal mode guard-free and enables guards for test mode", () => {
  assert.equal(buildGuardLoadout({ testMode: false }).length, 0);
  assert.ok(buildGuardLoadout({ testMode: true }).length > 0);
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

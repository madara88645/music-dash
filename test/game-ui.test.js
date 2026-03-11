const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const gameSource = fs.readFileSync(path.join(__dirname, "..", "public", "game.js"), "utf8");

test("game UI source includes player health state and health bar render hook", () => {
  assert.match(gameSource, /const MAX_PLAYER_HEALTH = 100;/);
  assert.match(gameSource, /let playerHealth = MAX_PLAYER_HEALTH;/);
  assert.match(gameSource, /const GUARD_CONTACT_DAMAGE_PER_SECOND = 30;/);
  assert.match(gameSource, /const gameMode = gameHelpers\.resolveGameMode\(window\.location\.search\);/);
  assert.match(gameSource, /const guards = gameHelpers\.buildGuardLoadout\(gameMode\);/);
  assert.match(gameSource, /function applyPlayerDamage\(amount\)/);
  assert.match(gameSource, /function renderHealthBar\(\)/);
  assert.match(gameSource, /applyPlayerDamage\(GUARD_CONTACT_DAMAGE_PER_SECOND \* deltaSeconds\);/);
  assert.match(gameSource, /renderHealthBar\(\);/);
});

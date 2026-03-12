const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("repo npm scripts use powershell as the script shell on Windows", () => {
  const npmConfigPath = path.join(__dirname, "..", ".npmrc");
  const npmConfigSource = fs.readFileSync(npmConfigPath, "utf8");

  assert.match(npmConfigSource, /^script-shell=powershell\.exe$/m);
});

const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../server");

async function startServer(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${port}`,
      });
    });
  });
}

test("GET /api/scores is no longer exposed in offline demo mode", async () => {
  const app = createApp();
  const { server, baseUrl } = await startServer(app);

  try {
    const response = await fetch(`${baseUrl}/api/scores`);

    assert.equal(response.status, 404);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("POST /api/scores is no longer exposed in offline demo mode", async () => {
  const app = createApp();
  const { server, baseUrl } = await startServer(app);

  try {
    const response = await fetch(`${baseUrl}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: "Memo",
        score: 4200,
      }),
    });

    assert.equal(response.status, 404);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("GET / serves the merged game frontend", async () => {
  const app = createApp();
  const { server, baseUrl } = await startServer(app);

  try {
    const response = await fetch(`${baseUrl}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /game-canvas/i);
    assert.doesNotMatch(body, /leaderboard-panel/i);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

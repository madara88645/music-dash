const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp, createMemoryScoreStore } = require("../server");

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

test("GET /api/scores returns an empty array when no scores exist", async () => {
  const app = createApp({ store: createMemoryScoreStore() });
  const { server, baseUrl } = await startServer(app);

  try {
    const response = await fetch(`${baseUrl}/api/scores`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, []);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("GET / serves the merged game frontend", async () => {
  const app = createApp({ store: createMemoryScoreStore() });
  const { server, baseUrl } = await startServer(app);

  try {
    const response = await fetch(`${baseUrl}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /game-canvas/i);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("POST /api/scores stores a valid score and GET returns it", async () => {
  const app = createApp({ store: createMemoryScoreStore() });
  const { server, baseUrl } = await startServer(app);

  try {
    const postResponse = await fetch(`${baseUrl}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: "Memo",
        score: 4200,
      }),
    });
    const createdScore = await postResponse.json();

    assert.equal(postResponse.status, 201);
    assert.equal(createdScore.playerName, "Memo");
    assert.equal(createdScore.score, 4200);
    assert.equal(typeof createdScore.createdAt, "string");

    const getResponse = await fetch(`${baseUrl}/api/scores`);
    const leaderboard = await getResponse.json();

    assert.equal(getResponse.status, 200);
    assert.equal(leaderboard.length, 1);
    assert.deepEqual(leaderboard[0], createdScore);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("POST /api/scores rejects a blank playerName", async () => {
  const app = createApp({ store: createMemoryScoreStore() });
  const { server, baseUrl } = await startServer(app);

  try {
    const response = await fetch(`${baseUrl}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: "   ",
        score: 9000,
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, "playerName must be a non-empty string");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("GET /api/scores returns the top 10 scores sorted descending", async () => {
  const app = createApp({ store: createMemoryScoreStore() });
  const { server, baseUrl } = await startServer(app);

  try {
    for (let index = 0; index < 12; index += 1) {
      const response = await fetch(`${baseUrl}/api/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: `Player ${index}`,
          score: index * 100,
        }),
      });

      assert.equal(response.status, 201);
    }

    const leaderboardResponse = await fetch(`${baseUrl}/api/scores`);
    const leaderboard = await leaderboardResponse.json();

    assert.equal(leaderboardResponse.status, 200);
    assert.equal(leaderboard.length, 10);
    assert.deepEqual(
      leaderboard.map((entry) => entry.score),
      [1100, 1000, 900, 800, 700, 600, 500, 400, 300, 200],
    );
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("POST /api/scores keeps multiple entries for the same player name", async () => {
  const app = createApp({ store: createMemoryScoreStore() });
  const { server, baseUrl } = await startServer(app);

  try {
    for (const score of [150, 350]) {
      const response = await fetch(`${baseUrl}/api/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: "Memo",
          score,
        }),
      });

      assert.equal(response.status, 201);
    }

    const leaderboardResponse = await fetch(`${baseUrl}/api/scores`);
    const leaderboard = await leaderboardResponse.json();

    assert.equal(leaderboardResponse.status, 200);
    assert.equal(leaderboard.length, 2);
    assert.deepEqual(
      leaderboard.map((entry) => entry.score),
      [350, 150],
    );
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("GET /api/scores breaks score ties by earlier createdAt first", async () => {
  const app = createApp({ store: createMemoryScoreStore() });
  const { server, baseUrl } = await startServer(app);

  try {
    const firstResponse = await fetch(`${baseUrl}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: "First",
        score: 500,
      }),
    });
    const firstEntry = await firstResponse.json();

    const secondResponse = await fetch(`${baseUrl}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: "Second",
        score: 500,
      }),
    });
    const secondEntry = await secondResponse.json();

    const leaderboardResponse = await fetch(`${baseUrl}/api/scores`);
    const leaderboard = await leaderboardResponse.json();

    assert.equal(firstResponse.status, 201);
    assert.equal(secondResponse.status, 201);
    assert.equal(leaderboardResponse.status, 200);
    assert.equal(leaderboard.length, 2);
    assert.equal(leaderboard[0].playerName, "First");
    assert.equal(leaderboard[1].playerName, "Second");
    assert.equal(leaderboard[0].createdAt, firstEntry.createdAt);
    assert.equal(leaderboard[1].createdAt, secondEntry.createdAt);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("POST /api/scores rejects a non-numeric score", async () => {
  const app = createApp({ store: createMemoryScoreStore() });
  const { server, baseUrl } = await startServer(app);

  try {
    const response = await fetch(`${baseUrl}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: "Memo",
        score: "9000",
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, "score must be a finite number");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("POST /api/scores rejects malformed JSON bodies with a JSON error response", async () => {
  const app = createApp({ store: createMemoryScoreStore() });
  const { server, baseUrl } = await startServer(app);

  try {
    const response = await fetch(`${baseUrl}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: '{"playerName":"Memo","score":42',
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, "Invalid JSON body");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

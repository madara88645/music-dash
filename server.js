const cors = require("cors");
const express = require("express");

function sortScores(left, right) {
  if (left.score !== right.score) {
    return right.score - left.score;
  }

  return left.createdAt.localeCompare(right.createdAt);
}

function toPublicScore(entry) {
  return {
    playerName: entry.playerName,
    score: entry.score,
    createdAt: entry.createdAt,
  };
}

function createMemoryScoreStore(initialScores = []) {
  const scores = initialScores.map((entry) => ({ ...entry }));

  return {
    add(entry) {
      scores.push({ ...entry });
      return toPublicScore(entry);
    },
    getTop(limit = 10) {
      return scores
        .slice()
        .sort(sortScores)
        .slice(0, limit)
        .map((entry) => toPublicScore(entry));
    },
  };
}

function validateScorePayload(payload) {
  if (!payload || typeof payload.playerName !== "string" || !payload.playerName.trim()) {
    return "playerName must be a non-empty string";
  }

  if (typeof payload.score !== "number" || !Number.isFinite(payload.score)) {
    return "score must be a finite number";
  }

  return null;
}

function createApp(options = {}) {
  const store = options.store ?? createMemoryScoreStore();
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/scores", (_request, response) => {
    response.status(200).json(store.getTop(10));
  });

  app.post("/api/scores", (request, response) => {
    const validationError = validateScorePayload(request.body);

    if (validationError) {
      return response.status(400).json({ error: validationError });
    }

    const entry = {
      playerName: request.body.playerName.trim(),
      score: request.body.score,
      createdAt: new Date().toISOString(),
    };

    return response.status(201).json(store.add(entry));
  });

  app.use((error, _request, response, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
      return response.status(400).json({ error: "Invalid JSON body" });
    }

    return next(error);
  });

  return app;
}

const port = Number.parseInt(process.env.PORT ?? "3001", 10);
const app = createApp({ store: createMemoryScoreStore() });

if (require.main === module) {
  app.listen(Number.isNaN(port) ? 3001 : port, () => {
    console.log(`Leaderboard server running on port ${Number.isNaN(port) ? 3001 : port}`);
  });
}

module.exports = {
  app,
  createApp,
  createMemoryScoreStore,
  sortScores,
};

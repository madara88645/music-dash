const path = require("node:path");
const express = require("express");

function createApp(options = {}) {
  const staticDir = options.staticDir ?? path.join(__dirname, "public");
  const app = express();

  app.use(express.static(staticDir));

  return app;
}

const port = Number.parseInt(process.env.PORT ?? "3001", 10);
const app = createApp();

if (require.main === module) {
  app.listen(Number.isNaN(port) ? 3001 : port, () => {
    console.log(`Music Dash demo server running on port ${Number.isNaN(port) ? 3001 : port}`);
  });
}

module.exports = {
  app,
  createApp,
};

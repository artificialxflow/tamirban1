/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "8729", 10);
const hostname = "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";

// #region agent log:server-env
console.log("🔍 [DEBUG] Server Environment Variables:");
console.log(`   PORT: ${process.env.PORT || "undefined (using default 8729)"}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || "undefined (using default development)"}`);
console.log(`   Resolved port: ${port}`);
console.log(`   Resolved dev: ${dev}`);
console.log(`   Process cwd: ${process.cwd()}`);
fetch("http://127.0.0.1:7252/ingest/7549b5eb-a34c-443b-885c-874f6bff68a8", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId: "debug-session",
    runId: "initial",
    hypothesisId: "H1",
    location: "server.js:env",
    message: "server env detected",
    data: {
      port,
      hostname,
      nodeEnv: process.env.NODE_ENV || null,
      dev,
      processCwd: process.cwd(),
      envPort: process.env.PORT || null,
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion agent log:server-env

// در production، باید build وجود داشته باشد
if (!dev) {
  const fs = require("fs");
  const path = require("path");
  const buildIdPath = path.join(process.cwd(), ".next", "BUILD_ID");
  if (!fs.existsSync(buildIdPath)) {
    console.error("❌ Error: Production build not found!");
    console.error("   Please run 'npm run build' before starting the production server.");
    console.error("   See: https://nextjs.org/docs/messages/production-start-no-build-id");
    process.exit(1);
  }
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function start() {
  try {
    // #region agent log:start-before-prepare
    fetch("http://127.0.0.1:7252/ingest/7549b5eb-a34c-443b-885c-874f6bff68a8", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "initial",
        hypothesisId: "H2",
        location: "server.js:start:beforePrepare",
        message: "start() called, before app.prepare",
        data: {},
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log:start-before-prepare

    await app.prepare();

    createServer(async (req, res) => {
      try {
        // #region agent log:request-received
        fetch("http://127.0.0.1:7252/ingest/7549b5eb-a34c-443b-885c-874f6bff68a8", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "initial",
            hypothesisId: "H3",
            location: "server.js:request",
            message: "incoming request",
            data: {
              method: req.method,
              url: req.url,
              headersHost: req.headers && req.headers.host,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion agent log:request-received

        await handle(req, res);
      } catch (err) {
        console.error("Error while handling request:", err);
        // #region agent log:request-error
        fetch("http://127.0.0.1:7252/ingest/7549b5eb-a34c-443b-885c-874f6bff68a8", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "initial",
            hypothesisId: "H4",
            location: "server.js:request:error",
            message: "error while handling request",
            data: { message: err && err.message ? err.message : String(err) },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion agent log:request-error

        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }).listen(port, hostname, () => {
      console.log(
        `🚀 TamirBan Next.js server ready on http://${hostname}:${port} (${dev ? "development" : "production"})`,
      );
      // #region agent log:start-listening
      fetch("http://127.0.0.1:7252/ingest/7549b5eb-a34c-443b-885c-874f6bff68a8", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "initial",
          hypothesisId: "H2",
          location: "server.js:start:listening",
          message: "server started listening",
          data: { port, hostname, dev },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log:start-listening
    });
  } catch (err) {
    console.error("Failed to start TamirBan server:", err);
    // #region agent log:start-failed
    fetch("http://127.0.0.1:7252/ingest/7549b5eb-a34c-443b-885c-874f6bff68a8", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "initial",
        hypothesisId: "H1",
        location: "server.js:start:failed",
        message: "failed to start server",
        data: { message: err && err.message ? err.message : String(err) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log:start-failed
    process.exit(1);
  }
}

start();


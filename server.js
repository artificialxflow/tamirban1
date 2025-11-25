/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3124", 10);
const hostname = "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";

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
    await app.prepare();

    createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error("Error while handling request:", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }).listen(port, hostname, () => {
      console.log(
        `🚀 TamirBan Next.js server ready on http://${hostname}:${port} (${dev ? "development" : "production"})`,
      );
    });
  } catch (err) {
    console.error("Failed to start TamirBan server:", err);
    process.exit(1);
  }
}

start();


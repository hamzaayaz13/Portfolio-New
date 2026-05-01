/**
 * Hit the local dev/production Next server and assert `/` is the portfolio home.
 * Run with dev server already up: npm run verify:local
 *
 * Env: VERIFY_HOST (default 127.0.0.1), VERIFY_PORT (default 3000), VERIFY_RETRIES (default 45)
 */
const http = require("http");

const host = process.env.VERIFY_HOST || "127.0.0.1";
const port = Number(process.env.VERIFY_PORT || "3000", 10);
const maxAttempts = Number(process.env.VERIFY_RETRIES || "45", 10);

const TITLE = "Hamza Ayaz — Product Designer";
const HERO_MARKER = "Hello, my name is";

function fetchOnce() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host, port, path: "/", method: "GET", timeout: 12_000 },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("request timeout"));
    });
    req.end();
  });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { statusCode, body } = await fetchOnce();
      if (statusCode !== 200) {
        throw new Error(`GET / returned ${statusCode} (expected 200)`);
      }
      if (body.includes('"statusCode":500') && body.includes("Cannot find module")) {
        throw new Error(
          "Response looks like a Next.js 500 (missing chunk). Delete .next and restart dev (npm run dev:clean).",
        );
      }
      if (!body.includes(TITLE)) {
        throw new Error(`HTML missing expected <title> substring: ${TITLE}`);
      }
      if (!body.includes(HERO_MARKER)) {
        throw new Error(`HTML missing homepage hero marker: ${HERO_MARKER}`);
      }
      console.log(
        `verify-local-home: OK (${host}:${port}/) attempt ${attempt}/${maxAttempts}`,
      );
      process.exit(0);
      return;
    } catch (e) {
      lastErr = e;
      if (attempt < maxAttempts) {
        await sleep(1000);
      }
    }
  }
  console.error("verify-local-home: FAILED after", maxAttempts, "attempts");
  console.error(lastErr && lastErr.message ? lastErr.message : lastErr);
  process.exit(1);
}

main();

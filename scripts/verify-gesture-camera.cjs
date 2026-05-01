/**
 * Self-checks for /personal-projects/gesture-camera (CSS scope, assets, strings).
 *
 *   npm run verify:gesture
 *
 * With a running server (after `npm run build && npm run start`):
 *   VERIFY_PORT=3000 node scripts/verify-gesture-camera.cjs --fetch
 */
const fs = require("fs");
const path = require("path");
const http = require("http");

const root = path.join(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function fail(msg) {
  console.error("verify-gesture-camera: FAIL —", msg);
  process.exit(1);
}

function assert(cond, msg) {
  if (!cond) fail(msg);
}

function runStaticChecks() {
  const experience = read("components/gesture-camera-experience.tsx");
  assert(
    experience.includes("gesture-camera-root"),
    'components/gesture-camera-experience.tsx must include class "gesture-camera-root".',
  );
  assert(
    experience.includes('style={{ color: "#ffffff" }}') ||
      /style=\{\{\s*color:\s*["']#fff(?:fff)?["']\s*\}\}/.test(experience),
    "Experience root must set inline style color #ffffff (fallback vs global base typography).",
  );
  assert(experience.includes("Turning Anime Into UX"), "Experience must include the title string.");
  assert(
    experience.includes('publicImage("Frame 2147224939.png")'),
    "Ritual stickers must use publicImage(...) so filenames with spaces are encoded in URLs.",
  );
  assert(
    experience.includes("isRunningRef") && experience.includes("isStartingRef") && experience.includes("rafEpochRef"),
    "Experience must use isRunningRef, isStartingRef, and rafEpochRef so runDetection cannot orphan RAF after stop or remount.",
  );
  assert(
    experience.includes('delegate: "CPU"'),
    "HandLandmarker must use delegate: \"CPU\" for stable WASM across refreshes (GPU can flake).",
  );

  const globals = read("app/globals.css");
  assert(globals.includes(".gesture-camera-root"), "app/globals.css must define .gesture-camera-root.");
  assert(
    globals.includes(".gesture-camera-root h1") && globals.includes("color: inherit !important"),
    "app/globals.css must set .gesture-camera-root h1,h2,h3 { color: inherit !important; }.",
  );
  assert(
    globals.includes(".gesture-camera-root p") && globals.includes("max-width: none !important"),
    "app/globals.css must set .gesture-camera-root p resets with !important.",
  );

  const gesturePage = read("app/personal-projects/gesture-camera/page.tsx");
  assert(
    gesturePage.includes("GestureCameraExperience"),
    "app/personal-projects/gesture-camera/page.tsx must render GestureCameraExperience.",
  );
  assert(
    gesturePage.includes("encodeURIComponent") && gesturePage.includes("image 9326.png"),
    "gesture-camera/page.tsx must use encodeURIComponent(\"image 9326.png\") for the city image URL.",
  );
  assert(
    gesturePage.includes("backgroundImage") || gesturePage.includes("cityBg"),
    "gesture-camera/page.tsx must set CSS backgroundImage (or cityBg) for the city art.",
  );

  const slugPage = read("app/personal-projects/[slug]/page.tsx");
  assert(
    !slugPage.includes("GestureCameraExperience"),
    "[slug]/page.tsx must not import GestureCameraExperience — use the dedicated gesture-camera route to avoid shared RSC/chunk coupling.",
  );
  assert(!slugPage.includes('"gesture-camera"'), '[slug]/page.tsx must not list "gesture-camera" in PROJECTS (handled by sibling route).');

  const cityPng = path.join(root, "public", "Images", "image 9326.png");
  assert(fs.existsSync(cityPng), "Missing public/Images/image 9326.png — background 404s.");

  for (const name of [
    "Frame 2147224939.png",
    "Frame 2147224940.png",
    "Frame 2147224941.png",
    "Frame 2147224942.png",
  ]) {
    const sticker = path.join(root, "public", "Images", name);
    assert(fs.existsSync(sticker), `Missing public/Images/${name} — ritual strip 404s.`);
  }
}

function fetchGesturePage(host, port, pathname) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host, port, path: pathname, method: "GET", timeout: 15_000 },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
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

async function main() {
  runStaticChecks();
  console.log("verify-gesture-camera: static checks OK.");

  if (process.argv.includes("--fetch")) {
    const port = Number(process.env.VERIFY_PORT || "3000", 10);
    const host = process.env.VERIFY_HOST || "127.0.0.1";
    const pathname = "/personal-projects/gesture-camera";
    let body;
    try {
      body = await fetchGesturePage(host, port, pathname);
    } catch (e) {
      fail(
        `HTTP ${host}:${port}${pathname} — ${e.message}. Run: npm run build && npm run start`,
      );
    }
    assert(body.includes("Turning Anime Into UX"), "HTML must include the gesture page title.");
    assert(body.includes("gesture-camera-root"), "HTML must include gesture-camera-root.");
    assert(body.includes("Start camera"), 'HTML must include "Start camera".');
    if (body.includes('"statusCode":500') && body.includes("Cannot find module")) {
      fail("Next 500 missing chunk — rm -rf .next && npm run dev:clean");
    }
    console.log(`verify-gesture-camera: HTTP OK (${host}:${port}${pathname}).`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Frees TCP :3000 so `next dev` binds there predictably.
 * A stale or foreign listener on 3000 often makes localhost look "broken"
 * while Next silently falls back to 3001.
 */
const { execSync } = require("node:child_process");

function main() {
  const port = process.env.DEV_PORT || "3000";
  try {
    const out = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim();
    if (!out) return;
    const pids = [...new Set(out.split(/\s+/).filter(Boolean))];
    for (const s of pids) {
      const pid = Number(s, 10);
      if (!Number.isFinite(pid) || pid <= 0) continue;
      try {
        process.kill(pid, "SIGTERM");
      } catch {
        /* ignore */
      }
    }
    try {
      execSync("sleep 0.25", { stdio: "ignore" });
    } catch {
      /* Windows or no sleep */
    }
  } catch {
    /* no listener or lsof unavailable */
  }
}

main();

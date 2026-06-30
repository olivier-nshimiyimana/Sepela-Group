import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const isWindows = process.platform === "win32";
const localAppData =
  process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local");
const nextLinkPath = path.join(projectRoot, ".next");
const legacyCachePath = path.join(localAppData, "sepela-group-next");

function removeDirectory(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return;
  }

  fs.rmSync(targetPath, { recursive: true, force: true });
  console.log(`Removed cache: ${targetPath}`);
}

function removeJunctionOrDirectory(linkPath) {
  if (!fs.existsSync(linkPath)) {
    return;
  }

  const stat = fs.lstatSync(linkPath);

  if (stat.isSymbolicLink()) {
    fs.rmdirSync(linkPath);
    console.log(`Removed junction: ${linkPath}`);
    return;
  }

  removeDirectory(linkPath);
}

function stopDevServers() {
  if (!isWindows) {
    return;
  }

  for (const port of [3000, 3001]) {
    try {
      execSync(
        `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`,
        { stdio: "ignore" },
      );
    } catch {
      // No process bound to this port.
    }
  }
}

const args = new Set(process.argv.slice(2));
const fullClean = args.has("--full");

stopDevServers();

// Remove legacy junction/cache from earlier experiments.
removeJunctionOrDirectory(nextLinkPath);
removeDirectory(legacyCachePath);

if (fullClean) {
  removeDirectory(path.join(projectRoot, "node_modules", ".cache"));
}

// Fresh .next on each dev start avoids OneDrive corrupting stale manifest files.
removeDirectory(nextLinkPath);

console.log("Next.js cache uses ./.next in the project folder.");

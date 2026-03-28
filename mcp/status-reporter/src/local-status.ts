import path from "path";
import { execFile } from "child_process";
import fs from "fs/promises";

function execGit(args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      resolve(stdout.trim());
    });
  });
}

export interface LocalStatus {
  repoId: string;
  name: string;
  ok: boolean;
  lastUpdatedAt: string;
  git: {
    head: string;
    branch: string;
  };
  signals: Record<string, boolean | string | number>;
}

export async function buildLocalStatus(repoRoot: string): Promise<LocalStatus> {
  const repoId =
    process.env.REPO_ID ??
    path.basename(repoRoot).toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const head = await execGit(["rev-parse", "HEAD"], repoRoot).catch(() => "unknown");
  const branch = await execGit(["rev-parse", "--abbrev-ref", "HEAD"], repoRoot).catch(() => "unknown");

  // Check for common signals
  const hasStatusFile = await fs
    .access(path.join(repoRoot, "status", "status.json"))
    .then(() => true)
    .catch(() => false);

  const hasPackageJson = await fs
    .access(path.join(repoRoot, "package.json"))
    .then(() => true)
    .catch(() => false);

  const hasSrc = await fs
    .access(path.join(repoRoot, "src"))
    .then(() => true)
    .catch(() => false);

  return {
    repoId,
    name: process.env.REPO_NAME ?? repoId,
    ok: true,
    lastUpdatedAt: new Date().toISOString(),
    git: { head, branch },
    signals: {
      hasStatusFile,
      hasPackageJson,
      hasSrc,
    },
  };
}

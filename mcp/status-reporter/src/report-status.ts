import path from "path";
import fs from "fs/promises";
import { buildLocalStatus } from "./local-status.js";

/**
 * Report status to Brain
 *
 * For Phase 0, this writes local status and optionally calls Brain HTTP API.
 * In Phase 1, this will use MCP client to call Brain's portfolio server.
 */
async function main() {
  const repoRoot = process.cwd();
  const brainRoot = process.env.BRAIN_ROOT;

  console.log("Building local status...");
  const status = await buildLocalStatus(repoRoot);
  console.log(`  repoId: ${status.repoId}`);
  console.log(`  branch: ${status.git.branch}`);
  console.log(`  head: ${status.git.head.slice(0, 8)}`);

  // Write local status file
  const statusDir = path.join(repoRoot, "status");
  await fs.mkdir(statusDir, { recursive: true });
  await fs.writeFile(
    path.join(statusDir, "status.json"),
    JSON.stringify(status, null, 2)
  );
  console.log("Wrote status/status.json");

  // If BRAIN_ROOT is set, also write to Brain's runtime directory
  if (brainRoot) {
    const brainStatusDir = path.join(brainRoot, "runtime", "repo-status");
    await fs.mkdir(brainStatusDir, { recursive: true });
    await fs.writeFile(
      path.join(brainStatusDir, `${status.repoId}.json`),
      JSON.stringify(status, null, 2)
    );
    console.log(`Wrote to Brain: runtime/repo-status/${status.repoId}.json`);
  } else {
    console.log("BRAIN_ROOT not set - skipping Brain sync");
  }

  // TODO Phase 1: Use MCP client to call Brain's portfolio server
  // const client = new Client({ name: "status-reporter", version: "1.0.0" });
  // await client.callTool({ name: "report_status", arguments: { repoId, status } });

  console.log("Done!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

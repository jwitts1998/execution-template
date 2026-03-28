import path from "path";
import fs from "fs/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { buildLocalStatus } from "./local-status.js";

/**
 * Report status to Brain via MCP client
 *
 * This connects to the Brain's portfolio-server MCP and calls the report_status tool.
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

  // Connect to Brain's portfolio server via MCP
  if (brainRoot) {
    console.log("Connecting to Brain MCP server...");

    try {
      const portfolioServerPath = path.join(
        brainRoot,
        "mcp",
        "portfolio-server",
        "dist",
        "index.js"
      );

      // Check if the server exists
      await fs.access(portfolioServerPath);

      // Create MCP client
      const client = new Client({
        name: "status-reporter",
        version: "1.0.0",
      });

      // Connect via stdio transport
      const transport = new StdioClientTransport({
        command: "node",
        args: [portfolioServerPath],
        env: {
          ...process.env,
          BRAIN_ROOT: brainRoot,
        },
      });

      await client.connect(transport);
      console.log("Connected to portfolio server");

      // Get repo ID from environment or derive from path
      const repoId = process.env.REPO_ID || status.repoId;

      // Call the report_status tool
      const result = await client.callTool({
        name: "report_status",
        arguments: {
          repoId,
          phase: process.env.CURRENT_PHASE || "development",
          currentTask: process.env.CURRENT_TASK,
          blockers: [],
          health: "healthy",
        },
      });

      console.log("Status reported to Brain:", JSON.stringify(result, null, 2));

      // Close the connection
      await client.close();
    } catch (err) {
      console.error("Failed to report via MCP:", err instanceof Error ? err.message : err);
      console.log("Falling back to file-based sync...");

      // Fallback: write directly to Brain's runtime directory
      const brainStatusDir = path.join(brainRoot, "runtime", "repo-status");
      await fs.mkdir(brainStatusDir, { recursive: true });
      await fs.writeFile(
        path.join(brainStatusDir, `${status.repoId}.json`),
        JSON.stringify(status, null, 2)
      );
      console.log(`Wrote to Brain: runtime/repo-status/${status.repoId}.json`);
    }
  } else {
    console.log("BRAIN_ROOT not set - skipping Brain sync");
  }

  console.log("Done!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

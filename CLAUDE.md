# Execution Repository

This is a Level 2 execution repo in the Command Center portfolio.

## Overview

This repo follows the standardized execution template structure and reports status back to the Brain (Level 1 Command Center) via MCP.

## Structure

```
src/              # Business-specific implementation code
status/
  status.json     # Machine-readable status contract
  progress.md     # Human-readable progress log
mcp/
  status-reporter/  # MCP client for reporting to Brain
scripts/
  report-status.sh  # Convenience wrapper
```

## Status Contract

The `status/status.json` file is the canonical machine-readable status. It must follow this schema:

```json
{
  "repoId": "string",
  "name": "string",
  "ok": "boolean",
  "lastUpdatedAt": "ISO timestamp",
  "git": {
    "head": "commit sha",
    "branch": "branch name"
  },
  "signals": {
    "hasStatusFile": "boolean",
    // ... domain-specific signals
  }
}
```

## Reporting to Brain

After meaningful progress, update status by running:

```bash
./scripts/report-status.sh
```

Or via hook (automatic on session end).

## Development Standards

1. **Tests must pass** - Never leave the repo in a broken state
2. **Small PRs** - One feature slice per branch
3. **No secrets** - Never hardcode credentials
4. **Update status** - Report progress after each milestone

## File Ownership

- `status/**` - Reporting contract. Do not change the `status/status.json` schema without coordinating with Brain
- `src/**` - Implementation code (primary workspace)
- `docs/**` - Documentation. Keep it updated alongside code changes
- `mcp/**` - MCP client infrastructure. Rarely modified

## Coordination with Brain

- This repo is registered with the Brain's portfolio MCP server
- Status is rolled up into the global `runtime/status.json`
- Respect locks when editing shared contracts
- Keep changes scoped to this repo; coordinate portfolio-wide changes through Brain
- When a change touches a shared interface, update its tests and docs in the same change

## Environment

Set these environment variables:

```bash
BRAIN_ROOT=/path/to/command-center
REPO_ID=this-repo-slug
REPO_NAME="Human Readable Name"
```

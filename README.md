# Execution Template

Level 2 execution repo template for the Command Center portfolio.

## Quick Start

1. Clone this template for a new business:
   ```bash
   git clone https://github.com/YOUR_ORG/execution-template.git my-new-business
   cd my-new-business
   ```

2. Configure environment:
   ```bash
   export BRAIN_ROOT=/path/to/command-center
   export REPO_ID=my-new-business
   export REPO_NAME="My New Business"
   ```

3. Initialize status reporting:
   ```bash
   cd mcp/status-reporter
   npm install
   npm run build
   cd ../..
   ./scripts/report-status.sh
   ```

## Structure

```
src/                    # Your business code
status/
  status.json           # Machine-readable status (auto-generated)
  progress.md           # Human-readable progress log
mcp/
  status-reporter/      # Reports status to Brain
scripts/
  report-status.sh      # Convenience wrapper
.claude/                # Claude Code configuration
CLAUDE.md               # Project instructions for Claude Code
AGENTS.md               # Agent roles and handoff protocol
```

## Status Contract

The `status/status.json` file follows this schema:

```json
{
  "repoId": "string",
  "name": "string",
  "ok": true,
  "lastUpdatedAt": "2024-01-01T00:00:00.000Z",
  "git": {
    "head": "abc123",
    "branch": "main"
  },
  "signals": {
    "hasStatusFile": true
  }
}
```

## Integration with Brain

This repo is designed to work with the Command Center (Brain):

- **Status Reporting**: Run `./scripts/report-status.sh` after milestones
- **Task Dispatch**: Brain's C-Suite agents can dispatch work here
- **Coordination**: Respect locks and shared contracts

## Development

1. Make changes in `src/`
2. Update `status/progress.md` with human-readable notes
3. Run `./scripts/report-status.sh` to sync status
4. Commit and push

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BRAIN_ROOT` | Path to command-center repo | Yes |
| `REPO_ID` | Override auto-detected repo ID | No |
| `REPO_NAME` | Human-readable repo name | No |

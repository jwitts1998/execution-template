# Development Agents

This document defines the agent roles for this execution repo.

## Available Agents

### CTO (Technical Implementation)

Primary agent for code changes. Responsibilities:

- Feature implementation
- Bug fixes
- Architecture decisions
- Code review
- Testing and quality

Invoked by Brain dispatch when `triage.agent = "cto"`.

### CMO (Growth & Marketing)

Agent for growth-related changes. Responsibilities:

- Landing pages
- Marketing content
- Messaging updates
- Analytics integration

Invoked by Brain dispatch when `triage.agent = "cmo"`.

## Agent Handoff Protocol

When work is delegated from Brain:

1. Agent receives task packet with:
   - `title`
   - `summary`
   - `acceptance_criteria[]`
   - `transcript` (original request)

2. Agent should:
   - Understand the acceptance criteria
   - Break down into implementation steps
   - Execute changes
   - Update `status/status.json` after milestones
   - Report completion back to Brain

## Coordination

- Check `status/status.json` before starting
- Acquire locks via Brain MCP for shared files
- Update status after meaningful progress
- Don't edit files outside your scope without coordination

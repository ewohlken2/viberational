---
slug: update-claude-md-after-every-pr
title: "Update Your claude.md After Every PR Merge"
date: 2026-01-12
---

If you are using Claude Code or any AI assistant with your codebase, there is a simple habit that will dramatically improve your experience over time: update your claude.md file after every PR merge.

**What is claude.md?**

The claude.md file (sometimes called CLAUDE.md) lives in your project root and contains project-specific instructions for AI assistants. It is like a README, but specifically for Claude. It tells the AI about your codebase's conventions, architecture decisions, and preferences.

**Why update it after every PR?**

Each PR represents new knowledge about your project. Maybe you:

- Established a new pattern for handling errors
- Added a new utility function that should be reused
- Made an architectural decision that affects future development
- Fixed a tricky bug with context worth preserving

Without documenting these, you will find yourself re-explaining the same things to Claude repeatedly. Your repo should learn as it grows.

**What to add**

After merging a PR, ask yourself: "What did I learn or decide that Claude should know for next time?"

```markdown
## Patterns

- Use the `useAsync` hook for all data fetching (added in PR #42)
- Error boundaries are in `src/components/ErrorBoundary.tsx`
- All API routes follow the pattern in `src/app/api/[resource]/route.ts`

## Decisions

- We chose Zustand over Redux for state management (simpler API)
- CSS Modules for styling, not Tailwind (team preference)
- No barrel files - import directly from source

## Gotchas

- The auth middleware must run before the rate limiter
- Don't use `fetch` directly - use `src/lib/api-client.ts`
- Tests need `NODE_ENV=test` or the mock server won't start
```

**Make it a habit**

Add "Update claude.md" to your PR checklist or create a GitHub Action that reminds you. The five minutes you spend documenting will save hours of repeated explanations.

```yaml
# .github/PULL_REQUEST_TEMPLATE.md
## Checklist
- [ ] Tests pass
- [ ] Updated claude.md with any new patterns or decisions
```

**The compound effect**

After a few months, your claude.md becomes an invaluable knowledge base. New team members can read it to understand project conventions. And Claude becomes increasingly effective because it has context that accumulates rather than resets with each conversation.

Your repository is not just code - it is accumulated knowledge. Make sure your AI assistant can access all of it.

---
name: reviewer
description: Reviews completed implementation work. Runs ./init.sh (includes pnpm test). Rejects if any test is red, any R<n> lacks test coverage, or the E2E gate is undocumented. Writes progress/review_<feature>.md with ACCEPT or REJECT.
---

Follow `AGENTS.md` and the canonical role contract in `.agents/subagents/reviewer.md`.

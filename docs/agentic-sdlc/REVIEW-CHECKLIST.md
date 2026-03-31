# Agent Output Review Checklist

> A practical guide for reviewing AI agent work before merging.
> Print this out, keep it next to your terminal, and check the boxes.

---

## Table of Contents

1. [Why Agent Review Matters](#why-agent-review-matters)
2. [The 5-Minute Triage](#the-5-minute-triage)
3. [Deep Review Checklist](#deep-review-checklist)
4. [Common Agent Failure Modes](#common-agent-failure-modes)
5. [The Merge Flow](#the-merge-flow)
6. [Review Shortcuts by Issue Type](#review-shortcuts-by-issue-type)
7. [Feedback Loop](#feedback-loop)
8. [Review Prioritization](#review-prioritization)

---

## Why Agent Review Matters

AI agents are powerful but not infallible. They produce plausible-looking code that passes syntax checks, lints clean, and reads like a senior engineer wrote it — but can contain subtle bugs that only a human familiar with the codebase will catch.

**"Vibe-coded" doesn't mean "unreviewed."** The review step is what separates controlled experimentation from chaos. You're dispatching agents across 14 repos (bolsard, bucket-flow-calculus, dc-sim, fam-arch, geeraff, me-net, minclo, pulsequiz, spider-size-simulator, and more). Each repo has its own conventions, constraints, and gotchas that no agent fully internalizes from a single issue prompt.

Agent code can:

- **Pass every automated check** while violating business logic or architectural patterns.
- **Introduce security holes** that look like normal code (a relaxed CORS header, a missing input validation).
- **Solve the wrong problem** if the issue was ambiguous or the agent lost context mid-task.
- **Over-engineer** a 10-line fix into a 200-line abstraction layer nobody asked for.

Review is also how you learn. Every failure mode you catch feeds back into better issue templates, sharper prompts, and tighter `.copilot/instructions.md` constraints. The review step isn't overhead — it's the training loop for your entire agentic workflow.

---

## The 5-Minute Triage

Before spending time on a deep review, do a fast pass. If any of these fail, stop — fix or re-dispatch immediately.

```bash
# Switch to the agent's branch
git checkout agent/issue-42-add-health-endpoint
git log --oneline -5   # Sanity-check commit history
```

- [ ] **Did the agent claim success?**
  Read its summary comment on the issue or PR. If the agent reported errors, blockers, or partial completion, don't proceed to deep review.

- [ ] **Do tests pass?**
  ```bash
  # Pick the right runner for the repo:
  npm test              # JS/TS repos (geeraff, pulsequiz, minclo)
  pytest                # Python repos (fam-arch, dc-sim)
  cargo test            # Rust repos (bucket-flow-calculus)
  ```

- [ ] **Does it build?**
  ```bash
  npm run build         # Next.js / Vite repos
  tsc --noEmit          # TypeScript type-check only
  cargo build           # Rust repos
  ```

- [ ] **Does the diff match the scope?**
  ```bash
  git diff --stat main...HEAD
  ```
  Unexpected files touched = red flag. If the issue said "modify `src/api/health.ts`" and the diff includes `package.json`, `tsconfig.json`, and three unrelated components — something went wrong.

- [ ] **Is the diff size reasonable?**
  A `size/S` issue shouldn't produce a 500-line diff. A `size/L` issue with a 12-line diff probably missed something.

  | Label | Expected Diff |
  |-------|--------------|
  | `size/XS` | 1–10 lines |
  | `size/S` | 10–50 lines |
  | `size/M` | 50–200 lines |
  | `size/L` | 200–500 lines |
  | `size/XL` | 500+ lines |

**If ANY of these fail → don't deep review.** Either fix the issue yourself (if trivial) or re-dispatch with a refined prompt.

---

## Deep Review Checklist

Work through each section. Check the boxes as you go.

### Correctness

- [ ] Does the code actually solve the issue's acceptance criteria? (Re-read them one by one.)
- [ ] Are edge cases handled?
  - Empty inputs, null/undefined values
  - Network errors, timeouts, 4xx/5xx responses
  - Boundary conditions (zero, negative, max int, empty arrays)
- [ ] Are error messages helpful and user-facing strings appropriate?
  - No stack traces leaked to users
  - No placeholder text like "TODO: write error message"
- [ ] Do conditional branches all have the right logic?
  - Watch for inverted conditions (`if (!isValid)` where `if (isValid)` was intended)
  - Watch for off-by-one errors in loops and slicing
- [ ] Are return values correct? (Agents sometimes return the wrong variable or forget to return at all.)

### Security

- [ ] No hardcoded secrets, tokens, API keys, or credentials
  ```bash
  # Quick scan:
  git diff main...HEAD | grep -iE '(api_key|secret|token|password|credential)' 
  ```
- [ ] No dangerous patterns:
  - `eval()` or `new Function()` in JavaScript
  - `dangerouslySetInnerHTML` without sanitization in React
  - `subprocess.shell=True` with user input in Python
  - SQL string concatenation instead of parameterized queries
- [ ] Input validation on any user-facing endpoints or form handlers
- [ ] CORS and CSP headers not weakened (check for `Access-Control-Allow-Origin: *`)
- [ ] New dependencies are from trusted sources:
  ```bash
  # Check what was added:
  git diff main...HEAD -- package.json requirements.txt Cargo.toml
  # Verify on npm/PyPI — is this a real, maintained package?
  npm info <package-name>
  ```
- [ ] No new `chmod 777`, overly permissive file modes, or world-readable configs

### Architecture

- [ ] Follows existing patterns in the codebase
  - If the repo uses a service/repository pattern, the agent shouldn't introduce raw DB calls in a controller
  - If the repo uses functional components, the agent shouldn't add class components
- [ ] No unnecessary dependencies added
  - Could this be done with what's already in `node_modules` or the standard library?
- [ ] File placement matches project structure conventions
  ```bash
  # Compare new file locations against existing structure:
  find src -type f -name '*.ts' | head -20
  ```
- [ ] No dead code, commented-out code, or placeholder TODOs left behind
  ```bash
  git diff main...HEAD | grep -E '(TODO|FIXME|HACK|XXX|// .*commented)'
  ```
- [ ] Imports are clean
  - No unused imports
  - No circular dependencies introduced
  - Import order follows project conventions (e.g., external → internal → relative)

### Testing

- [ ] Tests actually test the right thing
  - Read the assertions. Do they verify meaningful behavior or just that the code runs without crashing?
  - Watch for `expect(true).toBe(true)` or `assert result is not None` with no value check
- [ ] Tests cover the happy path AND at least one error/edge case
- [ ] Test descriptions are meaningful
  - ✅ `"returns 404 when user ID does not exist"`
  - ❌ `"test 1"`, `"it works"`, `"should do the thing"`
- [ ] Mocks are reasonable
  - Is the mock replacing external dependencies (good) or mocking the thing being tested (bad)?
  - Are mock return values realistic?
- [ ] No snapshot tests unless explicitly requested
  - Agents love generating snapshot tests — they're easy to write and always pass on first run

### Performance

- [ ] No obvious N+1 queries
  ```
  # Look for database calls inside loops:
  for user in users:
      orders = db.query(f"SELECT * FROM orders WHERE user_id = {user.id}")  # N+1!
  ```
- [ ] No O(n²) loops on data that could be large
  - Nested `.filter()` or `.find()` inside `.map()` on arrays
  - Could it be a `Map`/`Set` lookup instead?
- [ ] No synchronous blocking calls where async is expected
  - `fs.readFileSync` in a Node.js server handler
  - Blocking HTTP calls in an async Python function
- [ ] No memory leaks
  - Event listeners added without cleanup in `useEffect` / lifecycle hooks
  - Arrays or Maps that grow without bounds
- [ ] Bundle size check for frontend repos:
  ```bash
  # Before and after comparison:
  npm run build 2>&1 | grep -i size
  ```

### Documentation

- [ ] README updated if user-facing behavior changed (new env vars, new endpoints, new CLI flags)
- [ ] JSDoc / docstrings on public functions if that's the repo's convention
- [ ] CHANGELOG updated (if the repo uses one)
- [ ] Commit message describes the change clearly (agents often write vague messages)

---

## Common Agent Failure Modes

Recognize these patterns so you can catch them fast and prevent them in future dispatches.

| Failure | Symptom | Example | Prevention |
|---------|---------|---------|------------|
| **Over-engineering** | Added abstraction layers, factories, or design patterns nobody asked for | A simple config change wrapped in a Strategy Pattern with dependency injection | Add "Out of Scope" section to issue; say "minimal changes only" |
| **Phantom imports** | Imports modules that don't exist in the project or in any package | `import { validateSchema } from '@/utils/schema'` when no such file exists | List exact available modules in issue; say "do not add new deps without justification" |
| **Test theater** | Tests pass but don't verify meaningful behavior | `expect(component).toBeDefined()` with no interaction testing | Review test assertions manually; search for `expect(true)` |
| **Style drift** | Introduced different formatting, naming conventions, or code organization | camelCase in a snake_case Python repo; tabs in a spaces project | Reference an existing file as a style guide: "Match the style of `src/api/users.ts`" |
| **Scope creep** | Touched files outside the issue scope | Issue asked for a new endpoint but agent also refactored the auth middleware | Add "Files to Modify" and "Out of Scope" sections to issue |
| **Hallucinated APIs** | Used API methods, endpoints, or library features that don't exist | Called `prisma.user.softDelete()` when no such method exists | Pin to specific library versions in issue; link to relevant docs |
| **Lost context** | Ignored constraints from the issue body | Issue said "use the existing `fetchUser` helper" but agent wrote its own | Keep issues concise; put constraints at the top in bold |
| **Partial implementation** | Completed 80% of criteria, missed edge cases or final steps | Implemented the endpoint but forgot to add the route to the router | Use numbered acceptance criteria — gaps become visible |
| **Copy-paste bugs** | Replicated template code without adjusting repo-specific values | Hardcoded `pulsequiz` URL in the `geeraff` repo | Check all literals (URLs, paths, names, ports) are correct for this specific repo |
| **Stale references** | Used patterns from old code that has since been refactored | Called a function that was renamed two PRs ago | Point to specific files/functions by current name in issue |
| **Dependency bloat** | Added heavy libraries for simple tasks | Installed `lodash` for a single `_.get()` call | Say "use standard library / existing deps only" in issue |
| **Inconsistent error handling** | Mixed error strategies (sometimes throws, sometimes returns null, sometimes logs) | `try/catch` in one function, bare calls in the next | Specify error handling pattern: "throw on errors, let the middleware catch" |

---

## The Merge Flow

From agent output to production in a repeatable flow:

```
Agent completes
      │
      ▼
┌─────────────┐     FAIL    ┌──────────────────┐
│  5-Min       │───────────▶│  Fix or           │
│  Triage      │             │  Re-dispatch      │
└──────┬──────┘             └──────────────────┘
       │ PASS
       ▼
┌─────────────┐     >30%    ┌──────────────────┐
│  Deep        │  changes   │  Re-dispatch with │
│  Review      │───────────▶│  refined prompt   │
└──────┬──────┘             └──────────────────┘
       │ ≤30% changes
       ▼
┌─────────────┐
│  Manual      │  Fix the remaining 10% yourself.
│  Fix-ups     │  Faster than re-dispatching.
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Squash &    │  One clean commit, conventional message.
│  Commit      │
└──────┬──────┘
       │
       ▼
┌─────────────┐     FAIL    ┌──────────────────┐
│  CI          │───────────▶│  Fix locally,     │
│  Passes?     │             │  push again       │
└──────┬──────┘             └──────────────────┘
       │ PASS
       ▼
┌─────────────┐
│  Squash-     │
│  Merge       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Deploy &    │  Verify the live site / service.
│  Verify      │
└─────────────┘
```

### Key Decisions

**Small fix-ups (agent got ~90% right):**
Fix the remaining issues yourself. It's faster than writing a new prompt, waiting for dispatch, and reviewing again.

```bash
# Make your fixes on the agent's branch
git checkout agent/issue-42-add-health-endpoint
# ... edit files ...
git add -A
git commit -m "fix: correct response schema for health endpoint"
```

**Re-dispatch threshold (>30% needs changes):**
If more than a third of the diff needs rework, it's cheaper to re-dispatch. Update the issue with what went wrong:

```bash
# Add a comment to the issue with feedback
gh issue comment 42 --body "Agent attempt failed: missed acceptance criteria 3-5, introduced circular dependency in src/services/. Re-dispatching with refined prompt."
```

**Commit strategy:**
Squash agent commits into one clean commit with a conventional commit message:

```bash
# Squash all agent commits into one
git rebase -i main
# Mark all but the first commit as 'squash'
# Write a proper commit message:
#   feat(api): add health check endpoint
#
#   - GET /api/health returns { status: "ok", uptime: ... }
#   - Includes database connectivity check
#   - Closes #42
```

**Branch hygiene:**
- Agent work always goes on feature branches (`agent/issue-{N}-{slug}`)
- Squash-merge to `main` — keeps history clean
- Delete branch after merge:
  ```bash
  git branch -d agent/issue-42-add-health-endpoint
  git push origin --delete agent/issue-42-add-health-endpoint
  ```

**Deploy verification:**
After merge, verify the change is live and working:

```bash
# For web services behind Cloudflare Tunnel:
curl -s https://your-service.example.com/api/health | jq .

# For static sites (idealase.github.io):
# Wait for GitHub Pages deployment, then check:
curl -s https://idealase.github.io/path/to/changed/page | head -20

# For services behind nginx:
sudo nginx -t && sudo systemctl reload nginx
curl -s http://localhost/api/health
```

---

## Review Shortcuts by Issue Type

Not every change needs the full checklist. Use the right shortcut for the issue type.

### CI/CD Workflow Changes

```bash
# Trigger the workflow manually and watch it:
gh workflow run ci.yml --ref agent/issue-55-fix-ci
gh run list --workflow=ci.yml --limit=1
gh run watch                     # Live output
```
- Check: Does the workflow complete successfully?
- Check: Are secrets referenced correctly (not hardcoded)?
- Check: Are action versions pinned (`uses: actions/checkout@v4`, not `@main`)?

### Frontend Components

```bash
# Start dev server and visually verify:
npm run dev
# Open in browser, check:
# - Component renders correctly
# - Responsive breakpoints (resize browser or use devtools)
# - No console errors
# - Keyboard navigation / accessibility basics
```

### API Endpoints

```bash
# Test the endpoint directly:
curl -s http://localhost:3000/api/new-endpoint | jq .

# Check response schema:
curl -s http://localhost:3000/api/new-endpoint | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(json.dumps(data, indent=2))
# Verify expected fields exist
assert 'id' in data, 'Missing id field'
assert 'status' in data, 'Missing status field'
"

# Check error responses:
curl -s -w "\n%{http_code}" http://localhost:3000/api/new-endpoint/nonexistent
# Should return 404, not 500
```

### Config Changes

```bash
# Diff against the previous config:
git diff main...HEAD -- config/

# Verify the service restarts cleanly with new config:
npm start     # or however the service runs
# Watch for startup errors in the first 10 seconds
```

### Documentation Changes

- Read it as a human. Does it make sense? Is the flow logical?
- Check all links:
  ```bash
  # Quick link check:
  grep -oE '\[.*?\]\(.*?\)' docs/changed-file.md | grep -oE '\(.*?\)' | tr -d '()'
  # Visit each link, or use a link checker
  ```
- Check code examples: do they actually work if you paste them into a terminal?
- Check for stale references to old behavior.

### Test Suite Changes

```bash
# Run tests with verbose output:
npm test -- --verbose
pytest -v

# Check coverage:
npm test -- --coverage
pytest --cov=src --cov-report=term-missing

# Read 2-3 test cases carefully — do the assertions make sense?
```

---

## Feedback Loop

Review isn't just about catching bugs — it's about improving future dispatches.

### After Every Review

1. **Note what the agent got wrong.** One sentence is enough:
   - "Missed acceptance criterion #3 (error handling for empty input)"
   - "Added lodash as a dependency when we already have ramda"
   - "Used wrong port number — copied from pulsequiz template instead of geeraff"

2. **Categorize the failure:**
   - **Prompt issue** → The issue description was vague or missing constraints
   - **Context issue** → The agent didn't know about repo conventions
   - **Capability issue** → The task was too complex for a single dispatch

3. **Apply the fix upstream:**

   | Category | Fix |
   |----------|-----|
   | Prompt issue | Update your issue template with the missing section |
   | Context issue | Add the convention to `.copilot/instructions.md` in that repo |
   | Capability issue | Decompose the issue into smaller, more focused issues |

### Maintain Per-Repo Pitfall Lists

Keep a running list of what agents consistently get wrong in each repo. Store it where the agent can see it:

```markdown
<!-- .copilot/instructions.md in each repo -->

## Agent Pitfalls for This Repo

- This repo uses port 3001, not 3000
- All API responses must include `requestId` header
- We use `date-fns`, not `moment` — do not add moment
- Test files go in `__tests__/` next to the source, not in a top-level `tests/` dir
- CSS modules only — no inline styles, no styled-components
```

### Track Patterns Across Repos

If the same mistake happens across multiple repos, the fix is systemic:

- Same mistake in 3+ repos → Update your base issue template
- Same mistake from the same agent config → Update your agent instructions
- Same mistake regardless of prompting → Accept it as a known limitation and add it to this checklist

### Issue Decomposition Signals

If an issue consistently fails after dispatch, it's probably too big or too vague. Signs to decompose:

- Agent completes but misses >2 acceptance criteria
- Diff touches >10 files
- Agent asks clarifying questions in its summary
- Multiple unrelated changes bundled together

Split into focused issues: one concern, one area of the codebase, clear acceptance criteria.

---

## Review Prioritization

When you have 10+ agent PRs waiting for review, use this priority order:

### Priority 1: Blocking Issues

Review issues that other issues depend on first. Check the issue body for "depends on #X" or "blocked by #X" relationships.

```bash
# List open PRs across your repos:
gh pr list --repo idealase/pulsequiz --state open --label "agent"
gh pr list --repo idealase/geeraff --state open --label "agent"
# ... or script it across all repos
```

### Priority 2: Small Diffs

Quick wins. Clear the queue. A 15-line diff takes 2 minutes to review.

```bash
# Check diff size before opening:
gh pr diff 42 --stat
```

### Priority 3: Security-Labeled Changes

These get full deep review, no shortcuts. Check every item in the Security section of the deep review checklist.

### Priority 4: Template Replication PRs

If you dispatched the same change across multiple repos (e.g., "add health endpoint to all services"), review the first one thoroughly. If it's good, the others likely are too — spot-check 2-3 more, focusing on repo-specific values (ports, paths, names).

```bash
# Batch review pattern:
# 1. Deep review: idealase/pulsequiz PR #42
# 2. Spot check: idealase/geeraff PR #18 — correct port? correct path?
# 3. Spot check: idealase/minclo PR #7 — correct service name?
# 4. Merge the rest if spot checks pass
```

### Priority 5: Everything Else

Work through remaining PRs newest-first (most likely to be contextually fresh in your memory).

---

## Quick Reference Card

Cut this out and tape it to your monitor:

```
┌─────────────────────────────────────────┐
│         AGENT REVIEW QUICK REF          │
├─────────────────────────────────────────┤
│                                         │
│  TRIAGE (5 min)                         │
│  □ Agent claimed success?               │
│  □ Tests pass?                          │
│  □ Builds clean?                        │
│  □ Diff matches scope?                  │
│  □ Diff size reasonable?                │
│  → ANY fail = stop, fix, re-dispatch    │
│                                         │
│  DEEP REVIEW                            │
│  □ Solves acceptance criteria?          │
│  □ Edge cases handled?                  │
│  □ No hardcoded secrets?                │
│  □ No eval/dangerouslySetInnerHTML?     │
│  □ Follows existing patterns?           │
│  □ No unnecessary deps?                 │
│  □ Tests test the right thing?          │
│  □ No N+1 / O(n²)?                     │
│  □ Docs updated?                        │
│                                         │
│  MERGE                                  │
│  □ Squash into one commit               │
│  □ Conventional commit message          │
│  □ CI green                             │
│  □ Verify live after deploy             │
│                                         │
│  RE-DISPATCH IF >30% NEEDS CHANGES      │
│                                         │
└─────────────────────────────────────────┘
```

---

*This checklist is part of the [Agentic SDLC](../agentic-sdlc/) documentation. Update it as you discover new failure modes and sharpen your review process.*

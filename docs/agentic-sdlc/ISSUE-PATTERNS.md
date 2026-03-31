# 🎯 Issue Patterns for Agentic SDLC

> *Write issues that machines can execute and humans can verify.*

This guide defines how to write GitHub issues that AI agents — Copilot CLI, Claude, Cursor, or any LLM-powered coding tool — can pick up and complete in a single session. The goal: you write the issue, dispatch the agent, review the PR. No back-and-forth, no "what did you mean by…", no half-finished work.

These patterns are battle-tested across 14 repos (geeraff, greyzone, minclo, bolsard, ant-size-simulator, PulseQuiz, and more) with ~156 open issues organized using a consistent label taxonomy.

---

## 📑 Table of Contents

- [1. The Agent-Ready Issue Standard](#1--the-agent-ready-issue-standard)
- [2. Issue Template Anatomy](#2--issue-template-anatomy)
- [3. Patterns by Issue Type](#3--patterns-by-issue-type)
- [4. Anti-Patterns](#4--anti-patterns)
- [5. Real Examples — Bad to Good](#5--real-examples--bad-to-good)
- [6. Label Usage Guide](#6--label-usage-guide)
- [7. Epic Decomposition Walkthrough](#7--epic-decomposition-walkthrough)

---

## 1. 🏗️ The Agent-Ready Issue Standard

An agent operates in a **single context window** — typically 100–200k tokens. It reads your issue, explores the codebase, makes changes, runs tests, and opens a PR. Everything it needs must be in the issue or discoverable from the paths you provide.

### Agent-Ready vs. Needs-Decomposition

| Signal | Agent-Ready ✅ | Needs-Decomposition 🔀 |
|--------|---------------|------------------------|
| **File count** | 1–8 files modified | 10+ files or "all files matching X" |
| **Decision points** | Zero — the "what" is fully specified | Requires design choices the agent can't make |
| **Dependencies** | None, or all deps are already merged | Blocked by other unfinished work |
| **Testability** | Clear pass/fail — run a command, check output | "It should feel better" or "improve performance" |
| **Time to complete** | One agent session (< 2 hours of human equivalent) | Multi-session or needs human review mid-stream |
| **Scope** | Single concern — one bug, one feature, one refactor | Mixes concerns ("fix the bug and also refactor the module") |

If you check **Needs-Decomposition** on two or more signals, split the issue. Label it `needs-decomposition`, convert it to an epic, and create sub-issues.

### The 5 Properties of an Agent-Ready Issue

Every issue labeled `agent-ready` must satisfy all five:

#### 1. **Atomic** — One deliverable, one concern
The agent should produce exactly one logical unit of work. "Add the `PlayerHealth` component" is atomic. "Add the health system" is not — that's a component, a state manager, integration with the HUD, and tests.

#### 2. **Self-Contained** — Everything needed is in the issue or linked
The agent shouldn't need to ask questions. If there's a design decision, make it in the issue. If there's a convention, state it. If there's a dependency, link to it and confirm it's merged.

#### 3. **Testable** — Binary pass/fail acceptance criteria
Every criterion must be verifiable by running a command, checking a file exists, or observing a specific behavior. "The component renders correctly" fails this test. "Running `npm test -- --grep PlayerHealth` passes with 0 failures" passes it.

#### 4. **Bounded** — Explicit scope with an out-of-scope section
Agents are eager to help. Without boundaries, they'll refactor adjacent code, add "helpful" features, and restructure your project. The out-of-scope section is a guardrail.

#### 5. **Sequenced** — Dependencies are declared and resolved
If issue #42 must be merged before this issue can start, say so. If the agent produces work that conflicts with a parallel issue, that's wasted effort. Declare the dependency graph.

---

## 2. 📋 Issue Template Anatomy

Use this structure for every agent-ready issue. Copy it, fill it in, strip any sections that genuinely don't apply (but think twice before removing "Out of Scope").

````markdown
## Summary

One-sentence description of the deliverable. What exists after this issue is closed that didn't exist before?

## Context

Why this matters. What user-facing or developer-facing problem does it solve?
Link to parent epic: #XX (if applicable).

## Files to Modify

Explicit list of files the agent will create or edit:

- `src/components/PlayerHealth.tsx` — new file, the component
- `src/components/PlayerHealth.test.tsx` — new file, unit tests
- `src/components/index.ts` — add export

## Files for Context (read-only)

Files the agent should read to understand patterns and conventions but must NOT modify:

- `src/components/PlayerScore.tsx` — follow this component's structure
- `src/types/game.ts` — `Player` type definition lives here
- `CLAUDE.md` — project conventions and build commands

## Acceptance Criteria

- [ ] `PlayerHealth` component renders a health bar that fills proportionally to `health / maxHealth`
- [ ] Component accepts props: `{ health: number; maxHealth: number; className?: string }`
- [ ] `npm run test -- PlayerHealth` passes with ≥ 3 test cases (render, zero health, full health)
- [ ] `npm run build` completes with zero errors
- [ ] Component is exported from `src/components/index.ts`

## Out of Scope

- Do NOT modify the game state manager
- Do NOT add animations (that's a separate issue)
- Do NOT change existing component styles

## Size Estimate

`size/S` — 3 files, ~120 lines

## Dependencies

- Depends on #41 (Player type definition) — ✅ merged
- No blocking dependencies
````

### Section-by-Section Guidance

| Section | Purpose | Common Mistake |
|---------|---------|----------------|
| **Summary** | Agent uses this to understand the goal in one line | Writing a paragraph instead of a sentence |
| **Context** | Helps the agent make judgment calls when ambiguity arises | Omitting this — agent makes random choices |
| **Files to Modify** | Eliminates search time; agent goes straight to work | Saying "wherever it makes sense" |
| **Files for Context** | Gives the agent examples to follow | Not distinguishing read-only from modify |
| **Acceptance Criteria** | The agent's definition of done | Subjective criteria ("looks good") |
| **Out of Scope** | Prevents scope creep by eager agents | Assuming the agent won't touch other files |
| **Size Estimate** | Helps the dispatcher pick the right agent/model | Underestimating (agent runs out of context) |
| **Dependencies** | Prevents merge conflicts and wasted work | Not checking if deps are actually merged |

---

## 3. 🧩 Patterns by Issue Type

### 🐛 Bug Fix

The agent needs to reproduce, locate, and fix. Give it all three.

````markdown
## Summary

Fix crash in geeraff physics engine when giraffe neck length exceeds 12 units.

## Context

Players using the "extreme stretch" power-up trigger an unhandled NaN in the
torque calculation, causing a black screen. Reported by 3 users in the last week.

## Reproduction Steps

1. Open geeraff in browser (`npm run dev`)
2. Click "Start Simulation"
3. Set neck length slider to maximum (15 units)
4. Observe: canvas freezes, console shows `NaN` in `calculateTorque()`

## Root Cause Hint

`src/physics/torque.ts` line ~47 — the `Math.atan2()` call receives `0, 0`
when the neck segment length exceeds the maximum joint distance (12 units),
because `normalizeVector()` returns a zero vector for degenerate inputs.

## Files to Modify

- `src/physics/torque.ts` — add guard for degenerate vector input
- `src/physics/torque.test.ts` — add regression test

## Files for Context (read-only)

- `src/physics/types.ts` — `Vector2D` and `NeckSegment` types
- `src/physics/constants.ts` — `MAX_JOINT_DISTANCE` value

## Acceptance Criteria

- [ ] `calculateTorque()` returns `0` (not `NaN`) when neck length > `MAX_JOINT_DISTANCE`
- [ ] `npm run test -- torque` passes, including new test for edge case
- [ ] Manual test: setting slider to max no longer freezes the canvas
- [ ] No changes to the public API of `calculateTorque()`

## Out of Scope

- Do NOT change the slider's max value (that's a UX decision, separate issue)
- Do NOT refactor other physics functions
- Do NOT modify the rendering pipeline

## Size Estimate

`size/XS` — 2 files, ~30 lines
````

### 🧱 New Component

Define the interface first, behavior second.

````markdown
## Summary

Create `AntTrail` React component for ant-size-simulator that renders pheromone
trails as fading SVG paths.

## Context

Part of the pheromone visualization epic (#23). Ants currently move but leave no
visible trail. This component renders their path history as translucent,
time-decaying lines on the simulation canvas.

## Files to Modify

- `src/components/AntTrail.tsx` — new component
- `src/components/AntTrail.test.tsx` — unit tests
- `src/components/AntTrail.module.css` — scoped styles
- `src/components/SimulationCanvas.tsx` — import and render `AntTrail`

## Files for Context (read-only)

- `src/components/AntSprite.tsx` — follow the same component pattern
- `src/types/simulation.ts` — `TrailPoint`, `Ant` type definitions
- `src/hooks/useSimulationState.ts` — how to access trail data

## Props Interface

```typescript
interface AntTrailProps {
  points: TrailPoint[];       // ordered list of {x, y, timestamp}
  maxAge: number;             // milliseconds before a point fully fades
  color?: string;             // default: 'rgba(76, 175, 80, 0.6)'
  strokeWidth?: number;       // default: 2
}
```

## Render Behavior

- Render an SVG `<path>` connecting all `points` in order
- Each segment's opacity = `1 - (age / maxAge)`, clamped to `[0, 1]`
- Segments older than `maxAge` are not rendered (skip, don't set opacity 0)
- Empty `points` array renders nothing (no empty SVG element)

## Acceptance Criteria

- [ ] Component renders an SVG path matching the trail points
- [ ] Opacity fades linearly based on point age
- [ ] Points older than `maxAge` are excluded from the path
- [ ] `npm run test -- AntTrail` passes with ≥ 5 test cases
- [ ] `npm run build` passes with no TypeScript errors
- [ ] Component is imported and rendered in `SimulationCanvas.tsx`

## Out of Scope

- No animation/interpolation between points (just connect them)
- Do NOT modify ant movement logic
- Do NOT add pheromone strength mechanics (separate issue)

## Size Estimate

`size/M` — 4 files, ~200 lines
````

### ⚙️ CI/CD Workflow

Be explicit about triggers, runners, secrets, and what "success" means.

````markdown
## Summary

Create GitHub Actions workflow for minclo that runs tests and deploys to
sandford.systems on push to `main`.

## Context

minclo currently has no CI. Code goes from `git push` to production via manual
SSH deploy. This workflow automates test → build → deploy with zero-downtime.

## Files to Modify

- `.github/workflows/deploy.yml` — new workflow file

## Files for Context (read-only)

- `package.json` — scripts section (`test`, `build`)
- `nginx/minclo.conf` — nginx config for reference (deploy target path)
- `CLAUDE.md` — project build conventions

## Workflow Specification

```yaml
name: Test & Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# PR runs: test + build only
# Push to main: test + build + deploy
```

### Jobs

**1. `test`**
- Runner: `ubuntu-latest`
- Steps: checkout → setup Node 20 → `npm ci` → `npm test`

**2. `build`**
- Needs: `test`
- Steps: checkout → setup Node 20 → `npm ci` → `npm run build`
- Upload `dist/` as artifact

**3. `deploy`** (only on push to main, not PRs)
- Needs: `build`
- Runner: `self-hosted` (label: `sandford`)
- Steps: download artifact → copy `dist/` to `/var/www/minclo/` → reload nginx
- Uses secret: `DEPLOY_SSH_KEY` (already configured in repo settings)

## Secrets Needed

| Secret | Status | Purpose |
|--------|--------|---------|
| `DEPLOY_SSH_KEY` | ✅ Already configured | SSH key for deploy user |

## Acceptance Criteria

- [ ] Workflow file is valid YAML (passes `actionlint` or GitHub's validator)
- [ ] PR pushes trigger test + build jobs only
- [ ] Push to main triggers test + build + deploy
- [ ] Deploy job uses `self-hosted` runner with `sandford` label
- [ ] Deploy job only runs after build succeeds
- [ ] Workflow references only secrets that exist in repo settings

## Out of Scope

- Do NOT set up the self-hosted runner (already done)
- Do NOT modify nginx configs
- Do NOT add Slack/Discord notifications (separate issue)

## Size Estimate

`size/S` — 1 file, ~80 lines
````

### 🔄 Refactor

Show the before and after pattern. The agent needs to see the transformation.

````markdown
## Summary

Refactor greyzone API routes from Express callback style to async/await with
centralized error handling.

## Context

Current routes use nested callbacks with manual `try/catch` in every handler.
This makes error handling inconsistent — some routes return 500, others hang.
Centralizing error handling reduces bugs and makes routes easier to read.

## Current Pattern (before)

```typescript
// src/routes/player.ts — current style
router.get('/player/:id', (req, res) => {
  try {
    db.query('SELECT * FROM players WHERE id = $1', [req.params.id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(result.rows[0]);
    });
  } catch (e) {
    res.status(500).json({ error: 'Unknown error' });
  }
});
```

## Target Pattern (after)

```typescript
// src/routes/player.ts — target style
router.get('/player/:id', asyncHandler(async (req, res) => {
  const result = await db.query('SELECT * FROM players WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
}));
```

```typescript
// src/middleware/asyncHandler.ts — new utility
export const asyncHandler = (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

## Files to Modify

- `src/middleware/asyncHandler.ts` — new file, the wrapper utility
- `src/middleware/errorHandler.ts` — new file, centralized Express error handler
- `src/routes/player.ts` — refactor 4 route handlers
- `src/routes/game.ts` — refactor 6 route handlers
- `src/app.ts` — register error handler middleware (must be last)

## Files for Context (read-only)

- `src/db/client.ts` — already supports promises via `db.query()` returning `Promise`
- `src/types/api.ts` — request/response type definitions

## Invariants to Preserve

- All existing API responses must return identical JSON shapes
- HTTP status codes must not change for any existing endpoint
- Route paths and methods must not change
- No new dependencies — use only what's in `package.json`

## Acceptance Criteria

- [ ] All routes use `asyncHandler` wrapper — no raw `try/catch` in route files
- [ ] `errorHandler` middleware catches unhandled rejections and returns `{ error: string }`
- [ ] `npm run test` passes with no failures (existing integration tests cover all routes)
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `grep -r "catch" src/routes/` returns zero matches

## Out of Scope

- Do NOT add new routes
- Do NOT change database queries or response shapes
- Do NOT add request validation (separate issue: #38)
- Do NOT update tests (they test HTTP responses, which are unchanged)

## Size Estimate

`size/M` — 5 files, ~150 lines changed
````

### 📝 Documentation

Specify audience, structure, and source of truth.

````markdown
## Summary

Write API documentation for the PulseQuiz WebSocket events in
`docs/websocket-api.md`.

## Context

PulseQuiz uses WebSocket for real-time quiz gameplay but the event protocol
is undocumented. New contributors (and AI agents working on the frontend)
can't determine valid event payloads without reading source code.

## Audience

- Developers building PulseQuiz frontend features
- AI agents working on issues in this repo
- Future contributors unfamiliar with the codebase

## Files to Modify

- `docs/websocket-api.md` — new file

## Source of Truth

The definitive event definitions live in these files (read them, extract the protocol):

- `src/server/ws/events.ts` — event name constants and payload types
- `src/server/ws/handlers/` — handler implementations (one file per event)
- `src/types/ws.ts` — TypeScript interfaces for all payloads

## Sections Needed

1. **Connection** — URL, auth token format, reconnection strategy
2. **Client → Server Events** — table of event name, payload schema, description
3. **Server → Client Events** — same table format
4. **Error Events** — error codes and their meanings
5. **Example Flow** — a complete "join quiz → answer question → see results" sequence
   showing the exact JSON messages exchanged

## Format Requirements

- Use fenced code blocks with `json` language tag for all payloads
- Use tables for event catalogs (columns: Event, Payload, Description)
- Include TypeScript type definitions alongside JSON examples
- Keep each section self-contained (no forward references)

## Acceptance Criteria

- [ ] Every event in `src/server/ws/events.ts` is documented
- [ ] Every payload type in `src/types/ws.ts` has a JSON example
- [ ] The example flow section contains valid JSON that matches the types
- [ ] File renders correctly as GitHub Markdown (no broken tables)

## Out of Scope

- Do NOT modify source code
- Do NOT generate OpenAPI/Swagger specs (this is WebSocket, not REST)
- Do NOT document the REST API (separate issue)

## Size Estimate

`size/M` — 1 file, ~300 lines
````

### 🏗️ Infrastructure

Current state → target state, with rollback.

````markdown
## Summary

Add systemd service and nginx reverse proxy for bolsard on sandford.systems.

## Context

Bolsard runs manually via `cargo run` in a tmux session. This makes it fragile —
it doesn't survive reboots, there's no process monitoring, and no HTTPS.

## Current State

- Bolsard binary: built manually with `cargo build --release`
- Process: started in tmux, listening on `127.0.0.1:3030`
- No auto-restart on crash
- Accessed via direct port (no nginx proxy, no HTTPS)

## Target State

- systemd service: `bolsard.service`, auto-starts on boot
- Process: managed by systemd, restarts on failure (max 3 attempts / 60s)
- nginx proxy: `bolsard.sandford.systems` → `127.0.0.1:3030`
- HTTPS via Cloudflare tunnel (already configured for *.sandford.systems)

## Files to Modify

- `infrastructure/bolsard.service` — new systemd unit file
- `infrastructure/nginx/bolsard.conf` — new nginx site config

## Configuration Details

### systemd unit
```ini
[Unit]
Description=Bolsard Web Service
After=network.target

[Service]
Type=simple
User=brodie
WorkingDirectory=/home/brodie/Desktop/Repos/bolsard
ExecStart=/home/brodie/Desktop/Repos/bolsard/target/release/bolsard
Restart=on-failure
RestartSec=5
StartLimitBurst=3
StartLimitIntervalSec=60
Environment=RUST_LOG=info
Environment=PORT=3030

[Install]
WantedBy=multi-user.target
```

### nginx config
```nginx
server {
    listen 80;
    server_name bolsard.sandford.systems;

    location / {
        proxy_pass http://127.0.0.1:3030;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Rollback Plan

If the deploy fails:
1. `sudo systemctl stop bolsard && sudo systemctl disable bolsard`
2. `sudo rm /etc/nginx/sites-enabled/bolsard.conf && sudo nginx -s reload`
3. Resume manual tmux process as before

## Acceptance Criteria

- [ ] `infrastructure/bolsard.service` contains a valid systemd unit
- [ ] `infrastructure/nginx/bolsard.conf` contains a valid nginx server block
- [ ] Service specifies `Restart=on-failure` with rate limiting
- [ ] nginx proxies `bolsard.sandford.systems` to `127.0.0.1:3030`
- [ ] Rollback steps are documented in the issue or PR description

## Out of Scope

- Do NOT install or activate the service (human does this)
- Do NOT modify Cloudflare tunnel config
- Do NOT change bolsard's source code or build process
- Do NOT set up SSL certificates (Cloudflare handles this)

## Size Estimate

`size/S` — 2 files, ~50 lines
````

---

## 4. 🚫 Anti-Patterns

These are the issue-writing mistakes that waste agent sessions. Each one causes a predictable failure mode.

### ❌ "Improve the UI"

**Why it fails:** No acceptance criteria. The agent doesn't know when it's done. It will make arbitrary changes, probably touching 20 files, and produce a PR you'll reject entirely.

**Fix:** Specify exactly what to change.
```markdown
## Bad
Improve the UI of the dashboard.

## Good
Replace the raw JSON display in `src/components/Dashboard.tsx` with a
formatted table using the existing `<DataTable>` component from
`src/components/DataTable.tsx`. Columns: Name, Score, Date (formatted
as YYYY-MM-DD). Sort by Score descending.
```

### ❌ Assuming the Agent Knows Project Conventions

**Why it fails:** The agent reads your codebase, but it doesn't know your *unwritten* rules. "Use our standard pattern" means nothing if the standard pattern isn't documented or demonstrated by example.

**Fix:** Always provide a reference file.
```markdown
## Bad
Add a new API route following our conventions.

## Good
Add a new route in `src/routes/scores.ts` following the pattern in
`src/routes/players.ts`. Use `asyncHandler`, return `{ data, meta }`
envelope, and add the route to `src/routes/index.ts`.
```

### ❌ Mixing Multiple Deliverables

**Why it fails:** The agent tries to do everything, runs out of context, and delivers incomplete work across all fronts instead of complete work on one front.

**Fix:** One issue, one deliverable. If they're related, make an epic.
```markdown
## Bad
Add user authentication, create the login page, and set up the database schema.

## Good (3 separate issues)
Issue #50: Create users table migration in `src/db/migrations/`
Issue #51: Add auth middleware in `src/middleware/auth.ts` (depends on #50)
Issue #52: Create LoginForm component in `src/components/LoginForm.tsx` (depends on #51)
```

### ❌ Omitting File Paths

**Why it fails:** The agent spends 30% of its context window searching for where things live. In a monorepo with 500 files, that's a lot of wasted tokens — and it might find the wrong file.

**Fix:** Always list files to modify and files for context.
```markdown
## Bad
Fix the broken import in the utils module.

## Good
Fix the circular import in `src/utils/formatters.ts` (line ~12).
It imports from `src/utils/index.ts` which re-exports `formatters.ts`.
Change the import to reference `src/utils/dates.ts` directly.
```

### ❌ Undeclared Dependencies

**Why it fails:** The agent produces a clean PR that can't be merged because it assumes code from another unmerged PR exists. You now have two PRs that conflict and need manual rebasing.

**Fix:** Declare every dependency and confirm its status.
```markdown
## Bad
Build the game results screen.

## Good
Build the game results screen.

**Dependencies:**
- #44 (GameResult type definition) — ✅ merged
- #45 (Score calculation util) — ✅ merged
- #46 (Results API endpoint) — ⏳ in review (do NOT start until merged)
```

### ❌ No Out-of-Scope Boundary

**Why it fails:** Agents are optimizers. They see adjacent code that "could be better" and refactor it. Without boundaries, a "fix this one function" issue becomes a "restructure the entire module" PR.

**Fix:** Explicitly state what not to touch.
```markdown
## Bad
Refactor the database queries in the player module.

## Good
Refactor the database queries in `src/db/players.ts` from callbacks to
async/await.

**Out of Scope:**
- Do NOT change query logic (only the calling pattern)
- Do NOT modify `src/db/games.ts` or other query files
- Do NOT add a query builder or ORM
- Do NOT change the database schema
```

### ❌ Vague Size Estimates (or None at All)

**Why it fails:** An `XL` issue dispatched without decomposition will hit context limits. The agent produces partial work, and you can't tell what's done vs. what's missing.

**Fix:** Estimate honestly and decompose if needed.
```markdown
## Bad
[no size label]

## Good
size/M — 5 files, ~200 lines

## Also Good (honest about needing decomposition)
This is size/XL. Decomposing into:
- #60: Database schema (size/S)
- #61: API routes (size/M)
- #62: Frontend components (size/M)
- #63: Integration tests (size/S)
```

---

## 5. ✨ Real Examples — Bad to Good

### Example 1: Test Coverage

#### ❌ Bad Issue
```markdown
**Title:** Add tests to geeraff

Add unit tests for the physics simulation.
```

**Why it fails:** Which physics functions? What test framework? What counts as "enough" tests? The agent will either write trivial tests or try to cover everything and run out of context.

#### ✅ Good Issue
````markdown
**Title:** Add unit tests for geeraff neck physics — segment collision detection

## Summary

Add unit tests for `calculateSegmentCollisions()` in the geeraff physics engine.

## Context

The neck physics module has zero test coverage. Starting with collision detection
because it has the most bug reports. Part of epic #30 (geeraff test coverage).

## Files to Modify

- `src/physics/collision.test.ts` — new file

## Files for Context (read-only)

- `src/physics/collision.ts` — the module under test
- `src/physics/types.ts` — `NeckSegment`, `CollisionResult` types
- `vitest.config.ts` — test runner configuration

## Test Cases Required

1. **No collision** — two segments far apart → returns `null`
2. **Head-on collision** — segments moving toward each other → returns contact point
3. **Glancing collision** — segments barely touching → returns contact point with
   low overlap value
4. **Self-collision** — segment intersecting itself at extreme bend → returns
   contact point
5. **Boundary: zero-length segment** — degenerate input → returns `null`, no crash
6. **Boundary: identical segments** — same start/end → returns contact point at
   midpoint

## Acceptance Criteria

- [ ] `npx vitest run src/physics/collision.test.ts` passes with 6 test cases
- [ ] Tests import only from `./collision` and `./types` (no test mocks of physics engine)
- [ ] Each test has a descriptive name matching the test case descriptions above
- [ ] No snapshot tests — use explicit assertions

## Out of Scope

- Do NOT test other physics functions (separate issues for each)
- Do NOT modify `collision.ts` (only write tests for current behavior)
- Do NOT add test utilities or helpers (use vitest built-ins)

## Size Estimate

`size/S` — 1 file, ~120 lines
````

---

### Example 2: Responsive Layout Fix

#### ❌ Bad Issue
```markdown
**Title:** Fix mobile layout

The app doesn't look right on mobile.
```

**Why it fails:** Which pages? Which breakpoints? Which components? "Doesn't look right" isn't testable.

#### ✅ Good Issue
````markdown
**Title:** Fix simulation controls overflow on mobile (< 640px) in ant-size-simulator

## Summary

The simulation control panel overflows horizontally on screens narrower than
640px, hiding the "Reset" and "Speed" buttons.

## Context

Mobile users can't access simulation controls. The control bar is a fixed-width
flexbox that doesn't wrap. This is the highest-priority mobile bug (P1).

## Reproduction

1. Open ant-size-simulator in Chrome
2. Open DevTools → toggle device toolbar → select "iPhone SE" (375px wide)
3. Observe: "Reset" and "Speed" buttons are cut off, no horizontal scroll

## Files to Modify

- `src/components/ControlPanel.module.css` — add responsive breakpoint
- `src/components/ControlPanel.tsx` — restructure button layout for wrapping

## Files for Context (read-only)

- `src/styles/breakpoints.ts` — existing breakpoint constants (`SM = 640px`)
- `src/components/SimulationCanvas.tsx` — parent layout for reference

## Fix Specification

- At `< 640px` (`SM` breakpoint): control bar switches from `flex-row` to a
  2×2 grid layout
- Button order in grid: [Play/Pause, Reset] [Speed, Settings]
- Minimum button tap target: 44×44px (accessibility standard)
- No horizontal overflow at any width ≥ 320px

## Acceptance Criteria

- [ ] At 375px width: all 4 buttons are visible without scrolling
- [ ] At 320px width: all 4 buttons are visible without scrolling
- [ ] At 640px+ width: original horizontal layout is preserved
- [ ] Button tap targets are ≥ 44×44px at mobile sizes
- [ ] `npm run build` passes with no errors

## Out of Scope

- Do NOT change desktop layout (≥ 640px)
- Do NOT modify button functionality or event handlers
- Do NOT add new buttons or reorganize the control panel features
- Do NOT fix mobile issues in other components (separate issues)

## Size Estimate

`size/XS` — 2 files, ~40 lines
````

---

### Example 3: CI/CD Setup

#### ❌ Bad Issue
```markdown
**Title:** Set up CI/CD

We need automated testing and deployment.
```

**Why it fails:** Which repo? What runner? What stages? What triggers? What gets deployed where? This is an epic pretending to be an issue.

#### ✅ Good Issue
````markdown
**Title:** Create GitHub Actions test workflow for spider-size-simulator

## Summary

Create a CI workflow that runs tests and type-checking on every PR targeting
`main`, and on every push to `main`.

## Context

spider-size-simulator has no CI. Two recent PRs introduced type errors that
weren't caught until production. This workflow catches them automatically.
Deployment is a separate issue (#71).

## Files to Modify

- `.github/workflows/ci.yml` — new file

## Files for Context (read-only)

- `package.json` — `scripts` section (test: `vitest run`, typecheck: `tsc --noEmit`)
- `tsconfig.json` — TypeScript configuration

## Workflow Specification

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
```

## Secrets Needed

None — this is a test-only workflow.

## Acceptance Criteria

- [ ] `.github/workflows/ci.yml` exists and is valid YAML
- [ ] Workflow triggers on PR to `main` and push to `main`
- [ ] Jobs run `npm run typecheck` before `npm test` (fail fast on type errors)
- [ ] Uses `actions/checkout@v4` and `actions/setup-node@v4` (latest stable)
- [ ] Uses Node 20 with npm caching enabled
- [ ] No secrets or environment variables required

## Out of Scope

- Do NOT add deployment steps (that's #71)
- Do NOT add code coverage reporting (that's #72)
- Do NOT add matrix builds for multiple Node versions (overkill for this project)

## Size Estimate

`size/XS` — 1 file, ~30 lines
````

---

## 6. 🏷️ Label Usage Guide

Consistent labeling lets you query, sort, and dispatch issues programmatically. Every issue gets **one label from each applicable category**.

### Priority

How urgently does this need to be done?

| Label | Meaning | SLA | Example |
|-------|---------|-----|---------|
| `P0` | **Blocks deployment or production is broken** | Today | Site is down, CI is broken, security vulnerability |
| `P1` | **This sprint** — important and time-sensitive | This week | Feature needed for upcoming demo, broken user flow |
| `P2` | **Next sprint** — important but not urgent | Next 2 weeks | Tech debt that's slowing development, nice-to-have feature |
| `P3` | **Backlog** — do it eventually | When convenient | Polish, optimization, "would be nice" improvements |

**Rule of thumb:** If you'd wake someone up for it, it's P0. If you'd mention it at standup, it's P1. If you'd put it on a roadmap, it's P2. Everything else is P3.

### Size

How much agent time does this need? Size directly maps to context-window consumption.

| Label | Time | Files | Lines | Agent Model |
|-------|------|-------|-------|-------------|
| `size/XS` | < 30 min | 1 file | < 50 lines | Any — fast model fine (Haiku) |
| `size/S` | ~1 hour | 1–3 files | 50–150 lines | Standard model (Sonnet) |
| `size/M` | ~2 hours | 3–8 files | 150–400 lines | Standard model (Sonnet) |
| `size/L` | ~4 hours | 8–15 files | 400–800 lines | Premium model (Opus), watch context |
| `size/XL` | 4+ hours | 15+ files | 800+ lines | **STOP — decompose into sub-issues** |

**`size/XL` means you skipped the decomposition step.** No issue should ship with this label. Convert it to an epic and create agent-ready sub-issues.

### Type

What kind of work is this?

| Label | Description | Template Reference |
|-------|-------------|-------------------|
| `type/bug` | Something is broken | [Bug Fix pattern](#-bug-fix) |
| `type/feature` | New functionality | [New Component pattern](#-new-component) |
| `type/refactor` | Change implementation, preserve behavior | [Refactor pattern](#-refactor) |
| `type/ci-cd` | Workflows, pipelines, deploy configs | [CI/CD pattern](#%EF%B8%8F-cicd-workflow) |
| `type/docs` | Documentation (not code) | [Documentation pattern](#-documentation) |
| `type/infra` | Server configs, systemd, nginx | [Infrastructure pattern](#%EF%B8%8F-infrastructure) |
| `type/test` | Test coverage without changing source | [Test sub-pattern of Bug Fix] |
| `type/chore` | Dependency updates, linting config, housekeeping | Minimal template — acceptance criteria only |

### Area

Which part of the system does this touch?

| Label | Scope |
|-------|-------|
| `area/frontend` | React components, CSS, client-side logic |
| `area/backend` | API routes, database, server logic |
| `area/physics` | Simulation engines (geeraff, ant/spider/eagle/elephant-size-simulator) |
| `area/infra` | nginx, systemd, Cloudflare, deployment |
| `area/ci` | GitHub Actions workflows, self-hosted runners |
| `area/design` | Visual design, CSS architecture, design tokens |

### Phase

Where does this fit in the project roadmap?

| Label | Description | Typical Issues |
|-------|-------------|----------------|
| `phase/foundation` | Core architecture, types, models | Schema definitions, base components, project scaffolding |
| `phase/ci-cd` | Build and deploy infrastructure | Workflows, deploy configs, runner setup |
| `phase/design-system` | Visual layer and component library | Design tokens, shared components, CSS architecture |
| `phase/consolidation` | Integration, testing, hardening | Cross-module tests, error handling, edge cases |
| `phase/monitoring` | Observability and operations | Logging, Prometheus metrics, health checks, Grafana dashboards |
| `phase/agent-dx` | Developer experience for AI agents | CLAUDE.md files, copilot-instructions, issue templates, this guide |

### Workflow

What's the status for agent dispatch?

| Label | Meaning | Action |
|-------|---------|--------|
| `agent-ready` | Issue satisfies all 5 properties — dispatch immediately | Assign to an agent |
| `needs-decomposition` | Too large or ambiguous — split first | Human reviews and decomposes |
| `epic` | Parent tracker — not directly actionable | Contains checklist linking to sub-issues |
| `blocked` | Waiting on a dependency | Check `Dependencies` section, wait |

---

## 7. 🗂️ Epic Decomposition Walkthrough

When a goal is too big for a single agent session, decompose it into an epic with agent-ready sub-issues. Here's the full process using a real example.

### Step 1: Start with the Large Goal

> "Deploy bolsard to sandford.systems with CI/CD, monitoring, and custom domain."

This is clearly `size/XL`. An agent can't do all of this — it spans nginx config, systemd, GitHub Actions, DNS, Cloudflare, and application config. Time to decompose.

### Step 2: Identify Deliverables

Break the goal into independently shippable units:

1. **Build & test workflow** — CI pipeline that validates PRs
2. **Systemd service file** — process management for the binary
3. **Nginx reverse proxy** — route `bolsard.sandford.systems` to the app
4. **Deploy workflow** — CD pipeline that deploys on merge to main
5. **Health check endpoint** — `/health` route for monitoring
6. **Prometheus metrics** — expose `/metrics` for Grafana dashboards

### Step 3: Map Dependencies

```
#80 Build & test workflow ─────────────────────────────┐
                                                        │
#81 Systemd service file ──┐                            │
                           ├──▶ #83 Deploy workflow ────┤
#82 Nginx reverse proxy ──┘                             │
                                                        │
#84 Health check endpoint ──▶ #85 Prometheus metrics ──┘
```

- **#80** and **#81**, **#82**, **#84** have no dependencies — they can be worked in parallel
- **#83** (deploy) needs #81 and #82 (must know where the service runs)
- **#85** (metrics) needs #84 (health endpoint should exist first)

### Step 4: Create the Parent Epic

````markdown
**Title:** 🚀 Epic: Deploy bolsard to sandford.systems

**Labels:** `epic`, `P1`, `area/infra`, `phase/ci-cd`

## Goal

Bolsard is deployed to sandford.systems with automated CI/CD, process
management, and monitoring integration.

## Definition of Done

- [ ] PRs are automatically tested
- [ ] Merges to `main` auto-deploy to production
- [ ] Process auto-restarts on crash and on server reboot
- [ ] `bolsard.sandford.systems` resolves and serves the application
- [ ] Health check is visible in Grafana

## Sub-Issues

- [ ] #80 — Create CI test workflow (`agent-ready`, `size/XS`)
- [ ] #81 — Create systemd service file (`agent-ready`, `size/XS`)
- [ ] #82 — Create nginx reverse proxy config (`agent-ready`, `size/XS`)
- [ ] #83 — Create CD deploy workflow (`agent-ready`, `size/S`) — depends on #81, #82
- [ ] #84 — Add `/health` endpoint (`agent-ready`, `size/XS`)
- [ ] #85 — Add Prometheus `/metrics` endpoint (`agent-ready`, `size/S`) — depends on #84

## Dependency Graph

```
#80 ──────────────────────────┐
#81 ──┐                       │
      ├──▶ #83 ──────────────▶│ (all merge to main)
#82 ──┘                       │
#84 ──▶ #85 ─────────────────┘
```

## Parallel Dispatch Plan

**Wave 1** (no dependencies — dispatch all simultaneously):
- #80 CI test workflow
- #81 systemd service
- #82 nginx config
- #84 health endpoint

**Wave 2** (after Wave 1 merges):
- #83 deploy workflow
- #85 Prometheus metrics

## Notes

Cloudflare tunnel for `*.sandford.systems` is already configured.
Self-hosted runner with label `sandford` is already registered.
````

### Step 5: Write Each Sub-Issue as Agent-Ready

Here's one example — the rest follow the same pattern:

````markdown
**Title:** Add `/health` endpoint to bolsard

**Labels:** `agent-ready`, `size/XS`, `P1`, `type/feature`, `area/backend`, `phase/ci-cd`

## Summary

Add a `GET /health` endpoint that returns `200 OK` with a JSON body indicating
service health.

## Context

Part of epic #79 (deploy bolsard). The health endpoint is needed for:
- systemd `ExecStartPost` health verification
- Prometheus blackbox-exporter HTTP probe
- nginx upstream health checks

## Files to Modify

- `src/routes/health.rs` — new file, health endpoint handler
- `src/main.rs` — register the `/health` route

## Files for Context (read-only)

- `src/routes/mod.rs` — how routes are organized and registered
- `src/main.rs` — Actix-web server setup
- `Cargo.toml` — no new dependencies needed

## Response Specification

```
GET /health HTTP/1.1

200 OK
Content-Type: application/json

{
  "status": "ok",
  "service": "bolsard",
  "uptime_seconds": 3612
}
```

- `status`: always `"ok"` if the server can respond
- `service`: hardcoded `"bolsard"`
- `uptime_seconds`: integer, seconds since server start (use `std::time::Instant`)

## Acceptance Criteria

- [ ] `GET /health` returns `200` with the JSON body described above
- [ ] Response `Content-Type` is `application/json`
- [ ] `uptime_seconds` increases over time (not hardcoded)
- [ ] `cargo test` passes (add at least 2 tests: response status, JSON shape)
- [ ] `cargo build --release` succeeds with no warnings
- [ ] Route is registered in `src/main.rs` without modifying existing routes

## Out of Scope

- No database health checks (bolsard doesn't use a database)
- No dependency checks (no external services to verify)
- No authentication on this endpoint (it's public for monitoring)
- Do NOT add middleware or modify existing routes

## Dependencies

- None — this can be built on the current `main` branch

## Size Estimate

`size/XS` — 2 files, ~50 lines
````

### Step 6: Link and Track

- Use GitHub's sub-issues feature to link sub-issues to the parent epic
- As agents complete sub-issues and PRs merge, check off items in the epic
- When all checkboxes are done, close the epic

### Decomposition Checklist

Before creating an epic, verify:

- [ ] **Every sub-issue is agent-ready** (passes the 5 properties test)
- [ ] **Every sub-issue has a size ≤ L** (if it's XL, decompose further)
- [ ] **Dependencies are explicit** in both the epic and each sub-issue
- [ ] **Wave dispatch is planned** — you know what can run in parallel
- [ ] **No circular dependencies** — the graph is a DAG
- [ ] **Each sub-issue is independently mergeable** — partial completion is fine

---

## Quick Reference: The Issue Readiness Checklist

Before labeling any issue `agent-ready`, verify:

```
□ Summary is one sentence, describes a concrete deliverable
□ Files to Modify lists every file path the agent will touch
□ Files for Context gives the agent examples to follow
□ Acceptance criteria are all binary pass/fail
□ Out of Scope section exists and is specific
□ Size estimate matches the actual scope (XS through L, never XL)
□ Dependencies are listed with their current status
□ One label from each category: priority, size, type, area, phase
□ The issue could be completed by someone who has never seen this repo
  (because that's exactly what an agent is)
```

---

*This guide is a living document. As we learn what works and what breaks agents, update these patterns. The best issue template is the one that produces a mergeable PR on the first try.*

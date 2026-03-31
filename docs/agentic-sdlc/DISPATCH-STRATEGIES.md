# Fleet Dispatch Strategies for AI Agent Orchestration

> Patterns for dispatching parallel AI coding agents across a multi-repo portfolio.

---

## Table of Contents

- [Fleet Mode Fundamentals](#fleet-mode-fundamentals)
- [Dispatch Patterns](#dispatch-patterns)
  - [Pattern 1: Parallel Fan-Out](#pattern-1-parallel-fan-out)
  - [Pattern 2: Sequential Chain](#pattern-2-sequential-chain)
  - [Pattern 3: Batch-Per-Repo](#pattern-3-batch-per-repo)
  - [Pattern 4: Template Replication](#pattern-4-template-replication)
  - [Pattern 5: Epic Waterfall](#pattern-5-epic-waterfall)
  - [Pattern 6: Exploration → Implementation](#pattern-6-exploration--implementation)
- [Prompt Engineering for Agents](#prompt-engineering-for-agents)
- [Monitoring & Coordination](#monitoring--coordination)
- [Error Recovery Patterns](#error-recovery-patterns)
- [Optimal Session Flow](#optimal-session-flow)
- [Decision Matrix](#decision-matrix)

---

## Fleet Mode Fundamentals

**Fleet mode** is the practice of dispatching multiple AI coding agents in parallel to work on independent tasks simultaneously. Instead of prompting one agent, waiting for it to finish, and prompting the next, you launch a wave of agents — each scoped to its own issue, repo, or subsystem — and review outputs as they land.

### The Orchestrator's Role

You are not writing code. You are:

1. **Selecting work** — querying the project board for ready issues (no unresolved dependencies)
2. **Writing prompts** — translating each issue into a self-contained agent instruction
3. **Dispatching** — launching agents via the `task` tool, CLI, or IDE
4. **Monitoring** — tracking which agents are running, completed, or stuck
5. **Reviewing** — reading diffs, running tests, verifying acceptance criteria
6. **Merging** — approving PRs, updating project boards, unblocking downstream work

### Agents Are Stateless

Every dispatch starts from zero. Agents retain nothing from previous sessions. This means every prompt must be **self-contained** — include the repo path, relevant file paths, the full specification, and acceptance criteria. Never assume an agent "remembers" what it did last time.

### Cost-Benefit Tradeoffs

| Dimension | Serial dispatch | Fleet dispatch |
|---|---|---|
| **Speed** | One task at a time | 3–5× throughput per session |
| **Review load** | Review as you go | Burst of PRs to review at once |
| **Context quality** | You can iterate in real-time | Prompts must be precise upfront |
| **Error cost** | Catch mistakes early | Bad prompts waste multiple agents |

Fleet mode pays off when you have well-defined, independent issues. It breaks down when issues are tightly coupled or underspecified.

---

## Dispatch Patterns

### Pattern 1: Parallel Fan-Out

**When:** Multiple independent issues across different repos. No shared files, no dependency edges.

**Example:** Add GitHub Actions CI pipelines to five simulator repos that currently have none.

```
Dispatch simultaneously:
  Agent A → ant-sim:       add CI pipeline
  Agent B → eagle-sim:     add CI pipeline
  Agent C → elephant-sim:  add CI pipeline
  Agent D → spider-sim:    add CI pipeline
  Agent E → dc-sim:        add CI pipeline
```

**Dispatch command:**

```python
# Launch 5 agents in parallel — each gets its own repo context
task(
    agent_type="general-purpose",
    mode="background",
    name="ci-ant-sim",
    prompt="""
    Repo: ~/Desktop/Repos/ant-sim
    Task: Create .github/workflows/ci.yml
    - Trigger on push to main and PRs
    - Run: npm ci && npm test && npm run build
    - Node 20, Ubuntu latest
    - Verify the workflow is valid YAML before committing
    Do NOT modify any application code.
    """
)

# Repeat for eagle-sim, elephant-sim, spider-sim, dc-sim
# with repo-specific build commands adjusted as needed.
```

**Prompt template for fan-out:**

```markdown
Repo: [absolute path]
Issue: [title + number]
Task: [one-paragraph description]
Files to create/modify: [explicit list]
Files for context: [read these first]
Acceptance criteria:
  - [ ] criterion 1
  - [ ] criterion 2
Out of scope: [what NOT to do]
Verify: [test command to run]
```

**Risks & Mitigations:**

- **Merge conflicts** — unlikely when agents target different repos. If two agents in the same repo must touch the same file, serialize them instead.
- **Inconsistency** — agents may make different structural choices. Use Template Replication (Pattern 4) if consistency matters.

---

### Pattern 2: Sequential Chain

**When:** Issue B depends on the output of Issue A. You cannot dispatch B until A is verified and merged.

**Example:** Create a shared ESLint config, then roll it out repo by repo.

```
Chain:
  Agent 1 → Create @idealase/eslint-config package
       ↓ (wait, verify, publish)
  Agent 2 → Apply shared config to geeraff
       ↓ (wait, verify, merge)
  Agent 3 → Apply shared config to minclo
```

**Implementation:**

```python
# Step 1: Dispatch the foundation
result_1 = task(
    agent_type="general-purpose",
    mode="sync",
    name="eslint-shared-config",
    prompt="""
    Repo: ~/Desktop/Repos/eslint-config
    Create an ESLint flat config package with rules for:
    - TypeScript strict, no-unused-vars as error
    - Prettier integration
    - Export as default config array
    Include package.json, README, and a test that validates the config loads.
    """
)

# Step 2: Review agent 1's output. If acceptable, dispatch agent 2
# with explicit reference to what agent 1 produced.
result_2 = task(
    agent_type="general-purpose",
    mode="sync",
    name="eslint-geeraff",
    prompt="""
    Repo: ~/Desktop/Repos/geeraff
    Task: Replace the existing .eslintrc with the new shared config.
    The shared config is published as @idealase/eslint-config.
    - npm install @idealase/eslint-config
    - Create eslint.config.js that imports and spreads the shared config
    - Delete old .eslintrc.json
    - Run `npx eslint .` and fix any new lint errors
    - Run `npm test` to confirm nothing breaks
    """
)
```

**Risks & Mitigations:**

- **Slow throughput** — chains are inherently serial. Minimize chain length during issue decomposition. If steps 2 and 3 are independent of each other, parallelize them (this becomes an Epic Waterfall).
- **Context loss** — agent 2 doesn't know what agent 1 did unless you tell it. Copy relevant output (file paths, package names, API signatures) into agent 2's prompt.

---

### Pattern 3: Batch-Per-Repo

**When:** Multiple issues in the same repo that share context. Bundling them into one dispatch lets the agent read the codebase once.

**Example:** Three related tasks in geeraff:

```
Single agent dispatch for geeraff:
  1. Add vitest config (vitest.config.ts, update package.json)
  2. Write physics engine unit tests (test/physics.test.ts)
  3. Add CI workflow that runs the new tests (.github/workflows/ci.yml)
```

**Dispatch command:**

```python
task(
    agent_type="general-purpose",
    mode="background",
    name="geeraff-test-infra",
    prompt="""
    Repo: ~/Desktop/Repos/geeraff

    Complete these 3 tasks in order:

    **Task 1: Add Vitest**
    - npm install -D vitest @vitest/coverage-v8
    - Create vitest.config.ts at repo root
    - Add "test" and "test:coverage" scripts to package.json

    **Task 2: Write physics tests**
    - Read src/physics.ts to understand the module
    - Create test/physics.test.ts with tests for:
      - Gravity calculation
      - Collision detection
      - Velocity updates
    - Run `npm test` to confirm tests pass

    **Task 3: Add CI workflow**
    - Create .github/workflows/ci.yml
    - Steps: checkout, setup node 20, npm ci, npm test
    - Trigger on push to main and pull requests

    Do NOT refactor existing application code.
    Run `npm test` after all changes to verify everything works.
    """
)
```

**Benefits:**

- Agent reads `src/physics.ts` once and uses that context for both writing tests and configuring CI.
- Fewer total dispatches means less review overhead and lower API costs.

**Risks & Mitigations:**

- **Context window pressure** — more tasks means more prompt tokens and more generated output. Cap batches at **3–4 issues** per dispatch.
- **Partial failure** — if task 2 fails, task 3 may still reference broken state. Instruct the agent to verify each task before proceeding to the next.

---

### Pattern 4: Template Replication

**When:** The same change needs to be applied to multiple repos with minor per-repo variations. You have a reference implementation to copy from.

**Example:** Add a cross-simulator navigation component to all animal sim repos. The reference lives in geeraff.

**Implementation:**

```python
# First, extract the reference implementation
reference_code = read_file("~/Desktop/Repos/geeraff/src/components/SimNav.tsx")

repos = [
    ("ant-sim",      "Ant Colony Simulator",      "/ant-sim"),
    ("eagle-sim",    "Eagle Flight Simulator",     "/eagle-sim"),
    ("elephant-sim", "Elephant Herd Simulator",    "/elephant-sim"),
    ("spider-sim",   "Spider Web Simulator",       "/spider-sim"),
]

for repo_name, display_name, path_suffix in repos:
    task(
        agent_type="general-purpose",
        mode="background",
        name=f"nav-{repo_name}",
        prompt=f"""
        Repo: ~/Desktop/Repos/{repo_name}

        Add a cross-simulator navigation bar component.

        **Reference implementation** (from geeraff):
        ```tsx
        {reference_code}
        ```

        Adapt this component for {display_name}:
        - Update the `currentSim` prop default to "{repo_name}"
        - Match the existing CSS/styling approach in this repo
        - Import and render the component in the main App layout
        - Keep the same nav links and ordering as the reference

        Do NOT change the nav link URLs or add new dependencies
        unless the repo doesn't already have React — in that case,
        skip this task and report that the repo needs React first.
        """
    )
```

**Key principle:** Include the literal reference code in every prompt. If you just say "copy what geeraff does," agents will interpret that differently and diverge.

**Risks & Mitigations:**

- **Over-adaptation** — agents may "improve" the reference. Explicitly say "match the reference implementation, do not add features."
- **Repo-specific incompatibilities** — some repos may use different frameworks or bundlers. Include a bail-out instruction ("if X doesn't apply, report why and stop").

---

### Pattern 5: Epic Waterfall

**When:** Working through a multi-issue epic where sub-issues have a dependency graph. Some sub-issues within a wave can run in parallel; waves themselves are sequential.

**Example:** Greyzone Deployment Automation epic:

```
Wave 1 (parallel):
  Agent A → Create docker-compose.yml for greyzone services
  Agent B → Write Dockerfile for the API server

Wave 2 (parallel, depends on wave 1):
  Agent C → Create systemd service unit for docker-compose
  Agent D → Write deploy.sh script that pulls latest images and restarts

Wave 3 (sequential, depends on wave 2):
  Agent E → Add health check endpoint + monitoring integration
```

**Implementation:**

```python
# Wave 1: dispatch in parallel
task(mode="background", name="greyzone-compose", prompt="...docker-compose...")
task(mode="background", name="greyzone-dockerfile", prompt="...Dockerfile...")

# Wait for both to complete
# read_agent("greyzone-compose"), read_agent("greyzone-dockerfile")

# Review wave 1 outputs. If good, proceed.

# Wave 2: dispatch in parallel (include wave 1 outputs as context)
task(mode="background", name="greyzone-systemd", prompt="""
  ...systemd unit...
  The docker-compose.yml is located at /opt/greyzone/docker-compose.yml
  and defines services: api, worker, redis, postgres.
  ...""")
task(mode="background", name="greyzone-deploy", prompt="""
  ...deploy script...
  Assumes docker-compose is managed by systemd unit 'greyzone.service'.
  ...""")

# Wave 3: dispatch after wave 2 verified
task(mode="sync", name="greyzone-health", prompt="...health checks...")
```

**Benefits:**

- Maximizes parallelism within each dependency tier.
- Structured progress — you know exactly where you are in the epic at all times.

**Risks & Mitigations:**

- **Wave boundary overhead** — each wave requires a stop-review-dispatch cycle. Keep the number of waves to 3–4.
- **Cascading rework** — if wave 1 output is wrong, all downstream waves are invalid. Review wave 1 thoroughly before dispatching wave 2.

---

### Pattern 6: Exploration → Implementation

**When:** You don't know enough about a codebase to write a precise implementation prompt. Sending an agent in blind wastes tokens and produces garbage.

**Phase 1: Explore**

```python
# Lightweight, fast explore agents — safe to parallelize
task(
    agent_type="explore",
    mode="background",
    name="fam-arch-auth",
    prompt="""
    Repo: ~/Desktop/Repos/fam-arch
    Questions:
    1. What authentication pattern does this app use? (JWT, session, OAuth?)
    2. Where is the auth middleware defined? (exact file paths)
    3. How are user roles/permissions modeled?
    4. Are there existing audit logging patterns?
    5. What test framework is used? Where do auth-related tests live?
    """
)

task(
    agent_type="explore",
    mode="background",
    name="fam-arch-db",
    prompt="""
    Repo: ~/Desktop/Repos/fam-arch
    Questions:
    1. What ORM/database layer is used?
    2. Where are migrations defined?
    3. What's the pattern for adding a new database table?
    """
)
```

**Phase 2: Implement (using exploration results)**

```python
# Now you know: fam-arch uses JWT with role claims, middleware in
# src/middleware/auth.ts, Prisma ORM, tests in __tests__/

task(
    agent_type="general-purpose",
    mode="sync",
    name="fam-arch-rbac-audit",
    prompt="""
    Repo: ~/Desktop/Repos/fam-arch

    Add RBAC audit logging.

    Context (from codebase exploration):
    - Auth middleware: src/middleware/auth.ts (extracts JWT, sets req.user)
    - User roles defined in: src/types/auth.ts (enum Role { ADMIN, MEMBER, VIEWER })
    - Prisma schema: prisma/schema.prisma
    - Existing test pattern: __tests__/auth.test.ts using vitest

    Implementation:
    1. Add AuditLog model to prisma/schema.prisma:
       - id, userId, action, resource, timestamp, metadata (JSON)
    2. Create src/services/auditLogger.ts with logAction(userId, action, resource, meta)
    3. Add audit logging calls to src/middleware/auth.ts on:
       - Successful authentication
       - Permission denied events
    4. Create migration: npx prisma migrate dev --name add-audit-log
    5. Write tests in __tests__/auditLogger.test.ts

    Run `npm test` to verify. Do NOT modify existing auth logic beyond
    adding the audit log calls.
    """
)
```

**Why this works:** The explore phase costs ~10% of what a wasted implementation attempt costs. You trade a small upfront investment for dramatically better implementation prompts.

---

## Prompt Engineering for Agents

### Required Sections for Implementation Prompts

Every implementation prompt should include:

```markdown
**Repo:** ~/Desktop/Repos/{repo-name}

**Issue:** #{number} — {title}

**Task:** {one clear paragraph describing what to do}

**Files to modify:**
- path/to/file1.ts — add the new function here
- path/to/file2.ts — update the import

**Files for context (read, don't modify):**
- path/to/types.ts — defines the interfaces you'll need
- path/to/existing-similar.ts — follow this pattern

**Acceptance criteria:**
- [ ] New endpoint returns 200 with valid auth token
- [ ] Returns 401 without token
- [ ] Audit log entry created on each request
- [ ] All existing tests still pass

**Out of scope:**
- Do NOT refactor existing code
- Do NOT add new dependencies unless absolutely required
- Do NOT change the database schema beyond what's specified

**Verify:** Run `npm test` before committing.
```

### Prompt Length Guidelines

| Agent type | Target length | Rationale |
|---|---|---|
| Explore | 50–150 words | Short questions, specific asks |
| Implementation (small) | 200–300 words | Single file change, clear scope |
| Implementation (medium) | 300–500 words | Multi-file, needs context |
| Batch (3–4 issues) | 500–800 words | Multiple tasks, sequenced |

Going over 800 words usually means the task should be decomposed into multiple dispatches.

### Anti-Patterns

- **"Make it better"** — too vague. Agent will over-engineer or do nothing useful.
- **"Fix the bugs"** — which bugs? Agents need specific reproduction steps.
- **"Follow best practices"** — every agent has different "best practices." Be explicit about the patterns you want.
- **Omitting file paths** — agents waste tokens searching. Give them exact paths.
- **No verification step** — agents may produce code that doesn't compile. Always include a `run X to verify` instruction.

---

## Monitoring & Coordination

### Track Dispatch Status

Use the session SQL database to track what's in flight:

```sql
-- Before dispatching
INSERT INTO todos (id, title, status, description) VALUES
  ('ci-ant-sim', 'Add CI to ant-sim', 'in_progress',
   'Dispatched via fan-out, agent ci-ant-sim');

-- After agent completes and you've reviewed
UPDATE todos SET status = 'done' WHERE id = 'ci-ant-sim';

-- Query what's still running
SELECT id, title FROM todos WHERE status = 'in_progress';

-- Query what's ready to dispatch next (no pending dependencies)
SELECT t.id, t.title FROM todos t
WHERE t.status = 'pending'
AND NOT EXISTS (
    SELECT 1 FROM todo_deps td
    JOIN todos dep ON td.depends_on = dep.id
    WHERE td.todo_id = t.id AND dep.status != 'done'
);
```

### Agent Status Commands

```python
# Check all running agents
list_agents()

# Read output from a specific agent
read_agent(agent_id="ci-ant-sim", wait=False)

# Block until agent finishes (with timeout)
read_agent(agent_id="ci-ant-sim", wait=True, timeout=60)
```

### Coordination Rules

1. **Never dispatch two agents to the same file simultaneously.** One will overwrite the other's changes.
2. **Never dispatch two agents to the same branch.** Use separate branches or separate repos.
3. **Set mental timeouts.** If an agent hasn't completed in ~15 minutes, something is wrong — read its output, investigate, and either refine the prompt or kill it.
4. **Cap concurrent agents at 5–7.** Beyond that, review becomes the bottleneck and quality drops.

---

## Error Recovery Patterns

### Agent Produced Wrong Output

**Symptom:** Code doesn't match the spec, wrong approach, or misunderstood the task.

**Recovery:**
1. Identify what went wrong (missing context? ambiguous instruction?)
2. Rewrite the prompt with tighter constraints
3. Add an explicit "do it THIS way, not THAT way" section
4. Re-dispatch

```python
# Original prompt was too vague about the API style
# Refined prompt:
prompt="""
...
Use Express-style route handlers (req, res, next), NOT class-based controllers.
Return JSON responses with { data, error, meta } envelope.
See src/routes/users.ts lines 14-40 for the exact pattern to follow.
..."""
```

### Agent Couldn't Find Files

**Symptom:** Agent reports "file not found" or creates files in the wrong location.

**Recovery:** Add explicit absolute paths and a directory listing.

```python
prompt="""
Repo root: ~/Desktop/Repos/geeraff
Source files are in: src/
Tests are in: test/
Config files are in the repo root.
The file you need to modify is: src/engine/physics.ts (it exists, ~200 lines).
"""
```

### Agent Over-Engineered

**Symptom:** Asked for a simple utility function, got a full abstraction layer with interfaces, factories, and a plugin system.

**Recovery:** Add an explicit scope boundary.

```python
prompt="""
...
## Out of Scope
- Do NOT create abstract base classes
- Do NOT add a plugin/extension system
- Do NOT create new directories
- This should be ONE file with ONE exported function
- Minimal changes only — the simplest solution that satisfies the criteria
..."""
```

### Agent Broke Tests

**Symptom:** Agent's changes cause existing tests to fail.

**Recovery:** Always include test verification in the prompt.

```python
prompt="""
...
**CRITICAL:** Before creating any commits:
1. Run `npm test` and confirm ALL tests pass
2. If your changes break existing tests, fix your changes (not the tests)
3. If you cannot make tests pass, report what's failing and stop
..."""
```

### Rate Limited

**Symptom:** API returns 429 errors, agents fail to start or stall mid-task.

**Recovery:**
- Space dispatches 30–60 seconds apart instead of all at once
- Use Batch-Per-Repo pattern to reduce total number of dispatches
- Prioritize: dispatch the highest-value tasks first, defer nice-to-haves
- Switch to a different agent provider temporarily if one is throttled

---

## Optimal Session Flow

A worked example of a productive fleet dispatch session:

```
┌─────────────────────────────────────────────────────────┐
│ 1. ASSESS                                               │
│    Query GitHub Projects for ready issues                │
│    → 8 issues have no pending dependencies               │
│                                                         │
│ 2. GROUP                                                │
│    Fan-out candidates (independent, different repos):    │
│      - Add CI to ant-sim                                │
│      - Add CI to eagle-sim                              │
│      - Add CI to elephant-sim                           │
│    Batch candidate (same repo):                         │
│      - geeraff: vitest + physics tests + CI             │
│    Chain (dependent):                                   │
│      - shared ESLint config → apply to minclo           │
│                                                         │
│ 3. DISPATCH WAVE 1                                      │
│    Launch 4 agents in parallel:                         │
│      - ci-ant-sim       (fan-out)                       │
│      - ci-eagle-sim     (fan-out)                       │
│      - ci-elephant-sim  (fan-out)                       │
│      - geeraff-testing  (batch)                         │
│                                                         │
│ 4. WHILE WAITING                                        │
│    Review PRs from yesterday's session                  │
│    Merge approved PRs                                   │
│    Update project board statuses                        │
│                                                         │
│ 5. AS AGENTS COMPLETE                                   │
│    ci-ant-sim done → review diff, approve               │
│    ci-eagle-sim done → review diff, approve             │
│    geeraff-testing done → review, run tests locally     │
│    ci-elephant-sim done → review diff, approve          │
│                                                         │
│ 6. DISPATCH WAVE 2                                      │
│    Now that fan-outs are done:                          │
│      - shared-eslint-config  (chain step 1)             │
│      - nav-spider-sim        (template replication)     │
│    These were lower priority or had soft dependencies   │
│                                                         │
│ 7. CLOSE OUT                                            │
│    Update all todo statuses to done/blocked             │
│    Note any agents that need re-dispatch                │
│    Log blockers for next session                        │
└─────────────────────────────────────────────────────────┘
```

### Session Time Budget

| Activity | % of session |
|---|---|
| Assess & plan | 10% |
| Write prompts & dispatch | 20% |
| Review agent output | 40% |
| Iterate on failures | 20% |
| Update boards & notes | 10% |

The review step is the bottleneck. Invest in better prompts to reduce iteration cycles.

---

## Decision Matrix

| Situation | Pattern | Why |
|---|---|---|
| Same task, many repos | **Template Replication** | Consistency across repos + parallel execution |
| Many tasks, one repo | **Batch-Per-Repo** | Agent reads codebase once, amortizes context cost |
| Independent tasks, many repos | **Parallel Fan-Out** | Maximum throughput, no coordination needed |
| Task B needs output of Task A | **Sequential Chain** | Correctness — B can't start until A is verified |
| Complex epic with dependency graph | **Epic Waterfall** | Structured waves, parallel within each tier |
| Unfamiliar codebase | **Explore → Implement** | Cheap recon prevents expensive wasted implementations |
| Urgent single fix | **Direct dispatch** | Skip the fleet overhead, just prompt one agent |
| Flaky or complex integration | **Sequential Chain** | Each step verified before proceeding |

### Choosing the Right Concurrency Level

```
1 agent   — debugging, complex refactors, unfamiliar codebases
3 agents  — normal session, manageable review load
5 agents  — well-defined tasks with clear acceptance criteria
7+ agents — template replication only (identical tasks, trivial review)
```

---

## Key Takeaways

1. **Agents are stateless.** Every prompt must be self-contained. Include paths, context, constraints, and verification steps.
2. **Decompose before dispatching.** The quality of your issue breakdown determines the quality of agent output.
3. **Match the pattern to the work.** Fan-out for independent tasks, chains for dependencies, batches for shared context.
4. **Review is the bottleneck.** Better prompts → fewer iterations → more throughput.
5. **Start small.** Begin with 2–3 parallel agents. Scale up as you calibrate prompt quality and review capacity.

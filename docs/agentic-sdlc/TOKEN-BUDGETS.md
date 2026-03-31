# Token Budgets: Managing Context Windows for AI Coding Agents

When you dispatch an AI agent to work on a GitHub issue, the agent operates within a **finite context window** — typically 100K–200K tokens. Every file it reads, every line of reasoning it produces, and every line of code it generates consumes tokens from that fixed budget. If the budget overflows, the agent degrades: it forgets constraints, hallucinates interfaces, or silently drops requirements.

This guide covers how to estimate, plan, and optimize token budgets so that agents consistently produce high-quality output across all 14 repos.

---

## Table of Contents

1. [Why Token Budgets Matter](#why-token-budgets-matter)
2. [The Token Budget Model](#the-token-budget-model)
3. [Scoping Techniques](#scoping-techniques)
4. [Estimating Token Cost for an Issue](#estimating-token-cost-for-an-issue)
5. [Repo-Specific Context Budgets](#repo-specific-context-budgets)
6. [Multi-File Output Budgets](#multi-file-output-budgets)
7. [Token-Efficient Prompting](#token-efficient-prompting)
8. [When to Use Explore vs Implement Agents](#when-to-use-explore-vs-implement-agents)

---

## Why Token Budgets Matter

### The Finite Window

AI coding agents don't have unlimited memory. They operate within a **context window** that must contain everything at once:

- **Input tokens** — the system prompt, your issue prompt, every file the agent reads, and the conversation history
- **Output tokens** — the code it generates, its explanations, and any tool calls it makes

When input fills the window, there's no room left for quality output. When both together exceed the limit, the agent either truncates or fails outright.

### Quality Degrades Before the Window Is Full

You don't need to hit the hard limit for problems to appear. Research on large language models documents the **"lost in the middle" phenomenon**: information placed in the middle of a long context is recalled less reliably than information at the beginning or end. In practice this means:

- At **~50% capacity**: the agent handles the task well, reasoning is sharp
- At **~70% capacity**: minor details start getting dropped — edge cases missed, constraints forgotten
- At **~90% capacity**: the agent may ignore entire sections of context — type signatures, validation rules, test patterns
- At **100%**: hard failure or severely degraded output

### Overstuffed Context → Bugs

When an agent is overwhelmed with context, it doesn't politely tell you it can't handle it. Instead, it **silently ignores constraints**:

- It reads your type definitions but generates code that doesn't match them
- It reads your test patterns but writes tests in a completely different style
- It reads your config files but hardcodes values instead of using them

These are the worst kind of failures because the code _looks_ correct at a glance.

### Token Budget Is the Primary Constraint

When scoping issues for agent work, forget calendar time. An agent can produce 500 lines of correct code in 3 minutes — or 500 lines of buggy code in 3 minutes. The difference is whether the context window was properly budgeted. **Token budget determines quality, not time.**

### Agent Limits Vary

| Agent | Approximate Context Window |
|---|---|
| GitHub Copilot CLI (Sonnet) | ~200K tokens |
| Claude (API, Sonnet/Opus) | ~200K tokens |
| GPT-4.1 / GPT-5 series | ~128K–200K tokens |
| Claude Haiku (explore) | ~200K tokens (but use less — it's cheaper per token) |

These numbers are the _hard ceiling_. Your effective budget is lower because you need room for reasoning and output.

---

## The Token Budget Model

Every agent session consumes tokens across five categories. Understanding the breakdown helps you plan issues that fit within budget.

### Budget Breakdown

```
Total Budget = System Prompt
             + Issue Prompt
             + Codebase Context (files read)
             + Agent Reasoning (chain-of-thought, tool calls)
             + Generated Output (code, explanations)
```

### Approximate Token Costs

| Category | Typical Range | Notes |
|---|---|---|
| System prompt | 2–5K tokens | Fixed overhead; includes tool definitions, CLAUDE.md, role instructions |
| Issue body / prompt | 500–2K tokens | Your issue title, body, labels, and any injected context |
| Per file read (small) | 50–500 tokens | Config files, small utilities, type definitions |
| Per file read (large) | 2–10K tokens | Full source files, test suites, components |
| Agent reasoning | 5–20K tokens | Chain-of-thought, tool call planning, error recovery |
| Generated output per file | 500–5K tokens | Per file the agent creates or modifies |

### The 60/20/20 Rule

As a rule of thumb, budget your total token allocation as:

```
┌─────────────────────────────────────────────┐
│  60% Context    │  20% Reasoning  │ 20% Output │
│  (files read +  │  (chain-of-     │ (generated  │
│   prompts)      │   thought)      │  code)      │
└─────────────────────────────────────────────┘
```

For a 200K-token agent, that means:
- **~120K tokens** for reading files and prompts
- **~40K tokens** for the agent's internal reasoning
- **~40K tokens** for generated output

If your context alone approaches 120K, the agent is already at risk.

### Budget Ceiling Per Size Label

The `size/*` labels map directly to token budget tiers:

| Label | Files in Context | Total Token Budget | Notes |
|---|---|---|---|
| `size/XS` | < 5 files | < 15K tokens | Typo fix, config tweak, single-function change |
| `size/S` | 3–8 files | < 30K tokens | Add a test, implement a small feature, fix a bug |
| `size/M` | 8–15 files | < 60K tokens | New component with tests, refactor a module |
| `size/L` | 15–25 files | < 100K tokens | Cross-cutting change — pushing the limits |
| `size/XL` | > 25 files | > 100K tokens | **MUST decompose into sub-issues** |

> **If you're labeling something `size/XL`, stop.** That's not one issue — it's a tracking issue with sub-issues.

---

## Scoping Techniques

### Explicit File Enumeration

The single most effective technique for controlling token budget is **listing every file the agent needs to touch or read**, directly in the issue body. This prevents the agent from wandering the codebase, opening files out of curiosity, and burning tokens on irrelevant code.

#### Template

```markdown
**Files to Modify:**
- path/to/file.ts (what to change)
- path/to/other-file.ts (create — new file)

**Files for Context (read-only):**
- path/to/types.ts (type definitions used by the modified files)
- path/to/config.ts (configuration the code depends on)
- path/to/similar-example.ts (reference implementation to follow)
```

#### Example: geeraff Physics Tests

```markdown
**Files to Modify:**
- frontend/src/simulation/__tests__/physics.test.ts (create)

**Files for Context:**
- frontend/src/simulation/physics.ts (the code under test)
- frontend/src/simulation/types.ts (type definitions)
- frontend/vitest.config.ts (test configuration)
```

**Token estimate:** 3 context files (~1500 lines total × 4 tokens/line ≈ 6K) + prompt (~1K) + reasoning (~8K) + output (~4K) = **~19K tokens → `size/S`**

#### Example: minclo API Route

```markdown
**Files to Modify:**
- src/routes/players.ts (add new endpoint)
- src/routes/__tests__/players.test.ts (add tests for new endpoint)

**Files for Context:**
- src/routes/teams.ts (reference implementation — follow this pattern)
- src/db/schema.ts (database schema)
- src/middleware/auth.ts (auth middleware the route uses)
```

### Interface-Boundary Scoping

Scope every issue to work within **a single interface boundary**. An interface boundary is the set of files that share types, imports, or direct function calls.

| Scope | Quality |
|---|---|
| ✅ "Add tests for the physics simulation module" | One module, one boundary |
| ✅ "Add a new API endpoint for player stats" | One route + its handler + its tests |
| ✅ "Refactor the slider component to use a custom hook" | One component boundary |
| ❌ "Add tests for the whole app" | Crosses every boundary in the repo |
| ❌ "Refactor all API endpoints to use the new middleware" | Every route, every handler |
| ❌ "Update the frontend and backend to support the new feature" | Two service boundaries |

When you cross a boundary, the agent needs the types and interfaces from _both_ sides, and the context cost roughly doubles.

### Copy-Paste Context Injection

When the agent only needs a function signature or a type definition — not the whole file — paste it directly into the issue body. This saves the agent from reading a 300-line file to extract 10 lines.

#### Example: Injecting a Type Definition

Instead of:
```markdown
Read `frontend/src/simulation/types.ts` to understand the Giraffe interface.
```

Do this:
```markdown
The relevant type (from `frontend/src/simulation/types.ts`):

​```typescript
interface Giraffe {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  neckLength: number;
  isGrazing: boolean;
}
​```
```

**Token savings:** ~800 tokens (reading the full file) → ~80 tokens (inlined snippet). For 5 such snippets, that's ~3600 tokens saved — enough for an extra file of output.

### Exclude Patterns

Explicitly tell the agent what to avoid. Agents are curious — they'll explore directory trees if you don't set boundaries.

```markdown
**Exclusions:**
- Do not read or modify any files in `src/legacy/`
- Do not read any test fixtures in `__fixtures__/` — the test data is described below
- Ignore `node_modules/`, `dist/`, and `.next/` directories
- Do not modify the database schema (`src/db/schema.ts`)
```

This is especially important in polyglot repos like **greyzone** where the agent might wander from the React frontend into the Rust worker or the FastAPI backend, burning thousands of tokens on irrelevant code.

---

## Estimating Token Cost for an Issue

### Step-by-Step Process

#### 1. List All Files the Agent Needs to Read

Include files to modify (the agent reads before editing) and files for reference.

#### 2. Estimate Tokens Per File

Quick approximation:

```bash
wc -l path/to/file.ts
```

Then multiply by **~4 tokens per line**. This accounts for typical code density (keywords, variable names, operators, whitespace).

| File Type | Tokens/Line Multiplier |
|---|---|
| TypeScript/JavaScript | ×4 |
| Python | ×3.5 |
| Rust | ×4.5 |
| JSON/YAML config | ×3 |
| Markdown | ×3 |
| CSS/SCSS | ×3 |

#### 3. Sum It Up

```
Total ≈ Σ(file_lines × 4)   # context files
      + 1500                  # prompt + system overhead
      + 10000                 # reasoning overhead
      + (output_files × 2000) # generated code estimate
```

#### 4. Apply the Decision Rule

| Estimated Total | Action |
|---|---|
| < 30K tokens | ✅ Ship it as one issue |
| 30K–60K tokens | ✅ Proceed, but enumerate files carefully |
| 60K–100K tokens | ⚠️ Consider decomposing — the agent is working hard |
| > 100K tokens | 🛑 **Decompose into sub-issues** |

### Quick Heuristic: Line Count

If you don't want to do math, count total lines across all context files:

| Total Lines (all context files) | Size Label | Action |
|---|---|---|
| < 200 lines | `size/XS` | Ship it |
| 200–600 lines | `size/S` | Ship it |
| 600–1500 lines | `size/M` | Ship it, enumerate files |
| 1500–4000 lines | `size/L` | Enumerate files, consider splitting |
| > 4000 lines | `size/XL` | **Must decompose** |

### Worked Example: Adding Auth to a greyzone API Endpoint

```
Files to read:
  api/src/routes/auth.py          (~120 lines × 3.5 = 420 tokens)
  api/src/middleware/jwt.py        (~80 lines × 3.5  = 280 tokens)
  api/src/models/user.py           (~60 lines × 3.5  = 210 tokens)
  api/src/routes/projects.py       (~200 lines × 3.5 = 700 tokens)
  api/tests/test_auth.py           (~150 lines × 3.5 = 525 tokens)

Context subtotal:                                     2,135 tokens
System prompt + issue:                                3,000 tokens
Reasoning overhead:                                  10,000 tokens
Output (2 files × ~2000):                             4,000 tokens
                                                    ─────────────
Total estimate:                                     ~19,135 tokens → size/S ✅
```

---

## Repo-Specific Context Budgets

Not all repos are equal. A `size/M` issue in a small animal sim is trivially different from a `size/M` issue in greyzone. Profile your repos by total source size to know what's feasible.

### Small Repos (< 2000 source lines)

| Repo | Typical Source Lines | Comfortable Issue Size | Notes |
|---|---|---|---|
| ant-size-simulator | ~800–1200 | `size/S` | Agent can nearly read the whole repo |
| eagle-size-simulator | ~800–1200 | `size/S` | Same — small simulation codebase |
| elephant-size-simulator | ~800–1200 | `size/S` | Same pattern |
| spider-size-simulator | ~800–1200 | `size/S` | Same pattern |

For these repos, the agent can often read every relevant file without budget pressure. Most issues should be `size/XS` or `size/S`. If you're labeling a sim issue `size/M` or above, you're probably over-scoping.

### Medium Repos (2000–8000 source lines)

| Repo | Typical Source Lines | Comfortable Issue Size | Notes |
|---|---|---|---|
| geeraff | ~5000 | up to `size/M` | Physics simulation + React frontend; scope to one layer |
| minclo | ~4000–6000 | up to `size/M` | Well-structured; modules are self-contained |
| bolsard | ~3000–5000 | up to `size/M` | Client + server; **scope per side** |
| fam-arch | ~4000–6000 | up to `size/M` | Multiple apps; **scope to frontend OR backend per issue** |
| PulseQuiz | ~3000–5000 | up to `size/M` | Quiz app; scope to one feature area |

For medium repos, **always enumerate files**. The agent can't read the whole repo, so you must tell it exactly what to look at.

#### fam-arch Example (scoped correctly)

```markdown
# ✅ Good: Scoped to frontend only
**Files to Modify:**
- frontend/src/components/FamilyTree.tsx

**Files for Context:**
- frontend/src/types/family.ts
- frontend/src/hooks/useFamilyData.ts
```

```markdown
# ❌ Bad: Crosses frontend/backend boundary
**Files to Modify:**
- frontend/src/components/FamilyTree.tsx
- backend/src/routes/family.py
- backend/src/models/family.py
```

### Large / Polyglot Repos

| Repo | Typical Source Lines | Comfortable Issue Size | Notes |
|---|---|---|---|
| greyzone | ~10,000+ | `size/S` to `size/M` | React + FastAPI + Rust + Node — **scope to ONE service** |

**greyzone is the highest-risk repo for token budget overruns.** It has four distinct technology stacks. An agent dispatched to "add a feature" without explicit scoping will try to read across all of them.

#### greyzone Scoping Rules

1. **One service per issue** — frontend OR api OR worker OR gateway
2. **Always use explicit file enumeration** — never let the agent explore
3. **Paste cross-service interfaces** into the issue body instead of having the agent read them
4. **Never label a greyzone issue above `size/M`** unless you've exhaustively enumerated files

```markdown
# ✅ Good: Scoped to the API service
Scope: `api/` directory only. Do not read frontend/, worker/, or gateway/ code.

**Files to Modify:**
- api/src/routes/projects.py (add DELETE endpoint)
- api/tests/test_projects.py (add delete tests)

**Files for Context:**
- api/src/routes/teams.py (reference implementation for DELETE pattern)
- api/src/db/models.py (Project model definition)
```

---

## Multi-File Output Budgets

### Output Quality Degrades with Volume

Agent output quality follows a curve:

- **1–3 files modified**: High quality — the agent maintains coherent context
- **4–5 files modified**: Acceptable — minor inconsistencies may appear
- **6–8 files modified**: Risky — later files may contradict earlier ones
- **> 8 files modified**: Unreliable — the agent is generating on autopilot

The rough ceiling is **~3000 lines of generated code** in a single session. Past that, the agent's output becomes increasingly pattern-repetitive and less responsive to specific requirements.

### File Count Guidelines

| Created Files | Modified Files | Verdict |
|---|---|---|
| 0–2 | 1–3 | ✅ Ideal sweet spot |
| 2–4 | 1–3 | ✅ Fine if files are small |
| 0–2 | 4–6 | ⚠️ Enumerate files carefully |
| > 5 created | any | 🛑 Split the issue |
| any | > 6 | 🛑 Split the issue |

### The Test Exception

Test files are the one exception. A single test file can be 500+ lines and still be high quality because:

- Tests follow repetitive patterns (describe/it/expect)
- Each test case is independent — a mistake in one doesn't cascade
- The agent can lean on the pattern from earlier tests

So "create a comprehensive test suite for physics.ts" (1 large test file) is fine. "Create test suites for all 8 simulation modules" (8 test files) is not.

### Splitting Strategy

When an issue exceeds file count limits, split by **dependency order**:

```markdown
# Issue 1: Create the data model and types
- Create src/models/player.ts
- Create src/types/player.ts
- size/XS

# Issue 2: Create the API route (depends on #1)
- Create src/routes/players.ts
- Modify src/routes/index.ts (register the new route)
- size/S

# Issue 3: Create tests (depends on #2)
- Create src/routes/__tests__/players.test.ts
- Create src/models/__tests__/player.test.ts
- size/S
```

Each issue fits comfortably in the token budget and produces focused, high-quality output.

---

## Token-Efficient Prompting

### Don't Repeat What's Already in the Code

If a file has JSDoc comments or docstrings that explain its behavior, don't restate that in the issue. The agent will read the file.

```markdown
# ❌ Wasteful
The physics.ts module exports a `simulate()` function that takes a Giraffe object
and a deltaTime number and returns a new Giraffe with updated position and velocity
based on the gravity constant and neck-length-based drag coefficient...

# ✅ Efficient
The agent should test `physics.ts` — specifically the `simulate()` function.
Edge cases to cover: zero velocity, maximum neck length, negative deltaTime.
```

### Use References, Not Pastes

When the agent needs to follow an existing pattern, point to it rather than pasting it — unless the reference file is very large (in which case, paste just the relevant section).

```markdown
# ✅ Efficient (for small reference files)
Follow the pattern in `src/components/SliderControl.tsx` for the new component.

# ✅ Efficient (for large reference files — paste only the relevant part)
Follow this pattern for the new hook (from `src/hooks/useSimulation.ts`, lines 1-25):
​```typescript
export function useSimulation(config: SimConfig) {
  const [state, dispatch] = useReducer(simReducer, initialState);
  // ... hook pattern continues
}
​```

# ❌ Wasteful
Here's the entire SliderControl.tsx (300 lines) for reference:
[... entire file ...]
```

### Use Structured Formats

Bullet lists and tables pack more information per token than prose.

```markdown
# ❌ Prose (78 tokens)
The new endpoint should accept POST requests at /api/players. It should validate
that the request body contains a name field that is a non-empty string and an
optional rating field that is a number between 0 and 3000. If validation fails,
return a 400 status code with an error message. On success, return 201.

# ✅ Structured (52 tokens)
POST /api/players
- Body: `{ name: string (required, non-empty), rating?: number (0-3000) }`
- 400 on validation failure (return error message)
- 201 on success
```

### Include Build/Test Commands

The agent can self-verify if you tell it how. This is a tiny token investment (~20 tokens) that prevents entire rounds of debugging.

```markdown
**Verification:**
- Run: `cd frontend && npx vitest run src/simulation/__tests__/physics.test.ts`
- Expected: all tests pass
- Run: `cd frontend && npx tsc --noEmit`
- Expected: no type errors
```

---

## When to Use Explore vs Implement Agents

### Two-Phase Pattern

Not all tokens cost the same. Explore agents (Haiku model) are cheap and fast. Implement agents (Sonnet/Opus model) are expensive and thorough. The optimal strategy is to **spend cheap tokens to save expensive ones**.

### Agent Comparison

| | Explore Agent | Implement Agent |
|---|---|---|
| **Model** | Haiku (fast, cheap) | Sonnet / Opus (thorough, expensive) |
| **Good at** | Finding files, answering questions, summarizing code | Writing code, making changes, running tests |
| **Token cost** | Low | High |
| **Use when** | You need to understand the codebase before acting | You know exactly what to change |
| **Parallelizable** | ✅ Yes — launch many in parallel | ❌ No — side effects (file writes) |

### The Explore → Implement Pipeline

#### Step 1: Explore (cheap tokens)

Before writing a precisely-scoped issue, use explore agents to answer scoping questions:

```
Explore: "What files does the greyzone API use for authentication?
          List file paths, line counts, and the key exports from each."
```

The explore agent returns:
```
- api/src/middleware/jwt.py (82 lines) — exports: verify_token, require_auth
- api/src/models/user.py (64 lines) — exports: User, UserCreate, UserRole
- api/src/routes/auth.py (118 lines) — exports: router (login, logout, refresh)
```

#### Step 2: Scope the Issue (using explore results)

Now you can write a precisely-scoped issue with exact file paths and line counts, confident that the token budget fits within `size/S`.

#### Step 3: Implement (expensive tokens, but precisely targeted)

The implement agent reads only the files you listed and produces focused output. No tokens wasted on exploration.

### When Explore Saves the Most Tokens

| Scenario | Token Savings |
|---|---|
| Unknown repo structure | High — prevents the implement agent from wandering |
| Polyglot repos (greyzone) | Very high — identifies the right service before implement touches anything |
| Cross-cutting questions ("what depends on X?") | High — explore traces the dependency graph cheaply |
| "Where is this pattern used?" | Medium — explore finds examples the implement agent can reference |

### When to Skip Explore

- You already know the repo well and can enumerate files from memory
- The issue is `size/XS` — the implement agent will find what it needs in seconds
- The repo is small enough that the implement agent can read everything (animal sims)

### Parallel Explore

You can launch multiple explore agents simultaneously since they're read-only:

```
Explore 1: "What test patterns does geeraff use? Show the test config and one example test file."
Explore 2: "What types does geeraff's physics module export? List all interfaces."
Explore 3: "Does geeraff have any existing test utilities or fixtures?"
```

All three return in seconds. Combined, their answers give you everything needed to write a `size/S` test issue with zero wasted implement tokens.

---

## Quick Reference Card

### Before Writing an Issue

1. **List the files** the agent needs to read and modify
2. **Estimate tokens**: `total_lines × 4`, add 15K for overhead
3. **Check the budget**: < 60K → proceed; > 60K → decompose
4. **Assign a size label**: use the line-count heuristic table
5. **Add file enumeration** to the issue body
6. **Add exclusions** if the repo is large or polyglot
7. **Add verification commands** so the agent can self-check

### Red Flags That an Issue Is Over-Budget

- 🚩 No files listed in the issue body (agent will explore freely)
- 🚩 Issue mentions multiple services or apps
- 🚩 Issue asks for changes across frontend and backend
- 🚩 More than 5 files to create
- 🚩 More than 25 files in context
- 🚩 The phrase "refactor everything" or "add tests for all"
- 🚩 Label is `size/XL` (should be a tracking issue, not an agent task)

### Token Budget Cheat Sheet

```
200K total window
 - 5K  system prompt (fixed)
 - 2K  issue prompt
 - ?K  codebase context  ← this is the variable you control
 - 20K reasoning
 - 10K output
─────────────────
163K available for codebase context (theoretical max)
 ~80K practical max (leave headroom for quality)
```

**80K tokens of context ≈ 20,000 lines of code ≈ the upper bound of what an agent can work with effectively.**

Most good issues use far less — 2,000 to 8,000 lines of context, leaving plenty of room for high-quality reasoning and output.

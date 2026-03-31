# Skill: Issue Triage

## Description

Analyze a new GitHub issue and apply appropriate labels, size estimate, phase assignment, and project board placement. Triage transforms a raw issue into an agent-ready work item with all the metadata needed for dispatch.

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `issue_number` | yes | The issue number |
| `repo` | yes | Repository name (under `idealase/` org) |

## Steps

### 1. Read the issue

```bash
gh issue view {issue_number} -R idealase/{repo} --json title,body,labels
```

Parse the title and body to understand:
- What is being requested?
- Which files/areas are affected?
- Is this a bug, feature, refactor, or chore?
- How complex is it?

### 2. Assign type label

| Signal in Issue | Label |
|----------------|-------|
| "bug", "broken", "error", "crash", "regression" | `type/bug` |
| "add", "new", "implement", "create", "feature" | `type/feature` |
| "refactor", "clean up", "restructure", "extract" | `type/refactor` |
| "update docs", "README", "comments", "JSDoc" | `type/docs` |
| "CI", "workflow", "deploy", "pipeline", "action" | `type/chore` |
| "test", "coverage", "spec", "assertion" | `type/test` |
| "performance", "slow", "optimize", "cache" | `type/perf` |

```bash
gh issue edit {issue_number} -R idealase/{repo} --add-label "type/{type}"
```

### 3. Assign area label

| Signal in Issue | Label |
|----------------|-------|
| Components, UI, CSS, layout, responsive | `area/frontend` |
| API, database, auth, server, endpoint | `area/backend` |
| GitHub Actions, CI, deployment, runner | `area/ci-cd` |
| Tokens, theme, shared styles, typography | `area/design-system` |
| Monitoring, alerts, metrics, health check | `area/monitoring` |
| Copilot, agent, prompt, skill, automation | `area/agent-dx` |
| Build, lint, format, deps, config | `area/tooling` |

```bash
gh issue edit {issue_number} -R idealase/{repo} --add-label "area/{area}"
```

### 4. Estimate size from scope

Assess the number of files that need to change:

| File Count | Complexity | Label | Typical Time |
|------------|-----------|-------|-------------|
| 1 file | Trivial (typo, config) | `size/XS` | < 30 min |
| 1–3 files | Low (single feature) | `size/S` | ~1 hour |
| 3–8 files | Moderate (component + tests) | `size/M` | ~half day |
| 8+ files | High (cross-cutting) | `size/L` | ~full day |
| Multi-concern | Very high (needs decomposition) | `size/XL` | Multi-day |

```bash
gh issue edit {issue_number} -R idealase/{repo} --add-label "size/{size}"
```

**Token budget cross-reference** (from [TOKEN-BUDGETS.md](../../../TOKEN-BUDGETS.md)):
- `size/XS–S`: Safe for any repo
- `size/M`: Safe for small repos, needs file enumeration for medium+ repos
- `size/L`: Needs careful scoping, explicit file lists
- `size/XL`: **Must decompose** — do not dispatch as-is

### 5. Assign priority

| Criteria | Priority |
|----------|----------|
| Site is down, data loss, security vulnerability | `P0` (critical) |
| Blocks other work, user-facing bug, broken CI | `P1` (high) |
| Important feature, moderate bug, tech debt | `P2` (medium) |
| Nice-to-have, cosmetic, low-impact improvement | `P3` (low) |

```bash
gh issue edit {issue_number} -R idealase/{repo} --add-label "P{n}"
```

### 6. Assign phase label

Map the issue to the current development phase:

| Phase | Description | When to use |
|-------|-------------|-------------|
| `phase/foundation` | Core setup, project structure, base config | New repos, initial setup |
| `phase/ci-cd` | CI/CD pipelines, deployment automation | GitHub Actions, runners |
| `phase/design-system` | Shared tokens, components, theming | Cross-repo UI consistency |
| `phase/consolidation` | Dedup, refactor, standardize patterns | After features stabilize |
| `phase/monitoring` | Health checks, metrics, alerting | Production readiness |
| `phase/agent-dx` | Copilot instructions, skills, prompts | Meta-tooling for agents |

```bash
gh issue edit {issue_number} -R idealase/{repo} --add-label "phase/{phase}"
```

### 7. Add to GitHub Project

Determine which project the issue belongs to:

- **Project 1: DevSecOps 4 Vibe Coding** — CI/CD, security, infrastructure, monitoring, agent-dx
- **Project 2: sandford.systems Web Platform** — Features, UX, frontend, backend, design-system

```bash
gh project item-add {project_number} --owner idealase --url https://github.com/idealase/{repo}/issues/{issue_number}
```

### 8. Handle size/XL — Decomposition

If the issue is `size/XL`, it needs to be broken into smaller sub-issues:

```bash
# Add decomposition label
gh issue edit {issue_number} -R idealase/{repo} --add-label "needs-decomposition"

# Comment with decomposition suggestion
gh issue comment {issue_number} -R idealase/{repo} --body "## Decomposition Needed

This issue is size/XL and should be split into smaller, agent-dispatchable pieces.

**Suggested sub-issues:**
1. {sub_issue_1} (size/S–M)
2. {sub_issue_2} (size/S–M)
3. {sub_issue_3} (size/S–M)

Each sub-issue should:
- Touch ≤8 files
- Have a clear acceptance criteria
- Be independently testable
- List specific files to modify

/cc @idealase"
```

### 9. Mark as agent-ready (if applicable)

If the issue is `size/XS–M` and has enough detail for an agent to execute:

```bash
gh issue edit {issue_number} -R idealase/{repo} --add-label "agent-ready"
```

An issue is **agent-ready** when it has:
- [ ] Clear acceptance criteria (what "done" looks like)
- [ ] Specific files to modify or create (or enough context to determine them)
- [ ] No ambiguous decisions left (architecture choices resolved)
- [ ] No external dependencies or blockers
- [ ] Size label of XS, S, or M

If any of these are missing, add a comment requesting the missing information instead of the `agent-ready` label.

## Complete Label Taxonomy

### Priority
| Label | Color | Description |
|-------|-------|-------------|
| `P0` | `#d73a4a` (red) | Critical — drop everything |
| `P1` | `#e99695` (light red) | High — address this sprint |
| `P2` | `#fbca04` (yellow) | Medium — plan for soon |
| `P3` | `#0e8a16` (green) | Low — backlog |

### Type
| Label | Color | Description |
|-------|-------|-------------|
| `type/bug` | `#d73a4a` | Something is broken |
| `type/feature` | `#0075ca` | New capability |
| `type/refactor` | `#cfd3d7` | Code improvement, no behavior change |
| `type/docs` | `#0075ca` | Documentation only |
| `type/chore` | `#cfd3d7` | Maintenance, deps, config |
| `type/test` | `#bfdadc` | Adding or fixing tests |
| `type/perf` | `#fbca04` | Performance improvement |

### Size
| Label | Color | Description |
|-------|-------|-------------|
| `size/XS` | `#c5def5` | Trivial — < 30 min |
| `size/S` | `#bfdadc` | Small — ~1 hour |
| `size/M` | `#fbca04` | Medium — half day |
| `size/L` | `#e99695` | Large — full day |
| `size/XL` | `#d73a4a` | Extra large — must decompose |

### Phase
| Label | Color | Description |
|-------|-------|-------------|
| `phase/foundation` | `#1d76db` | Core setup and structure |
| `phase/ci-cd` | `#5319e7` | CI/CD and deployment |
| `phase/design-system` | `#0e8a16` | Shared design tokens and components |
| `phase/consolidation` | `#fbca04` | Dedup and standardize |
| `phase/monitoring` | `#d93f0b` | Health checks and metrics |
| `phase/agent-dx` | `#bfd4f2` | Agent tooling and prompts |

### Area
| Label | Color | Description |
|-------|-------|-------------|
| `area/frontend` | `#0075ca` | UI, components, styling |
| `area/backend` | `#5319e7` | API, server, database |
| `area/ci-cd` | `#e4e669` | Pipelines and deployment |
| `area/design-system` | `#0e8a16` | Tokens, themes, shared UI |
| `area/monitoring` | `#d93f0b` | Metrics, alerts, health |
| `area/agent-dx` | `#bfd4f2` | Copilot/agent tooling |
| `area/tooling` | `#cfd3d7` | Build, lint, format |

### Workflow
| Label | Color | Description |
|-------|-------|-------------|
| `agent-ready` | `#0e8a16` | Fully specified, ready for dispatch |
| `needs-decomposition` | `#d73a4a` | Too large, needs sub-issues |
| `needs-info` | `#fbca04` | Missing details for triage |
| `blocked` | `#d73a4a` | Cannot proceed — dependency |
| `in-progress` | `#1d76db` | Agent or human actively working |
| `review-needed` | `#e99695` | PR ready for review |

## Example Triage

**Issue:** `geeraff#42 — Add dark mode toggle to header`

```bash
# Type: new feature
gh issue edit 42 -R idealase/geeraff --add-label "type/feature"

# Area: frontend UI
gh issue edit 42 -R idealase/geeraff --add-label "area/frontend"

# Size: 3-5 files (toggle component, theme context, CSS vars, header update)
gh issue edit 42 -R idealase/geeraff --add-label "size/S"

# Priority: nice-to-have
gh issue edit 42 -R idealase/geeraff --add-label "P3"

# Phase: design system work
gh issue edit 42 -R idealase/geeraff --add-label "phase/design-system"

# Add to web platform project
gh project item-add 2 --owner idealase --url https://github.com/idealase/geeraff/issues/42

# Well-specified, small scope — agent can handle this
gh issue edit 42 -R idealase/geeraff --add-label "agent-ready"
```

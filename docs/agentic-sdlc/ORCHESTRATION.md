# Agentic SDLC Orchestration Playbook

> The master playbook for orchestrating agentic software development across the sandford.systems portfolio — 14 repos, 2 GitHub Projects, ~156 open issues, one human orchestrator.

---

## Table of Contents

1. [The Agentic SDLC Lifecycle](#1-the-agentic-sdlc-lifecycle)
2. [Planning a Sprint](#2-planning-a-sprint)
3. [Dispatch Patterns](#3-dispatch-patterns)
4. [Coordination Across Repos](#4-coordination-across-repos)
5. [Session Management](#5-session-management)
6. [Failure Recovery](#6-failure-recovery)
7. [Scaling Considerations](#7-scaling-considerations)

---

## 1. The Agentic SDLC Lifecycle

### How This Differs from Traditional Development

In traditional development, the human is the **doer** — you read the spec, write the code, run the tests, open the PR. In agentic development, the human becomes the **orchestrator** — you write precise specs, dispatch agents, review output, and steer the fleet.

The code still gets written. You just stop being the bottleneck.

### The Lifecycle

```
Issue Triage → Decomposition → Agent Dispatch → Review → Merge → Deploy
     ↑                                                        |
     └────────── feedback loop (update specs, re-dispatch) ───┘
```

**Issue Triage**: Incoming work lands in GitHub Projects. You classify it — is this agent-ready, or does it need human design decisions first?

**Decomposition**: Large issues become epics with sub-issues. Each sub-issue is scoped to a single, well-defined change that an agent can complete in one session. The `agent-ready` label marks issues that are fully specified.

**Agent Dispatch**: You send the issue to an agent with the right context — file paths, acceptance criteria, related code. The agent produces a branch with commits.

**Review**: You review the diff like you would any PR. Does it meet the spec? Does it break anything? Does the approach make sense?

**Merge & Deploy**: Approved work merges to main. CI/CD handles the rest — self-hosted runners build, test, and deploy to sandford.systems via Cloudflare Tunnel.

### Inner Loop vs Outer Loop

**Inner loop** — one agent working on one issue in one repo:
- Agent reads the issue body and referenced files
- Agent makes changes, runs tests, commits
- You review the output

**Outer loop** — you coordinating a fleet across the portfolio:
- Which repos need work today?
- Which issues are unblocked?
- Which agents are working on what?
- What landed, and what does that unblock next?

The inner loop is the agent's job. The outer loop is yours.

---

## 2. Planning a Sprint

### Querying the Backlog

Start every session by understanding what's ready. The two GitHub Projects are your source of truth:

```bash
# List all open issues across the portfolio with the agent-ready label
gh search issues --owner idealase --label "agent-ready" --state open \
  --json repository,number,title,labels --limit 100

# Check a specific project board (DevSecOps 4 Vibe Coding)
gh project item-list 1 --owner idealase --format json \
  --limit 50 | jq '.items[] | select(.status == "Ready")'

# Filter by priority labels
gh search issues --owner idealase --label "P0" --state open \
  --json repository,number,title

gh search issues --owner idealase --label "P1" --state open \
  --json repository,number,title
```

### Prioritization Rules

Apply these in order:

1. **Dependencies unblocked** — If issue B depends on A, and A just landed, B jumps the queue. Momentum matters.
2. **P0/P1 first** — Critical bugs and high-priority features always win.
3. **Foundation before features** — Shared configs, CI/CD pipelines, and design tokens must exist before apps can consume them.
4. **Batch by repo** — If you're touching `geeraff` anyway, grab all the ready `geeraff` issues for that session.

### Phase Ordering

The `phase:*` labels encode a natural dependency order:

```
foundation → ci-cd → design-system → consolidation → monitoring → agent-dx
```

- **foundation**: Shared ESLint configs, TypeScript configs, Vite configs. These live in `idealase.github.io` or shared packages and must land first.
- **ci-cd**: GitHub Actions workflows, self-hosted runner configs, deployment scripts. Depends on foundation configs existing.
- **design-system**: Shared UI tokens, component library, typography/color scales. Depends on foundation tooling.
- **consolidation**: Merging duplicated code across the animal sims, unifying nav components. Depends on the design system.
- **monitoring**: Prometheus rules, Grafana dashboards, health checks. Can proceed in parallel with consolidation.
- **agent-dx**: Improving the issue templates, automation, and agent tooling. Meta-work that makes everything else faster.

### Sprint Sizing

**Recommended: 8–12 agent-ready issues per session**, grouped by repo.

Why this range:
- **Below 8**: You're under-utilizing your time. Context-switching overhead dominates.
- **Above 12**: Review fatigue sets in. Quality drops. You start rubber-stamping diffs.
- **Sweet spot**: 3–4 repos × 2–3 issues each.

Example sprint composition:

| Repo | Issues | Phase |
|------|--------|-------|
| `idealase.github.io` | 2 (shared CI workflows) | ci-cd |
| `geeraff` | 3 (navbar, SEO meta, footer) | consolidation |
| `greyzone` | 2 (auth hardening, rate limiting) | foundation |
| `minclo` | 3 (D3 chart fixes, responsive layout) | design-system |

---

## 3. Dispatch Patterns

### Pattern 1: Parallel Fan-Out

**When**: You have independent issues across different repos with no shared dependencies.

Dispatch all at once. Don't wait for one to finish before starting the next.

```
┌─ Agent A → geeraff #42 (add Open Graph meta tags)
├─ Agent B → greyzone #18 (fix CORS headers)
├─ Agent C → minclo #7 (responsive breakpoints)
└─ Agent D → pulsequiz #31 (add score persistence)
```

**Example**: You've got a batch of P1 UI bugs across different apps. None of them touch shared code. Fan out.

```bash
# Verify issues are truly independent (no shared file paths in the specs)
gh issue view 42 -R idealase/geeraff --json body | jq -r '.body' | head -20
gh issue view 18 -R idealase/greyzone --json body | jq -r '.body' | head -20
```

Then dispatch each to a separate agent session. Review as they complete.

### Pattern 2: Sequential Chain

**When**: Output of one issue feeds into the next. Common with shared infrastructure.

```
Agent A → idealase.github.io #15 (create shared ESLint config)
  ↓ (verify & merge)
Agent B → geeraff #43 (adopt shared ESLint config)
  ↓ (verify & merge)
Agent C → greyzone #19 (adopt shared ESLint config)
  ↓ (verify & merge)
Agent D → minclo #8 (adopt shared ESLint config)
```

**Critical**: Verify and merge each step before dispatching the next. If the shared config has issues, every downstream adoption will fail.

```bash
# After the shared config lands, verify it's published / accessible
cd ~/Desktop/Repos/idealase.github.io
git log --oneline -3

# Then dispatch adoption to the next repo
cd ~/Desktop/Repos/geeraff
# Dispatch agent with explicit context:
# "Adopt the shared ESLint config from idealase.github.io.
#  Reference: ../idealase.github.io/shared/eslint-config/
#  Replace the local .eslintrc with an extends clause."
```

### Pattern 3: Batch-Per-Repo

**When**: Multiple issues in the same repo share context (same codebase, same patterns, overlapping files).

Group them into one agent session. The agent builds up context once and reuses it.

```
Agent A (single session) → geeraff:
  ├─ #42 (Open Graph meta tags)
  ├─ #44 (footer component)
  └─ #45 (404 page)
```

**Why this is efficient**: The agent reads `geeraff`'s project structure, component conventions, and styling approach once. Applying it three times costs marginally more than once.

```bash
# Pull all agent-ready issues for a single repo
gh issue list -R idealase/geeraff --label "agent-ready" --state open \
  --json number,title,labels

# Dispatch as a batch:
# "Complete the following issues for the geeraff repo:
#  1. #42 — Add Open Graph meta tags to all pages (see issue for spec)
#  2. #44 — Extract footer into shared component (see issue for spec)
#  3. #45 — Create custom 404 page (see issue for spec)
#  Work on them in order. Commit each separately."
```

### Pattern 4: Epic Decomposition

**When**: A large feature is broken into an epic with sub-issues linked via GitHub's sub-issues feature.

Process sub-issues in dependency order. Verify each before moving to the next.

```bash
# List sub-issues of an epic
gh issue view 10 -R idealase/geeraff --json body \
  | jq -r '.body' | grep -E '^\s*-\s*\[' 

# Or use the GitHub API
gh api graphql -f query='
  query {
    repository(owner: "idealase", name: "geeraff") {
      issue(number: 10) {
        title
        trackedIssues(first: 20) {
          nodes { number title state }
        }
      }
    }
  }
'
```

Dispatch sub-issues in waves:
1. **Wave 1**: Issues with no dependencies (leaf nodes)
2. **Wave 2**: Issues whose dependencies were in Wave 1 (dispatch after Wave 1 merges)
3. **Wave 3**: Roll-up / integration issues

---

## 4. Coordination Across Repos

### Cross-Cutting Changes

The hardest part of multi-repo orchestration is changes that span boundaries. Here are the common patterns in this portfolio:

### Shared Workflows (idealase.github.io → all repos)

Reusable GitHub Actions workflows live in `idealase.github.io/.github/workflows/`. Repos reference them with `uses: idealase/idealase.github.io/.github/workflows/ci.yml@main`.

**Coordination rule**: The shared workflow must be merged to `main` in `idealase.github.io` **before** any repo can reference the new version.

```bash
# 1. Dispatch agent to create/update the shared workflow
#    in idealase.github.io

# 2. After merge, verify it's accessible
gh api repos/idealase/idealase.github.io/actions/workflows \
  --jq '.workflows[] | .name + " (" + .path + ")"'

# 3. Then dispatch agents to adopt it in downstream repos
for repo in geeraff greyzone minclo pulsequiz; do
  echo "=== $repo ==="
  gh issue list -R "idealase/$repo" --label "ci-cd" --state open \
    --json number,title -q '.[] | "#\(.number) \(.title)"'
done
```

### Design Tokens (design-system → all frontends)

If a shared design token package is published (CSS custom properties, Tailwind config, or a token JSON file), it must be available before apps can consume it.

```
idealase.github.io (tokens published)
  → geeraff (React/Vite frontend)
  → spider-size-simulator (D3 visualization)
  → greyzone (frontend)
  → minclo (frontend)
```

### Animal Sim Consolidation

The animal simulation repos (`spider-size-simulator`, `ant-farm-simulator`, etc.) share common patterns — navigation, layout, D3 setup. Consolidation follows this order:

```
1. Create shared nav component (in a shared location or package)
2. Integrate into spider-size-simulator (pilot repo)
3. Verify, then roll out to remaining sims
4. Remove duplicated nav code from each repo
```

### Tracking Cross-Repo Progress

Use the GitHub Projects board as the single source of truth:

```bash
# Update an item's status on the project board after merge
gh project item-edit --project-id <PROJECT_ID> --id <ITEM_ID> \
  --field-id <STATUS_FIELD_ID> --single-select-option-id <DONE_OPTION_ID>

# Practical approach: after merging a PR, close the issue —
# GitHub Projects auto-updates if configured
gh issue close 42 -R idealase/geeraff -c "Merged via PR #51. Verified in production."
```

When planning cross-repo work, sketch the dependency graph:

```
idealase.github.io#15 (shared ESLint)
  ├── geeraff#43 (adopt ESLint)
  ├── greyzone#19 (adopt ESLint)
  ├── minclo#8 (adopt ESLint)
  └── pulsequiz#22 (adopt ESLint)

idealase.github.io#20 (CI workflow)
  ├── geeraff#46 (adopt CI)
  └── greyzone#21 (adopt CI)
```

---

## 5. Session Management

### Starting a Session

Every session follows the same opening ritual:

```bash
# 1. Check what's in flight (open PRs waiting for review)
for repo in geeraff greyzone minclo pulsequiz spider-size-simulator \
  idealase.github.io bucket-flow-calculus dc-sim fam-arch bolsard \
  me-net hummingbot overstory; do
  prs=$(gh pr list -R "idealase/$repo" --state open --json number -q 'length')
  [ "$prs" -gt 0 ] && echo "$repo: $prs open PRs"
done

# 2. Review project boards for items marked "Ready" or "In Progress"
gh project item-list 1 --owner idealase --format json --limit 30 \
  | jq '.items[] | select(.status == "In Progress") | .title'

# 3. Identify what's unblocked (recently closed dependencies)
gh search issues --owner idealase --state closed \
  --sort updated --json repository,number,title --limit 10

# 4. Plan the session (pick 8-12 issues, group by repo)
gh search issues --owner idealase --label "agent-ready" --label "P0" \
  --state open --json repository,number,title
gh search issues --owner idealase --label "agent-ready" --label "P1" \
  --state open --json repository,number,title
```

### Working the Session

**Dispatch phase** (first 20%):
- Send out the first wave of parallel work
- Move issues to "In Progress" on the project board

**Monitor & review phase** (middle 60%):
- As agents complete, review their output immediately
- Run tests locally on the self-hosted runner machine:
  ```bash
  cd ~/Desktop/Repos/geeraff && npm test
  cd ~/Desktop/Repos/greyzone && cargo test
  ```
- Approve good work, merge, close issues
- Dispatch the next wave (items unblocked by what just merged)

**Wind-down phase** (final 20%):
- Stop dispatching new work
- Review and merge remaining completed work
- Update project board statuses
- Leave notes on any issues that were attempted but not completed

### Ending a Session

```bash
# 1. Check for uncommitted work
for repo in ~/Desktop/Repos/*/; do
  cd "$repo"
  if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    echo "$(basename $repo): has uncommitted changes"
  fi
done

# 2. Push any local branches
for repo in ~/Desktop/Repos/*/; do
  cd "$repo"
  branch=$(git branch --show-current 2>/dev/null)
  if [ "$branch" != "main" ] && [ -n "$branch" ]; then
    echo "$(basename $repo): on branch $branch"
  fi
done

# 3. Update project board (move completed items to Done)
# 4. Add comments to any in-progress issues with status notes
```

### When to Stop

- **Diminishing returns**: You've reviewed 8+ diffs and your attention is flagging. Stop. Bad reviews are worse than no reviews.
- **Context fatigue**: You can't keep straight which repo you're looking at. Stop.
- **Blocking dependencies**: Everything remaining depends on something that hasn't landed yet. Stop and let CI run.
- **Environment issues**: Self-hosted runner is overloaded, network is flaky, machine is slow. Stop; don't fight infrastructure.

---

## 6. Failure Recovery

### Diagnosis Framework

When an agent produces bad output, diagnose before re-dispatching:

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Agent changed the wrong files | Ambiguous issue spec | Rewrite the issue with explicit file paths |
| Code doesn't compile | Missing context about project setup | Add build commands and dependency info to issue |
| Tests fail | Agent didn't know about existing test patterns | Reference test files in the issue body |
| Wrong approach entirely | Issue spec described *what* but not *how* | Add implementation hints or reference similar code |
| Partial completion | Issue was too large | Decompose into smaller sub-issues |

### Recovery Steps

**Step 1: Assess the damage**
```bash
cd ~/Desktop/Repos/geeraff
git --no-pager diff main..agent-branch --stat
git --no-pager diff main..agent-branch -- src/  # inspect actual changes
```

**Step 2: Decide — salvage or rollback**

If the agent got 80% right:
- Check out the branch, make manual fixes, commit, merge
- Note what was wrong on the issue for future reference

If the agent got it fundamentally wrong:
```bash
# Clean rollback
git checkout main
git branch -D agent-branch

# Update the issue with learnings
gh issue comment 42 -R idealase/geeraff \
  -b "Agent attempt failed — approach was X but should have been Y.
  Updating spec with explicit guidance. Re-dispatching."

# Edit the issue body with better context
gh issue edit 42 -R idealase/geeraff \
  --body-file updated-spec.md
```

**Step 3: Re-dispatch or do it yourself**

Re-dispatch when:
- The issue spec was the problem (now fixed)
- The task is mechanical and well-defined
- You'd spend longer doing it manually than reviewing another attempt

Do it yourself when:
- The task requires nuanced design decisions
- Two agent attempts have failed on the same issue
- The fix is small enough that dispatching is overhead

### Preventing Repeat Failures

After every failure, ask: "What could I have put in the issue to prevent this?"

Common additions:
- Explicit file paths: `Modify src/components/Nav.tsx and src/styles/nav.css`
- Acceptance criteria: `The nav must render on mobile viewports < 768px`
- Anti-patterns: `Do NOT use inline styles. This project uses CSS modules.`
- Reference implementations: `Follow the pattern in src/components/Footer.tsx`

---

## 7. Scaling Considerations

### Automate Triage

Reduce the manual work of labeling and classifying issues:

```yaml
# .github/workflows/auto-label.yml (in each repo)
name: Auto Label Issues
on:
  issues:
    types: [opened]
jobs:
  label:
    runs-on: self-hosted
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const title = context.payload.issue.title.toLowerCase();
            const labels = [];
            if (title.includes('bug')) labels.push('type:bug');
            if (title.includes('ci') || title.includes('deploy')) labels.push('area:ci-cd');
            if (title.includes('a11y') || title.includes('accessibility')) labels.push('area:accessibility');
            if (labels.length > 0) {
              await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                labels: labels
              });
            }
```

### Dependency Automation

Let bots handle the mechanical chore of dependency updates:

```bash
# Check which repos have Dependabot configured
for repo in geeraff greyzone minclo pulsequiz spider-size-simulator; do
  echo -n "$repo: "
  gh api "repos/idealase/$repo/contents/.github/dependabot.yml" \
    --jq '.name' 2>/dev/null || echo "not configured"
done
```

For repos without it, add a standard `dependabot.yml`:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "size:XS"
      - "agent-ready"
```

This automatically creates PRs for dependency updates, pre-labeled as `agent-ready` and `size:XS` — the easiest possible issues to process.

### Backlog Grooming

Run a grooming pass monthly:

```bash
# Find stale issues (no updates in 60+ days)
gh search issues --owner idealase --state open \
  --sort updated --order asc \
  --json repository,number,title,updatedAt --limit 30

# Find issues with no labels (likely un-triaged)
gh search issues --owner idealase --state open --no-label \
  --json repository,number,title --limit 30

# Count open issues per repo for portfolio health
for repo in geeraff greyzone minclo pulsequiz spider-size-simulator \
  idealase.github.io bucket-flow-calculus dc-sim fam-arch bolsard \
  me-net hummingbot overstory; do
  count=$(gh issue list -R "idealase/$repo" --state open --json number -q 'length' 2>/dev/null)
  [ "$count" -gt 0 ] && echo "$repo: $count open"
done
```

Close or deprioritize issues that:
- Haven't been touched in 90+ days and aren't part of an active epic
- Were made obsolete by other changes
- Are aspirational features with no concrete spec

### Tracking Velocity

Measure what matters:

```bash
# Issues closed in the last 7 days
gh search issues --owner idealase --state closed \
  --sort updated --json repository,number,title,closedAt \
  --limit 50 | jq '[.[] | select(
    (.closedAt | fromdateiso8601) > (now - 604800)
  )] | length'

# PRs merged this week
gh search prs --owner idealase --merged \
  --sort updated --json repository,number,title \
  --limit 50
```

**Metrics to track per session**:

| Metric | Target | Notes |
|--------|--------|-------|
| Issues dispatched | 8–12 | Per session |
| Issues completed (merged) | 6–10 | ~80% completion rate |
| Agent first-attempt success | >70% | Below this, improve issue specs |
| Review time per issue | 5–15 min | Above 15 min, issue was too large |
| Cross-repo blockers hit | 0–1 | Above this, improve dependency planning |

**Track trends, not absolutes.** A bad session where you learn to write better specs is more valuable than a good session that doesn't improve the system.

---

## Quick Reference Card

### Daily Workflow
```
1. gh search issues --owner idealase --label "agent-ready" --state open
2. Pick 8-12 issues, group by repo
3. Dispatch parallel fan-out for independent issues
4. Review, merge, close as they complete
5. Dispatch next wave (newly unblocked items)
6. Update project boards, push all branches, end session
```

### Label Cheat Sheet
```
Priority:  P0 (critical) → P1 (high) → P2 (medium) → P3 (low)
Size:      XS (<30min) → S (1hr) → M (half-day) → L (full day) → XL (multi-day)
Phase:     foundation → ci-cd → design-system → consolidation → monitoring → agent-dx
Dispatch:  agent-ready (fully specified, no blockers)
```

### Dispatch Decision Tree
```
Is the issue agent-ready?
  ├─ No → Decompose or add spec detail first
  └─ Yes → Does it depend on unmerged work?
      ├─ Yes → Queue it for the next wave
      └─ No → Is there other work in the same repo?
          ├─ Yes → Batch them together (Pattern 3)
          └─ No → Fan out independently (Pattern 1)
```

---

*This playbook is a living document. Update it as the workflow evolves, new repos are added, and better patterns emerge.*

# Agentic SDLC Toolkit — sandford.systems

A comprehensive toolkit for orchestrating AI-assisted software development across a portfolio of 14 web applications deployed on [sandford.systems](https://sandford.systems).

## What is This?

This directory contains guides, templates, and configurations for running an **agentic SDLC** — a software development lifecycle where AI coding agents do the implementation work while you (the human) orchestrate, review, and decide.

The workflow:

```
  You (orchestrator)           AI Agents (workers)
  ─────────────────           ──────────────────
  Write issues        →       Read issue + repo context
  Triage & label      →       Implement changes
  Dispatch agents     →       Open pull requests
  Review PRs          →       Fix review feedback
  Merge & deploy      →       (done)
```

You stay in the **outer loop** (planning, reviewing, deciding). Agents handle the **inner loop** (reading code, writing code, running tests).

## Portfolio Overview

14 active repositories, ~112 open issues, 2 GitHub Projects.

| # | Repo | Stack | Deployment URL | Open Issues | Status |
|---|------|-------|---------------|-------------|--------|
| 1 | [geeraff](https://github.com/idealase/geeraff) | React / Vite / TS + backend | [geeraff.sandford.systems](https://geeraff.sandford.systems) | 14 | Active |
| 2 | [greyzone](https://github.com/idealase/greyzone) | React + FastAPI + Rust + Node (polyglot) | [greyzone.sandford.systems](https://greyzone.sandford.systems) | 15 | Active |
| 3 | [PulseQuiz](https://github.com/idealase/PulseQuiz) | React / Vite / TS | TBD | 15 | Active |
| 4 | [fam-arch](https://github.com/idealase/fam-arch) | React / Vite / TS (monorepo) | [family.sandford.systems](https://family.sandford.systems) | 13 | Active |
| 5 | [minclo](https://github.com/idealase/minclo) | React / Vite / TS | TBD | 10 | Active |
| 6 | [bolsard](https://github.com/idealase/bolsard) | Client / Server | TBD | 8 | Active |
| 7 | [me-net](https://github.com/idealase/me-net) | React / Vite / TS | TBD | 8 | Active |
| 8 | [dc-sim](https://github.com/idealase/dc-sim) | React / Vite / TS | TBD | 6 | Active |
| 9 | [bucket-flow-calculus](https://github.com/idealase/bucket-flow-calculus) | React / Vite / TS | TBD | 6 | Active |
| 10 | [spider-size-simulator](https://github.com/idealase/spider-size-simulator) | React / Vite / TS | TBD | 5 | Active |
| 11 | [ant-size-simulator](https://github.com/idealase/ant-size-simulator) | React / Vite / TS | [ant-sim.sandford.systems](https://ant-sim.sandford.systems) | 4 | Active |
| 12 | [eagle-size-simulator](https://github.com/idealase/eagle-size-simulator) | React / Vite / TS | [eagle-sim.sandford.systems](https://eagle-sim.sandford.systems) | 4 | Active |
| 13 | [elephant-size-simulator](https://github.com/idealase/elephant-size-simulator) | React / Vite / TS | [elephant-sim.sandford.systems](https://elephant-sim.sandford.systems) | 4 | Active |
| 14 | [rot-garden](https://github.com/idealase/rot-garden) | Rust + Vite frontend | [rot-garden.sandford.systems](https://rot-garden.sandford.systems) | 0 | Active |

### Repo Tiers

| Tier | Repos | Characteristics | Agent Scoping |
|------|-------|----------------|---------------|
| **Small** | ant-sim, eagle-sim, elephant-sim, spider-sim, dc-sim, bucket-flow | < 2K lines, single-page Vite apps | Agent can read entire repo. Keep issues size/S or smaller. |
| **Medium** | geeraff, minclo, bolsard, me-net, PulseQuiz, fam-arch | 2–8K lines, may have frontend + backend | Enumerate files in issues. Up to size/M with explicit file lists. |
| **Large** | greyzone | 10K+ lines, polyglot monorepo | ONE SERVICE PER ISSUE. Must use explicit file enumeration. size/S–M only. |
| **Rust** | rot-garden | Rust backend + Vite frontend | Scope to `server/` or `frontend/` per issue, not both. |

## Guides

| Guide | Purpose | Read When |
|-------|---------|-----------|
| [ORCHESTRATION.md](./ORCHESTRATION.md) | Master playbook for planning and dispatching agent work | First — it's the big picture |
| [DISPATCH-STRATEGIES.md](./DISPATCH-STRATEGIES.md) | Fleet patterns for parallel agent orchestration | Dispatching multiple agents |
| [TOKEN-BUDGETS.md](./TOKEN-BUDGETS.md) | Context window sizing and scope control | Scoping issues, estimating complexity |
| [REVIEW-CHECKLIST.md](./REVIEW-CHECKLIST.md) | Post-agent review and merge workflow | Reviewing agent PRs |

### Guide Reading Order

```
1. ORCHESTRATION.md        ← Start here: lifecycle, phases, session flow
2. TOKEN-BUDGETS.md        ← Understand capacity: what fits in one issue
3. DISPATCH-STRATEGIES.md  ← Learn patterns: fan-out, chain, batch, epic
4. REVIEW-CHECKLIST.md     ← Quality gate: 5-min triage + deep review
```

## Templates

Reusable templates to copy into your repos' `.github/` directories.

| Template | Purpose | Copy to |
|----------|---------|---------|
| [agents/](./templates/agents/) | Custom Copilot agent definitions | `.github/agents/` |
| [prompts/](./templates/prompts/) | Reusable dispatch prompts | `.github/prompts/` |
| [ISSUE_TEMPLATE/](./templates/ISSUE_TEMPLATE/) | Issue templates for agent work | `.github/ISSUE_TEMPLATE/` |
| [skills/](./templates/skills/) | Copilot skills (merge, deploy, test, triage) | `.github/skills/` |
| [copilot-instructions-template.md](./templates/copilot-instructions-template.md) | Repo-level Copilot instructions | `.github/copilot-instructions.md` |

### Skills

Skills are modular capabilities that agents can invoke. Each skill lives in `.github/skills/<skill-name>/SKILL.md`.

| Skill | Purpose | Used When |
|-------|---------|-----------|
| [merge-pr](./templates/skills/merge-pr/SKILL.md) | Safely merge PRs with conventional commits | After review approval |
| [deploy-static](./templates/skills/deploy-static/SKILL.md) | Build and deploy React/Vite apps to nginx | After merge to main |
| [deploy-backend](./templates/skills/deploy-backend/SKILL.md) | Deploy Python/Rust/Node services via systemd | After merge to main |
| [run-tests](./templates/skills/run-tests/SKILL.md) | Execute test suites with consistent output | During review, pre-merge |
| [issue-triage](./templates/skills/issue-triage/SKILL.md) | Label, size, and classify new issues | When new issues are created |

### Using the Copilot Instructions Template

1. Copy `copilot-instructions-template.md` to your repo as `.github/copilot-instructions.md`
2. Replace every `{placeholder}` with values specific to your repo
3. Delete sections that don't apply (e.g., Backend for frontend-only repos)
4. Remove the HTML comment annotations
5. Commit and push — Copilot reads this file automatically

## Quick Start

### First Time Setup

```
1. Read ORCHESTRATION.md for the big picture
2. Read TOKEN-BUDGETS.md to understand capacity limits
3. Copy copilot-instructions-template.md to your target repo's .github/
4. Customize it with your repo's specifics
5. Copy relevant skills to your repo's .github/skills/
```

### Running a Session

```
1. Check open issues:           gh issue list -R idealase/{repo} --label agent-ready
2. Pick 3-5 issues              (mix of repos, all size/S or size/M)
3. Dispatch agents               (use DISPATCH-STRATEGIES.md patterns)
4. Review PRs as they come in    (use REVIEW-CHECKLIST.md)
5. Merge approved PRs            (use merge-pr skill)
6. Deploy if needed              (use deploy-static or deploy-backend skill)
7. Close issues                  (auto-closed by PR merge if "Closes #N" in body)
```

### Session Time Allocation

| Phase | % Time | Activity |
|-------|--------|----------|
| Assess | 10% | Review backlog, pick issues, check blockers |
| Dispatch | 20% | Write prompts, launch agents |
| Review | 40% | Read diffs, run tests, verify correctness |
| Iterate | 20% | Fix review feedback, re-dispatch failures |
| Admin | 10% | Merge, deploy, close issues, groom backlog |

## Label Taxonomy

Standard labels used across all 14 repositories. Apply consistently for filtering and project board automation.

### Priority

| Label | Color | Meaning | Response Time |
|-------|-------|---------|--------------|
| `P0` | 🔴 `#d73a4a` | Critical — site down, security, data loss | Immediately |
| `P1` | 🟠 `#e99695` | High — blocks work, user-facing bug, broken CI | This session |
| `P2` | 🟡 `#fbca04` | Medium — important feature, moderate bug | This week |
| `P3` | 🟢 `#0e8a16` | Low — nice-to-have, cosmetic, low impact | Backlog |

### Type

| Label | Color | Meaning |
|-------|-------|---------|
| `type/bug` | 🔴 `#d73a4a` | Something is broken |
| `type/feature` | 🔵 `#0075ca` | New capability or enhancement |
| `type/refactor` | ⚪ `#cfd3d7` | Code improvement, no behavior change |
| `type/docs` | 🔵 `#0075ca` | Documentation only |
| `type/chore` | ⚪ `#cfd3d7` | Maintenance, dependencies, config |
| `type/test` | 🟢 `#bfdadc` | Adding or fixing tests |
| `type/perf` | 🟡 `#fbca04` | Performance improvement |

### Size (Token Budget Implications)

| Label | Color | Files | Agent Budget | Dispatchable? |
|-------|-------|-------|-------------|---------------|
| `size/XS` | 🔵 `#c5def5` | 1 file | < 15K tokens | ✅ Any repo |
| `size/S` | 🟢 `#bfdadc` | 1–3 files | < 30K tokens | ✅ Any repo |
| `size/M` | 🟡 `#fbca04` | 3–8 files | < 60K tokens | ✅ With file enumeration |
| `size/L` | 🟠 `#e99695` | 8+ files | < 100K tokens | ⚠️ Needs careful scoping |
| `size/XL` | 🔴 `#d73a4a` | Multi-concern | > 100K tokens | ❌ Must decompose first |

### Phase

| Label | Color | Meaning | Typical Work |
|-------|-------|---------|-------------|
| `phase/foundation` | 🔵 `#1d76db` | Core setup | Project structure, base config, initial components |
| `phase/ci-cd` | 🟣 `#5319e7` | CI/CD | GitHub Actions, deployment automation, runners |
| `phase/design-system` | 🟢 `#0e8a16` | Shared UI | Design tokens, component library, theming |
| `phase/consolidation` | 🟡 `#fbca04` | Standardize | Dedup code, align patterns across repos |
| `phase/monitoring` | 🟠 `#d93f0b` | Observability | Health checks, metrics, alerting |
| `phase/agent-dx` | 🔵 `#bfd4f2` | Agent tooling | Copilot instructions, skills, prompts |

### Area

| Label | Color | Meaning |
|-------|-------|---------|
| `area/frontend` | 🔵 `#0075ca` | UI, components, styling, client-side logic |
| `area/backend` | 🟣 `#5319e7` | API, server, database, auth |
| `area/ci-cd` | 🟡 `#e4e669` | Pipelines, deployment, GitHub Actions |
| `area/design-system` | 🟢 `#0e8a16` | Tokens, themes, shared components |
| `area/monitoring` | 🟠 `#d93f0b` | Metrics, alerts, health checks |
| `area/agent-dx` | 🔵 `#bfd4f2` | Copilot/agent tooling and configuration |
| `area/tooling` | ⚪ `#cfd3d7` | Build tools, linters, formatters |

### Workflow

| Label | Color | Meaning |
|-------|-------|---------|
| `agent-ready` | 🟢 `#0e8a16` | Fully specified — can be dispatched to an agent |
| `needs-decomposition` | 🔴 `#d73a4a` | Too large (size/XL) — needs sub-issues |
| `needs-info` | 🟡 `#fbca04` | Missing details — can't triage yet |
| `blocked` | 🔴 `#d73a4a` | Cannot proceed — external dependency |
| `in-progress` | 🔵 `#1d76db` | Agent or human actively working |
| `review-needed` | 🟠 `#e99695` | PR open and ready for review |

## GitHub Projects

### Project 1: DevSecOps 4 Vibe Coding

CI/CD pipelines, security hardening, infrastructure, monitoring, and agent developer experience.

**Labels that route here:** `area/ci-cd`, `area/monitoring`, `area/agent-dx`, `phase/ci-cd`, `phase/monitoring`, `phase/agent-dx`

**Typical issues:**
- Set up GitHub Actions workflow for repo X
- Add health check endpoint
- Create Copilot instructions for repo Y
- Configure Prometheus scraping for service Z

### Project 2: sandford.systems Web Platform

Features, UX improvements, frontend/backend development, design system, and deployment.

**Labels that route here:** `area/frontend`, `area/backend`, `area/design-system`, `phase/foundation`, `phase/design-system`, `phase/consolidation`, `type/feature`, `type/bug`

**Typical issues:**
- Add dark mode toggle
- Implement responsive layout
- Create shared component library
- Fix physics calculation bug in geeraff

## Infrastructure Reference

### Server: sandford.systems

- **OS**: Ubuntu Linux, kernel 6.17
- **Web server**: Nginx (reverse proxy on port 80)
- **TLS**: Cloudflare Tunnel (`cloudflared`) for HTTPS
- **Monitoring**: Prometheus + Node Exporter + Grafana (`~/bin/monitoring`)
- **Database**: PostgreSQL on localhost:5432
- **Repos**: `~/Desktop/Repos/` (all 14 cloned here)
- **Runners**: `~/actions-runners/` (self-hosted GitHub Actions runners)

### Nginx Sites

| Config File | Domains Served |
|------------|---------------|
| `/etc/nginx/sites-enabled/geeraff` | geeraff.sandford.systems |
| `/etc/nginx/sites-enabled/animal-sims` | ant-sim, eagle-sim, elephant-sim.sandford.systems |
| `/etc/nginx/sites-enabled/plane-archive` | family.sandford.systems |
| `/etc/nginx/sites-enabled/greyzone` | greyzone.sandford.systems |
| `/etc/nginx/sites-enabled/rot-garden` | rot-garden.sandford.systems |

### Useful Commands

```bash
# Check all runners
ls ~/actions-runners/

# Monitoring stack
~/bin/monitoring status

# Nginx
sudo nginx -t && sudo systemctl reload nginx

# Cloudflare tunnel
systemctl status cloudflared

# PostgreSQL
sudo systemctl status postgresql
```

## Contributing to This Toolkit

This toolkit itself follows the agentic SDLC. To improve it:

1. Open an issue on [idealase.github.io](https://github.com/idealase/idealase.github.io)
2. Label it `area/agent-dx` + `phase/agent-dx`
3. Dispatch an agent (or do it yourself)
4. PR against `main`

### File Naming Conventions

- Guides: `UPPERCASE-WITH-DASHES.md` (e.g., `ORCHESTRATION.md`)
- Templates: `lowercase-with-dashes.md` (e.g., `copilot-instructions-template.md`)
- Skills: `skill-name/SKILL.md` (e.g., `merge-pr/SKILL.md`)
- Agents: `agent-name.md` (e.g., `code-review.md`)

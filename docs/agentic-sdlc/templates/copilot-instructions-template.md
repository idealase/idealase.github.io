# {repo_name} — Copilot Instructions

<!-- ============================================================================
  USAGE: Copy this file to your repo as `.github/copilot-instructions.md`
  Then replace every {placeholder} with values specific to your repo.
  Delete sections that don't apply (e.g., Backend for frontend-only repos).
  Delete all HTML comments (like this one) when you're done customizing.
  
  This file tells GitHub Copilot (and AI coding agents) how to work in your repo.
  It's the single most important file for agent quality — invest time here.
  
  Reference: https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot
============================================================================ -->

## Project Overview

<!-- One to two sentences: what does this repo do, who is it for, what problem does it solve? -->
{project_description}

## Tech Stack

<!-- List every major technology. Agents use this to choose the right patterns. -->

- **Frontend**: {React 19 / Vite 6 / TypeScript 5 | N/A}
- **Backend**: {FastAPI / Rust (Actix-web) / Node (Express) | N/A}
- **Data**: {PostgreSQL / SQLite / localStorage / none}
- **Styling**: {Tailwind CSS / CSS Modules / vanilla CSS}
- **Testing**: {Vitest / Jest / pytest / cargo test | none yet}
- **Deployment**: {sandford.systems via nginx / GitHub Pages / Vercel}
- **CI/CD**: GitHub Actions on self-hosted runner

## Quick Commands

<!-- These are the commands agents will run. Be precise — wrong commands waste tokens. -->

```bash
# Install dependencies
{npm ci | pip install -e ".[dev]" | cargo build}

# Start dev server
{npm run dev | uvicorn main:app --reload | cargo run}

# Build for production
{npm run build | cargo build --release}

# Run tests
{npm test | npx vitest run | pytest -q | cargo test}

# Lint
{npm run lint | ruff check . | cargo clippy}

# Format
{npm run format | ruff format . | cargo fmt}

# Type check (if separate from build)
{npx tsc --noEmit | mypy src/ | N/A}

# Deploy (if applicable)
{npm run deploy | see deploy-static skill | see deploy-backend skill}
```

## Project Structure

<!-- Show the directory tree. Agents use this to know where to put new files.
     Keep it high-level — don't list every file, just the important directories. -->

```
{repo_name}/
├── src/                    # {Source code}
│   ├── components/         # {React components | API routes | modules}
│   ├── hooks/              # {Custom React hooks | N/A}
│   ├── utils/              # {Shared utilities}
│   ├── types/              # {TypeScript types | Pydantic models}
│   └── {other_dirs}/       # {Description}
├── tests/                  # {Test files — or co-located with src}
├── public/                 # {Static assets | N/A}
├── docs/                   # {Documentation | N/A}
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   ├── copilot-instructions.md  # This file
│   └── {agents|skills|prompts}/ # Agent tooling
├── package.json            # {or Cargo.toml / pyproject.toml}
└── {config files}          # vite.config.ts, tsconfig.json, etc.
```

## Coding Conventions

<!-- Be specific. Agents follow these literally. Vague rules get ignored. -->

### General
- {Use TypeScript strict mode — no `any` types | Use type hints on all function signatures}
- {Prefer named exports over default exports | Use absolute imports}
- {Keep functions under 50 lines — extract helpers if longer}
- {Error messages must be user-friendly, not stack traces}

### Naming
- {Components: PascalCase (`UserProfile.tsx`) | Modules: snake_case (`user_profile.py`)}
- {Hooks: `use` prefix (`useGiraffePhysics.ts`) | N/A}
- {Test files: `*.test.ts` co-located | `tests/test_*.py` in tests dir}
- {CSS classes: kebab-case | Tailwind utilities}

### File Organization
- {One component per file | One class per module}
- {Co-locate tests with source: `Component.tsx` + `Component.test.tsx`}
- {Shared types go in `src/types/` — never define types inline in components}

### Git
- Conventional commits: `{feat|fix|docs|chore|refactor|test|ci}: {description}`
- Branch naming: `{type}/{issue-number}-{short-description}` (e.g., `feat/42-dark-mode`)
- Always squash merge to `main`

## Architecture Decisions

<!-- Document the "why" behind key choices. Agents make better decisions with context. -->

- **{Decision 1}**: {Rationale — e.g., "Vite over CRA because faster HMR and smaller bundles"}
- **{Decision 2}**: {Rationale — e.g., "localStorage over API for MVP, will migrate to PostgreSQL in phase 2"}
- **{Decision 3}**: {Rationale — e.g., "Single repo, not monorepo, because scope is small enough"}
- **{Decision 4}**: {Rationale — e.g., "No state management library — React context + useReducer is sufficient"}

## Deployment

<!-- Where does this app live in production? Agents need this to verify deploys. -->

- **URL**: https://{subdomain}.sandford.systems
- **Build path**: ~/Desktop/Repos/{repo_name}/{dist_path}
- **Nginx config**: /etc/nginx/sites-enabled/{nginx_config_name}
- **Backend service**: {systemd_service_name | N/A}
- **Cloudflare Tunnel**: Configured in ~/.cloudflared/config.yml

### Deployment Checklist
1. All tests pass: `{test_command}`
2. Build succeeds: `{build_command}`
3. Reload nginx: `sudo nginx -t && sudo systemctl reload nginx`
4. Health check: `curl -s https://{subdomain}.sandford.systems`

## Testing Strategy

<!-- Tell agents what kind of tests to write and where to put them. -->

- **Unit tests**: {Vitest | pytest | cargo test} — `{npm test | pytest -q | cargo test}`
- **Component tests**: {React Testing Library | N/A} — test user interactions, not implementation
- **Integration tests**: {API endpoint tests | N/A} — `{command}`
- **Coverage target**: {80% | 70% | N/A — tests not yet set up}
- **Test location**: {Co-located `*.test.ts` | `tests/` directory}

### What to Test
- {All pure functions and utility modules}
- {Component rendering and user interactions}
- {API endpoint request/response contracts}
- {Edge cases: empty state, error state, boundary values}

### What NOT to Test
- {CSS/styling details — visual regression if needed later}
- {Third-party library internals}
- {Implementation details that may change — test behavior, not code}

## Common Pitfalls

<!-- Warn agents about foot-guns specific to this repo. Saves re-dispatch cycles. -->

- **{Pitfall 1}**: {Description — e.g., "Don't import from `src/legacy/` — it's deprecated and being removed"}
- **{Pitfall 2}**: {Description — e.g., "The physics engine uses SI units internally but displays imperial — always convert at the display layer"}
- **{Pitfall 3}**: {Description — e.g., "Node 20+ required — the GitHub Actions runner uses Node 20, don't use Node 18 features that were removed"}
- **{Pitfall 4}**: {Description — e.g., "Don't add new npm dependencies without checking bundle size impact: `npx bundlephobia {package}`"}

## Environment Variables

<!-- List env vars the agent might need to know about (but NEVER include actual values). -->

| Variable | Purpose | Where Set |
|----------|---------|-----------|
| {`VITE_API_URL`} | {Backend API base URL} | {`.env` file} |
| {`DATABASE_URL`} | {PostgreSQL connection string} | {systemd EnvironmentFile} |

> **Note**: Never hardcode secrets. Never commit `.env` files. Never log sensitive values.

## Related Repos

<!-- Help agents understand the broader system. Cross-repo issues need this context. -->

- **{related_repo_1}**: {Relationship — e.g., "Shares design tokens via `packages/tokens`"}
- **{related_repo_2}**: {Relationship — e.g., "Backend API that this frontend consumes"}
- **idealase.github.io**: Meta-repo with agentic SDLC docs and shared templates

## Agent-Specific Instructions

<!-- Instructions that only matter for AI agents, not human developers. -->

### Scope Control
- Stay within the files listed in the issue. Do not refactor unrelated code.
- If you discover a bug outside your scope, note it in the PR but don't fix it.
- Maximum diff size: {200 lines for size/S | 500 lines for size/M}

### PR Format
- Title: conventional commit format (`feat: add dark mode toggle`)
- Body: reference the issue (`Closes #42`)
- Include a "Changes" section listing what was modified and why
- Include a "Testing" section showing test commands run and results

### What NOT to Do
- Do not modify CI/CD workflows unless the issue specifically asks for it
- Do not update dependencies unless the issue specifically asks for it
- Do not add new dev dependencies without explicit instruction
- Do not modify nginx configs, systemd units, or deployment scripts
- Do not read or modify `.env` files, credentials, or secrets

# idealase.github.io

## Quick Reference
- **Build**: `npm run build` (delegates to `cd react-website && npm run build`)
- **Test**: `npm test` (delegates to `cd react-website && npm test`)
- **Lint**: `npx eslint react-website/src` (avoid linting build artifacts)
- **Dev server**: `npm start` → http://localhost:3000
- **Deploy**: Push to `main` → GitHub Actions builds and deploys to GitHub Pages
- **Install**: `npm run install:all` (installs root + react-website deps)

## Architecture
This is a **hybrid** repo: legacy HTML/CSS/JS at root + modern React app in `/react-website/`.

```
/                       → Legacy HTML pages (served directly by GitHub Pages)
/react-website/         → React CRA app (TypeScript, styled-components, Framer Motion)
  /src/                 → React source code
  /build/               → Production build (copied to root for GH Pages)
/.github/workflows/     → CI/CD: main.yml (build+deploy), security.yml, dast.yml
```

Entry point: `react-website/src/` — the root `package.json` scripts all delegate into `react-website/`.

## Key Conventions
- **Styling**: styled-components (CSS-in-JS), NOT CSS files
- **Color palette**: Nord-inspired — `#88c0d0` frost blue, `#5e81ac` storm blue, `#1d1d1d` bg, `#e1e1e1` text
- **Routing**: HashRouter (required for GitHub Pages — not BrowserRouter)
- **State**: React hooks only; no global state library
- **Components**: PascalCase filenames, one component per file
- **Config**: EmailJS credentials in `config.js` (gitignored), template in `config.example.js`

## Deployment
- **URL**: https://idealase.github.io (custom domain: sandford.systems)
- **CI**: Three workflows — main (build+deploy), security (CodeQL+Snyk+gitleaks), DAST (OWASP ZAP+SonarCloud)
- **Node**: v20 in CI

## Common Pitfalls
- Root `package.json` scripts all `cd react-website &&` — run commands from repo root, not react-website/
- Build takes 15-20s; dev server startup 8-10s
- Security ESLint plugins (`no-secrets`, `security`) enforce strict checks — don't disable
- Legacy HTML tests: `node tests/run-tests.js` (separate from React tests)

## Existing Agent Guidance
See `.github/copilot-instructions.md` for detailed component architecture, validation scenarios, and timing guidelines. This CLAUDE.md is complementary — not a replacement.

## Sensitive Files
Do not read, log, or commit: `config.js`, any `.env` files, credentials, secrets.

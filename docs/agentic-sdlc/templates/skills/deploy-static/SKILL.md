# Skill: Deploy Static Site

## Description

Build and deploy a React/Vite static site to sandford.systems via nginx. Most repos in the portfolio are single-page applications served as static files from a `dist/` directory. Nginx reverse-proxies via Cloudflare Tunnel for HTTPS.

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `repo_name` | yes | — | Repository name (directory under `~/Desktop/Repos/`) |
| `subdomain` | yes | — | Target subdomain (e.g., `geeraff`, `ant-sim`) |
| `build_dir` | no | `dist` | Build output directory relative to repo root |
| `build_command` | no | `npm run build` | Override if repo uses a different build command |

## Deployment Map

| Repo | Subdomain | Build Path | Nginx Config |
|------|-----------|------------|--------------|
| geeraff | geeraff.sandford.systems | `frontend/dist` | `/etc/nginx/sites-enabled/geeraff` |
| fam-arch | family.sandford.systems | `apps/web/dist` | `/etc/nginx/sites-enabled/plane-archive` |
| greyzone | greyzone.sandford.systems | `apps/web/dist` | `/etc/nginx/sites-enabled/greyzone` |
| rot-garden | rot-garden.sandford.systems | `frontend/dist` | `/etc/nginx/sites-enabled/rot-garden` |
| ant-size-simulator | ant-sim.sandford.systems | `dist` | `/etc/nginx/sites-enabled/animal-sims` |
| eagle-size-simulator | eagle-sim.sandford.systems | `dist` | `/etc/nginx/sites-enabled/animal-sims` |
| elephant-size-simulator | elephant-sim.sandford.systems | `dist` | `/etc/nginx/sites-enabled/animal-sims` |
| minclo | minclo.sandford.systems | `dist` | TBD |
| PulseQuiz | pulsequiz.sandford.systems | `dist` | TBD |
| me-net | me-net.sandford.systems | `dist` | TBD |

## Steps

### 1. Navigate to repo

```bash
cd ~/Desktop/Repos/{repo_name}
```

### 2. Pull latest code

```bash
git checkout main && git pull origin main
```

Ensure you're deploying what's on `main`, not a feature branch.

### 3. Install dependencies

```bash
npm ci
```

Use `npm ci` (not `npm install`) for reproducible builds from lockfile.

### 4. Build

```bash
npm run build
```

For monorepos with workspaces:
- **geeraff**: `cd frontend && npm run build`
- **fam-arch**: `cd apps/web && npm run build`
- **greyzone**: `cd apps/web && npm run build`

### 5. Verify build output

```bash
ls -la {build_dir}/index.html
```

Confirm the file exists and has a recent timestamp. Also check:
```bash
du -sh {build_dir}/
```

A typical Vite build is 200KB–5MB. If it's 0 or >50MB, something is wrong.

### 6. Verify nginx config

```bash
cat /etc/nginx/sites-enabled/{nginx_config}
```

**DO NOT modify** — just verify the `root` directive points to the correct `dist/` path. The nginx configs are managed separately and should not be changed during a deploy.

### 7. Test nginx config and reload

```bash
sudo nginx -t && sudo systemctl reload nginx
```

`nginx -t` validates syntax. Only reload if the test passes.

### 8. Health check

```bash
curl -s -o /dev/null -w '%{http_code}' https://{subdomain}.sandford.systems
```

Expect `200`. If `502` or `504`, nginx can't reach the backend (for hybrid sites). If `404`, the `root` path may be wrong.

### 9. Verify content

```bash
curl -s https://{subdomain}.sandford.systems | head -20
```

Should show the HTML shell with the React app's `<div id="root">` or equivalent mount point. Check that asset paths resolve (no 404s on JS/CSS bundles).

### 10. Smoke test (optional)

Open in browser or use a more thorough check:
```bash
curl -s https://{subdomain}.sandford.systems/assets/ | head -5
```

## Rollback

If the new build has issues:

```bash
# Option 1: Rebuild from previous commit
cd ~/Desktop/Repos/{repo_name}
git checkout HEAD~1
npm ci && npm run build
sudo systemctl reload nginx

# Option 2: If you need to go back further
git log --oneline -10  # find the last known-good commit
git checkout {good_commit_sha}
npm ci && npm run build
sudo systemctl reload nginx

# Always return to main when done
git checkout main
```

## Common Failure Modes

| Failure | Symptom | Resolution |
|---------|---------|------------|
| Build fails | Non-zero exit, no `dist/` | Fix build errors, check Node version (`node -v`) |
| Wrong dist path | 404 on site | Verify nginx `root` matches actual build output path |
| Stale cache | Old content showing | Hard refresh, or check `Cache-Control` headers |
| Cloudflare tunnel down | Connection refused | `systemctl status cloudflared`, restart if needed |
| npm ci fails | Lockfile mismatch | Run `npm install` to regenerate lockfile, commit, then `npm ci` |

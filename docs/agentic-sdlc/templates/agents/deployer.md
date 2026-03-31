# Agent: Deployer (sub-agent)

## Role

Invoked after a PR merges to main, or manually for deployment tasks. Handles build, deploy, verification, and rollback for all service types on sandford.systems infrastructure.

## Mission

Deploy changes to the correct environment, verify the deployment is healthy, and roll back automatically if health checks fail.

## Input (provided by orchestrator or manual trigger)

- Repo name and archetype
- Branch/tag being deployed (typically `main`)
- List of changed files (to determine which services are affected)
- Previous known-good commit SHA (for rollback)

## Output

- Deployment status: `success`, `rolled-back`, or `failed`
- Health check results for each affected service
- Post-deploy verification output
- Rollback details if triggered

## Infrastructure Context

| Component | Details |
|---|---|
| **Nginx** | Reverse proxy on port 80, configs in `/etc/nginx/sites-enabled/` |
| **Cloudflare Tunnel** | `cloudflared` service, named tunnels, ingress rules in `~/.cloudflared/` |
| **Self-hosted runners** | Per-repo in `~/actions-runners/`, PulseQuiz at `~/actions-runner-pulsequiz/` |
| **Monitoring** | Prometheus + Node Exporter + Grafana via `~/bin/monitoring` |
| **PostgreSQL** | localhost:5432 |
| **Systemd** | Backend services managed as systemd units |

## Deployment Procedures by Archetype

### Frontend-only (React/Vite/TS)

Applies to: ant-sim, eagle-sim, elephant-sim, spider-sim, dc-sim, bucket-flow-calculus, minclo, me-net

```bash
# 1. Build
cd ~/Desktop/Repos/<repo>
npm ci --prefer-offline
npm run build

# 2. Deploy — copy dist/ to nginx-served path
sudo cp -r dist/* /var/www/<site-name>/

# 3. Verify
curl -sf http://localhost/<site-path>/ | head -1
# Expect: valid HTML response

# 4. Reload nginx (only if config changed)
sudo nginx -t && sudo systemctl reload nginx
```

**Verification commands:**
- `curl -sf -o /dev/null -w '%{http_code}' http://localhost/<site-path>/` → expect `200`
- `curl -sf http://localhost/<site-path>/assets/` → expect asset files accessible

### Full-stack (React + Python API)

Applies to: greyzone, fam-arch, bolsard, PulseQuiz

```bash
# 1. Build frontend
cd ~/Desktop/Repos/<repo>
npm ci --prefer-offline && npm run build
sudo cp -r dist/* /var/www/<site-name>/

# 2. Update backend
cd ~/Desktop/Repos/<repo>/api  # or backend/
source .venv/bin/activate
pip install -r requirements.txt --quiet

# 3. Restart backend service
sudo systemctl restart <service-name>

# 4. Health check (wait up to 15s for startup)
for i in $(seq 1 15); do
  curl -sf http://localhost:<port>/health && break
  sleep 1
done
```

**Verification commands:**
- `systemctl is-active <service-name>` → expect `active`
- `curl -sf http://localhost:<port>/health` → expect `{"status": "ok"}` or equivalent
- `curl -sf http://localhost/<site-path>/` → expect `200`

### Full-stack (React + Rust)

Applies to: geeraff, rot-garden

```bash
# 1. Build frontend
cd ~/Desktop/Repos/<repo>
npm ci --prefer-offline && npm run build
sudo cp -r dist/* /var/www/<site-name>/

# 2. Build backend
cd ~/Desktop/Repos/<repo>/backend  # or server/
cargo build --release

# 3. Restart backend service
sudo systemctl restart <service-name>

# 4. Health check
for i in $(seq 1 15); do
  curl -sf http://localhost:<port>/health && break
  sleep 1
done
```

**Verification commands:**
- `systemctl is-active <service-name>` → expect `active`
- `journalctl -u <service-name> --no-pager -n 20` → check for startup errors
- `curl -sf http://localhost:<port>/health` → expect healthy response

## Cloudflare Tunnel Verification

After any deployment, verify tunnel ingress is correct:

```bash
# Check tunnel is running
systemctl is-active cloudflared

# Verify ingress rules include the deployed service
cloudflared tunnel ingress validate

# Test external access (if applicable)
curl -sf https://<subdomain>.sandford.systems/health
```

## Monitoring Verification

```bash
# Check Prometheus is scraping the service
curl -sf http://localhost:9090/api/v1/targets | python3 -c "
import json, sys
targets = json.load(sys.stdin)['data']['activeTargets']
for t in targets:
    print(f\"{t['labels'].get('job', 'unknown')}: {t['health']}\")
"

# Verify Node Exporter is up
curl -sf http://localhost:9100/metrics | head -5

# Check Grafana is accessible
curl -sf -o /dev/null -w '%{http_code}' http://localhost:3000/api/health
```

## Rollback Procedures

### Frontend rollback

```bash
# Revert to previous build
cd ~/Desktop/Repos/<repo>
git checkout <previous-sha>
npm ci --prefer-offline && npm run build
sudo cp -r dist/* /var/www/<site-name>/
git checkout main  # return to main
```

### Python backend rollback

```bash
cd ~/Desktop/Repos/<repo>/api
git checkout <previous-sha>
source .venv/bin/activate
pip install -r requirements.txt --quiet
sudo systemctl restart <service-name>
# Verify health
curl -sf http://localhost:<port>/health
git checkout main
```

### Rust backend rollback

```bash
cd ~/Desktop/Repos/<repo>/backend
git checkout <previous-sha>
cargo build --release
sudo systemctl restart <service-name>
# Verify health
curl -sf http://localhost:<port>/health
git checkout main
```

### Full rollback (nuclear option)

If multiple services are degraded:

```bash
# 1. Stop affected services
sudo systemctl stop <service-1> <service-2>

# 2. Revert all repos to known-good state
for repo in <affected-repos>; do
  cd ~/Desktop/Repos/$repo
  git checkout <known-good-sha>
done

# 3. Rebuild and redeploy all
# Follow per-archetype procedures above

# 4. Restart monitoring
~/bin/monitoring restart

# 5. Verify everything
curl -sf http://localhost/  # nginx root
curl -sf http://localhost:9090/-/healthy  # prometheus
curl -sf http://localhost:3000/api/health  # grafana
```

## Output Format

```
## Deploy Report: [repo] @ [commit-sha-short]

- **Archetype:** [frontend-only | full-stack-python | full-stack-rust]
- **Status:** [success | rolled-back | failed]
- **Timestamp:** [ISO 8601]

### Services affected
| Service | Action | Status |
|---|---|---|
| frontend | build + copy | ✅ deployed |
| backend API | restart systemd | ✅ healthy |
| nginx | reload | ✅ config valid |

### Health checks
| Endpoint | Expected | Actual |
|---|---|---|
| http://localhost/<path>/ | 200 | 200 ✅ |
| http://localhost:<port>/health | ok | ok ✅ |

### Monitoring
- Prometheus targets: [all healthy | N unhealthy]
- Grafana: [accessible | down]

### Rollback (if triggered)
- **Reason:** [health check failure description]
- **Rolled back to:** [commit-sha]
- **Post-rollback health:** [all green | issues remain]
```

## Rules

- **Never deploy without a passing CI pipeline.** If the latest workflow run is red, abort.
- **Always health check after deploy.** A deploy without verification is not complete.
- **Rollback automatically** if health checks fail after 3 retries with 5-second intervals.
- **Never modify Cloudflare tunnel credentials** — only verify ingress rules.
- **Log everything.** Every command run and its output should be captured in the deploy report.
- **One service at a time.** For multi-service deploys, deploy and verify each service sequentially.

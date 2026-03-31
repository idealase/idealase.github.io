# Skill: Deploy Backend Service

## Description

Deploy and restart a Python/Rust/Node backend service on sandford.systems. Backend services run as systemd units, sit behind nginx reverse proxies, and are exposed via Cloudflare Tunnel. This skill handles the pull → build → restart → verify cycle.

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `service_name` | yes | The systemd service name (e.g., `greyzone-api`, `rot-garden`) |
| `repo_name` | yes | Repository name (directory under `~/Desktop/Repos/`) |
| `service_type` | yes | One of: `python`, `rust`, `node` |
| `port` | yes | Port the service listens on (for health checks) |

## Known Backend Services

| Repo | Service Type | Port | Systemd Unit | Notes |
|------|-------------|------|--------------|-------|
| greyzone | python (FastAPI) | 8010 | TBD | Polyglot monorepo — API in `services/` |
| rot-garden | rust | 8004 | TBD | Actix-web or Axum server in `server/` |
| bolsard | node/python | TBD | TBD | `server/` directory |
| fam-arch | python | TBD | TBD | Backend in `apps/api/` or similar |
| PulseQuiz | python | 8000 | TBD | FastAPI on localhost:8000 |

## Steps (Python / FastAPI)

### 1. Navigate to repo

```bash
cd ~/Desktop/Repos/{repo_name}
```

### 2. Pull latest code

```bash
git checkout main && git pull origin main
```

### 3. Activate virtual environment (if applicable)

```bash
source .venv/bin/activate
```

If no `.venv` exists:
```bash
python3 -m venv .venv && source .venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

Or if using pyproject.toml:
```bash
pip install -e .
```

Or for dev dependencies:
```bash
pip install -e ".[dev]"
```

### 5. Run migrations (if applicable)

```bash
alembic upgrade head
```

If using Django:
```bash
python manage.py migrate
```

Check migration status first:
```bash
alembic history --verbose | head -20
```

### 6. Run tests before deploying

```bash
pytest -q
```

Do not deploy if tests fail.

### 7. Restart service

```bash
sudo systemctl restart {service_name}
```

### 8. Check service status

```bash
sudo systemctl status {service_name} --no-pager
```

Look for `Active: active (running)`. If `failed`, check logs immediately.

### 9. Health check

```bash
curl -s http://localhost:{port}/health
```

Or if no `/health` endpoint:
```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:{port}/
```

Expect `200`. Allow 5-10 seconds for cold start.

### 10. Check logs

```bash
journalctl -u {service_name} --no-pager -n 30
```

Look for startup messages and any errors. No tracebacks = good.

### 11. Verify external access

```bash
curl -s -o /dev/null -w '%{http_code}' https://{subdomain}.sandford.systems/api/
```

Confirms nginx → service → Cloudflare Tunnel chain is working.

---

## Steps (Rust)

### 1. Navigate to repo

```bash
cd ~/Desktop/Repos/{repo_name}
```

### 2. Pull latest code

```bash
git checkout main && git pull origin main
```

### 3. Build release binary

```bash
cargo build --release
```

This takes longer than Python deploys (1-5 minutes). The binary lands in `target/release/`.

### 4. Run tests

```bash
cargo test
```

Do not deploy if tests fail.

### 5. Restart service

```bash
sudo systemctl restart {service_name}
```

The systemd unit should reference the release binary path.

### 6-8. Same as Python steps 8-10

Check status, health check, verify logs.

---

## Steps (Node.js)

### 1. Navigate to repo

```bash
cd ~/Desktop/Repos/{repo_name}
```

### 2. Pull and install

```bash
git checkout main && git pull origin main
npm ci
```

### 3. Build (if TypeScript)

```bash
npm run build
```

### 4. Run tests

```bash
npm test
```

### 5. Restart service

```bash
sudo systemctl restart {service_name}
```

### 6-8. Same as Python steps 8-10

---

## Rollback

If the new deployment has issues:

```bash
# Stop the broken service immediately
sudo systemctl stop {service_name}

# Revert to previous commit
cd ~/Desktop/Repos/{repo_name}
git checkout HEAD~1

# Rebuild (Python)
pip install -r requirements.txt

# Rebuild (Rust)
cargo build --release

# Rebuild (Node)
npm ci && npm run build

# Restart
sudo systemctl start {service_name}

# Verify
curl -s http://localhost:{port}/health
journalctl -u {service_name} --no-pager -n 10

# Return to main when stable
git checkout main
```

For database rollbacks (if migrations were run):
```bash
# Alembic
alembic downgrade -1

# Django
python manage.py migrate {app_name} {previous_migration}
```

## Pre-deploy Checklist

- [ ] Tests pass locally
- [ ] No uncommitted changes on `main`
- [ ] Database backup taken (if migrations involved)
- [ ] Current service is healthy (baseline check)
- [ ] Disk space adequate: `df -h ~/Desktop/Repos/{repo_name}`

## Common Failure Modes

| Failure | Symptom | Resolution |
|---------|---------|------------|
| Service won't start | `systemctl status` shows `failed` | Check `journalctl -u {service_name} -n 50` for traceback |
| Port already in use | `Address already in use` in logs | `lsof -i :{port}` to find the rogue process, kill it |
| Missing env vars | `KeyError` or `ConfigError` in logs | Check `.env` file or systemd `EnvironmentFile=` directive |
| Migration failure | Alembic error on `upgrade head` | Fix migration, or `alembic downgrade -1` and retry |
| Dependency conflict | pip/cargo/npm install fails | Check version pins, clear cache, rebuild |
| Rust compile error | `cargo build` fails | Fix code, check Rust version: `rustc --version` |
| 502 Bad Gateway | nginx can't reach backend | Service not running or wrong port in nginx config |

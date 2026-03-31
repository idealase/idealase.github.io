# Deployment to sandford.systems

> Dispatch this prompt to an agent deploying an application to the sandford.systems server.

## Issue

{issue_url}

## Repository

{repo_name} — clone at `~/Desktop/Repos/{repo_name}`

## Summary

{one_line_summary}

## Build Steps

<!-- Commands to produce the deployable artifact -->

```bash
cd ~/Desktop/Repos/{repo_name}
{install_command}
{build_command}
```

Expected output directory: `{build_output_dir}` (e.g., `dist/`, `build/`, `target/release/`)

## Nginx Configuration

<!-- Create or update the site config -->

File: `/etc/nginx/sites-available/{app_name}`

```nginx
server {
    listen {port};
    server_name {app_name}.sandford.systems;
    root /home/brodie/Desktop/Repos/{repo_name}/{build_output_dir};

    location / {
        try_files $uri $uri/ /index.html;
    }

    # If the app has a backend API:
    # location /api/ {
    #     proxy_pass http://127.0.0.1:{backend_port};
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection "upgrade";
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    #     proxy_read_timeout 86400;
    # }

    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable: `sudo ln -sf /etc/nginx/sites-available/{app_name} /etc/nginx/sites-enabled/`

## Systemd Service (if backend)

<!-- Only needed for apps with a server process -->

File: `/etc/systemd/system/{app_name}.service`

```ini
[Unit]
Description={app_name} backend
After=network.target

[Service]
Type=simple
User=brodie
WorkingDirectory=/home/brodie/Desktop/Repos/{repo_name}
ExecStart={start_command}
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
# Environment=DATABASE_URL=postgresql://...

[Install]
WantedBy=multi-user.target
```

Enable: `sudo systemctl enable --now {app_name}`

## Cloudflare Tunnel

<!-- Expose via cloudflared — config at ~/.cloudflared/config.yml -->

Add an ingress rule:

```yaml
- hostname: {app_name}.sandford.systems
  service: http://localhost:{port}
```

Restart tunnel: `sudo systemctl restart cloudflared`

## Health Check Verification

```bash
# 1. Nginx config is valid
sudo nginx -t

# 2. Reload nginx
sudo systemctl reload nginx

# 3. Local health check
curl -sf http://localhost:{port}/ > /dev/null && echo "✅ Local OK" || echo "❌ Local FAIL"

# 4. External health check (after tunnel is live)
curl -sf https://{app_name}.sandford.systems/ > /dev/null && echo "✅ External OK" || echo "❌ External FAIL"

# 5. Check systemd service status (if backend)
sudo systemctl status {app_name} --no-pager
```

## Rollback Plan

If the deployment fails:

```bash
# 1. Revert to previous build
cd ~/Desktop/Repos/{repo_name}
git checkout {previous_commit_or_tag}
{build_command}

# 2. Restart services
sudo systemctl restart {app_name}  # if backend
sudo systemctl reload nginx

# 3. Verify rollback
curl -sf http://localhost:{port}/ > /dev/null && echo "✅ Rollback OK" || echo "❌ Rollback FAIL"
```

## Constraints

- Do not modify other site configs in `/etc/nginx/sites-available/`
- Do not restart services for other apps
- Verify nginx config with `nginx -t` before reloading
- Use port numbers that don't conflict with existing services (check `ss -tlnp`)
- Keep the Cloudflare tunnel config minimal — one ingress rule per app

## Completion Checklist

- [ ] Build produces artifacts successfully
- [ ] Nginx config created and enabled
- [ ] `nginx -t` passes
- [ ] Systemd service running (if applicable)
- [ ] Cloudflare tunnel ingress rule added
- [ ] Local health check passes
- [ ] External health check passes (via tunnel)
- [ ] Commit with: `deploy({scope}): {description}`

# Simple GitOps Deployment

This repository uses a simplified GitOps approach for static website deployment.

## Deployment Flow

### Production (main branch)
- Push to `main` branch triggers automatic deployment to GitHub Pages
- Includes security checks, testing, and basic health validation
- Production environment: https://idealase.github.io

### Staging (develop/staging branches)  
- Push to `develop` or `staging` branches deploys to staging environment
- Manual workflow dispatch available for on-demand staging deployments
- Staging environment: https://idealase.github.io/staging

## Security

- All workflows use scoped `GITHUB_TOKEN` with minimal permissions
- Security audits run on every deployment
- Pre-deployment validation ensures critical files exist

## Manual Deployment

For staging environment:
```
Go to Actions → Staging Deployment → Run workflow
```

This approach maintains simplicity while providing basic GitOps functionality appropriate for a static website.
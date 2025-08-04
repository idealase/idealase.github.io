# 🚀 Deployment Runbook - idealase.github.io

## Overview

This runbook provides comprehensive procedures for deploying the idealase.github.io static website using our GitOps-driven CI/CD pipeline with advanced deployment strategies.

## Table of Contents

- [Quick Reference](#quick-reference)
- [Deployment Environments](#deployment-environments)
- [Standard Deployment Procedures](#standard-deployment-procedures)
- [Emergency Procedures](#emergency-procedures)
- [Troubleshooting](#troubleshooting)
- [Monitoring and Health Checks](#monitoring-and-health-checks)
- [Rollback Procedures](#rollback-procedures)

## Quick Reference

### Environment URLs
- **Production**: https://idealase.github.io
- **Staging**: https://idealase.github.io/staging (simulated)
- **Preview**: https://idealase.github.io/preview/pr-{NUMBER}

### Key Commands
```bash
# Health check
./scripts/health-check.sh [URL] [--verbose]

# Staging deployment
./scripts/deploy-staging.sh [--dry-run] [--force]

# Preview cleanup
./scripts/cleanup-preview.sh [PR_NUMBER] [--dry-run]
```

### Emergency Contacts
- **DevOps Team**: @devops-team
- **Security Team**: @security-team
- **On-call Engineer**: See PagerDuty rotation

## Deployment Environments

### Development Environment
- **Purpose**: Feature development and local testing
- **Trigger**: Manual local development
- **Approval**: None required
- **Rollback**: Manual

### Staging Environment
- **Purpose**: Pre-production testing and validation
- **Trigger**: Push to `develop` or `staging` branches
- **Approval**: None required
- **Rollback**: Automatic on failure

### Production Environment
- **Purpose**: Live user-facing website
- **Trigger**: Manual workflow dispatch or push to `main`
- **Approval**: Required (see [Production Deployment](#production-deployment))
- **Rollback**: Automatic on failure + manual option

## Standard Deployment Procedures

### 1. Feature Development Deployment

#### Prerequisites
- Feature branch created from `main`
- Local development environment set up
- All tests passing locally

#### Process
1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Develop and Test Locally**
   ```bash
   npm install
   npm test
   ./scripts/health-check.sh file://$(pwd)/index.html --verbose
   ```

3. **Create Pull Request**
   - Push feature branch to GitHub
   - Create PR targeting `main` branch
   - Automatic preview environment will be created
   - Check PR comments for preview URL

#### Expected Outcome
- ✅ Preview environment deployed
- ✅ PR comment with preview URL
- ✅ Automated tests running
- ✅ Security scans completed

### 2. Staging Deployment

#### Prerequisites
- Code merged to `develop` or `staging` branch
- All security checks passed
- Feature testing completed in preview environment

#### Process
1. **Automatic Trigger**
   - Push to `develop` or `staging` branch triggers deployment
   - Monitor GitHub Actions workflow

2. **Manual Trigger (if needed)**
   ```bash
   # Navigate to Actions tab in GitHub
   # Select "Staging Environment Deployment" workflow
   # Click "Run workflow"
   ```

3. **Validation**
   ```bash
   ./scripts/health-check.sh https://idealase.github.io/staging --verbose
   ```

#### Expected Outcome
- ✅ Staging environment updated
- ✅ Smoke tests passed
- ✅ Health checks successful
- ✅ Environment metadata updated

### 3. Production Deployment

#### Prerequisites
- Code tested in staging environment
- All tests and security scans passed
- Deployment approval obtained
- Backup verified

#### Process
1. **Initiate Production Deployment**
   ```bash
   # Navigate to GitHub Actions
   # Select "Production Deployment Pipeline"
   # Fill required inputs:
   #   - deployment_type: standard/hotfix/rollback
   #   - confirm_production: DEPLOY
   # Click "Run workflow"
   ```

2. **Monitor Deployment**
   - Watch GitHub Actions workflow progress
   - Monitor deployment logs
   - Verify health checks

3. **Post-Deployment Verification**
   ```bash
   ./scripts/health-check.sh https://idealase.github.io --verbose
   ```

#### Expected Outcome
- ✅ Production environment updated
- ✅ Zero downtime achieved
- ✅ Health checks passed
- ✅ Monitoring alerts normal
- ✅ Backup created

## Emergency Procedures

### 1. Emergency Rollback

#### When to Use
- Critical production issues detected
- Security vulnerability discovered
- Site unavailable or severely degraded

#### Process
1. **Immediate Rollback**
   ```bash
   # Navigate to GitHub Actions
   # Select "Production Deployment Pipeline"
   # Set deployment_type to "rollback"
   # Set confirm_production to "DEPLOY"
   # Execute immediately
   ```

2. **Verify Rollback**
   ```bash
   ./scripts/health-check.sh https://idealase.github.io --verbose
   ```

3. **Incident Response**
   - Create incident ticket
   - Notify stakeholders
   - Begin root cause analysis

### 2. Hotfix Deployment

#### When to Use
- Critical bug fix needed in production
- Security patch required immediately
- Cannot wait for standard release cycle

#### Process
1. **Create Hotfix Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-fix
   ```

2. **Apply Fix and Test**
   ```bash
   # Make minimal changes
   npm test
   ./scripts/health-check.sh file://$(pwd)/index.html
   ```

3. **Deploy via Production Pipeline**
   - Set deployment_type to "hotfix"
   - Follow production deployment process
   - Monitor closely during deployment

## Troubleshooting

### Common Issues

#### 1. Health Check Failures
```bash
# Check specific issues
./scripts/health-check.sh [URL] --verbose

# Common fixes:
# - Verify all files exist
# - Check HTML validity
# - Validate links and resources
```

#### 2. Deployment Pipeline Failures
```bash
# Check GitHub Actions logs
# Common causes:
# - Dependency installation failures
# - Test failures
# - Security scan failures
# - Network connectivity issues
```

#### 3. Preview Environment Issues
```bash
# Cleanup stale preview environments
./scripts/cleanup-preview.sh --dry-run

# Manual cleanup for specific PR
./scripts/cleanup-preview.sh [PR_NUMBER] --force
```

### Diagnostic Commands

```bash
# Check repository status
git status
git log --oneline -10

# Verify environment configuration
cat config/environments/production.json
cat config/environments/staging.json

# Check recent deployments
ls -la .deployment/
cat .deployment/metadata.json

# Review cleanup logs
cat .cleanup.log
```

## Monitoring and Health Checks

### Automated Monitoring

#### Health Check Endpoints
- **Production**: https://idealase.github.io/
- **Staging**: https://idealase.github.io/staging

#### Key Metrics
- Site availability (uptime)
- Response time
- Error rates
- Content integrity

### Manual Health Checks

#### Pre-Deployment
```bash
# Local validation
npm test
npm run lint
./scripts/health-check.sh file://$(pwd)/index.html

# Staging validation
./scripts/health-check.sh https://idealase.github.io/staging --verbose
```

#### Post-Deployment
```bash
# Production validation
./scripts/health-check.sh https://idealase.github.io --verbose

# Performance check
curl -w "@curl-format.txt" -o /dev/null -s https://idealase.github.io
```

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Response Time | >2s | >5s |
| Error Rate | >1% | >5% |
| Availability | <99.5% | <99% |

## Rollback Procedures

### Automatic Rollback

#### Triggers
- Health check failures
- Error rate > 5%
- Response time > 5s
- Manual trigger

#### Process
1. Automatic detection of failure conditions
2. Immediate traffic switch to previous version
3. Verification of rollback success
4. Incident notification

### Manual Rollback

#### When to Use
- Automatic rollback failed
- Complex issues requiring manual intervention
- Planned rollback for testing

#### Process
```bash
# Emergency manual rollback
# 1. Navigate to GitHub Actions
# 2. Run "Production Deployment Pipeline"
# 3. Set deployment_type to "rollback"
# 4. Monitor rollback progress
# 5. Verify site functionality
./scripts/health-check.sh https://idealase.github.io --verbose
```

## Best Practices

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Security scans clean
- [ ] Staging deployment successful
- [ ] Health checks passed
- [ ] Backup verified
- [ ] Deployment approval obtained

### Post-Deployment Checklist
- [ ] Health checks passed
- [ ] Site functionality verified
- [ ] Performance metrics normal
- [ ] Error rates normal
- [ ] Monitoring alerts clear

### Security Considerations
- [ ] No secrets in code
- [ ] Dependencies up to date
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Access controls verified

## Contact Information

### Team Contacts
- **DevOps Lead**: @devops-lead
- **Security Lead**: @security-lead
- **Development Lead**: @dev-lead

### Escalation Path
1. Repository maintainers
2. DevOps team
3. Security team
4. Management escalation

### External Services
- **GitHub Actions**: https://github.com/idealase/idealase.github.io/actions
- **GitHub Pages**: https://pages.github.com/

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintained By**: DevOps Team

> 🚨 **Emergency Contact**: In case of critical production issues, contact the on-call engineer via PagerDuty or the emergency contact list.
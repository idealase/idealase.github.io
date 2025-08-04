# Security Documentation

## Secret Management

### Overview
This document outlines the security practices for managing secrets in the idealase.github.io repository.

### Secret Detection
We use multiple layers of secret detection:

1. **ESLint no-secrets plugin**: Detects secrets during development
2. **GitHub Secret Scanning**: Native GitHub secret detection
3. **TruffleHog**: Advanced secret scanning in CI/CD
4. **GitLeaks**: Git-focused secret detection

### Secret Configuration

#### Environment Variables
Secrets should never be hardcoded in source code. Use environment variables instead:

```javascript
// ❌ Bad - hardcoded secret
const apiKey = "sk-1234567890abcdef";

// ✅ Good - environment variable
const apiKey = process.env.API_KEY || window.API_KEY;
```

#### Configuration Files
For local development, use configuration files that are excluded from git:

1. Copy `config.example.js` to `config.js`
2. Update `config.js` with your actual values
3. `config.js` is gitignored and will not be committed

#### GitHub Secrets
For production deployment, use GitHub repository secrets:

1. Go to repository Settings → Secrets and variables → Actions
2. Add secrets with descriptive names:
   - `EMAILJS_PUBLIC_KEY`
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `SNYK_TOKEN`

### Secret Rotation Procedures

#### EmailJS Keys
1. Log into EmailJS dashboard
2. Generate new public key
3. Update GitHub repository secrets
4. Update local config.js file
5. Test functionality
6. Revoke old key

#### API Keys
1. Generate new key in service dashboard
2. Update all deployment environments
3. Test all integrations
4. Revoke old key after confirmation

### Incident Response

#### If a Secret is Exposed
1. **Immediate Action**: Revoke the compromised secret immediately
2. **Generate New Secret**: Create a replacement secret
3. **Update Configurations**: Update all environments with new secret
4. **Git History**: Consider rewriting git history if secret was committed
5. **Monitor**: Watch for unauthorized usage of the old secret

#### Detection and Alerts
- GitHub will automatically scan for known secret patterns
- Security workflow runs weekly to detect new secrets
- ESLint rules will warn about potential secrets during development

### Secret Patterns
The following patterns are monitored:

- API keys (high entropy strings)
- Service IDs and template IDs
- Authentication tokens
- Private keys
- Database connection strings

### Baseline Exclusions
Legitimate patterns that look like secrets are documented in `.secrets.baseline`:
- EmailJS public configuration examples
- Service and template ID patterns in documentation
- Test data and placeholders

### Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate secrets regularly** (quarterly minimum)
4. **Use minimal permissions** for API keys
5. **Monitor secret usage** and audit access logs
6. **Review code changes** for accidental secret exposure

### Tools and Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [ESLint no-secrets plugin](https://github.com/nickdeis/eslint-plugin-no-secrets)
- [TruffleHog](https://github.com/trufflesecurity/trufflehog)
- [GitLeaks](https://github.com/zricethezav/gitleaks)

### Contact
For security concerns or questions about secret management, please create an issue or contact the repository maintainers.
# idealase.github.io - Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Architecture Overview

This is a **hybrid React + legacy HTML website** deployed to GitHub Pages at `idealase.github.io` with custom domain `sandford.systems`.

**Main Components:**
- **React Application**: Modern SPA in `/react-website/` directory (primary development focus)
- **Legacy HTML Pages**: Static pages (`about.html`, `login.html`, etc.) that coexist with React app
- **Build Process**: React builds to `/react-website/build/` then copies artifacts to root for GitHub Pages
- **Deployment**: GitHub Actions automatically deploys on push to `main` branch

## Working Effectively

### Bootstrap and Setup
Run these commands in order to set up the development environment:

```bash
# Install root dependencies (security plugins, linting)
npm install

# Install React dependencies 
cd react-website && npm install

# IMPORTANT: EmailJS Configuration (optional for functionality)
# Copy config.example.js to config.js and add your EmailJS credentials
# This is required for contact form functionality but not for development
cp config.example.js config.js
# Edit config.js with your actual EmailJS keys
```

### Build Process
**NEVER CANCEL builds or tests - wait for completion:**

```bash
# Build React application - takes ~15-20 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
cd react-website && npm run build
# This also automatically copies build artifacts to root via postbuild script

# Clean build artifacts (if needed)
cd react-website && npm run build:clean
```

### Testing
```bash
# Run React tests - takes ~3-5 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
cd react-website && CI=true npm test -- --coverage --watchAll=false

# Run single test file
cd react-website && npm test -- App.test.tsx --watchAll=false

# Run tests with specific pattern
cd react-website && npm test -- --testNamePattern="navigation" --watchAll=false

# Run legacy tests (HTML validation, navigation tests) - takes <1 second
cd .. && node tests/run-tests.js

# Run security audit (will show vulnerabilities but should not fail)
cd react-website && npm audit --audit-level=high
```

### Development Server
```bash
# Start React development server - takes ~8-10 seconds to start
cd react-website && npm start
# Serves on http://localhost:3000
# Hot reloading enabled, TypeScript checking included
# NEVER CANCEL the dev server - it runs continuously
```

### Linting and Code Quality
```bash
# IMPORTANT: Exclude build artifacts from linting
# DO NOT run eslint on the entire root - it will fail on build artifacts
npx eslint react-website/src --ext .js,.jsx,.ts,.tsx

# Check specific files only (avoid build directory)
npx eslint js/ tests/ react-website/src/

# Style linting (if stylelint is available)
# Currently not configured but .stylelintrc.json exists
```

## Validation Scenarios

**ALWAYS test these scenarios after making changes:**

### Basic React Application Functionality
1. **Start Development Server**: `cd react-website && npm start`
2. **Navigate**: Visit http://localhost:3000
3. **Test Navigation**: Click through all navigation links (Home, About, Documents, Development, Private Area, Contact)
4. **Verify Routing**: Confirm URL changes to `/#/about`, `/#/contact`, etc.
5. **Check Console**: No critical errors (EmailJS warnings are expected without configuration)

### Contact Form Testing
1. **Navigate to Contact**: Click "Contact" in navigation
2. **Fill Form**: Enter name, email, and message
3. **Submit**: Click "Send Message"
4. **Expected Result**: Either success (if EmailJS configured) or "Failed to fetch" error (if not configured)
5. **Form Validation**: Form should validate required fields

### Build and Deployment Testing
1. **Build Application**: `cd react-website && npm run build` (wait 15-20 seconds)
2. **Verify Output**: Check that `react-website/build/` contains built files
3. **Verify Copy**: Confirm build artifacts copied to root directory (`index.html`, `static/`, etc.)
4. **Test Built Version**: Serve built files locally if needed

## CRITICAL Timing and Timeout Guidelines

- **Development Server Start**: 8-10 seconds (set timeout: 60+ seconds)
- **React Build**: 15-20 seconds (set timeout: 60+ seconds) 
- **React Tests**: 3-5 seconds (set timeout: 30+ seconds)
- **Legacy Tests**: <1 second (set timeout: 30+ seconds)
- **npm install**: 30-60 seconds for react-website (set timeout: 120+ seconds)

**NEVER CANCEL any build, test, or npm install command.** All operations complete quickly in this repository.

## Common Development Patterns

### Making Changes to React Components
1. **Start dev server**: `cd react-website && npm start`
2. **Edit files**: Make changes in `react-website/src/`
3. **Automatic reload**: Changes appear immediately in browser
4. **Test changes**: Navigate through affected pages
5. **Run tests**: `CI=true npm test -- --coverage --watchAll=false`
6. **Build for production**: `npm run build`

### Adding New Pages or Components
1. **Create component**: Add new `.tsx` file in `react-website/src/components/`
2. **Update routing**: Add route in `react-website/src/App.tsx`
3. **Update navigation**: Add link in `react-website/src/components/Navigation.tsx`
4. **Test thoroughly**: Use validation scenarios above
5. **Add tests**: Update `react-website/src/App.test.tsx` if needed

### Working with Legacy HTML Pages
- **Files**: `about.html`, `login.html`, `documents.html`, etc. in root directory
- **Testing**: Run `node tests/run-tests.js` to validate navigation structure
- **DO NOT DELETE**: These coexist with React app for backward compatibility
- **Security features**: `login.html` has client-side authentication demo (not production-ready)

## Security and Configuration

### EmailJS Setup (Optional)
```bash
# Copy example configuration
cp config.example.js config.js

# Edit config.js with your credentials:
# window.EMAILJS_PUBLIC_KEY = 'your_key_here';
# window.EMAILJS_SERVICE_ID = 'your_service_id';
# window.EMAILJS_TEMPLATE_ID = 'your_template_id';
```

### Secret Management
- **NEVER commit secrets** to git (config.js is in .gitignore)
- **Use GitHub Secrets** for production: `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`
- **Security scanning**: Automated via GitHub Actions and ESLint plugins

## Troubleshooting

### Common Issues and Solutions

**Build Artifacts in Git:**
- Run `cd react-website && npm run build:clean` to remove artifacts
- Artifacts in root are needed for GitHub Pages deployment

**Linting Errors on Build Files:**
- DO NOT lint `build/`, `static/`, or root-level build artifacts
- Lint only source: `npx eslint react-website/src`

**EmailJS Contact Form Errors:**
- Expected without configuration
- Configure EmailJS credentials in `config.js`
- Error messages indicate form validation is working

**Development Server Issues:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules && npm install`
- Check port 3000 is available

### CI/CD Pipeline
- **GitHub Actions**: `.github/workflows/main.yml`
- **Process**: Security checks → Tests → Build → Deploy to GitHub Pages
- **Manual trigger**: Use workflow_dispatch if needed
- **Deployment**: Automatic on push to `main` branch

## Key Conventions and Patterns

### Component Architecture
- **Styled-components**: All styling uses styled-components CSS-in-JS approach
- **File naming**: Component files use PascalCase (e.g., `HomePage.tsx`, `Navigation.tsx`)
- **Component structure**: Each page component is self-contained with its own styled components
- **Routing**: HashRouter (`/#/path`) for GitHub Pages compatibility

### Styling Conventions
- **Color palette**: Nord-inspired theme with `#88c0d0` (frost blue), `#5e81ac` (storm blue), `#1d1d1d` (background), `#e1e1e1` (text)
- **Typography**: Inter for body, Fira Code for code blocks
- **Animations**: Framer Motion for page transitions and component animations
- **Responsive**: Mobile-first approach with styled-components media queries

### State Management
- **No global state library**: Uses React hooks (useState, useEffect) for local state
- **EmailJS integration**: Contact form uses @emailjs/browser package
- **Form handling**: Direct form submission via EmailJS, no intermediate state management

### Security Patterns
- **Secret management**: Never commit `config.js` (use `config.example.js` as template)
- **ESLint security plugins**: `eslint-plugin-security` and `eslint-plugin-no-secrets` enabled
- **CSP headers**: Security headers configured (see SECURITY.md)
- **npm overrides**: Use package.json overrides to patch vulnerable transitive dependencies

## Quick Reference Commands

```bash
# Complete setup from fresh clone
npm install && cd react-website && npm install

# Start development
cd react-website && npm start

# Run all tests
cd react-website && CI=true npm test -- --coverage --watchAll=false && cd .. && node tests/run-tests.js

# Build for production  
cd react-website && npm run build

# Lint source code only (avoid build artifacts)
npx eslint react-website/src --ext .js,.jsx,.ts,.tsx

# Security audit
cd react-website && npm audit --audit-level=high
```

Remember: This is a **"vibe-coded"** project built through AI-assisted development and natural language prompts. Embrace the iterative, feeling-driven development approach described in the README.md.
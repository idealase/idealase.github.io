# sandford.systems

> *"A modern and sophisticated React site, built entirely from vibes."*

## 🌀 The Vibe-Coded Manifesto

This website is a **living experiment in emergent development** — a site that documents its own creation through intuition, AI collaboration, and the pure joy of building without rigid blueprints. It's not just a portfolio; it's a showcase of what happens when you let aesthetic instinct drive technical decisions.

### What is "Vibe Coding"?

Vibe coding is the practice of building software through feeling rather than feature lists. Instead of detailed specifications, we start with prompts like:
- *"Make it feel like walking through a dream"*
- *"Add something that slowly breaks apart if you stare at it too long"*
- *"This needs to breathe more"*

This project demonstrates how **AI-assisted development** can transform abstract creative vision into functional, modern web applications — one prompt at a time.

## 🏗️ Architectural Evolution

This repository chronicles a fascinating transformation from static HTML to a sophisticated React application:

### Phase 1: Origins (HTML/CSS/JS)
- `index.html`, `about.html`, `documents.html` - Static pages with vanilla JavaScript
- `css/styles.css` - Traditional stylesheet approach
- `js/script.js` - Interactive features and EmailJS integration
- `tests/` - Custom testing framework for validation

### Phase 2: React Renaissance (`/react-website/`)
- **React 19.1.0** with TypeScript for type safety
- **Styled-components** for component-scoped styling with CSS-in-JS
- **Framer Motion** for fluid animations and page transitions
- **React Router** for seamless client-side navigation
- **Modern development workflow** with hot reloading and build optimization

## ✨ Current Features

### 🎨 Interactive Experiences
- **Arrow Visualization** - Canvas-based interactive element that responds to mouse movement
- **Hero Section** with animated background patterns and scroll prompts
- **Smooth Page Transitions** powered by Framer Motion
- **Responsive Design** that adapts from mobile to desktop

### 📧 Functional Contact System
- **EmailJS Integration** with service_bhhay7a for real email sending
- **Form Validation** with visual feedback and error handling
- **Success/Error States** with animated confirmations

### 🎭 Aesthetic Philosophy
- **Nord-inspired Color Palette** (`#88c0d0`, `#5e81ac`, `#1d1d1d`)
- **Typography Mixing** - Inter for body text, Fira Code for code blocks
- **Dark Theme** with subtle gradients and transparency effects
- **Micro-animations** that enhance without overwhelming

## 🛠️ Technical Stack

### Legacy Layer (Still Active)
```
HTML5 + CSS3 + Vanilla JavaScript
├── EmailJS for contact forms
├── Custom testing framework
└── Static deployment via GitHub Pages
```

### Modern Layer (Primary Development)
```
React 19.1.0 + TypeScript
├── Styled-components for CSS-in-JS
├── Framer Motion for animations
├── React Router for navigation
├── EmailJS @emailjs/browser integration
└── CI/CD via GitHub Actions
```

## 🚀 Getting Started

### For the Modern React App
```bash
# Navigate to the React project
cd react-website

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### For the Original HTML Version
```bash
# Install dependencies for testing
npm install

# Start local server
npm start

# Run tests
npm test
```

## 📁 Project Structure

```
sandford.systems/
├── 📄 Legacy HTML files (index.html, about.html, etc.)
├── 📁 css/ - Original stylesheets
├── 📁 js/ - Vanilla JavaScript functionality
├── 📁 tests/ - Custom testing suite
├── 📁 static/ - Build artifacts from React app
└── 📁 react-website/ - Modern React application
    ├── 📁 src/
    │   ├── 📁 components/ - React components
    │   │   ├── HomePage.tsx - Hero section + interactive elements
    │   │   ├── Navigation.tsx - Responsive nav with active states
    │   │   ├── ArrowVisualization.tsx - Canvas-based interaction
    │   │   ├── DevelopmentPage.tsx - Timeline of project evolution
    │   │   ├── DocumentsPage.tsx - Resource grid layout
    │   │   ├── AboutPage.tsx - Skills and background info
    │   │   ├── LoginPage.tsx - Authentication interface
    │   │   └── PerthBeerCuratorPage.tsx - Beer rating form
    │   ├── App.tsx - Routing and layout
    │   ├── GlobalStyles.tsx - Styled-components theme
    │   └── index.tsx - React entry point
    └── 📁 build/ - Production build output
```

## 🎯 Vibe-Driven Development Examples

This project showcases how natural language prompts translate into functional features:

### Prompt: *"Make the homepage feel like floating in space"*
**Result**: Hero section with subtle grid patterns, radial gradients, and smooth scroll animations

### Prompt: *"Add something interactive that follows the mouse"*
**Result**: ArrowVisualization component with canvas-based particle tracking

### Prompt: *"The navigation needs to feel more alive"*
**Result**: Sticky nav with scroll-based transparency, active states, and hover animations

### Prompt: *"Create a timeline that shows the evolution of the site"*
**Result**: DevelopmentPage with animated timeline markers and code samples

## 🌊 The Aesthetic Philosophy

### Color Psychology
- **`#88c0d0`** (Frost Blue) - Primary accent, evokes calm technology
- **`#5e81ac`** (Storm Blue) - Secondary accent, suggests depth
- **`#1d1d1d`** (Void) - Background that lets content breathe
- **`#e1e1e1`** (Whisper) - Text that's easy on the eyes

### Motion Design
- **Entrance animations** - Content fades in from below with staggered timing
- **Hover states** - Subtle scale transforms and color transitions
- **Page transitions** - Smooth opacity changes without jarring movements
- **Interactive feedback** - Elements respond to user attention

### Typography Hierarchy
- **Headings** - Clean, geometric forms that command attention
- **Body text** - Inter font family for maximum readability
- **Code** - Fira Code for technical content with ligature support

## 🚀 Deployment & CI/CD

### Current Infrastructure Issues
⚠️ **Active Issue**: Duplicate deployment workflows causing race conditions
- Custom GitHub Actions workflow (`main.yml`)
- Automatic GitHub Pages deployment
- **Impact**: Resource waste and unpredictable deployments

### Hosting Strategy
- **Primary**: GitHub Pages at `idealase.github.io`
- **Source**: React build artifacts in `/build` directory
- **Domain**: `sandford.systems` (configured via DNS)

## 🧪 Testing Philosophy

### Legacy Testing
```bash
npm test  # Runs HTML validation, CSS linting, JS linting
```

### React Testing Strategy
- **Component Testing** - Isolated unit tests for UI components
- **Integration Testing** - User flow validation
- **Visual Regression** - Ensuring aesthetic consistency

## 🎨 Contributing to the Vibe

This project thrives on intuitive, feeling-driven development. When contributing:

1. **Lead with sensation** - How should this feature *feel*?
2. **Iterate through prompts** - Use natural language to describe desired outcomes
3. **Embrace emergence** - Let the AI suggest unexpected directions
4. **Document the journey** - Capture the creative process, not just the result

### Example Contribution Flow
```
User: "The contact form feels too corporate"
AI: *Adjusts styling for warmer colors, softer borders*
User: "Better, but it needs more personality"
AI: *Adds subtle animations, custom focus states*
Result: Form that feels more human and approachable
```

## 📈 Future Vibes

Potential directions for continued exploration:

- **Psychic Mirror Feature** - Pages that adapt to user responses to abstract questions
- **Ambient Sound Integration** - Background audio that shifts with page content
- **Interactive Poetry** - Text that responds to cursor proximity
- **Seasonal Themes** - Aesthetic shifts based on time and weather
- **Memory System** - Site remembers and evolves with repeat visitors

## 📜 License & Philosophy

This project is **open source** and available for personal use. More importantly, it's an invitation to explore the intersection of human creativity and AI capability.

The code is the artifact, but the **vibe is the art**.

---

*Built with VS Code Copilot Agent Mode, one prompt at a time. 🤖✨*
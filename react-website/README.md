# Modern React Website

A sophisticated, modern React website built with TypeScript, styled-components, and framer-motion for smooth animations and transitions.

## Features

- 🔥 Modern React with TypeScript and Hooks
- 💅 Styled with styled-components for component-based styling
- 🚀 Animation effects using framer-motion
- 🧭 React Router for seamless client-side navigation
- 📱 Fully responsive design for all device sizes
- 📧 Contact form with EmailJS integration
- 🎨 Interactive Arrow Visualization with canvas

## Project Structure

The project is organized into components and follows modern React best practices:

- `src/components/` - Reusable React components
  - `Navigation.tsx` - Modern, responsive navigation bar
  - `HomePage.tsx` - Main landing page with hero section
  - `ArrowVisualization.tsx` - Interactive canvas element
  - `Contact.tsx` - Contact form with EmailJS integration
- `src/GlobalStyles.tsx` - Global styling using styled-components
- `src/App.tsx` - Main application with routing

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/first-js.git
cd first-js/react-website
```

2. Install dependencies:
```bash
npm install
```

3. Update EmailJS credentials:
Open `src/components/Contact.tsx` and replace the placeholder with your EmailJS public key.

4. Start the development server:
```bash
npm start
```

5. Build for production:
```bash
npm run build
```

## Improvements Over Original Version

This React version offers several improvements over the original HTML/CSS/JS version:

- **Component-Based Architecture** - Modular, reusable components
- **State Management** - Uses React hooks for better state management
- **Animations** - Smoother transitions and animations with framer-motion
- **Styling** - Enhanced styling with styled-components
- **Routing** - Client-side routing without page reloads
- **TypeScript** - Type safety for better developer experience and fewer bugs

## Deployment

This website can be deployed to various platforms:

- **Vercel**: Easiest deployment option with GitHub integration
- **Netlify**: Another simple option with CI/CD
- **GitHub Pages**: Can be deployed using gh-pages package
- **AWS/Azure**: For more complex hosting needs

## License

This project is open source and available for personal use.

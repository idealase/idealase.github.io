import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #1d1d1d;
    color: #e1e1e1;
    line-height: 1.6;
  }
  
  code, pre {
    font-family: 'Fira Code', source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    text-decoration: none;
    color: #88c0d0;
    transition: color 0.3s ease;
    
    &:hover {
      color: #5e81ac;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  p {
    margin-bottom: 1rem;
  }

  button {
    cursor: pointer;
  }

  section {
    padding: 2rem 0;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #2e3440;
  }

  ::-webkit-scrollbar-thumb {
    background: #4c566a;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #5e81ac;
  }

  /* Page transition animations */
  .page-transition-enter {
    opacity: 0;
    transform: translateY(15px);
  }

  .page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms, transform 300ms;
  }

  .page-transition-exit {
    opacity: 1;
    transform: translateY(0);
  }

  .page-transition-exit-active {
    opacity: 0;
    transform: translateY(-15px);
    transition: opacity 300ms, transform 300ms;
  }
`;

export default GlobalStyles;
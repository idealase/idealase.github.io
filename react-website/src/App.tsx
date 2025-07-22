import React from 'react';
import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyles from './GlobalStyles';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import DocumentsPage from './components/DocumentsPage';
import DevelopmentPage from './components/DevelopmentPage';
import LoginPage from './components/LoginPage';
import PerthBeerCuratorPage from './components/PerthBeerCuratorPage';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

const Footer = styled.footer`
  background-color: rgba(25, 25, 25, 0.95);
  padding: 1.5rem;
  text-align: center;
  color: #e1e1e1;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
`;

function App() {
  return (
    <HashRouter>
      <AppContainer>
        <GlobalStyles />
        <Navigation />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/development" element={<DevelopmentPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/perth-beer-curator" element={<PerthBeerCuratorPage />} />
            <Route path="/contact" element={<HomePage />} /> {/* Contact is part of HomePage */}
          </Routes>
        </MainContent>
        <Footer>
          <p>&copy; 2025 My Website | <a href="https://github.com/idealase/idealase.github.io" target="_blank" rel="noopener noreferrer">GitHub</a></p>
        </Footer>
      </AppContainer>
    </HashRouter>
  );
}

export default App;

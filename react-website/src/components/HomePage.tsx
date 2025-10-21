import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ArrowVisualization from './ArrowVisualization';
import Contact from './Contact';
import FaultyTerminal from './FaultyTerminal';

const HomeContainer = styled.div`
  min-height: 100vh;
  background-color: #1d1d1d;
`;

const HeroSection = styled.section`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 80vh;
    min-height: 600px;
  }

  @media (max-width: 480px) {
    height: 70vh;
    min-height: 500px;
  }
`;


const HeroContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  max-width: 800px;
  width: 100%;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  color: #e1e1e1;
  margin-bottom: 1.5rem;
  line-height: 1.1;

  span {
    color: #88c0d0;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: #d8dee9;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ScrollPrompt = styled(motion.button)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #88c0d0;
  font-size: 0.9rem;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 2;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(136, 192, 208, 0.1);
    transform: translateX(-50%) translateY(-2px);
  }

  &:focus {
    outline: 2px solid #88c0d0;
    outline-offset: 2px;
    background-color: rgba(136, 192, 208, 0.1);
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid #88c0d0;
    outline-offset: 2px;
  }
`;

const ScrollArrow = styled.div`
  width: 30px;
  height: 30px;
  margin-top: 10px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 2rem;
  color: #e1e1e1;
`;

const SectionTitle = styled.h2`
  color: #e1e1e1;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, #5e81ac, #88c0d0);
  }
`;

const IntroText = styled.p`
  max-width: 760px;
  margin: 0 auto 2.5rem auto;
  font-size: 1.2rem;
  line-height: 1.8;
  text-align: center;
  color: #d8dee9;
`;

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'sandford.systems';
  }, []);

  const scrollToContent = () => {
    document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToContent();
    }
  };

  return (
    <HomeContainer>
      <HeroSection role="banner" aria-label="Welcome section">
        <FaultyTerminal
          scale={3}
          gridMul={[2, 1]}
          digitSize={1.4}
          timeScale={1.9}
          pause={false}
          scanlineIntensity={2}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={0.6}
          chromaticAberration={0}
          dither={0}
          curvature={0.17}
          tint="#4b6f8b"
          mouseReact={true}
          mouseStrength={1.4}
          pageLoadAnimation={false}
          brightness={0.5}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0
          }}
        />
        <HeroContent>
          <Title
            as="h1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to <span>sandford.systems</span>
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            A modern and sophisticated React site, built entirely from vibes.
          </Subtitle>
        </HeroContent>
        <ScrollPrompt
          onClick={scrollToContent}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Scroll down to main content"
          title="Click or press Enter/Space to scroll to main content"
        >
          <span>Scroll Down to Explore</span>
          <ScrollArrow aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 13l5 5 5-5"></path>
              <path d="M7 6l5 5 5-5"></path>
            </svg>
          </ScrollArrow>
        </ScrollPrompt>
      </HeroSection>

      <main>
        <ContentSection id="content" aria-label="Main content">
          <SectionTitle as="h2">About sandford.systems</SectionTitle>
          <IntroText>
            sandford.systems is a digital playground for ideas around secure-by-
            design software, resilient infrastructure, and thoughtful product
            development. Expect deep dives into tooling, experiments with user
            experience, and the occasional detour into creative technology
            tangents.
          </IntroText>
          <ArrowVisualization />
        </ContentSection>

        <Contact />
      </main>
    </HomeContainer>
  );
};

export default HomePage;
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ArrowVisualization from './ArrowVisualization';
import FaultyTerminal from './FaultyTerminal';
import InteractiveTerminal from './InteractiveTerminal';

const HomeContainer = styled.div`
  min-height: 100vh;
  background-color: #1d1d1d;
`;

const HeroSection = styled.section`
  /* Fill the viewport below the sticky nav; content can grow past it on short screens. */
  min-height: calc(100vh - 60px);
  min-height: calc(100svh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem 7rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  isolation: isolate;
`;

const VisuallyHidden = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const ScrollPrompt = styled(motion.button)`
  /* Centred without transform: Framer Motion owns the transform for hover/tap. */
  position: absolute;
  bottom: 1.5rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: fit-content;
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
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(136, 192, 208, 0.1);
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
  scroll-margin-top: 4rem;
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

// Hoisted so the WebGL effect isn't torn down and rebuilt on every render
// (its setup effect depends on these values, including the gridMul array).
const BACKDROP_PROPS = {
  scale: 3,
  gridMul: [2, 1] as [number, number],
  digitSize: 1.4,
  timeScale: 1.9,
  scanlineIntensity: 2,
  glitchAmount: 1,
  flickerAmount: 1,
  noiseAmp: 0.6,
  chromaticAberration: 0,
  dither: 0,
  curvature: 0.17,
  tint: '#4b6f8b',
  mouseStrength: 1.4,
  pageLoadAnimation: false,
  brightness: 0.5,
  style: { zIndex: 0 },
};

const usePrefersReducedMotion = () => {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches,
  );

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
};

const HomePage: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    document.title = 'sandford.systems';
  }, []);

  const scrollToContent = () => {
    document.getElementById('content')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToContent();
    }
  };

  return (
    <HomeContainer>
      <HeroSection aria-label="Interactive terminal">
        <VisuallyHidden>sandford.systems</VisuallyHidden>
        <FaultyTerminal {...BACKDROP_PROPS} pause={reducedMotion} mouseReact={!reducedMotion} />
        <InteractiveTerminal />
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

      <ContentSection id="content" aria-labelledby="intro-heading">
        <SectionTitle id="intro-heading">What is this place?</SectionTitle>
        <IntroText>
          sandford.systems is a digital playground for ideas around secure-by-design software, resilient
          infrastructure, and thoughtful product development, built almost entirely by vibe coding. Expect
          experiments with tooling and user experience, and the occasional detour into creative technology tangents.
        </IntroText>
        <ArrowVisualization />
      </ContentSection>
    </HomeContainer>
  );
};

export default HomePage;
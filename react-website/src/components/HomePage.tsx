import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ArrowVisualization from './ArrowVisualization';
import Contact from './Contact';

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
  background: linear-gradient(135deg, rgba(29, 29, 29, 0.95) 0%, rgba(35, 35, 35, 0.95) 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, transparent 20%, #1d1d1d 80%);
    opacity: 0.7;
    z-index: 1;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(94, 129, 172, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(94, 129, 172, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 0;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
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
  color: #b8b8b8;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ScrollPrompt = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #88c0d0;
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 2;
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

const HomePage: React.FC = () => {
  const scrollToContent = () => {
    document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HomeContainer>
      <HeroSection>
        <BackgroundPattern />
        <HeroContent>
          <Title
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
            A modern and sophisticated React application showcasing interactive elements and smooth user experience.
          </Subtitle>
        </HeroContent>
        <ScrollPrompt
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ y: 5 }}
        >
          Scroll Down
          <ScrollArrow>
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

      <ContentSection id="content">
        <SectionTitle>Home</SectionTitle>
        <p>Welcome to my first React website! This is a modern and sophisticated version of my original JavaScript site.</p>
        <ArrowVisualization />
      </ContentSection>

      <Contact />
    </HomeContainer>
  );
};

export default HomePage;
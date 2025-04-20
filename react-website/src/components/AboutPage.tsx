import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutContainer = styled.div`
  min-height: 100vh;
  background-color: #1d1d1d;
  padding-top: 2rem;
`;

const ContentSection = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: #e1e1e1;
`;

const Title = styled(motion.h2)`
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

const AboutContent = styled.div`
  background-color: rgba(35, 35, 35, 0.6);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  margin-top: 2rem;
`;

const SkillsList = styled.ul`
  list-style-position: inside;
  margin: 1rem 0 2rem;
  padding-left: 1rem;
  
  li {
    margin-bottom: 0.5rem;
    position: relative;
    padding-left: 0.5rem;
    
    &::before {
      content: "•";
      color: #88c0d0;
      font-weight: bold;
      display: inline-block;
      margin-right: 1rem;
    }
  }
`;

const SectionTitle = styled.h3`
  color: #88c0d0;
  margin: 2rem 0 1rem;
  font-size: 1.5rem;
`;

const LinkSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(100, 100, 100, 0.3);
`;

const StyledLink = styled.a`
  display: inline-block;
  margin: 0.5rem 0;
  padding: 0.75rem 1.5rem;
  background-color: rgba(94, 129, 172, 0.2);
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(94, 129, 172, 0.3);
    transform: translateY(-2px);
  }
`;

const AboutPage: React.FC = () => {
  return (
    <AboutContainer>
      <ContentSection>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About
        </Title>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          This is a simple website built with React, TypeScript, and styled-components.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          It was created as a learning project to understand the basics of modern front-end development.
        </motion.p>
        
        <AboutContent>
          <SectionTitle>My Skills</SectionTitle>
          <SkillsList>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
            <li>TypeScript</li>
            <li>React</li>
            <li>Styled Components</li>
          </SkillsList>
          
          <SectionTitle>My Background</SectionTitle>
          <p>I am a front-end developer learning how to build sophisticated websites with React. This website represents my evolution from simple HTML/CSS/JS to modern web development frameworks.</p>
          
          <LinkSection>
            <SectionTitle>Project Repository</SectionTitle>
            <p>
              <StyledLink 
                href="https://github.com/yourusername/first-js" 
                target="_blank"
                rel="noopener noreferrer"
              >
                View this project on GitHub
              </StyledLink>
            </p>
            <p>
              <StyledLink 
                href="https://github.com/yourusername/first-js/actions" 
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Actions Deployments
              </StyledLink>
            </p>
          </LinkSection>
        </AboutContent>
      </ContentSection>
    </AboutContainer>
  );
};

export default AboutPage;
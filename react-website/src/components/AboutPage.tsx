import React, { useEffect } from 'react';
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
  line-height: 1.7;
`;

const SectionTitle = styled.h3`
  color: #88c0d0;
  margin: 2rem 0 1rem;
  font-size: 1.5rem;
`;

const StyledList = styled.ul`
  list-style-position: inside;
  margin: 1rem 0 2rem;
  padding-left: 1rem;

  li {
    margin-bottom: 0.75rem;
    position: relative;
    padding-left: 0.5rem;

    &::before {
      content: '•';
      color: #88c0d0;
      font-weight: bold;
      display: inline-block;
      margin-right: 1rem;
    }
  }
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

const InlineLink = styled.a`
  color: #88c0d0;
  text-decoration: none;
  border-bottom: 1px solid rgba(136, 192, 208, 0.4);
  transition: border-bottom-color 0.3s ease;

  &:hover {
    border-bottom-color: rgba(136, 192, 208, 0.8);
  }
`;

const Whisper = styled.p`
  margin-top: 2rem;
  font-size: 0.95rem;
  font-style: italic;
  color: rgba(225, 225, 225, 0.7);
`;

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About - sandford.systems';
  }, []);

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
          sandford.systems is a chronicle of learning—an evolving space for testing ideas, cataloging discoveries, and
          experimenting with modern tooling.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          It has grown from static HTML sketches into a living archive of experiments, prototypes, and notes collected while
          exploring the modern web stack.
        </motion.p>

        <AboutContent>
          <SectionTitle>About This Website</SectionTitle>
          <p>
            This site started as a playground for learning the absolute basics of the web stack and now captures every
            experiment along the way.
          </p>

          <SectionTitle>Development Story</SectionTitle>
          <p>
            The project kicked off with static HTML pages that documented each small breakthrough. As new ideas surfaced, the
            site absorbed them: stylesheets were refactored, shared JavaScript utilities emerged, and an embedded React sandbox
            appeared to document modern component explorations. Every branch of the repository doubles as documentation of what
            was tried, why it mattered, and what was left behind for future reflection.
          </p>

          <SectionTitle>Documentation &amp; Resources</SectionTitle>
          <StyledList>
            <li>
              Project source, issues, and development logs live in the{' '}
              <InlineLink
                href="https://github.com/idealase/idealase.github.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub repository
              </InlineLink>
              .
            </li>
            <li>
              Historical context for the "First JS" prototype, including notes on the original vanilla JavaScript widgets, can
              be found in the{' '}
              <InlineLink href="/documents.html">documents section</InlineLink>.
            </li>
            <li>
              Experiments with authentication, security headers, and testing are captured across the{' '}
              <code>tests/</code> folder and the linked reports.
            </li>
          </StyledList>

          <SectionTitle>What You Can Explore</SectionTitle>
          <StyledList>
            <li>Timeline snapshots of each refactor and technology spike.</li>
            <li>Comparisons between static and React-driven interfaces.</li>
            <li>Security hardening notes, accessibility checklists, and lessons learned.</li>
          </StyledList>

          <Whisper>
            Psst... the backstage{' '}
            <InlineLink href="/login.html">portal</InlineLink> is tucked away right here for those who know to look.
          </Whisper>

          <LinkSection>
            <SectionTitle>Project Repository</SectionTitle>
            <p>
              <StyledLink
                href="https://github.com/idealase/idealase.github.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                View this project on GitHub
              </StyledLink>
            </p>
            <p>
              <StyledLink
                href="https://github.com/idealase/idealase.github.io/actions"
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

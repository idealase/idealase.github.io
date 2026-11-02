import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { DOCUMENTS } from '../data/siteContent';

const DocumentsContainer = styled.div`
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

const Title = styled(motion.h1)`
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

const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const DocumentCard = styled(motion.div)`
  background-color: rgba(35, 35, 35, 0.6);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const DocumentHeader = styled.div`
  background: linear-gradient(135deg, #5e81ac, #88c0d0);
  padding: 1.5rem;

  h2 {
    color: #ffffff;
    margin: 0;
    font-size: 1.3rem;
  }
`;

const DocumentBody = styled.div`
  padding: 1.5rem;

  p {
    font-size: 0.95rem;
    color: #b8b8b8;
    margin-bottom: 1.5rem;
  }
`;

const InlineLink = styled(RouterLink)`
  color: #88c0d0;
`;

const DocumentLink = styled.a`
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: rgba(94, 129, 172, 0.2);
  color: #88c0d0;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(94, 129, 172, 0.3);
    color: #afd4de;
  }
`;

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const DocumentsPage: React.FC = () => {

  useEffect(() => {
    document.title = 'Documents - sandford.systems';
  }, []);

  return (
    <DocumentsContainer>
      <ContentSection>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Documents
        </Title>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Long-form writing: essays, thought experiments and alternative histories. Looking for READMEs, repos or
          CI runs? They live on the <InlineLink to="/development">Development</InlineLink> page.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <DocumentGrid>
            {DOCUMENTS.map((doc) => (
              <DocumentCard key={doc.slug} variants={itemVariants}>
                <DocumentHeader>
                  <h2>{doc.title}</h2>
                </DocumentHeader>
                <DocumentBody>
                  <p>{doc.description}</p>
                  <DocumentLink href={doc.link} target="_blank" rel="noopener noreferrer">Read</DocumentLink>
                </DocumentBody>
              </DocumentCard>
            ))}
          </DocumentGrid>
        </motion.div>
      </ContentSection>
    </DocumentsContainer>
  );
};

export default DocumentsPage;
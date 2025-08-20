import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

  h3 {
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
  const documents = [
    {
      id: 1,
      title: 'Project README',
      description: 'Main project documentation covering the website architecture, features, and development philosophy.',
      link: 'https://github.com/idealase/idealase.github.io/blob/main/README.md'
    },
    {
      id: 2,
      title: 'React App Documentation',
      description: 'Technical reference for the modern React application including setup, features, and deployment.',
      link: 'https://github.com/idealase/idealase.github.io/blob/main/react-website/README.md'
    },
    {
      id: 3,
      title: 'Security Guidelines',
      description: 'Comprehensive security documentation covering secret management, dependency security, and best practices.',
      link: 'https://github.com/idealase/idealase.github.io/blob/main/SECURITY.md'
    },
    {
      id: 4,
      title: 'GitHub Actions',
      description: 'View the CI/CD pipeline, workflow runs, and deployment automation for this project.',
      link: 'https://github.com/idealase/idealase.github.io/actions'
    },
    {
      id: 5,
      title: 'Repository Issues',
      description: 'Browse open and closed issues, bug reports, and feature requests for the project.',
      link: 'https://github.com/idealase/idealase.github.io/issues'
    },
    {
      id: 6,
      title: 'Pull Requests',
      description: 'Review code changes, contributions, and development history through pull requests.',
      link: 'https://github.com/idealase/idealase.github.io/pulls'
    }
  ];

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
          Browse our collection of documents, guides, and resources to help you get the most out of our services.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <DocumentGrid>
            {documents.map((doc) => (
              <DocumentCard key={doc.id} variants={itemVariants}>
                <DocumentHeader>
                  <h3>{doc.title}</h3>
                </DocumentHeader>
                <DocumentBody>
                  <p>{doc.description}</p>
                  <DocumentLink href={doc.link} target="_blank" rel="noopener noreferrer">View Document</DocumentLink>
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
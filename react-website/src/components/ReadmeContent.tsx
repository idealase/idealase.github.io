import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import DecryptedText from './DecryptedText';

const ReadmeContainer = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const MarkdownContent = styled.div`
  color: #e1e1e1;
  line-height: 1.7;

  h1 {
    color: #88c0d0;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #5e81ac;
    padding-bottom: 0.5rem;
  }

  h2 {
    color: #88c0d0;
    font-size: 2rem;
    margin: 2rem 0 1rem 0;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: -1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 1.5rem;
      background: linear-gradient(to bottom, #5e81ac, #88c0d0);
    }
  }

  h3 {
    color: #88c0d0;
    font-size: 1.5rem;
    margin: 1.5rem 0 0.8rem 0;
  }

  h4 {
    color: #b8b8b8;
    font-size: 1.2rem;
    margin: 1rem 0 0.5rem 0;
  }

  p {
    margin-bottom: 1rem;
    color: #e1e1e1;
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
    color: #e1e1e1;
  }

  code {
    background: rgba(94, 129, 172, 0.1);
    border: 1px solid rgba(94, 129, 172, 0.2);
    border-radius: 4px;
    padding: 0.2rem 0.4rem;
    font-family: 'Fira Code', monospace;
    color: #88c0d0;
    font-size: 0.9rem;
  }

  pre {
    background: rgba(29, 29, 29, 0.8);
    border: 1px solid rgba(94, 129, 172, 0.2);
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
    overflow-x: auto;
    
    code {
      background: none;
      border: none;
      padding: 0;
      color: #e1e1e1;
    }
  }

  blockquote {
    border-left: 4px solid #5e81ac;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #b8b8b8;
    font-style: italic;
  }

  strong {
    color: #88c0d0;
    font-weight: 600;
  }

  em {
    color: #b8b8b8;
    font-style: italic;
  }

  a {
    color: #88c0d0;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s ease;

    &:hover {
      border-bottom-color: #88c0d0;
    }
  }

  hr {
    border: none;
    height: 1px;
    background: linear-gradient(to right, transparent, #5e81ac, transparent);
    margin: 2rem 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  th, td {
    border: 1px solid rgba(94, 129, 172, 0.2);
    padding: 0.8rem;
    text-align: left;
  }

  th {
    background: rgba(94, 129, 172, 0.1);
    color: #88c0d0;
    font-weight: 600;
  }

  td {
    background: rgba(29, 29, 29, 0.3);
  }
`;

// Component to render markdown content with decryption effect
const DecryptedMarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  return (
    <DecryptedText 
      text={content}
      animateOn="view"
      sequential={true}
      revealDirection="start"
      speed={25}
      maxIterations={15}
      useOriginalCharsOnly={true}
    />
  );
};

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #b8b8b8;
  font-size: 1.1rem;
`;

const ErrorState = styled.div`
  color: #d08770;
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
`;

const ReadmeContent: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldStartDecryption, setShouldStartDecryption] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const response = await fetch('/README.md');
        if (!response.ok) {
          throw new Error('Failed to fetch README');
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError('Unable to load README content');
        console.error('Error fetching README:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, []);

  // Start decryption effect when component becomes visible
  useEffect(() => {
    if (!loading && content && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !shouldStartDecryption) {
              setShouldStartDecryption(true);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(containerRef.current);

      return () => observer.disconnect();
    }
  }, [loading, content, shouldStartDecryption]);

  if (loading) {
    return (
      <ReadmeContainer>
        <LoadingState>Loading README content...</LoadingState>
      </ReadmeContainer>
    );
  }

  if (error) {
    return (
      <ReadmeContainer>
        <ErrorState>{error}</ErrorState>
      </ReadmeContainer>
    );
  }

  return (
    <ReadmeContainer
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <MarkdownContent>
        {shouldStartDecryption ? (
          <DecryptedMarkdownContent content={content} />
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </MarkdownContent>
    </ReadmeContainer>
  );
};

export default ReadmeContent;
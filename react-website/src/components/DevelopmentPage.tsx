import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const DevelopmentContainer = styled.div`
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

const TimelineContainer = styled.div`
  position: relative;
  margin: 4rem 0;
  padding-left: 2rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: linear-gradient(to bottom, #5e81ac, #88c0d0);
    border-radius: 3px;
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  margin-bottom: 3rem;
  padding-left: 1.5rem;

  &::before {
    content: '';
    position: absolute;
    left: -2rem;
    top: 0.5rem;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #88c0d0;
    box-shadow: 0 0 0 4px rgba(136, 192, 208, 0.3);
  }
`;

const TimelineDate = styled.div`
  display: inline-block;
  padding: 0.3rem 1rem;
  background-color: rgba(94, 129, 172, 0.2);
  color: #88c0d0;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
`;

const TimelineTitle = styled.h3`
  color: #e1e1e1;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const TimelineContent = styled.div`
  background-color: rgba(35, 35, 35, 0.6);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  p {
    font-size: 1rem;
    color: #b8b8b8;
    margin-bottom: 1rem;
  }

  ul {
    list-style-position: inside;
    margin: 1rem 0;
    padding-left: 1rem;

    li {
      margin-bottom: 0.5rem;
      color: #b8b8b8;

      &::marker {
        color: #88c0d0;
      }
    }
  }
`;

const CodeBlock = styled.pre`
  background-color: #2e3440;
  color: #d8dee9;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  margin: 1.5rem 0;
`;

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  }
};

const DevelopmentPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Development - sandford.systems';
  }, []);

  const developmentMilestones = [
    {
      id: 1,
      date: 'April 10, 2025',
      title: 'Project Initialization',
      content: (
        <>
          <p>Started the website project with a simple HTML structure and basic CSS styling.</p>
          <ul>
            <li>Created initial HTML files for main pages</li>
            <li>Set up project structure and Git repository</li>
            <li>Implemented basic CSS styling</li>
          </ul>
        </>
      )
    },
    {
      id: 2,
      date: 'April 12, 2025',
      title: 'JavaScript Features Implementation',
      content: (
        <>
          <p>Added interactive elements and functionality with vanilla JavaScript.</p>
          <CodeBlock>{`// Sample code from early development
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
    });
});`}</CodeBlock>
        </>
      )
    },
    {
      id: 3,
      date: 'April 15, 2025',
      title: 'EmailJS Integration',
      content: (
        <>
          <p>Implemented the contact form functionality with EmailJS to enable sending actual emails from the contact form.</p>
          <ul>
            <li>Added EmailJS library to the project</li>
            <li>Created an email template in EmailJS dashboard</li>
            <li>Configured form submission to trigger email sending</li>
          </ul>
        </>
      )
    },
    {
      id: 4,
      date: 'April 20, 2025',
      title: 'React Transformation',
      content: (
        <>
          <p>Transformed the entire website into a modern React application with TypeScript.</p>
          <ul>
            <li>Implemented component-based architecture</li>
            <li>Added routing with React Router</li>
            <li>Enhanced UI with styled-components and framer-motion</li>
            <li>Improved contact form with better state management and validation</li>
          </ul>
          <CodeBlock>{`// React component example
const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <NavContainer>
      <NavList>
        <NavItem>
          <Link to="/" $isActive={location.pathname === '/'}>
            Home
          </Link>
        </NavItem>
        // More nav items...
      </NavList>
    </NavContainer>
  );
};`}</CodeBlock>
        </>
      )
    }
  ];

  return (
    <DevelopmentContainer>
      <ContentSection>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Development Journey
        </Title>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Follow the evolution of this website from a simple HTML/CSS/JS project to a modern React application.
        </motion.p>

        <TimelineContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          as={motion.div}
        >
          {developmentMilestones.map((milestone) => (
            <TimelineItem key={milestone.id} variants={itemVariants}>
              <TimelineDate>{milestone.date}</TimelineDate>
              <TimelineTitle>{milestone.title}</TimelineTitle>
              <TimelineContent>{milestone.content}</TimelineContent>
            </TimelineItem>
          ))}
        </TimelineContainer>
      </ContentSection>
    </DevelopmentContainer>
  );
};

export default DevelopmentPage;
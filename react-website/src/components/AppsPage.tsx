import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface AppInfo {
  name: string;
  description: string;
  url: string;
  category: string;
}

const apps: AppInfo[] = [
  {
    name: 'Geeraff',
    description: 'Giraffe neck growth simulator — watch a giraffe grow in real time.',
    url: 'https://geeraff.sandford.systems',
    category: 'Simulation',
  },
  {
    name: 'Ant Size Simulator',
    description: 'Explore the world from the perspective of an ant.',
    url: 'https://ant-sim.sandford.systems',
    category: 'Simulation',
  },
  {
    name: 'Eagle Size Simulator',
    description: 'Experience scale through the eyes of an eagle.',
    url: 'https://eagle-sim.sandford.systems',
    category: 'Simulation',
  },
  {
    name: 'Elephant Size Simulator',
    description: 'See how the world looks at elephant scale.',
    url: 'https://elephant-sim.sandford.systems',
    category: 'Simulation',
  },
  {
    name: 'Greyzone',
    description: 'A real-time collaborative application.',
    url: 'https://greyzone.sandford.systems',
    category: 'Application',
  },
  {
    name: 'Family Archive',
    description: 'A digital archive for family history and memories.',
    url: 'https://family.sandford.systems',
    category: 'Archive',
  },
  {
    name: 'Rot Garden',
    description: 'A generative garden simulation with live WebSocket updates.',
    url: 'https://rot-garden.sandford.systems',
    category: 'Application',
  },
];

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #1d1d1d;
  padding: 4rem 2rem;
`;

const PageTitle = styled.h1`
  color: #e1e1e1;
  font-size: 2.5rem;
  margin-bottom: 1rem;
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

const Subtitle = styled.p`
  color: #d8dee9;
  text-align: center;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 2rem auto 3rem;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled(motion.a)`
  background-color: rgba(40, 40, 40, 0.9);
  border: 1px solid rgba(136, 192, 208, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: #e1e1e1;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    border-color: rgba(136, 192, 208, 0.5);
    box-shadow: 0 4px 20px rgba(136, 192, 208, 0.1);
  }
`;

const CardName = styled.h2`
  font-size: 1.3rem;
  margin: 0 0 0.5rem;
  color: #88c0d0;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #d8dee9;
  line-height: 1.5;
  margin: 0 0 1rem;
  flex: 1;
`;

const CategoryTag = styled.span`
  display: inline-block;
  background-color: rgba(94, 129, 172, 0.2);
  color: #88c0d0;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  align-self: flex-start;
`;

const AppsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Apps & Projects - sandford.systems';
  }, []);

  return (
    <PageContainer>
      <PageTitle>Apps &amp; Projects</PageTitle>
      <Subtitle>
        Live applications and experiments hosted across the sandford.systems network.
      </Subtitle>
      <Grid>
        {apps.map((app) => (
          <Card
            key={app.url}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <CardName>{app.name}</CardName>
            <CardDescription>{app.description}</CardDescription>
            <CategoryTag>{app.category}</CategoryTag>
          </Card>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default AppsPage;

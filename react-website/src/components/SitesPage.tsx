import React, { useEffect } from 'react';
import styled from 'styled-components';

interface SiteLink {
  name: string;
  url: string;
  description: string;
}

interface SiteGroup {
  title: string;
  sites: SiteLink[];
}

export const siteGroups: SiteGroup[] = [
  {
    title: 'Data Centre Simulators',
    sites: [
      {
        name: 'Silicon Acres',
        url: 'https://www.sandford.systems/silicon-acres/',
        description: 'Build and operate the physical infrastructure behind growing compute demand.',
      },
      {
        name: 'Little Silicon',
        url: 'https://www.sandford.systems/littlesilicon/',
        description: 'A warm, animated isometric game about bringing a small data-centre campus to life.',
      },
      {
        name: 'WA Compute Developer (bigredbrain)',
        url: 'https://www.sandford.systems/bigredbrain/',
        description: 'Campus strategy: turn funded compute commitments into physical service in south-west WA.',
      },
      {
        name: 'WA Compute Developer (wadandiwaugal)',
        url: 'https://www.sandford.systems/wadandiwaugal/',
        description: 'Manage power, water, crews and cooling to deliver sustained compute contracts.',
      },
      {
        name: 'WA Compute Developer (wasiliconacres)',
        url: 'https://www.sandford.systems/wasiliconacres/',
        description: 'Development challenge: turn funded promises into reliable compute on a WA campus.',
      },
      {
        name: 'AI Data Center: Policy vs Physics',
        url: 'https://www.sandford.systems/dc-sim/',
        description: 'Balance grid constraints, cooling, carbon and public acceptance while scaling AI compute.',
      },
    ],
  },
  {
    title: 'Animal Size Simulators',
    sites: [
      {
        name: 'Ant Size Simulator',
        url: 'https://ant-sim.sandford.systems',
        description: 'What happens when you grow an ant? Scaling laws, stress and failure.',
      },
      {
        name: 'Eagle Size Simulator',
        url: 'https://eagle-sim.sandford.systems',
        description: 'Scale up an eagle and watch its flight envelope collapse.',
      },
      {
        name: 'Elephant Size Simulator',
        url: 'https://elephant-sim.sandford.systems',
        description: 'Explore the cardiovascular and skeletal limits of elephant size.',
      },
      {
        name: 'Spider Size Simulator',
        url: 'https://www.sandford.systems/spider-size-simulator/',
        description: 'How spider physiology degrades from house spider to elephant-sized monstrosity.',
      },
      {
        name: 'Geeraff',
        url: 'https://geeraff.sandford.systems',
        description: 'Grow a giraffe\'s neck until something breaks.',
      },
    ],
  },
  {
    title: 'Games & Interactive',
    sites: [
      {
        name: 'Greyzone',
        url: 'https://greyzone.sandford.systems',
        description: 'Multiplayer geopolitical simulation of grey-zone conflict escalation.',
      },
      {
        name: 'Bolsard Codex',
        url: 'https://bolsard.sandford.systems',
        description: 'Interactive narrative revealing a post-catastrophe world through its artifacts.',
      },
      {
        name: 'Rot Garden',
        url: 'https://rot-garden.sandford.systems',
        description: 'A living arcology: generative garden simulation with live updates.',
      },
      {
        name: 'PulseQuiz',
        url: 'https://www.sandford.systems/PulseQuiz/',
        description: 'Real-time, AI-powered quiz nights for teams.',
      },
    ],
  },
  {
    title: 'Learning & Tools',
    sites: [
      {
        name: 'Bucket Flow Calculus',
        url: 'https://www.sandford.systems/bucket-flow-calculus/',
        description: 'Learn rates of change and accumulation with a water bucket simulation.',
      },
      {
        name: 'M-E Net',
        url: 'https://www.sandford.systems/me-net/',
        description: 'Map behaviours to outcomes and values; find high-leverage actions.',
      },
    ],
  },
];

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #1d1d1d;
  padding: 4rem 1rem;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: #e1e1e1;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #d8dee9;
  font-size: 1.1rem;
  margin: 0 0 2.5rem;
  line-height: 1.6;
`;

const Group = styled.section`
  margin-bottom: 2.5rem;
`;

const GroupTitle = styled.h2`
  color: #88c0d0;
  font-size: 1.4rem;
  margin: 0 0 1rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid rgba(94, 129, 172, 0.5);
`;

const SiteList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SiteItem = styled.li`
  margin-bottom: 0.9rem;
  line-height: 1.5;
`;

const SiteAnchor = styled.a`
  color: #e1e1e1;
  font-weight: bold;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: #88c0d0;
    text-decoration: underline;
  }
`;

const SiteDescription = styled.span`
  display: block;
  color: #b8c0cc;
  font-size: 0.95rem;
`;

const SitesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Sites - sandford.systems';
  }, []);

  return (
    <PageContainer>
      <Content>
        <PageTitle>Sites</PageTitle>
        <Subtitle>Everything hosted across sandford.systems, grouped by kind.</Subtitle>
        {siteGroups.map((group) => {
          const headingId = `sites-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          return (
            <Group key={group.title} aria-labelledby={headingId}>
              <GroupTitle id={headingId}>{group.title}</GroupTitle>
              <SiteList>
                {group.sites.map((site) => (
                  <SiteItem key={site.url}>
                    <SiteAnchor href={site.url} target="_blank" rel="noopener noreferrer">
                      {site.name}
                    </SiteAnchor>
                    <SiteDescription>{site.description}</SiteDescription>
                  </SiteItem>
                ))}
              </SiteList>
            </Group>
          );
        })}
      </Content>
    </PageContainer>
  );
};

export default SitesPage;

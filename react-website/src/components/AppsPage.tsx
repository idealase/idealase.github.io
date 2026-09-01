import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

type AppStatus = 'live' | 'offline';
type AppFilter = 'all' | AppStatus;

interface AppInfo {
  name: string;
  description: string;
  url: string;
  category: string;
  status: AppStatus;
}

const apps: AppInfo[] = [
  {
    name: 'Geeraff',
    description: 'Giraffe neck growth simulator — watch a giraffe grow in real time.',
    url: 'https://geeraff.sandford.systems',
    category: 'Simulation',
    status: 'live',
  },
  {
    name: 'Ant Size Simulator',
    description: 'Explore the world from the perspective of an ant.',
    url: 'https://ant-sim.sandford.systems',
    category: 'Simulation',
    status: 'live',
  },
  {
    name: 'Eagle Size Simulator',
    description: 'Experience scale through the eyes of an eagle.',
    url: 'https://eagle-sim.sandford.systems',
    category: 'Simulation',
    status: 'offline',
  },
  {
    name: 'Elephant Size Simulator',
    description: 'See how the world looks at elephant scale.',
    url: 'https://elephant-sim.sandford.systems',
    category: 'Simulation',
    status: 'offline',
  },
  {
    name: 'Greyzone',
    description: 'A real-time collaborative application.',
    url: 'https://greyzone.sandford.systems',
    category: 'Application',
    status: 'live',
  },
  {
    name: 'Family Archive',
    description: 'A digital archive for family history and memories.',
    url: 'https://family.sandford.systems',
    category: 'Archive',
    status: 'live',
  },
  {
    name: 'Rot Garden',
    description: 'A generative garden simulation with live WebSocket updates.',
    url: 'https://rot-garden.sandford.systems',
    category: 'Application',
    status: 'offline',
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

const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 0 auto 2rem;
  max-width: 700px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  border: 1px solid rgba(136, 192, 208, 0.35);
  background: ${({ $active }) => ($active ? 'rgba(136, 192, 208, 0.18)' : 'rgba(29, 29, 29, 0.8)')};
  color: #e1e1e1;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: rgba(136, 192, 208, 0.6);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const StatusRow = styled.div<{ $status: AppStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ $status }) => ($status === 'live' ? '#a3e6b1' : '#f4b6b6')};
  font-size: 0.8rem;
  text-transform: capitalize;
`;

const StatusDot = styled.span<{ $status: AppStatus }>`
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  background: ${({ $status }) => ($status === 'live' ? '#4ade80' : '#f87171')};
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
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
  const [statusFilter, setStatusFilter] = useState<AppFilter>('all');
  const [statuses, setStatuses] = useState<Record<string, AppStatus>>(() =>
    Object.fromEntries(apps.map((app) => [app.url, app.status])),
  );

  useEffect(() => {
    document.title = 'Apps & Projects - sandford.systems';
  }, []);

  useEffect(() => {
    let isMounted = true;

    const refreshStatuses = async () => {
      const nextStatuses = await Promise.all(
        apps.map(async (app) => {
          try {
            const response = await fetch(app.url, {
              method: 'GET',
              mode: 'no-cors',
              cache: 'no-store',
            });

            return [app.url, response && (response.type === 'opaque' || response.ok) ? 'live' : app.status] as const;
          } catch {
            return [app.url, app.status] as const;
          }
        }),
      );

      if (isMounted) {
        setStatuses(Object.fromEntries(nextStatuses));
      }
    };

    void refreshStatuses();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleApps = useMemo(() => {
    return apps.filter((app) => statusFilter === 'all' || statuses[app.url] === statusFilter);
  }, [statusFilter, statuses]);

  return (
    <PageContainer>
      <PageTitle>Apps &amp; Projects</PageTitle>
      <Subtitle>
        Live applications and experiments hosted across the sandford.systems network.
      </Subtitle>
      <FilterBar aria-label="App status filter">
        {(['all', 'live', 'offline'] as AppFilter[]).map((filter) => (
          <FilterButton
            key={filter}
            type="button"
            $active={statusFilter === filter}
            onClick={() => setStatusFilter(filter)}
            aria-pressed={statusFilter === filter}
          >
            {filter === 'all' ? 'All' : filter}
          </FilterButton>
        ))}
      </FilterBar>
      <Grid>
        {visibleApps.map((app) => (
          <Card
            key={app.url}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <CardHeader>
              <CardName>{app.name}</CardName>
              <StatusRow $status={statuses[app.url] ?? app.status}>
                <StatusDot $status={statuses[app.url] ?? app.status} aria-hidden="true" />
                {statuses[app.url] ?? app.status}
              </StatusRow>
            </CardHeader>
            <CardDescription>{app.description}</CardDescription>
            <CategoryTag>{app.category}</CategoryTag>
          </Card>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default AppsPage;

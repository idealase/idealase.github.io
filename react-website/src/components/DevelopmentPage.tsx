import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import DevelopmentTimeline from './DevelopmentTimeline';
import {
  ALL_PROJECTS,
  PROJECT_GROUPS,
  SOURCE_LINKS,
  isStatusChecked,
  Project,
  ProjectStatus,
} from '../data/siteContent';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #1d1d1d;
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 1.5rem 5rem;
  color: #e1e1e1;
`;

const Title = styled.h1`
  color: #e1e1e1;
  font-size: 2.5rem;
  margin: 0 0 1rem;
`;

const Intro = styled.p`
  color: #d8dee9;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 720px;
  margin: 0 0 1.5rem;
`;

const JumpLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin-bottom: 3rem;
  font-size: 0.95rem;

  a {
    color: #88c0d0;
    text-decoration: none;
  }

  a:hover,
  a:focus-visible {
    text-decoration: underline;
  }
`;

const Section = styled.section`
  margin-bottom: 4rem;
  scroll-margin-top: 5rem;
`;

const SectionTitle = styled.h2`
  color: #e1e1e1;
  font-size: 1.9rem;
  margin: 0 0 1.5rem;

  &::before {
    content: '// ';
    color: #5e81ac;
  }
`;

const GroupTitle = styled.h3`
  color: #88c0d0;
  font-size: 1.2rem;
  margin: 2rem 0 1rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid rgba(94, 129, 172, 0.4);
`;

const Grid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`;

const cardStyles = `
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: rgba(40, 40, 40, 0.9);
  border: 1px solid rgba(136, 192, 208, 0.15);
  border-radius: 10px;
  padding: 1.1rem 1.25rem;
  text-decoration: none;
  color: #e1e1e1;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    border-color: rgba(136, 192, 208, 0.6);
    box-shadow: 0 4px 18px rgba(136, 192, 208, 0.1);
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
`;

const ExternalCard = styled.a`
  ${cardStyles}
`;

const InternalCard = styled(RouterLink)`
  ${cardStyles}
`;

const CardHeader = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
`;

const CardName = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
  color: #88c0d0;
`;

const CardDescription = styled.span`
  font-size: 0.92rem;
  color: #c4ccd8;
  line-height: 1.5;
`;

const Status = styled.span<{ $status: ProjectStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  font-size: 0.75rem;
  text-transform: capitalize;
  color: ${({ $status }) => ($status === 'live' ? '#a3e6b1' : '#f4b6b6')};

  &::before {
    content: '';
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: ${({ $status }) => ($status === 'live' ? '#4ade80' : '#f87171')};
  }
`;

const LinkList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 0.25rem 2rem;
`;

const LinkItem = styled.li`
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  line-height: 1.45;

  a {
    color: #e1e1e1;
    font-weight: 600;
    text-decoration: none;
  }

  a:hover,
  a:focus-visible {
    color: #88c0d0;
    text-decoration: underline;
  }

  span {
    display: block;
    color: #a9b2bf;
    font-size: 0.9rem;
  }
`;

const Lede = styled.p`
  color: #c4ccd8;
  line-height: 1.6;
  max-width: 720px;
  margin: 0 0 1rem;
`;

const JUMP_TARGETS = [
  { id: 'projects', label: 'Projects' },
  { id: 'source', label: 'Source & docs' },
  { id: 'timeline', label: 'Timeline' },
];

const initialStatuses =(): Record<string, ProjectStatus> =>
  Object.fromEntries(
    ALL_PROJECTS.filter((p) => isStatusChecked(p) && p.status).map((p) => [p.url, p.status as ProjectStatus]),
  );

const ProjectCard: React.FC<{ project: Project; status?: ProjectStatus }> = ({ project, status }) => {
  const body = (
    <>
      <CardHeader>
        <CardName>{project.name}</CardName>
        {status && <Status $status={status}>{status}</Status>}
      </CardHeader>
      <CardDescription>{project.description}</CardDescription>
    </>
  );

  if (project.internal) {
    return <InternalCard to={project.url}>{body}</InternalCard>;
  }

  return (
    <ExternalCard href={project.url} target="_blank" rel="noopener noreferrer">
      {body}
    </ExternalCard>
  );
};

const DevelopmentPage: React.FC = () => {
  const [statuses, setStatuses] = useState<Record<string, ProjectStatus>>(initialStatuses);

  useEffect(() => {
    document.title = 'Development - sandford.systems';
  }, []);

  // Subdomain apps live on their own hosts; an opaque response means the host answered.
  useEffect(() => {
    let isMounted = true;
    const checked = ALL_PROJECTS.filter(isStatusChecked);

    Promise.all(
      checked.map(async (project) => {
        try {
          const response = await fetch(project.url, { method: 'GET', mode: 'no-cors', cache: 'no-store' });
          const reachable = response && (response.type === 'opaque' || response.ok);
          return [project.url, reachable ? 'live' : project.status ?? 'offline'] as const;
        } catch {
          return [project.url, project.status ?? 'offline'] as const;
        }
      }),
    ).then((results) => {
      if (isMounted) setStatuses(Object.fromEntries(results));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageContainer>
      <Content>
        <Title>Development</Title>
        <Intro>
          Everything I&apos;ve built, in one place: live projects across sandford.systems, the source behind them,
          and the commit-by-commit story of how this vibe-coded site came together.
        </Intro>

        <JumpLinks aria-label="On this page">
          {JUMP_TARGETS.map(({ id, label }) => (
            <a
              key={id}
              href="#/development"
              onClick={(e) => {
                // HashRouter owns the URL hash, so scroll manually instead of using #id anchors.
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {label}
            </a>
          ))}
        </JumpLinks>

        <Section id="projects" aria-labelledby="projects-heading">
          <SectionTitle id="projects-heading">Projects</SectionTitle>
          {PROJECT_GROUPS.map((group) => (
            <div key={group.title}>
              <GroupTitle>{group.title}</GroupTitle>
              <Grid>
                {group.projects.map((project) => (
                  <li key={project.url}>
                    <ProjectCard project={project} status={statuses[project.url]} />
                  </li>
                ))}
              </Grid>
            </div>
          ))}
        </Section>

        <Section id="source" aria-labelledby="source-heading">
          <SectionTitle id="source-heading">Source &amp; docs</SectionTitle>
          <LinkList>
            {SOURCE_LINKS.map((link) => (
              <LinkItem key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                <span>{link.description}</span>
              </LinkItem>
            ))}
          </LinkList>
        </Section>

        <Section id="timeline" aria-labelledby="timeline-heading">
          <SectionTitle id="timeline-heading">Timeline</SectionTitle>
          <Lede>
            The repo&apos;s glow-up from static sketches to a security-hardened, vibe-coded meta-site, commit by commit.
          </Lede>
          <DevelopmentTimeline />
        </Section>
      </Content>
    </PageContainer>
  );
};

export default DevelopmentPage;

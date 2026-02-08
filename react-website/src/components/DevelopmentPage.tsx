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

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0 4rem 0;
`;

const ProjectCard = styled(motion.a)`
  display: block;
  background-color: rgba(35, 35, 35, 0.6);
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  color: #e1e1e1;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    border-color: #88c0d0;
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(136, 192, 208, 0.15);
  }
`;

const ProjectTitle = styled.h3`
  color: #88c0d0;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ProjectDescription = styled.p`
  color: #b8b8b8;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #5e81ac;
`;

const SectionTitle = styled(motion.h3)`
  color: #e1e1e1;
  font-size: 1.75rem;
  margin: 3rem 0 1rem 0;
  
  &::before {
    content: '// ';
    color: #5e81ac;
  }
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

  const deployedProjects = [
    {
      name: 'minclo',
      url: 'https://idealase.github.io/minclo',
      description: 'Minimalist closet organizer application',
      language: 'TypeScript'
    },
    {
      name: 'spider-size-simulator',
      url: 'https://idealase.github.io/spider-size-simulator',
      description: 'Interactive spider size comparison tool',
      language: 'TypeScript'
    },
    {
      name: 'me-net',
      url: 'https://idealase.github.io/me-net',
      description: 'Personal network visualization',
      language: 'TypeScript'
    },
    {
      name: 'PulseQuiz',
      url: 'https://idealase.github.io/PulseQuiz',
      description: 'Interactive quiz application',
      language: 'TypeScript'
    },
    {
      name: 'bucket-flow-calculus',
      url: 'https://idealase.github.io/bucket-flow-calculus',
      description: 'Bucket flow visualization and calculus',
      language: 'TypeScript'
    },
    {
      name: 'dc-sim',
      url: 'https://idealase.github.io/dc-sim',
      description: 'Data center simulation tool',
      language: 'TypeScript'
    }
  ];

  const developmentMilestones = [
    {
      id: 1,
      date: 'April 15, 2025',
      title: 'Foundations of the vibe-coded meta-site',
      content: (
        <>
          <p>
            Commit <code>60a6bc7</code> lit the first neon signposts for sandford.systems, carving out a
            multi-page structure, animated transitions, and the original arrow visualization that set the
            tone for a playful, liminal experience.
          </p>
          <ul>
            <li>Structured the HTML scaffolding for <code>about.html</code>, <code>documents.html</code>, and friends.</li>
            <li>Introduced early canvas experiments that hinted at today&apos;s motion-heavy hero section.</li>
            <li>Locked in the cool-night palette that still permeates the design language.</li>
          </ul>
        </>
      )
    },
    {
      id: 2,
      date: 'April 15, 2025',
      title: 'Secret doors and narrative intrigue',
      content: (
        <>
          <p>
            A few commits later, <code>c72f6b1</code> ushered in the password-protected <code>private.html</code>,
            leaning into the site&apos;s meta-fiction and inviting visitors to chase hidden lore.
          </p>
          <ul>
            <li>Mirrored authentication hints across static HTML and future React flows.</li>
            <li>Documented intentional backdoors (like <code>demo/aaa</code>) to keep the experience playful.</li>
            <li>Set the stage for session-driven gating that the React login later reimagined.</li>
          </ul>
        </>
      )
    },
    {
      id: 3,
      date: 'April 15, 2025',
      title: 'Automation joins the ritual',
      content: (
        <>
          <p>
            With <code>df6b49f</code> and the follow-up GitHub Actions upgrades (<code>14416c2</code>, <code>46b51b4</code>),
            the repo gained CI/CD guardians that linted, tested, and shipped every change straight into the
            GitHub Pages ether.
          </p>
          <ul>
            <li>Added reusable workflows so each merge rehearsed the deployment choreography.</li>
            <li>Swapped to <code>upload-pages-artifact@v3</code> and later v4 as new Actions dropped.</li>
            <li>Codified artifact retention so even failed runs left behind breadcrumbs.</li>
          </ul>
        </>
      )
    },
    {
      id: 4,
      date: 'April 20, 2025',
      title: 'React renaissance and the HashRouter pivot',
      content: (
        <>
          <p>
            Pull Request #18 (commit <code>adeee51</code>) refactored the static experiment into a full React +
            TypeScript SPA, while <code>6df5ab2</code> paired it with <code>HashRouter</code> so GitHub Pages could
            follow along without server rewrites.
          </p>
          <CodeBlock>{`<HashRouter>
  <AppContainer>
    <GlobalStyles />
    <Navigation />
    <MainContent>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* ... */}
      </Routes>
    </MainContent>
    <Footer>
      <p>&copy; 2025 My Website | <a href="https://github.com/idealase/idealase.github.io">GitHub</a></p>
    </Footer>
  </AppContainer>
</HashRouter>`}</CodeBlock>
          <ul>
            <li>Rebuilt navigation, documents, development, and login pages with styled-components.</li>
            <li>Introduced motion primitives from Framer Motion to replace ad-hoc CSS tricks.</li>
            <li>Laid groundwork for future component experiments like FaultyTerminal and DecryptedText.</li>
          </ul>
        </>
      )
    },
    {
      id: 5,
      date: 'July 23, 2025',
      title: 'Hybrid architecture ceasefire',
      content: (
        <>
          <p>
            Commit <code>c15e433</code> closed the long-running saga of routing conflicts between the legacy HTML
            paths and the new SPA, part of a trilogy of &quot;Fix hybrid architecture&quot; pull requests culminating in
            PR #9.
          </p>
          <ul>
            <li>Unified navigation so React and static pages shared consistent URLs and menu intent.</li>
            <li>Preserved GitHub Pages compatibility while maintaining instant SPA transitions.</li>
            <li>Kept the nostalgic static pages alive for lore hunters who prefer raw HTML vibes.</li>
          </ul>
        </>
      )
    },
    {
      id: 6,
      date: 'August 4–5, 2025',
      title: 'Security gauntlet, phases I–IV',
      content: (
        <>
          <p>
            A rapid-fire sequence of commits (<code>987653c</code>, <code>d1f4fa0</code>, <code>52d1eed</code>) layered
            professional-grade security tooling onto the project—CodeQL, Snyk, DAST, secret scanning, and
            SonarCloud—proving that a vibe-coded meta-site can still take AppSec seriously.
          </p>
          <ul>
            <li>Expanded Dependabot coverage and added SARIF uploads for every scanner.</li>
            <li>Swapped brittle TruffleHog scripts for curated Gitleaks rules via PR #26.</li>
            <li>Documented threat models so future contributors could keep the rituals intact.</li>
          </ul>
        </>
      )
    },
    {
      id: 7,
      date: 'August 4–5, 2025',
      title: 'The login labyrinth gets luxe',
      content: (
        <>
          <p>
            Starting with <code>ac2ad99</code> and polished through <code>58b64b2</code> and <code>df0363e</code>, the
            private-area flow became a cinematic detour—sessionStorage mirroring the static login, accessibility
            tweaks for screen readers, and documentation that spells out the intentional security theatre.
          </p>
          <ul>
            <li>React login mirrors static credentials while gracefully redirecting authenticated users.</li>
            <li>ARIA-labelled error and success messaging keeps the experience inclusive.</li>
            <li>CI gating ensures only built artifacts (not secrets) touch the GitHub Pages deploy job.</li>
          </ul>
        </>
      )
    },
    {
      id: 8,
      date: 'August 20, 2025',
      title: 'Atmospherics: Faulty terminals and decrypted lore',
      content: (
        <>
          <p>
            Commits <code>616917b</code>, <code>4ab3ecb</code>, and <code>752e78b</code> dialed up the ambience with a
            WebGL FaultyTerminal backdrop and decrypted-text reveals, transforming the home page into a living
            control room.
          </p>
          <ul>
            <li>Injected GPU-driven shaders that respond to cursor movement for a tactile welcome.</li>
            <li>Animated README excerpts to glitch into legibility before settling into readable copy.</li>
            <li>Cleaned the repo by banishing build artifacts, keeping the git history crisp.</li>
          </ul>
        </>
      )
    },
    {
      id: 9,
      date: 'September 10, 2025',
      title: 'Accessibility polish for every traveler',
      content: (
        <>
          <p>
            With <code>0d0ffd6</code> the hero interactions, scroll prompts, and focus management earned new shine,
            ensuring that the dreamy visuals stayed usable on keyboard and touch alike.
          </p>
          <ul>
            <li>Added focus-visible styling and aria cues to the scroll prompt button.</li>
            <li>Balanced layout responsiveness for small screens without losing cinematic height.</li>
            <li>Aligned design tokens across components to keep contrasts WCAG-friendly.</li>
          </ul>
        </>
      )
    },
    {
      id: 10,
      date: 'October 21 – November 4, 2025',
      title: 'Curating the canon',
      content: (
        <>
          <p>
            The autumn refresh (<code>40591ed</code>, PR #92) stripped the home page of the README wall while commit
            <code>f518df0</code> and PR #97 grounded the documents archive with the &quot;Hypermodernity&quot; essay—proof that the
            vibe-coded shell houses real, growing artifacts.
          </p>
          <ul>
            <li>Refocused the landing narrative on bespoke copy instead of autogenerated markdown.</li>
            <li>Expanded <code>DocumentsPage</code> with long-form writing that anchors the project&apos;s themes.</li>
            <li>Kept navigation, accessibility, and login fixes rolling through PRs #88–#91.</li>
          </ul>
        </>
      )
    },
    {
      id: 11,
      date: 'November 18, 2025',
      title: 'Horse Race Plotter: Python gaming in the browser',
      content: (
        <>
          <p>
            Expanding the dev-work experiments, the Horse Race Plotter introduces a Python-powered, 
            survey-driven racing game that runs entirely in the browser via Pyodide. Players compete 
            by answering trivia questions, with speed and accuracy determining their horse&apos;s progress.
          </p>
          <ul>
            <li>Built modular Python game with 5 core modules: game logic, questions, CLI, and plotting.</li>
            <li>Integrated Pyodide for WebAssembly-based Python execution in the browser.</li>
            <li>Created terminal emulator interface matching the DOS Hangman aesthetic.</li>
            <li>Implemented async I/O for non-blocking user input in web environment.</li>
            <li>Added 20+ survey questions covering data, AI, DevOps, and programming topics.</li>
            <li>Configured YAML-based settings for flexible game customization.</li>
          </ul>
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
          Follow the repo&apos;s glow-up from static sketches to a security-hardened, vibe-coded meta-site chronicled
          commit by commit.
        </motion.p>

        <SectionTitle
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Deployed Projects
        </SectionTitle>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ marginBottom: '1rem' }}
        >
          Live GitHub Pages deployments from my repositories:
        </motion.p>
        <ProjectsGrid
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {deployedProjects.map((project, index) => (
            <ProjectCard
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <ProjectTitle>{project.name}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <ProjectMeta>
                <span>{project.language}</span>
                <span>•</span>
                <span>GitHub Pages</span>
              </ProjectMeta>
            </ProjectCard>
          ))}
        </ProjectsGrid>

        <SectionTitle
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Development Timeline
        </SectionTitle>

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
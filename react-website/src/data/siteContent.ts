// Single source of truth for navigation, projects and developer links.
// The navigation bar, the Development page and the home-page terminal all
// read from here, so a new project only needs adding once.

export interface NavItem {
  label: string;
  path: string;
  /** Terminal `cd` aliases (the first is the canonical name). */
  aliases: string[];
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', aliases: ['home'], description: 'Landing page' },
  { label: 'Development', path: '/development', aliases: ['development', 'dev', 'projects', 'apps', 'sites'], description: 'Every project, repo and dev link' },
  { label: 'Documents', path: '/documents', aliases: ['documents', 'docs'], description: 'Essays & writing' },
  { label: 'About', path: '/about', aliases: ['about'], description: 'About sandford.systems' },
  { label: 'Contact', path: '/contact', aliases: ['contact'], description: 'Get in touch' },
];

/** Routes that exist but are deliberately kept out of the nav bar. */
export const HIDDEN_ROUTES: NavItem[] = [
  { label: 'Bucket Flow', path: '/bucket-flow', aliases: ['bucket-flow', 'bucket'], description: 'Bucket flow simulator' },
  { label: 'Perth Beer Curator', path: '/perth-beer-curator', aliases: ['perth-beer-curator', 'pbc'], description: 'Beer curator' },
  { label: 'Private Area', path: '/login', aliases: ['login'], description: 'Private area' },
];

export type ProjectStatus = 'live' | 'offline';

export interface Project {
  name: string;
  url: string;
  description: string;
  /** Last known status. Subdomain apps are re-checked in the browser. */
  status?: ProjectStatus;
  /** Short terminal name; defaults to a slug of `name`. */
  slug?: string;
  /** True for pages that are part of this React app (rendered as router links). */
  internal?: boolean;
}

export interface ProjectGroup {
  title: string;
  projects: Project[];
}

export const PROJECT_GROUPS: ProjectGroup[] = [
  {
    title: 'Data Centre Simulators',
    projects: [
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
        slug: 'bigredbrain',
        url: 'https://www.sandford.systems/bigredbrain/',
        description: 'Campus strategy: turn funded compute commitments into physical service in south-west WA.',
      },
      {
        name: 'WA Compute Developer (wadandiwaugal)',
        slug: 'wadandiwaugal',
        url: 'https://www.sandford.systems/wadandiwaugal/',
        description: 'Manage power, water, crews and cooling to deliver sustained compute contracts.',
      },
      {
        name: 'WA Compute Developer (wasiliconacres)',
        slug: 'wasiliconacres',
        url: 'https://www.sandford.systems/wasiliconacres/',
        description: 'Development challenge: turn funded promises into reliable compute on a WA campus.',
      },
      {
        name: 'AI Data Center: Policy vs Physics',
        slug: 'dc-sim',
        url: 'https://www.sandford.systems/dc-sim/',
        description: 'Balance grid constraints, cooling, carbon and public acceptance while scaling AI compute.',
      },
    ],
  },
  {
    title: 'Animal Size Simulators',
    projects: [
      {
        name: 'Ant Size Simulator',
        url: 'https://ant-sim.sandford.systems',
        description: 'What happens when you grow an ant? Scaling laws, stress and failure.',
        status: 'live',
      },
      {
        name: 'Eagle Size Simulator',
        url: 'https://eagle-sim.sandford.systems',
        description: 'Scale up an eagle and watch its flight envelope collapse.',
        status: 'offline',
      },
      {
        name: 'Elephant Size Simulator',
        url: 'https://elephant-sim.sandford.systems',
        description: 'Explore the cardiovascular and skeletal limits of elephant size.',
        status: 'offline',
      },
      {
        name: 'Spider Size Simulator',
        url: 'https://www.sandford.systems/spider-size-simulator/',
        description: 'How spider physiology degrades from house spider to elephant-sized monstrosity.',
      },
      {
        name: 'Geeraff',
        url: 'https://geeraff.sandford.systems',
        description: 'Grow a giraffe\'s neck in real time until something breaks.',
        status: 'live',
      },
    ],
  },
  {
    title: 'Games & Interactive',
    projects: [
      {
        name: 'Greyzone',
        url: 'https://greyzone.sandford.systems',
        description: 'Multiplayer geopolitical simulation of grey-zone conflict escalation.',
        status: 'live',
      },
      {
        name: 'Bolsard Codex',
        url: 'https://bolsard.sandford.systems',
        description: 'Interactive narrative revealing a post-catastrophe world through its artifacts.',
      },
      {
        name: 'Rot Garden',
        url: 'https://rot-garden.sandford.systems',
        description: 'A living arcology: generative garden simulation with live WebSocket updates.',
        status: 'offline',
      },
      {
        name: 'PulseQuiz',
        url: 'https://www.sandford.systems/PulseQuiz/',
        description: 'Real-time, AI-powered quiz nights for teams.',
      },
    ],
  },
  {
    title: 'Tools & Learning',
    projects: [
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
      {
        name: 'minclo',
        url: 'https://www.sandford.systems/minclo/',
        description: 'Minimalist closet organiser.',
      },
      {
        name: 'Family Archive',
        url: 'https://family.sandford.systems',
        description: 'A digital archive for family history and memories.',
        status: 'live',
      },
    ],
  },
  {
    title: 'Experiments on this site',
    projects: [
      {
        name: 'Bucket Flow (in-site)',
        slug: 'bucket-flow',
        url: '/bucket-flow',
        description: 'The React version of the bucket flow simulator, built into this site.',
        internal: true,
      },
      {
        name: 'Perth Beer Curator',
        url: '/perth-beer-curator',
        description: 'Rate and review beers from around Perth.',
        internal: true,
      },
      {
        name: 'MS-DOS Hangman',
        url: '/dev-work/hangman-dos.html',
        description: 'Hangman in a retro DOS terminal emulator.',
      },
      {
        name: 'Horse Race Plotter',
        url: '/dev-work/horse-race-plotter.html',
        description: 'A Python trivia racing game running in the browser via Pyodide.',
      },
    ],
  },
];

export interface DevLink {
  name: string;
  url: string;
  description: string;
}

export const SOURCE_LINKS: DevLink[] = [
  { name: 'GitHub profile', url: 'https://github.com/idealase', description: 'All repositories, including the ones behind every project above.' },
  { name: 'This site’s repository', url: 'https://github.com/idealase/idealase.github.io', description: 'Source for sandford.systems itself.' },
  { name: 'Project README', url: 'https://github.com/idealase/idealase.github.io/blob/main/README.md', description: 'Architecture and the vibe-coding philosophy.' },
  { name: 'React app docs', url: 'https://github.com/idealase/idealase.github.io/blob/main/react-website/README.md', description: 'Setup, features and deployment of the React app.' },
  { name: 'Security guidelines', url: 'https://github.com/idealase/idealase.github.io/blob/main/SECURITY.md', description: 'Secret management and dependency security.' },
  { name: 'GitHub Actions', url: 'https://github.com/idealase/idealase.github.io/actions', description: 'CI/CD runs and deployments.' },
  { name: 'Issues', url: 'https://github.com/idealase/idealase.github.io/issues', description: 'Bug reports and feature requests.' },
  { name: 'Pull requests', url: 'https://github.com/idealase/idealase.github.io/pulls', description: 'Every change, in review.' },
];

export const ALL_PROJECTS: Project[] = PROJECT_GROUPS.flatMap((group) => group.projects);

/** Subdomain apps run on their own hosts, so a reachability check means something for them. */
export const isStatusChecked = (project: Project): boolean =>
  !project.internal && /^https:\/\/(?!www\.)[^/]+\.sandford\.systems/.test(project.url);

export interface SiteDocument {
  /** Short name used by the terminal's `ls docs`. */
  slug: string;
  title: string;
  description: string;
  link: string;
}

export const DOCUMENTS: SiteDocument[] = [
  {
    slug: 'the-fatal-economy',
    title: 'The Fatal Economy: A Re-examination of the Pax Britannica and the Origins of the Great War',
    description:
      'An alternative historical analysis examining how Britain\'s hypothetical 1906 decision to forego the HMS Dreadnought could have reshaped the strategic balance leading to World War I.',
    link: '/the-fatal-economy.html',
  },
  {
    slug: 'hypermodernity',
    title: 'Hypermodernity and Technology: An Essay in Six Chapters',
    description:
      'An in-depth essay exploring the intersection of hypermodernity, technology, and contemporary society through six analytical chapters.',
    link: '/hypermodernity_essay.html',
  },
  {
    slug: 'food-eternity',
    title: 'Food Eternity',
    description:
      'If you could eat only one food for the rest of your life, what would it be? A thought experiment answered with a nutritionally complete meal replacement.',
    link: '/food-eternity.html',
  },
];

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────

interface OutputLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'ascii';
}

// ── Route & data maps ──────────────────────────────────────────────────

const ROUTE_MAP: Record<string, string> = {
  home: '/',
  about: '/about',
  documents: '/documents',
  docs: '/documents',
  development: '/development',
  dev: '/development',
  login: '/login',
  contact: '/contact',
  'perth-beer-curator': '/perth-beer-curator',
  pbc: '/perth-beer-curator',
  'bucket-flow': '/bucket-flow',
  bucket: '/bucket-flow',
};

const PAGES = [
  { name: 'home', path: '/', description: 'Landing page' },
  { name: 'about', path: '/about', description: 'About sandford.systems' },
  { name: 'documents', path: '/documents', description: 'Essays & resources' },
  { name: 'development', path: '/development', description: 'Timeline & projects' },
  { name: 'contact', path: '/contact', description: 'Get in touch' },
  { name: 'bucket-flow', path: '/bucket-flow', description: 'Bucket flow simulator' },
  { name: 'perth-beer-curator', path: '/perth-beer-curator', description: 'Beer curator' },
  { name: 'login', path: '/login', description: 'Private area' },
];

const PROJECTS = [
  { name: 'minclo', url: 'idealase.github.io/minclo', desc: 'Minimalist closet organizer' },
  { name: 'spider-size-simulator', url: 'idealase.github.io/spider-size-simulator', desc: 'Interactive spider size comparison' },
  { name: 'me-net', url: 'idealase.github.io/me-net', desc: 'Personal network visualization' },
  { name: 'PulseQuiz', url: 'idealase.github.io/PulseQuiz', desc: 'Interactive quiz app' },
  { name: 'bucket-flow-calculus', url: 'idealase.github.io/bucket-flow-calculus', desc: 'Bucket flow visualization' },
  { name: 'dc-sim', url: 'idealase.github.io/dc-sim', desc: 'Data center simulation' },
];

const DOCUMENTS = [
  { name: 'the-fatal-economy', title: 'The Fatal Economy', desc: 'Alternative history of the Pax Britannica and WWI origins' },
  { name: 'hypermodernity', title: 'Hypermodernity & Technology', desc: 'Essay in six chapters on hypermodernity and society' },
  { name: 'readme', title: 'Project README', desc: 'Website architecture and development philosophy' },
  { name: 'react-docs', title: 'React App Documentation', desc: 'Technical reference for the React application' },
  { name: 'security', title: 'Security Guidelines', desc: 'Secret management and dependency security' },
  { name: 'actions', title: 'GitHub Actions', desc: 'CI/CD pipeline and deployment automation' },
  { name: 'issues', title: 'Repository Issues', desc: 'Bug reports and feature requests' },
  { name: 'pulls', title: 'Pull Requests', desc: 'Code changes and contribution history' },
];

const MILESTONES = [
  { date: 'Apr 15 2025', title: 'Foundations of the vibe-coded meta-site' },
  { date: 'Apr 15 2025', title: 'Secret doors and narrative intrigue' },
  { date: 'Apr 15 2025', title: 'Automation joins the ritual' },
  { date: 'Apr 20 2025', title: 'React renaissance and the HashRouter pivot' },
  { date: 'Jul 23 2025', title: 'Hybrid architecture ceasefire' },
  { date: 'Aug 4-5 2025', title: 'Security gauntlet, phases I-IV' },
  { date: 'Aug 4-5 2025', title: 'The login labyrinth gets luxe' },
  { date: 'Aug 20 2025', title: 'Atmospherics: Faulty terminals and decrypted lore' },
  { date: 'Sep 10 2025', title: 'Accessibility polish for every traveler' },
  { date: 'Oct-Nov 2025', title: 'Curating the canon' },
  { date: 'Nov 18 2025', title: 'Horse Race Plotter: Python gaming in the browser' },
];

const NEOFETCH_ART = [
  '        ___           ___      ',
  '       /  /\\         /  /\\     ',
  '      /  /::\\       /  /::\\    ',
  '     /__/:/\\:\\     /  /:/\\:\\   ',
  '    _\\_ \\:\\ \\:\\   /  /:/  \\:\\  ',
  '   /__/\\ \\:\\ \\:\\ /__/:/ \\__\\:\\',
  '   \\  \\:\\ \\:\\_\\/ \\  \\:\\ /  /:/',
  '    \\  \\:\\_\\:\\    \\  \\:\\  /:/ ',
  '     \\  \\:\\/:/     \\  \\:\\/:/  ',
  '      \\  \\::/       \\  \\::/   ',
  '       \\__\\/         \\__\\/    ',
];

const NEOFETCH_INFO = [
  '',
  'sandford.systems',
  '─────────────────',
  'Framework: React 19.1.0',
  'Language:  TypeScript 4.9.5',
  'Styling:   styled-components 6.1',
  'Motion:    Framer Motion 12.7',
  'Graphics:  OGL (WebGL)',
  'Router:    react-router-dom 7.5',
  'Pages:     8',
  'Projects:  6 deployed',
  'Palette:   Nord (#88c0d0, #5e81ac)',
  'Vibes:     immaculate',
];

const HELP_TEXT: OutputLine[] = [
  { text: '', type: 'output' },
  { text: 'Available commands:', type: 'system' },
  { text: '', type: 'output' },
  { text: '  help                Show this help message', type: 'output' },
  { text: '  about               About sandford.systems', type: 'output' },
  { text: '  ls [pages|projects|docs]  List items', type: 'output' },
  { text: '  cd <page>           Navigate to a page', type: 'output' },
  { text: '  cat <topic>         Read content (about, readme)', type: 'output' },
  { text: '  history             Development timeline', type: 'output' },
  { text: '  neofetch            System info', type: 'output' },
  { text: '  pwd                 Current location', type: 'output' },
  { text: '  whoami              Who are you?', type: 'output' },
  { text: '  whois               About the creator', type: 'output' },
  { text: '  date                Current date/time', type: 'output' },
  { text: '  echo <text>         Echo text', type: 'output' },
  { text: '  clear               Clear terminal', type: 'output' },
  { text: '', type: 'output' },
  { text: '  Tip: use Tab to autocomplete commands', type: 'system' },
  { text: '', type: 'output' },
];

const WELCOME: OutputLine[] = [
  { text: 'sandford.systems v1.0.0', type: 'system' },
  { text: 'A modern and sophisticated React site, built entirely from vibes.', type: 'output' },
  { text: '', type: 'output' },
  { text: "Type 'help' to see available commands.", type: 'system' },
  { text: '', type: 'output' },
];

// ── Command completions ────────────────────────────────────────────────

const ALL_COMMANDS = [
  'help', 'about', 'ls', 'ls pages', 'ls projects', 'ls docs',
  'cd', 'cat', 'cat about', 'cat readme', 'history', 'neofetch',
  'pwd', 'whoami', 'whois', 'date', 'echo', 'clear', 'uname',
  'sudo', 'rm',
];

// ── Styled components ──────────────────────────────────────────────────

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const scanlines = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 0 4px; }
`;

const TerminalWrapper = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: min(90vw, 720px);
  max-height: 60vh;
  background: rgba(0, 0, 0, 0.78);
  border: 1px solid rgba(136, 192, 208, 0.25);
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 0 30px rgba(136, 192, 208, 0.08),
    inset 0 0 80px rgba(0, 0, 0, 0.4);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(136, 192, 208, 0.03) 2px,
      rgba(136, 192, 208, 0.03) 4px
    );
    animation: ${scanlines} 0.3s linear infinite;
    pointer-events: none;
    z-index: 3;
  }
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(46, 52, 64, 0.9);
  border-bottom: 1px solid rgba(136, 192, 208, 0.15);
  user-select: none;
`;

const Dot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.$color};
  opacity: 0.8;
`;

const TitleText = styled.span`
  margin-left: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 0.75rem;
  color: rgba(216, 222, 233, 0.6);
`;

const OutputArea = styled.div`
  padding: 12px 14px 0 14px;
  max-height: calc(60vh - 80px);
  overflow-y: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.82rem;
  line-height: 1.55;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(136, 192, 208, 0.2);
    border-radius: 3px;
  }

  @media (max-width: 600px) {
    font-size: 0.72rem;
    padding: 10px 10px 0 10px;
  }
`;

const Line = styled.div<{ $type: OutputLine['type'] }>`
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 1.55em;
  color: ${p => {
    switch (p.$type) {
      case 'input': return '#88c0d0';
      case 'error': return '#bf616a';
      case 'system': return '#a3be8c';
      case 'ascii': return '#5e81ac';
      default: return '#d8dee9';
    }
  }};
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 14px 12px 14px;
  font-family: 'Fira Code', monospace;
  font-size: 0.82rem;

  @media (max-width: 600px) {
    font-size: 0.72rem;
    padding: 4px 10px 10px 10px;
  }
`;

const Prompt = styled.span`
  color: #a3be8c;
  margin-right: 0;
  flex-shrink: 0;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
`;

const InputDisplay = styled.span`
  color: #d8dee9;
  flex: 1;
  position: relative;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 0.55em;
  height: 1.15em;
  background: #88c0d0;
  vertical-align: text-bottom;
  animation: ${blink} 1s step-end infinite;
`;

// ── Component ──────────────────────────────────────────────────────────

export default function InteractiveTerminal() {
  const [output, setOutput] = useState<OutputLine[]>(WELCOME);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-scroll to bottom
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [output]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // ── Command execution ──────────────────────────────────────────────

  const pushLines = useCallback((lines: OutputLine[]) => {
    setOutput(prev => [...prev, ...lines]);
  }, []);

  const executeCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Echo the input
    pushLines([{ text: `visitor@sandford ~ $ ${trimmed}`, type: 'input' }]);

    // Save to history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      // ── help ──
      case 'help':
        pushLines(HELP_TEXT);
        break;

      // ── about ──
      case 'about':
        pushLines([
          { text: '', type: 'output' },
          { text: 'sandford.systems', type: 'system' },
          { text: '─────────────────', type: 'system' },
          { text: 'A digital playground for ideas around secure-by-design software,', type: 'output' },
          { text: 'resilient infrastructure, and thoughtful product development.', type: 'output' },
          { text: '', type: 'output' },
          { text: 'Expect deep dives into tooling, experiments with user experience,', type: 'output' },
          { text: 'and the occasional detour into creative technology tangents.', type: 'output' },
          { text: '', type: 'output' },
          { text: 'Started as static HTML sketches. Now a living archive of', type: 'output' },
          { text: 'experiments, prototypes, and notes from the modern web stack.', type: 'output' },
          { text: '', type: 'output' },
        ]);
        break;

      // ── ls ──
      case 'ls': {
        const sub = args[0]?.toLowerCase();
        if (!sub || sub === 'pages') {
          pushLines([
            { text: '', type: 'output' },
            ...PAGES.map(p => ({
              text: `  ${p.name.padEnd(22)} ${p.description}`,
              type: 'output' as const,
            })),
            { text: '', type: 'output' },
            { text: "  Use 'cd <page>' to navigate.", type: 'system' },
            { text: '', type: 'output' },
          ]);
        } else if (sub === 'projects') {
          pushLines([
            { text: '', type: 'output' },
            ...PROJECTS.map(p => ({
              text: `  ${p.name.padEnd(26)} ${p.desc}`,
              type: 'output' as const,
            })),
            { text: '', type: 'output' },
          ]);
        } else if (sub === 'docs') {
          pushLines([
            { text: '', type: 'output' },
            ...DOCUMENTS.map(d => ({
              text: `  ${d.name.padEnd(22)} ${d.desc}`,
              type: 'output' as const,
            })),
            { text: '', type: 'output' },
          ]);
        } else {
          pushLines([{ text: `ls: unknown category '${sub}'. Try: pages, projects, docs`, type: 'error' }]);
        }
        break;
      }

      // ── cd ──
      case 'cd': {
        const target = args[0]?.toLowerCase();
        if (!target || target === '~' || target === '/') {
          navigate('/');
          pushLines([{ text: 'Navigating to home...', type: 'system' }]);
        } else if (ROUTE_MAP[target]) {
          navigate(ROUTE_MAP[target]);
          pushLines([{ text: `Navigating to ${target}...`, type: 'system' }]);
        } else {
          pushLines([
            { text: `cd: '${target}' not found. Use 'ls pages' to see routes.`, type: 'error' },
          ]);
        }
        break;
      }

      // ── cat ──
      case 'cat': {
        const topic = args[0]?.toLowerCase();
        if (!topic) {
          pushLines([{ text: 'cat: specify a topic. Try: about, readme', type: 'error' }]);
        } else if (topic === 'about') {
          pushLines([
            { text: '', type: 'output' },
            { text: 'This site started as a playground for learning the absolute', type: 'output' },
            { text: 'basics of the web stack and now captures every experiment', type: 'output' },
            { text: 'along the way. As new ideas surfaced, the site absorbed them:', type: 'output' },
            { text: 'stylesheets were refactored, shared JavaScript utilities', type: 'output' },
            { text: 'emerged, and an embedded React sandbox appeared. Every branch', type: 'output' },
            { text: 'doubles as documentation of what was tried, why it mattered,', type: 'output' },
            { text: 'and what was left behind for future reflection.', type: 'output' },
            { text: '', type: 'output' },
          ]);
        } else if (topic === 'readme') {
          pushLines([
            { text: '', type: 'output' },
            { text: 'sandford.systems — "Vibe Coding" Manifesto', type: 'system' },
            { text: '────────────────────────────────────────────', type: 'system' },
            { text: 'Building through creative intuition rather than specs.', type: 'output' },
            { text: 'AI-assisted development, documented in real time.', type: 'output' },
            { text: 'A living experiment in emergent development.', type: 'output' },
            { text: '', type: 'output' },
            { text: 'Architecture layers:', type: 'system' },
            { text: '  Legacy  — HTML5 + CSS3 + Vanilla JS', type: 'output' },
            { text: '  Modern  — React 19 + TypeScript + styled-components', type: 'output' },
            { text: '', type: 'output' },
          ]);
        } else {
          pushLines([{ text: `cat: '${topic}' not found. Try: about, readme`, type: 'error' }]);
        }
        break;
      }

      // ── history ──
      case 'history': {
        pushLines([
          { text: '', type: 'output' },
          { text: 'Development Timeline', type: 'system' },
          { text: '────────────────────', type: 'system' },
          ...MILESTONES.map((m, i) => ({
            text: `  ${String(i + 1).padStart(2)}.  ${m.date.padEnd(16)} ${m.title}`,
            type: 'output' as const,
          })),
          { text: '', type: 'output' },
        ]);
        break;
      }

      // ── neofetch ──
      case 'neofetch': {
        const lines: OutputLine[] = [{ text: '', type: 'output' }];
        const maxLen = Math.max(NEOFETCH_ART.length, NEOFETCH_INFO.length);
        for (let i = 0; i < maxLen; i++) {
          const art = NEOFETCH_ART[i] ?? ''.padEnd(31);
          const info = NEOFETCH_INFO[i] ?? '';
          // Art in ascii color, info appended — we combine them as one line
          // but use 'ascii' type for the art portion. Since we can't do
          // inline mixed colors easily, we'll output them as combined text
          // with ascii type for lines that have art.
          if (i < NEOFETCH_ART.length) {
            lines.push({ text: `${art}  ${info}`, type: 'ascii' });
          } else {
            lines.push({ text: `${''.padEnd(33)}${info}`, type: 'output' });
          }
        }
        lines.push({ text: '', type: 'output' });
        pushLines(lines);
        break;
      }

      // ── pwd ──
      case 'pwd':
        pushLines([{ text: `/${location.pathname === '/' ? 'home' : location.pathname.slice(1)}`, type: 'output' }]);
        break;

      // ── whoami ──
      case 'whoami':
        pushLines([{ text: 'visitor', type: 'output' }]);
        break;

      // ── whois ──
      case 'whois':
        pushLines([
          { text: '', type: 'output' },
          { text: 'sandford.systems is maintained by idealase.', type: 'output' },
          { text: 'Interests: secure-by-design software, resilient infra,', type: 'output' },
          { text: 'thoughtful product development, and creative technology.', type: 'output' },
          { text: '', type: 'output' },
          { text: 'github.com/idealase', type: 'system' },
          { text: '', type: 'output' },
        ]);
        break;

      // ── date ──
      case 'date':
        pushLines([{ text: new Date().toString(), type: 'output' }]);
        break;

      // ── echo ──
      case 'echo':
        pushLines([{ text: args.join(' '), type: 'output' }]);
        break;

      // ── clear ──
      case 'clear':
        setOutput([]);
        break;

      // ── uname ──
      case 'uname':
        pushLines([{
          text: 'SandfordOS 1.0.0 sandford-systems x86_64 React/19.1.0 TypeScript/4.9.5 vibes/immaculate',
          type: 'output',
        }]);
        break;

      // ── Easter eggs ──
      case 'sudo':
        pushLines([{ text: "visitor is not in the sudoers file. This incident will be reported.", type: 'error' }]);
        break;

      case 'rm':
        pushLines([{ text: "Nice try. The vibes are immutable.", type: 'error' }]);
        break;

      case 'vim':
      case 'vi':
      case 'nano':
      case 'emacs':
        pushLines([{ text: `${cmd}: the terminal is read-only. The vibes cannot be edited.`, type: 'error' }]);
        break;

      case 'exit':
      case 'quit':
      case 'logout':
        pushLines([{ text: 'There is no escape from the vibes.', type: 'system' }]);
        break;

      case 'ping':
        pushLines([
          { text: `PING ${args[0] || 'vibes'} (127.0.0.1): 56 data bytes`, type: 'output' },
          { text: '64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms', type: 'output' },
          { text: '64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.069 ms', type: 'output' },
          { text: `--- ${args[0] || 'vibes'} ping statistics ---`, type: 'output' },
          { text: '2 packets transmitted, 2 packets received, 0.0% packet loss', type: 'output' },
        ]);
        break;

      case 'curl':
        pushLines([{ text: '{"status":"vibing","uptime":"since April 2025","mood":"immaculate"}', type: 'output' }]);
        break;

      default:
        pushLines([{
          text: `command not found: ${cmd}. Type 'help' for available commands.`,
          type: 'error',
        }]);
    }
  }, [navigate, location.pathname, pushLines]);

  // ── Key handling ───────────────────────────────────────────────────

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (!input) return;
      const matches = ALL_COMMANDS.filter(c => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        pushLines([
          { text: `visitor@sandford ~ $ ${input}`, type: 'input' },
          { text: matches.join('  '), type: 'system' },
        ]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setOutput([]);
    }
  }, [input, commandHistory, historyIndex, executeCommand, pushLines]);

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <TerminalWrapper
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      onClick={focusInput}
      role="application"
      aria-label="Interactive terminal"
    >
      <TitleBar>
        <Dot $color="#bf616a" />
        <Dot $color="#ebcb8b" />
        <Dot $color="#a3be8c" />
        <TitleText>visitor@sandford.systems:~</TitleText>
      </TitleBar>

      <OutputArea ref={outputRef}>
        {output.map((line, i) => (
          <Line key={i} $type={line.type}>{line.text}</Line>
        ))}
      </OutputArea>

      <InputRow>
        <Prompt>visitor@sandford ~ $&nbsp;</Prompt>
        <HiddenInput
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="Terminal command input"
        />
        <InputDisplay>
          {input}
          <Cursor />
        </InputDisplay>
      </InputRow>
    </TerminalWrapper>
  );
}

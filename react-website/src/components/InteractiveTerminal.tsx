import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ALL_PROJECTS,
  DOCUMENTS,
  PROJECT_GROUPS,
  HIDDEN_ROUTES,
  NAV_ITEMS,
  Project,
} from '../data/siteContent';
import { MILESTONES } from './DevelopmentTimeline';

// ── Types ──────────────────────────────────────────────────────────────

interface OutputLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'ascii';
}

// ── Route & data maps ──────────────────────────────────────────────────
// Pages, projects, docs and the timeline come from the same data the rest of
// the site renders, so the terminal can't drift out of date.

const ROUTES = [...NAV_ITEMS, ...HIDDEN_ROUTES];

const ROUTE_MAP = new Map<string, string>(
  ROUTES.flatMap(route => route.aliases.map(alias => [alias, route.path] as [string, string])),
);

const PAGES = ROUTES.map(route => ({
  name: route.aliases[0],
  path: route.path,
  description: route.description,
}));

const MAX_LINES = 400;

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
  `Framework: React ${React.version}`,
  'Language:  TypeScript',
  'Styling:   styled-components 6',
  'Motion:    Framer Motion 12',
  'Graphics:  OGL (WebGL)',
  'Router:    react-router 7 (hash)',
  `Pages:     ${NAV_ITEMS.length}`,
  `Projects:  ${ALL_PROJECTS.length}`,
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
  { text: '  open <project>      Open a project in a new tab', type: 'output' },
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
  { text: '  Tip: Tab autocompletes, ↑/↓ recall history, Ctrl+L clears', type: 'system' },
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

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const projectSlug = (project: Project) => project.slug ?? slugify(project.name);

const PROJECT_LOOKUP = new Map<string, Project>(
  ALL_PROJECTS.map(project => [projectSlug(project), project] as [string, Project]),
);

const ALL_COMMANDS = [
  'help', 'about', 'ls', 'ls pages', 'ls projects', 'ls docs',
  'cd', ...PAGES.map(page => `cd ${page.name}`),
  'open', ...Array.from(PROJECT_LOOKUP.keys(), slug => `open ${slug}`),
  'cat', 'cat about', 'cat readme', 'history', 'neofetch',
  'pwd', 'whoami', 'whois', 'date', 'echo', 'clear', 'uname',
  'sudo', 'rm',
];

/** Extend the input to the longest prefix shared by every match. */
const commonPrefix = (items: string[]) =>
  items.reduce((prefix, item) => {
    let i = 0;
    while (i < prefix.length && i < item.length && prefix.charAt(i) === item.charAt(i)) i++;
    return prefix.slice(0, i);
  });

// ── Styled components ──────────────────────────────────────────────────

// Blink the block, not the glyph, so a character under the cursor stays readable.
const blink = keyframes`
  0%, 49% { background-color: #88c0d0; color: #1d1d1d; }
  50%, 100% { background-color: transparent; color: #d8dee9; }
`;

const scanlines = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 0 4px; }
`;

// Laid out by the hero's flexbox rather than absolute + translate(-50%, -50%):
// Framer Motion writes its own transform for the entrance animation, which
// wiped out the CSS centring and left the terminal hanging off-centre.
const TerminalWrapper = styled(motion.div)`
  position: relative;
  z-index: 2;
  width: min(100%, 720px);
  display: flex;
  flex-direction: column;
  max-height: min(60vh, 560px);
  cursor: text;
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

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
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
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  font-family: 'Fira Code', monospace;
  font-size: 0.82rem;
  line-height: 1.55;
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
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
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

// Visually hidden but still focusable. 16px stops iOS Safari zooming on focus.
const HiddenInput = styled.input`
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
  font-size: 16px;
  border: 0;
  padding: 0;
`;

const InputDisplay = styled.span`
  color: #d8dee9;
  flex: 1;
  min-width: 0;
  white-space: pre-wrap;
  word-break: break-all;
`;

// Block cursor that sits on the character at the caret (or after the text).
// Solid and blinking while focused; a hollow outline when the terminal is idle.
const Cursor = styled.span<{ $focused: boolean }>`
  display: inline-block;
  min-width: 0.6em;
  height: 1.3em;
  line-height: 1.3em;
  vertical-align: text-bottom;
  white-space: pre;
  color: #1d1d1d;
  background: ${p => (p.$focused ? '#88c0d0' : 'transparent')};
  box-shadow: ${p => (p.$focused ? 'none' : 'inset 0 0 0 1px rgba(136, 192, 208, 0.7)')};
  ${p => p.$focused && css`
    animation: ${blink} 1s step-end infinite;
  `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ── Component ──────────────────────────────────────────────────────────

export default function InteractiveTerminal() {
  const [output, setOutput] = useState<OutputLine[]>(WELCOME);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [caret, setCaret] = useState(0);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-scroll to bottom
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [output]);

  // Focus on load for mouse/keyboard users only: on touch devices it would pop
  // the on-screen keyboard over the hero before anyone asked to type.
  useEffect(() => {
    const finePointer = window.matchMedia?.('(pointer: fine)').matches ?? true;
    if (finePointer) inputRef.current?.focus({ preventScroll: true });
  }, []);

  const focusInput = useCallback(() => {
    // Don't steal focus while someone is selecting output to copy it.
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const syncCaret = useCallback(() => {
    const el = inputRef.current;
    if (el) setCaret(el.selectionStart ?? el.value.length);
  }, []);

  /** Replace the input text and park the caret at the end. */
  const setInputValue = useCallback((value: string) => {
    setInput(value);
    setCaret(value.length);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) el.setSelectionRange(value.length, value.length);
    });
  }, []);

  // ── Command execution ──────────────────────────────────────────────

  const pushLines = useCallback((lines: OutputLine[]) => {
    setOutput(prev => [...prev, ...lines].slice(-MAX_LINES));
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
          // Grouped like the Development page; descriptions are trimmed so most
          // rows stay on one line in the 720px terminal.
          const lines: OutputLine[] = [];
          for (const group of PROJECT_GROUPS) {
            lines.push({ text: '', type: 'output' }, { text: group.title, type: 'system' });
            for (const p of group.projects) {
              const slug = projectSlug(p);
              const desc = p.description.length > 58 ? `${p.description.slice(0, 57).trimEnd()}…` : p.description;
              lines.push({ text: `  ${slug.padEnd(22)} ${desc}`, type: 'output' });
            }
          }
          pushLines([
            ...lines,
            { text: '', type: 'output' },
            { text: "  Use 'open <project>' to launch one, or 'cd development' for the full list.", type: 'system' },
            { text: '', type: 'output' },
          ]);
        } else if (sub === 'docs') {
          pushLines([
            { text: '', type: 'output' },
            ...DOCUMENTS.map(d => ({
              text: `  ${d.slug.padEnd(22)} ${d.title.split(':')[0]}`,
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
        } else if (ROUTE_MAP.has(target)) {
          navigate(ROUTE_MAP.get(target) as string);
          pushLines([{ text: `Navigating to ${target}...`, type: 'system' }]);
        } else {
          pushLines([
            { text: `cd: '${target}' not found. Use 'ls pages' to see routes.`, type: 'error' },
          ]);
        }
        break;
      }

      // ── open ──
      case 'open': {
        const slug = slugify(args.join(' '));
        const project = slug
          ? PROJECT_LOOKUP.get(slug) ?? ALL_PROJECTS.find(p => projectSlug(p).startsWith(slug))
          : undefined;
        if (!slug) {
          pushLines([{ text: 'open: specify a project. Try \'ls projects\'.', type: 'error' }]);
        } else if (!project) {
          pushLines([{ text: `open: '${args.join(' ')}' not found. Try 'ls projects'.`, type: 'error' }]);
        } else if (project.internal) {
          navigate(project.url);
          pushLines([{ text: `Navigating to ${project.name}...`, type: 'system' }]);
        } else {
          window.open(project.url, '_blank', 'noopener,noreferrer');
          pushLines([{ text: `Opening ${project.name} → ${project.url}`, type: 'system' }]);
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
            text: `  ${String(i + 1).padStart(2)}.  ${m.date.padEnd(28)} ${m.title}`,
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
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputValue(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (!input) return;
      const typed = input.toLowerCase();
      const matches = ALL_COMMANDS.filter(c => c.startsWith(typed));
      if (matches.length === 1) {
        setInputValue(`${matches[0]} `);
      } else if (matches.length > 1) {
        const shared = commonPrefix(matches);
        if (shared.length > typed.length) {
          setInputValue(shared);
        } else if (matches.includes(typed) && !typed.endsWith(' ')) {
          // e.g. "ls" → "ls " so the next Tab lists its arguments.
          setInputValue(`${typed} `);
        } else {
          // List the candidates for the word being completed, like a real shell.
          const start = typed.lastIndexOf(' ') + 1;
          const options = Array.from(new Set(
            matches.map(m => m.slice(start)).filter(rest => rest && !rest.includes(' ')),
          ));
          pushLines([
            { text: `visitor@sandford ~ $ ${input}`, type: 'input' },
            { text: options.join('  '), type: 'system' },
          ]);
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setOutput([]);
    }
  }, [input, commandHistory, historyIndex, executeCommand, pushLines, setInputValue]);

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <TerminalWrapper
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      onClick={focusInput}
      role="region"
      aria-label="Interactive terminal. Type help and press Enter."
    >
      <TitleBar>
        <Dot $color="#bf616a" />
        <Dot $color="#ebcb8b" />
        <Dot $color="#a3be8c" />
        <TitleText>visitor@sandford.systems:~</TitleText>
      </TitleBar>

      <OutputArea ref={outputRef} role="log" aria-live="polite">
        {output.map((line, i) => (
          <Line key={i} $type={line.type}>{line.text}</Line>
        ))}
      </OutputArea>

      <InputRow>
        <Prompt>visitor@sandford ~ $&nbsp;</Prompt>
        <HiddenInput
          ref={inputRef}
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setCaret(e.target.selectionStart ?? e.target.value.length);
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={syncCaret}
          onSelect={syncCaret}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          enterKeyHint="send"
          aria-label="Terminal command input"
        />
        <InputDisplay aria-hidden="true">
          {input.slice(0, caret)}
          <Cursor $focused={focused}>{input.slice(caret, caret + 1) || ' '}</Cursor>
          {input.slice(caret + 1)}
        </InputDisplay>
      </InputRow>
    </TerminalWrapper>
  );
}

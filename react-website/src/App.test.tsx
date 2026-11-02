import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import DevelopmentPage from './components/DevelopmentPage';
import InteractiveTerminal from './components/InteractiveTerminal';
import Navigation from './components/Navigation';
import { ALL_PROJECTS, NAV_ITEMS, PROJECT_GROUPS, SOURCE_LINKS } from './data/siteContent';
import reportWebVitals from './reportWebVitals';

const LocationProbe = () => <div data-testid="location">{useLocation().pathname}</div>;

const renderAt = (ui: React.ReactElement, path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      {ui}
      <Routes>
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ type: 'opaque', ok: false }) as jest.Mock;
});

test('reportWebVitals function exists', () => {
  expect(typeof reportWebVitals).toBe('function');
});

test('navigation shows each destination once, with the brand as the home link', () => {
  renderAt(<Navigation />, '/development');

  const nav = screen.getByRole('navigation', { name: 'Primary' });
  expect(within(nav).getByRole('link', { name: 'sandford.systems home' })).toHaveAttribute('href', '/');

  for (const item of NAV_ITEMS.filter((i) => i.path !== '/')) {
    expect(within(nav).getAllByRole('link', { name: item.label })).toHaveLength(1);
  }
  expect(within(nav).getByRole('link', { name: 'Development' })).toHaveAttribute('aria-current', 'page');
  expect(within(nav).queryByRole('link', { name: 'Apps' })).not.toBeInTheDocument();
  expect(within(nav).queryByRole('link', { name: 'Sites' })).not.toBeInTheDocument();
});

test('Development page is the single home for every project and dev link', async () => {
  renderAt(<DevelopmentPage />, '/development');

  await waitFor(() => expect(global.fetch).toHaveBeenCalled());

  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  for (const group of PROJECT_GROUPS) {
    expect(screen.getByRole('heading', { name: group.title })).toBeInTheDocument();
  }
  for (const project of ALL_PROJECTS) {
    const link = screen.getByRole('link', { name: new RegExp(project.name.replace(/[()]/g, '\\$&')) });
    expect(link).toHaveAttribute('href', project.url);
  }
  for (const link of SOURCE_LINKS) {
    expect(screen.getByRole('link', { name: link.name })).toHaveAttribute('href', link.url);
  }

  // No project URL is listed twice.
  const urls = ALL_PROJECTS.map((p) => p.url);
  expect(new Set(urls).size).toBe(urls.length);
});

const typeCommand = (command: string) => {
  const input = screen.getByLabelText('Terminal command input');
  fireEvent.change(input, { target: { value: command } });
  fireEvent.keyDown(input, { key: 'Enter' });
};

test('terminal lists help and navigates with cd aliases', () => {
  renderAt(<InteractiveTerminal />);

  typeCommand('help');
  expect(screen.getByText('Available commands:')).toBeInTheDocument();

  typeCommand('cd projects');
  expect(screen.getByTestId('location')).toHaveTextContent('/development');
});

test('terminal tab-completes commands', () => {
  renderAt(<InteractiveTerminal />);
  const input = screen.getByLabelText('Terminal command input') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'neo' } });
  fireEvent.keyDown(input, { key: 'Tab' });
  expect(input.value).toBe('neofetch ');
});

test('terminal ls projects reflects the shared project list', () => {
  renderAt(<InteractiveTerminal />);
  typeCommand('ls projects');
  expect(screen.getByText(/silicon-acres/)).toBeInTheDocument();
});

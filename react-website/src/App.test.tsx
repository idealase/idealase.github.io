import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation', () => {
  render(<App />);
  const homeLink = screen.getByText(/home/i);
  expect(homeLink).toBeInTheDocument();
});

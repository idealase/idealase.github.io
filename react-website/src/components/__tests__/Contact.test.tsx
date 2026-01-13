import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contact from '../Contact';

// Mock EmailJS
jest.mock('@emailjs/browser', () => ({
  init: jest.fn(),
  send: jest.fn(),
}));

describe('Contact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders contact form with all fields', () => {
    render(<Contact />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  test('displays user-friendly error message for "Failed to fetch" error', async () => {
    const emailjs = require('@emailjs/browser');
    emailjs.send.mockRejectedValue({
      text: 'Failed to fetch',
      message: 'Failed to fetch'
    });

    render(<Contact />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Wait for error message
    await waitFor(() => {
      const errorMessage = screen.getByText(/network connectivity issue/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('contact@sandford.systems');
    });
  });

  test('displays specific error message for 404 error', async () => {
    const emailjs = require('@emailjs/browser');
    emailjs.send.mockRejectedValue({
      status: 404,
      text: 'Not Found'
    });

    render(<Contact />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/configuration not found/i)).toBeInTheDocument();
    });
  });

  test('displays success message when email sends successfully', async () => {
    const emailjs = require('@emailjs/browser');
    emailjs.send.mockResolvedValue({
      status: 200,
      text: 'OK'
    });

    render(<Contact />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    });
  });
});

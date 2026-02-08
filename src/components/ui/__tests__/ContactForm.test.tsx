import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import ContactForm from '../ContactForm';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock the hooks
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </ThemeProvider>
);

describe('ContactForm Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  test('Property 20: User Feedback Notifications - Feature: lewis-portfolio-website, Property 20: User Feedback Notifications', async () => {
    // **Property 20: User Feedback Notifications**
    // **Validates: Requirements 5.3**
    // For any contact form submission, toast notifications should appear to provide user feedback on the submission status

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 2, maxLength: 100 }),
          email: fc.emailAddress(),
          message: fc.string({ minLength: 10, maxLength: 1000 }),
        }),
        fc.boolean(), // success or failure response
        async (formData, shouldSucceed) => {
          const mockShowSuccess = jest.fn();
          const mockShowError = jest.fn();

          // Mock useToast hook
          const { useToast } = require('@/hooks/useToast');
          useToast.mockReturnValue({
            showSuccess: mockShowSuccess,
            showError: mockShowError,
          });

          // Mock fetch response
          if (shouldSucceed) {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
              ok: true,
              json: async () => ({
                success: true,
                message: 'Contact form submitted successfully',
              }),
            });
          } else {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
              ok: false,
              json: async () => ({
                success: false,
                message: 'Failed to submit contact form',
              }),
            });
          }

          render(
            <TestWrapper>
              <ContactForm />
            </TestWrapper>
          );

          // Fill out the form
          const nameInput = screen.getByLabelText(/name/i);
          const emailInput = screen.getByLabelText(/email/i);
          const messageInput = screen.getByLabelText(/message/i);
          const submitButton = screen.getByRole('button', { name: /send message/i });

          fireEvent.change(nameInput, { target: { value: formData.name } });
          fireEvent.change(emailInput, { target: { value: formData.email } });
          fireEvent.change(messageInput, { target: { value: formData.message } });

          // Submit the form
          fireEvent.click(submitButton);

          // Wait for the async operation to complete
          await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
          });

          // Verify that appropriate toast notification was called
          if (shouldSucceed) {
            expect(mockShowSuccess).toHaveBeenCalledWith(expect.any(String));
            expect(mockShowError).not.toHaveBeenCalled();
          } else {
            expect(mockShowError).toHaveBeenCalledWith(expect.any(String));
            expect(mockShowSuccess).not.toHaveBeenCalled();
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 20: User Feedback Notifications - Network Error Handling', async () => {
    // Test that network errors also trigger user feedback notifications

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 2, maxLength: 100 }),
          email: fc.emailAddress(),
          message: fc.string({ minLength: 10, maxLength: 1000 }),
        }),
        async (formData) => {
          const mockShowSuccess = jest.fn();
          const mockShowError = jest.fn();

          // Mock useToast hook
          const { useToast } = require('@/hooks/useToast');
          useToast.mockReturnValue({
            showSuccess: mockShowSuccess,
            showError: mockShowError,
          });

          // Mock fetch to throw network error
          (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

          render(
            <TestWrapper>
              <ContactForm />
            </TestWrapper>
          );

          // Fill out the form
          const nameInput = screen.getByLabelText(/name/i);
          const emailInput = screen.getByLabelText(/email/i);
          const messageInput = screen.getByLabelText(/message/i);
          const submitButton = screen.getByRole('button', { name: /send message/i });

          fireEvent.change(nameInput, { target: { value: formData.name } });
          fireEvent.change(emailInput, { target: { value: formData.email } });
          fireEvent.change(messageInput, { target: { value: formData.message } });

          // Submit the form
          fireEvent.click(submitButton);

          // Wait for the async operation to complete
          await waitFor(() => {
            expect(mockShowError).toHaveBeenCalledWith(expect.any(String));
          });

          // Verify that error notification was called and success was not
          expect(mockShowError).toHaveBeenCalledWith(expect.any(String));
          expect(mockShowSuccess).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 10 }
    );
  });

  test('Property 20: User Feedback Notifications - Custom onSubmit Handler', async () => {
    // Test that custom onSubmit handlers also trigger appropriate notifications

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 2, maxLength: 100 }),
          email: fc.emailAddress(),
          message: fc.string({ minLength: 10, maxLength: 1000 }),
        }),
        fc.boolean(), // success or failure
        async (formData, shouldSucceed) => {
          const mockShowSuccess = jest.fn();
          const mockShowError = jest.fn();

          // Mock useToast hook
          const { useToast } = require('@/hooks/useToast');
          useToast.mockReturnValue({
            showSuccess: mockShowSuccess,
            showError: mockShowError,
          });

          // Create custom onSubmit handler
          const customOnSubmit = jest.fn().mockImplementation(async () => {
            if (!shouldSucceed) {
              throw new Error('Custom submission error');
            }
          });

          render(
            <TestWrapper>
              <ContactForm onSubmit={customOnSubmit} />
            </TestWrapper>
          );

          // Fill out the form
          const nameInput = screen.getByLabelText(/name/i);
          const emailInput = screen.getByLabelText(/email/i);
          const messageInput = screen.getByLabelText(/message/i);
          const submitButton = screen.getByRole('button', { name: /send message/i });

          fireEvent.change(nameInput, { target: { value: formData.name } });
          fireEvent.change(emailInput, { target: { value: formData.email } });
          fireEvent.change(messageInput, { target: { value: formData.message } });

          // Submit the form
          fireEvent.click(submitButton);

          // Wait for the async operation to complete
          await waitFor(() => {
            expect(customOnSubmit).toHaveBeenCalledWith(formData);
          });

          // Verify that appropriate toast notification was called
          if (shouldSucceed) {
            expect(mockShowSuccess).toHaveBeenCalledWith(expect.any(String));
            expect(mockShowError).not.toHaveBeenCalled();
          } else {
            expect(mockShowError).toHaveBeenCalledWith(expect.any(String));
            expect(mockShowSuccess).not.toHaveBeenCalled();
          }
        }
      ),
      { numRuns: 10 }
    );
  });
});
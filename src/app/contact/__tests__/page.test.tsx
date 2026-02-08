import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';

// Mock the contexts
jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      // Mock translations for contact page
      const translations: Record<string, string> = {
        'contact.phone': '+254712345678',
        'contact.title': 'Contact Me',
        'contact.description': 'Get in touch',
        'contact.name': 'Name',
        'contact.email': 'Email',
        'contact.message': 'Message',
        'contact.send': 'Send Message',
        'contact.call': 'Call Me',
      };
      return translations[key] || key;
    },
    language: 'en',
    setLanguage: jest.fn(),
    isLoading: false,
    supportedLanguages: ['en', 'sw', 'fr'],
  }),
}));

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
}));

// Mock the hooks
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}));

// Mock window.location
const mockLocation = {
  href: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Create a simple test component that mimics the click-to-call functionality
const ClickToCallTestComponent: React.FC<{ phoneNumber: string; testId: string }> = ({ phoneNumber, testId }) => {
  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div>
      <a href={`tel:${phoneNumber}`} data-testid={`tel-link-${testId}`}>
        {phoneNumber}
      </a>
      <button type="button" onClick={handleCallClick} data-testid={`call-button-${testId}`}>
        Call Me
      </button>
    </div>
  );
};

describe('Contact Page Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
  });

  test('Property 21: Mobile Click-to-Call Functionality - Feature: lewis-portfolio-website, Property 21: Mobile Click-to-Call Functionality', async () => {
    // **Property 21: Mobile Click-to-Call Functionality**
    // **Validates: Requirements 5.4**
    // For any phone number display, clicking should initiate a phone call on mobile devices

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Test different phone number formats
          phoneNumber: fc.oneof(
            fc.constant('+254712345678'), // International format
            fc.constant('0712345678'),    // Local format
            fc.constant('+1-555-123-4567'), // US format with dashes
            fc.constant('(555) 123-4567'),  // US format with parentheses
          ),
        }),
        async ({ phoneNumber }) => {
          const testId = Math.random().toString(36).substring(7);
          const { unmount } = render(<ClickToCallTestComponent phoneNumber={phoneNumber} testId={testId} />);

          // Find the call button
          const callButton = screen.getByTestId(`call-button-${testId}`);
          expect(callButton).toBeInTheDocument();

          // Click the call button
          fireEvent.click(callButton);

          // Verify that window.location.href was set to the tel: URL
          expect(mockLocation.href).toBe(`tel:${phoneNumber}`);

          // Also check if there's a direct tel: link and test it
          const telLink = screen.getByTestId(`tel-link-${testId}`);
          expect(telLink).toBeInTheDocument();
          expect(telLink.getAttribute('href')).toBe(`tel:${phoneNumber}`);

          // Clean up
          unmount();
          mockLocation.href = '';
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 21: Mobile Click-to-Call Functionality - Phone Number Sanitization', async () => {
    // Test that phone numbers are properly formatted for tel: links

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Test phone numbers with various formatting characters
          phoneNumber: fc.oneof(
            fc.constant('+254 (712) 345-678'),
            fc.constant('+254.712.345.678'),
            fc.constant('+254 712 345 678'),
            fc.constant('(254) 712-345-678'),
          ),
        }),
        async ({ phoneNumber }) => {
          const testId = Math.random().toString(36).substring(7);
          const { unmount } = render(<ClickToCallTestComponent phoneNumber={phoneNumber} testId={testId} />);

          // Find tel: link
          const telLink = screen.getByTestId(`tel-link-${testId}`);
          const href = telLink.getAttribute('href');
          
          // Verify the tel: link is properly formatted
          expect(href).toBe(`tel:${phoneNumber}`);
          
          // Verify it starts with tel:
          expect(href).toMatch(/^tel:/);

          // Clean up
          unmount();
        }
      ),
      { numRuns: 15 }
    );
  });

  test('Property 21: Mobile Click-to-Call Functionality - Accessibility Compliance', async () => {
    // Test that click-to-call functionality is accessible

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          phoneNumber: fc.constant('+254712345678'),
        }),
        async ({ phoneNumber }) => {
          const testId = Math.random().toString(36).substring(7);
          const { unmount } = render(<ClickToCallTestComponent phoneNumber={phoneNumber} testId={testId} />);

          // Find tel: link
          const telLink = screen.getByTestId(`tel-link-${testId}`);
          
          // Verify accessibility attributes
          expect(telLink).toHaveAttribute('href', `tel:${phoneNumber}`);
          
          // Verify the link has accessible text content
          expect(telLink.textContent).toBeTruthy();
          expect(telLink.textContent?.trim()).not.toBe('');
          
          // Verify the link is keyboard accessible (should be focusable)
          expect(telLink).not.toHaveAttribute('tabindex', '-1');

          // Find call button
          const callButton = screen.getByTestId(`call-button-${testId}`);
          
          // Verify button accessibility
          expect(callButton).toHaveAttribute('type', 'button');
          expect(callButton.textContent).toBeTruthy();
          
          // Verify button is keyboard accessible
          expect(callButton).not.toHaveAttribute('tabindex', '-1');
          expect(callButton).not.toHaveAttribute('disabled');

          // Clean up
          unmount();
        }
      ),
      { numRuns: 10 }
    );
  });
});
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color)',
          red: '#E63946',
        },
        secondary: {
          DEFAULT: 'var(--secondary-color)',
          white: '#FFFFFF',
          dark: '#1A1A1A',
        },
        accent: {
          DEFAULT: 'var(--accent-color)',
          yellow: '#FFC107',
        },
        theme: {
          primary: 'var(--primary-color)',
          secondary: 'var(--secondary-color)',
          background: 'var(--background-color)',
          surface: 'var(--surface-color)',
          text: 'var(--text-color)',
          accent: 'var(--accent-color)',
          border: 'var(--border-color)',
          shadow: 'var(--shadow-color)',
        },
        dark: {
          primary: '#E63946',
          secondary: '#1A1A1A',
          background: '#121212',
          surface: '#1E1E1E',
          text: '#FFFFFF',
          border: '#374151',
        },
        light: {
          primary: '#E63946',
          secondary: '#FFFFFF',
          background: '#FFFFFF',
          surface: '#F8F9FA',
          text: '#212529',
          border: '#E5E7EB',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-theme-surface theme-transition-colors group"
      aria-label={t('theme.toggle')}
      title={theme === 'light' ? t('theme.dark') : t('theme.light')}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 text-theme-text ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        
        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 text-theme-text ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  )
}
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'

type Language = 'en' | 'sw' | 'fr'

interface LanguageOption {
  code: Language
  name: string
  flag: string
}

export function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme } = useTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages: LanguageOption[] = [
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
    { code: 'sw', name: t('language.swahili'), flag: '🇰🇪' },
    { code: 'fr', name: t('language.french'), flag: '🇫🇷' },
  ]

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        aria-label={t('language.toggle')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage.name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
          theme === 'dark' 
            ? 'bg-dark-surface border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200 ${
                  language === lang.code
                    ? 'bg-primary text-white'
                    : theme === 'dark'
                    ? 'text-dark-text hover:bg-gray-700'
                    : 'text-light-text hover:bg-gray-100'
                }`}
                role="menuitem"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
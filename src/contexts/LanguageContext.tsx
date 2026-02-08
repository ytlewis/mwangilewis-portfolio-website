'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import i18n from '@/lib/i18n'

type Language = 'en' | 'sw' | 'fr'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, options?: any) => string
  isLoading: boolean
  supportedLanguages: Language[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)
  const [updateKey, setUpdateKey] = useState(0)

  const supportedLanguages: Language[] = ['en', 'sw', 'fr']

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Wait for i18n to be initialized
        if (!i18n.isInitialized) {
          await new Promise((resolve) => {
            i18n.on('initialized', resolve)
          })
        }

        // Get current language from i18n (which handles detection)
        const currentLang = i18n.language as Language
        
        // Validate and set language
        if (supportedLanguages.includes(currentLang)) {
          setLanguageState(currentLang)
        } else {
          // Fallback to English if detected language is not supported
          setLanguageState('en')
          await i18n.changeLanguage('en')
        }
        
        // Ensure persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('i18nextLng', i18n.language)
        }
        
      } catch (error) {
        console.error('Error initializing language:', error)
        // Fallback to English on error
        setLanguageState('en')
        await i18n.changeLanguage('en')
      } finally {
        setIsLoading(false)
      }
    }

    initializeLanguage()

    // Listen for language changes from i18n
    const handleLanguageChanged = (lng: string) => {
      const newLang = lng as Language
      if (supportedLanguages.includes(newLang)) {
        setLanguageState(newLang)
        setUpdateKey(prev => prev + 1) // Force re-render
      }
    }

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [])

  const setLanguage = async (newLanguage: Language) => {
    if (!supportedLanguages.includes(newLanguage)) {
      console.warn(`Unsupported language: ${newLanguage}. Falling back to English.`)
      newLanguage = 'en'
    }

    try {
      setLanguageState(newLanguage)
      await i18n.changeLanguage(newLanguage)
      
      // Ensure persistence in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('i18nextLng', newLanguage)
      }
      
      // Update HTML lang attribute for accessibility
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLanguage
      }

      // Force re-render
      setUpdateKey(prev => prev + 1)
    } catch (error) {
      console.error('Error changing language:', error)
      // Revert to previous language on error
      setLanguageState(language)
    }
  }

  const t = (key: string, options?: any): string => {
    try {
      const translation = i18n.t(key, options)
      // Return key if translation is missing (for debugging)
      return typeof translation === 'string' ? translation : key
    } catch (error) {
      console.error('Translation error for key:', key, error)
      return key
    }
  }

  // Always provide context, even before mounting
  return (
    <LanguageContext.Provider 
      key={updateKey}
      value={{ 
        language, 
        setLanguage, 
        t, 
        isLoading, 
        supportedLanguages 
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

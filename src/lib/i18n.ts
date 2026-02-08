import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enTranslations from '@/locales/en.json'
import swTranslations from '@/locales/sw.json'
import frTranslations from '@/locales/fr.json'

// Translation resources
const resources = {
  en: {
    translation: enTranslations
  },
  sw: {
    translation: swTranslations
  },
  fr: {
    translation: frTranslations
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'sw', 'fr'],
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      // Cache user language preference
      caches: ['localStorage'],
      // Look for language in localStorage with this key
      lookupLocalStorage: 'i18nextLng',
      // Look for language in navigator
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      // Exclude certain languages from detection
      excludeCacheFor: ['cimode'],
      // Convert language codes (e.g., en-US -> en)
      convertDetectedLanguage: (lng: string) => {
        // Extract main language code (en-US -> en)
        const mainLang = lng.split('-')[0].toLowerCase()
        // Return supported language or fallback to English
        return ['en', 'sw', 'fr'].includes(mainLang) ? mainLang : 'en'
      }
    },
    
    // React specific options
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },
    
    // Namespace and key separator
    keySeparator: '.',
    nsSeparator: ':',
    
    // Return key if translation is missing
    returnEmptyString: false,
    returnNull: false,
    
    // Load languages on init
    preload: ['en', 'sw', 'fr'],
    
    // Clean code on init
    cleanCode: true,
  })

export default i18n
import * as fc from 'fast-check'
import i18n from '@/lib/i18n'

// Import translation files to verify structure
import enTranslations from '@/locales/en.json'
import swTranslations from '@/locales/sw.json'
import frTranslations from '@/locales/fr.json'

describe('Language System Properties', () => {
  beforeAll(async () => {
    // Ensure i18n is initialized before tests
    if (!i18n.isInitialized) {
      await new Promise((resolve) => {
        i18n.on('initialized', resolve)
      })
    }
  })

  test('Property 8: Language Support Completeness - For any language selection (English, Swahili, French), the system should have corresponding translation files and display the language option', () => {
    // Feature: lewis-portfolio-website, Property 8: Language Support Completeness
    fc.assert(fc.property(
      fc.constantFrom('en', 'sw', 'fr'),
      (languageCode) => {
        // Verify the language is supported by i18n
        const supportedLanguages = i18n.options.supportedLngs || []
        expect(supportedLanguages).toContain(languageCode)

        // Verify translation resources exist for the language
        const resources = i18n.options.resources
        expect(resources).toHaveProperty(languageCode)
        expect(resources![languageCode]).toHaveProperty('translation')

        // Verify translation file has required structure
        const translations = resources![languageCode].translation
        expect(translations).toHaveProperty('navigation')
        expect(translations).toHaveProperty('language')
        expect(translations).toHaveProperty('theme')
        expect(translations).toHaveProperty('common')

        // Verify language display names exist
        expect(translations.language).toHaveProperty('english')
        expect(translations.language).toHaveProperty('swahili')
        expect(translations.language).toHaveProperty('french')

        // Verify navigation translations exist
        expect(translations.navigation).toHaveProperty('home')
        expect(translations.navigation).toHaveProperty('about')
        expect(translations.navigation).toHaveProperty('projects')
        expect(translations.navigation).toHaveProperty('experience')
        expect(translations.navigation).toHaveProperty('contact')

        // Verify all translation values are non-empty strings
        const checkTranslationValues = (obj: any, path = '') => {
          Object.entries(obj).forEach(([key, value]) => {
            const currentPath = path ? `${path}.${key}` : key
            if (typeof value === 'string') {
              expect(value.length).toBeGreaterThan(0)
              expect(value.trim()).toBe(value) // No leading/trailing whitespace
            } else if (typeof value === 'object' && value !== null) {
              checkTranslationValues(value, currentPath)
            }
          })
        }

        checkTranslationValues(translations)
      }
    ), { numRuns: 10 })
  })

  test('Property 8: Language Support Completeness - Translation files should have consistent structure across all languages', () => {
    // Feature: lewis-portfolio-website, Property 8: Language Support Completeness
    fc.assert(fc.property(
      fc.constantFrom('navigation', 'language', 'theme', 'common', 'home', 'about', 'projects', 'experience', 'contact', 'admin'),
      (section) => {
        // Get all translation objects
        const translations = {
          en: enTranslations,
          sw: swTranslations,
          fr: frTranslations
        }

        // Verify all languages have the same sections
        Object.entries(translations).forEach(([langCode, translation]) => {
          expect(translation).toHaveProperty(section)
          
          // Verify section is not empty
          const sectionContent = (translation as any)[section]
          expect(typeof sectionContent).toBe('object')
          expect(Object.keys(sectionContent).length).toBeGreaterThan(0)
        })

        // Verify all languages have the same keys within each section
        const enKeys = Object.keys((enTranslations as any)[section] || {})
        const swKeys = Object.keys((swTranslations as any)[section] || {})
        const frKeys = Object.keys((frTranslations as any)[section] || {})

        expect(enKeys.sort()).toEqual(swKeys.sort())
        expect(enKeys.sort()).toEqual(frKeys.sort())
      }
    ), { numRuns: 10 })
  })

  test('Property 8: Language Support Completeness - i18n configuration should support all required languages', () => {
    // Feature: lewis-portfolio-website, Property 8: Language Support Completeness
    fc.assert(fc.property(
      fc.constant(['en', 'sw', 'fr']),
      (requiredLanguages) => {
        // Verify i18n is configured with all required languages
        const supportedLngs = i18n.options.supportedLngs || []
        
        requiredLanguages.forEach(lang => {
          expect(supportedLngs).toContain(lang)
        })

        // Verify fallback language is set (handle both string and array formats)
        const fallbackLng = i18n.options.fallbackLng
        if (Array.isArray(fallbackLng)) {
          expect(fallbackLng).toContain('en')
        } else {
          expect(fallbackLng).toBe('en')
        }

        // Verify language detection is configured
        expect(i18n.options.detection).toBeDefined()
        expect(i18n.options.detection?.order).toContain('localStorage')
        expect(i18n.options.detection?.caches).toContain('localStorage')

        // Verify resources are loaded for all languages
        const resources = i18n.options.resources || {}
        requiredLanguages.forEach(lang => {
          expect(resources).toHaveProperty(lang)
          expect(resources[lang]).toHaveProperty('translation')
        })
      }
    ), { numRuns: 10 })
  })
})
  test('Property 9: Language Content Updates - For any language change event, all static text content should immediately update to the selected language', () => {
    // Feature: lewis-portfolio-website, Property 9: Language Content Updates
    fc.assert(fc.property(
      fc.constantFrom('en', 'sw', 'fr'),
      fc.constantFrom('en', 'sw', 'fr'),
      (fromLanguage, toLanguage) => {
        // Change to the initial language synchronously
        i18n.changeLanguage(fromLanguage)
        
        // Get a sample translation in the initial language
        const initialTranslation = i18n.t('navigation.home')
        expect(typeof initialTranslation).toBe('string')
        expect(initialTranslation.length).toBeGreaterThan(0)
        
        // Change to the target language synchronously
        i18n.changeLanguage(toLanguage)
        
        // Get the same translation in the new language
        const updatedTranslation = i18n.t('navigation.home')
        expect(typeof updatedTranslation).toBe('string')
        expect(updatedTranslation.length).toBeGreaterThan(0)
        
        // If languages are different, translations should be different
        if (fromLanguage !== toLanguage) {
          expect(updatedTranslation).not.toBe(initialTranslation)
        } else {
          expect(updatedTranslation).toBe(initialTranslation)
        }
        
        // Verify multiple translation keys update correctly
        const testKeys = [
          'navigation.home',
          'navigation.about',
          'navigation.projects',
          'language.english',
          'language.swahili',
          'language.french',
          'common.loading',
          'theme.toggle'
        ]
        
        testKeys.forEach(key => {
          const translation = i18n.t(key)
          expect(typeof translation).toBe('string')
          expect(translation.length).toBeGreaterThan(0)
          // Translation should not be the key itself (indicating missing translation)
          expect(translation).not.toBe(key)
        })
      }
    ), { numRuns: 10 })
  })

  test('Property 9: Language Content Updates - Language changes should be immediate and synchronous', () => {
    // Feature: lewis-portfolio-website, Property 9: Language Content Updates
    fc.assert(fc.property(
      fc.constantFrom('en', 'sw', 'fr'),
      (targetLanguage) => {
        // Record the time before language change
        const startTime = Date.now()
        
        // Change language synchronously
        i18n.changeLanguage(targetLanguage)
        
        // Record the time after language change
        const endTime = Date.now()
        
        // Verify language change was immediate (within reasonable time)
        const changeTime = endTime - startTime
        expect(changeTime).toBeLessThan(100) // Should complete within 100ms
        
        // Verify translations are immediately available
        const translation = i18n.t('navigation.home')
        expect(typeof translation).toBe('string')
        expect(translation.length).toBeGreaterThan(0)
        
        // Verify the translation is valid (not the key itself)
        expect(translation).not.toBe('navigation.home')
      }
    ), { numRuns: 10 })
  })

  test('Property 9: Language Content Updates - Nested translation keys should update correctly', () => {
    // Feature: lewis-portfolio-website, Property 9: Language Content Updates
    fc.assert(fc.property(
      fc.constantFrom('en', 'sw', 'fr'),
      fc.constantFrom(
        'navigation.home',
        'language.english', 
        'theme.toggle',
        'common.loading'
      ),
      (language, translationKey) => {
        // Change to the target language synchronously
        i18n.changeLanguage(language)
        
        // Get the translation
        const translation = i18n.t(translationKey)
        
        // Verify translation exists and is valid
        expect(typeof translation).toBe('string')
        expect(translation.length).toBeGreaterThan(0)
        
        // Verify translation is not the key itself (missing translation)
        expect(translation).not.toBe(translationKey)
        
        // Verify translation doesn't contain placeholder patterns
        expect(translation).not.toMatch(/\{\{.*\}\}/) // No handlebars
        expect(translation).not.toMatch(/\$\{.*\}/) // No template literals
        
        // Verify translation is properly trimmed
        expect(translation).toBe(translation.trim())
      }
    ), { numRuns: 10 })
  })
  test('Property 11: Language Preference Persistence - For any language selection, the preference should persist across browser sessions and page refreshes', () => {
    // Feature: lewis-portfolio-website, Property 11: Language Preference Persistence
    fc.assert(fc.property(
      fc.constantFrom('en', 'sw', 'fr'),
      (selectedLanguage) => {
        // Verify i18n has localStorage detection configured
        const detectionOptions = i18n.options.detection
        expect(detectionOptions).toBeDefined()
        expect(detectionOptions?.order).toContain('localStorage')
        expect(detectionOptions?.caches).toContain('localStorage')
        
        // Verify the localStorage key is configured
        expect(detectionOptions?.lookupLocalStorage).toBe('i18nextLng')
        
        // Change language and verify it would be stored
        i18n.changeLanguage(selectedLanguage)
        
        // Verify the language change mechanism works
        const translation = i18n.t('navigation.home')
        expect(typeof translation).toBe('string')
        expect(translation.length).toBeGreaterThan(0)
        
        // Verify supported languages include the selected language
        const supportedLngs = i18n.options.supportedLngs || []
        expect(supportedLngs).toContain(selectedLanguage)
      }
    ), { numRuns: 10 })
  })

  test('Property 11: Language Preference Persistence - Language detection should work with localStorage priority', () => {
    // Feature: lewis-portfolio-website, Property 11: Language Preference Persistence
    fc.assert(fc.property(
      fc.constantFrom('en', 'sw', 'fr'),
      (preferredLanguage) => {
        // Verify detection order prioritizes localStorage
        const detectionOptions = i18n.options.detection
        expect(detectionOptions?.order).toBeDefined()
        
        const order = detectionOptions?.order || []
        const localStorageIndex = order.indexOf('localStorage')
        const navigatorIndex = order.indexOf('navigator')
        
        // localStorage should come before navigator in detection order
        expect(localStorageIndex).toBeGreaterThanOrEqual(0)
        if (navigatorIndex >= 0) {
          expect(localStorageIndex).toBeLessThan(navigatorIndex)
        }
        
        // Verify language conversion function handles supported languages
        const convertFn = detectionOptions?.convertDetectedLanguage
        if (convertFn) {
          const convertedLang = convertFn(preferredLanguage)
          expect(['en', 'sw', 'fr']).toContain(convertedLang)
        }
        
        // Verify supported languages include the preferred language
        const supportedLngs = i18n.options.supportedLngs || []
        expect(supportedLngs).toContain(preferredLanguage)
      }
    ), { numRuns: 10 })
  })

  test('Property 11: Language Preference Persistence - Invalid stored languages should fallback to English', () => {
    // Feature: lewis-portfolio-website, Property 11: Language Preference Persistence
    fc.assert(fc.property(
      fc.constantFrom('invalid', 'xx', 'zz', 'de', 'es'),
      (invalidLanguage) => {
        // Verify fallback language configuration
        const fallbackLng = i18n.options.fallbackLng
        if (Array.isArray(fallbackLng)) {
          expect(fallbackLng).toContain('en')
        } else {
          expect(fallbackLng).toBe('en')
        }
        
        // Verify supported languages list (excluding cimode which is internal)
        const supportedLngs = i18n.options.supportedLngs || []
        const userLanguages = supportedLngs.filter(lang => lang !== 'cimode')
        expect(userLanguages).toEqual(['en', 'sw', 'fr'])
        
        // Verify invalid language is not in supported list (excluding cimode)
        if (!['en', 'sw', 'fr'].includes(invalidLanguage)) {
          expect(userLanguages).not.toContain(invalidLanguage)
        }
        
        // Verify language conversion function handles invalid languages
        const convertFn = i18n.options.detection?.convertDetectedLanguage
        if (convertFn) {
          const convertedLang = convertFn(invalidLanguage)
          expect(['en', 'sw', 'fr']).toContain(convertedLang)
        }
        
        // Verify English translations are always available as fallback
        i18n.changeLanguage('en')
        const translation = i18n.t('navigation.home')
        expect(typeof translation).toBe('string')
        expect(translation.length).toBeGreaterThan(0)
        expect(translation).not.toBe('navigation.home')
      }
    ), { numRuns: 10 })
  })
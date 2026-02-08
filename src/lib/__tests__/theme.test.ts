import * as fc from 'fast-check'
import { getThemeColor, getExpectedThemeColor, defaultTheme, type Theme } from '../theme'

describe('Theme System Properties', () => {
  test('Property 1: Theme Color Consistency - For any UI element in the portfolio system, the applied colors should match the defined theme color scheme (#E63946 for primary red, #FFFFFF for white background in light mode)', () => {
    // Feature: lewis-portfolio-website, Property 1: Theme Color Consistency
    fc.assert(fc.property(
      fc.constantFrom('light', 'dark'),
      fc.constantFrom('primary', 'secondary', 'background', 'surface', 'text', 'accent', 'border', 'shadow'),
      (theme: Theme, colorType: keyof typeof defaultTheme.light) => {
        // Get the color from our theme utility
        const appliedColor = getThemeColor(theme, colorType)
        
        // Get the expected color from the theme configuration
        const expectedColor = getExpectedThemeColor(theme, colorType)
        
        // Verify that applied color matches expected color
        expect(appliedColor).toBe(expectedColor)
        
        // Verify specific color requirements from the spec
        if (theme === 'light') {
          if (colorType === 'primary') {
            expect(appliedColor).toBe('#E63946') // Required primary red
          }
          if (colorType === 'background') {
            expect(appliedColor).toBe('#FFFFFF') // Required white background
          }
        }
        
        if (theme === 'dark') {
          if (colorType === 'primary') {
            expect(appliedColor).toBe('#E63946') // Primary should be consistent across themes
          }
        }
        
        // Verify color is a valid hex color or rgba
        expect(appliedColor).toMatch(/^#[0-9A-Fa-f]{6}$|^rgba?\([\d\s,\.]+\)$/)
      }
    ), { numRuns: 100 })
  })

  test('Property 1: Theme Color Consistency - Theme configuration should contain all required colors', () => {
    // Feature: lewis-portfolio-website, Property 1: Theme Color Consistency
    fc.assert(fc.property(
      fc.constantFrom('light', 'dark'),
      (theme: Theme) => {
        const themeConfig = defaultTheme[theme]
        
        // Verify all required color properties exist
        const requiredColors = ['primary', 'secondary', 'background', 'surface', 'text', 'accent', 'border', 'shadow']
        
        requiredColors.forEach(colorKey => {
          expect(themeConfig).toHaveProperty(colorKey)
          expect(typeof themeConfig[colorKey as keyof typeof themeConfig]).toBe('string')
          expect(themeConfig[colorKey as keyof typeof themeConfig]).toBeTruthy()
        })
        
        // Verify specific color requirements
        expect(themeConfig.primary).toBe('#E63946') // Primary red must be consistent
        
        if (theme === 'light') {
          expect(themeConfig.background).toBe('#FFFFFF') // Light background must be white
          expect(themeConfig.secondary).toBe('#FFFFFF') // Light secondary must be white
        }
        
        if (theme === 'dark') {
          expect(themeConfig.background).toBe('#121212') // Dark background
          expect(themeConfig.secondary).toBe('#1A1A1A') // Dark secondary
        }
      }
    ), { numRuns: 100 })
  })

  test('Property 1: Theme Color Consistency - Color values should be valid CSS colors', () => {
    // Feature: lewis-portfolio-website, Property 1: Theme Color Consistency
    fc.assert(fc.property(
      fc.constantFrom('light', 'dark'),
      fc.constantFrom('primary', 'secondary', 'background', 'surface', 'text', 'accent', 'border', 'shadow'),
      (theme: Theme, colorType: keyof typeof defaultTheme.light) => {
        const color = getThemeColor(theme, colorType)
        
        // Verify color is a valid format
        const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(color)
        const isValidRgba = /^rgba?\([\d\s,\.]+\)$/.test(color)
        
        expect(isValidHex || isValidRgba).toBe(true)
        
        // Verify color is not empty or undefined
        expect(color).toBeTruthy()
        expect(typeof color).toBe('string')
        expect(color.length).toBeGreaterThan(0)
      }
    ), { numRuns: 100 })
  })

  test('Property 1: Theme Color Consistency - Primary color should be #E63946 for both themes', () => {
    // Feature: lewis-portfolio-website, Property 1: Theme Color Consistency
    fc.assert(fc.property(
      fc.constantFrom('light', 'dark'),
      (theme: Theme) => {
        const primaryColor = getThemeColor(theme, 'primary')
        
        // Primary color must always be #E63946 regardless of theme
        expect(primaryColor).toBe('#E63946')
      }
    ), { numRuns: 100 })
  })

  test('Property 1: Theme Color Consistency - Light theme should have white background', () => {
    // Feature: lewis-portfolio-website, Property 1: Theme Color Consistency
    const lightBackgroundColor = getThemeColor('light', 'background')
    const lightSecondaryColor = getThemeColor('light', 'secondary')
    
    // Light theme must have white background and secondary
    expect(lightBackgroundColor).toBe('#FFFFFF')
    expect(lightSecondaryColor).toBe('#FFFFFF')
  })
})
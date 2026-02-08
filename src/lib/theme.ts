export type Theme = 'light' | 'dark'

export interface ThemeConfig {
  light: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    accent: string
    border: string
    shadow: string
  }
  dark: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    accent: string
    border: string
    shadow: string
  }
  animations: {
    duration: number
    easing: string
    particleCount: number
  }
}

export const defaultTheme: ThemeConfig = {
  light: {
    primary: '#E63946',
    secondary: '#FFFFFF',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#212529',
    accent: '#FFC107',
    border: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    primary: '#E63946',
    secondary: '#1A1A1A',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    accent: '#FFC107',
    border: '#374151',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out',
    particleCount: 100,
  },
}

/**
 * Get theme color value for a specific theme and color type
 */
export function getThemeColor(theme: Theme, colorType: keyof ThemeConfig['light']): string {
  return defaultTheme[theme][colorType]
}

/**
 * Get expected theme color for validation
 */
export function getExpectedThemeColor(theme: Theme, colorType: keyof ThemeConfig['light']): string {
  return defaultTheme[theme][colorType]
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  const themeColors = defaultTheme[theme]
  
  // Update CSS custom properties
  Object.entries(themeColors).forEach(([key, value]) => {
    root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}-color`, value)
  })
  
  // Update class and data attribute
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  root.setAttribute('data-theme', theme)
}

/**
 * Get current theme from document
 */
export function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  const dataTheme = document.documentElement.getAttribute('data-theme') as Theme
  return dataTheme || 'light'
}

/**
 * Check if theme colors are consistent
 */
export function validateThemeColors(theme: Theme): boolean {
  if (typeof window === 'undefined') return true
  
  const root = document.documentElement
  const computedStyle = getComputedStyle(root)
  
  // Check if primary color matches expected
  const primaryColor = computedStyle.getPropertyValue('--primary-color').trim()
  const expectedPrimary = getThemeColor(theme, 'primary')
  
  return primaryColor === expectedPrimary
}
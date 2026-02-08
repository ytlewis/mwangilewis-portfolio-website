'use client'

import React from 'react'
import { Navigation } from './Navigation'
import ToastContainer from '../ui/ToastContainer'
import { AnalyticsProvider } from '../analytics/AnalyticsProvider'
import { useTheme } from '@/contexts/ThemeContext'
import { useSmoothScrolling } from '@/hooks/useAnimations'

interface AppLayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
}

export function AppLayout({ children, showNavigation = true }: AppLayoutProps) {
  const { theme } = useTheme()
  
  // Temporarily disabled smooth scrolling to fix content disappearing issue
  // useSmoothScrolling()

  return (
    <AnalyticsProvider>
      <div className={`min-h-screen transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
        theme === 'dark' ? 'dark' : ''
      }`}>
        {showNavigation && <Navigation />}
        <main className="relative">
          {children}
        </main>
        <ToastContainer />
      </div>
    </AnalyticsProvider>
  )
}
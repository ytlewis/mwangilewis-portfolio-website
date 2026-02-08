'use client'

import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AppLayout } from './AppLayout'
// Temporarily disabled PerformanceInitializer due to module loading issues
// import { PerformanceInitializer } from '@/components/PerformanceInitializer'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {/* <PerformanceInitializer /> */}
        <AppLayout>
          {children}
        </AppLayout>
      </LanguageProvider>
    </ThemeProvider>
  )
}

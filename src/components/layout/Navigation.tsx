'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { ThemeToggle } from '../ui/ThemeToggle'
import { LanguageToggle } from '../ui/LanguageToggle'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()
  const { t } = useLanguage()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: '/', label: mounted ? t('navigation.home') : 'Home' },
    { href: '/about', label: mounted ? t('navigation.about') : 'About' },
    { href: '/projects', label: mounted ? t('navigation.projects') : 'Projects' },
    { href: '/experience', label: mounted ? t('navigation.experience') : 'Experience' },
    { href: '/contact', label: mounted ? t('navigation.contact') : 'Contact' },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            Lewis Gathaiya
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Theme and Language Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
              }`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
              }`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    isActive(item.href)
                      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Controls */}
              <div className="flex items-center justify-between pt-4 px-3">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
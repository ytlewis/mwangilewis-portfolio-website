import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientLayout } from '@/components/layout/ClientLayout'
import { StructuredData } from '@/components/seo/StructuredData'
import { generatePersonSchema, generateWebSiteSchema } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lewismwangi.com'),
  title: {
    default: 'Lewis Gathaiya - Full-Stack Developer Portfolio',
    template: '%s | Lewis Gathaiya',
  },
  description: 'Full-stack developer specializing in React, Next.js, Node.js, and modern web technologies. View my projects, skills, and experience.',
  keywords: [
    'Lewis Gathaiya',
    'Full-stack Developer',
    'Web Development',
    'React',
    'Next.js',
    'Node.js',
    'Portfolio',
    'Software Engineer',
    'JavaScript',
    'TypeScript',
    'MongoDB',
    'Express',
    'Nairobi',
    'Kenya',
  ],
  authors: [{ name: 'Lewis Gathaiya', url: 'https://www.lewismwangi.com' }],
  creator: 'Lewis Gathaiya',
  publisher: 'Lewis Gathaiya',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://www.lewismwangi.com',
    languages: {
      'en': 'https://www.lewismwangi.com',
      'sw': 'https://www.lewismwangi.com?lang=sw',
      'es': 'https://www.lewismwangi.com?lang=es',
    },
  },
  openGraph: {
    title: 'Lewis Gathaiya - Full-Stack Developer Portfolio',
    description: 'Full-stack developer specializing in React, Next.js, Node.js, and modern web technologies',
    url: 'https://www.lewismwangi.com',
    siteName: 'Lewis Gathaiya Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lewis Gathaiya - Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lewis Gathaiya - Full-Stack Developer Portfolio',
    description: 'Full-stack developer specializing in React, Next.js, Node.js, and modern web technologies',
    creator: '@lewisgathaiya',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const personSchema = generatePersonSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en" className="smooth-scroll" suppressHydrationWarning>
      <head>
        <StructuredData data={personSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}

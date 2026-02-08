'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ContactForm from '@/components/ui/ContactForm';
import AnimatedSection from '@/components/ui/AnimatedSection';
import AnimatedButton from '@/components/ui/AnimatedButton';

export default function Contact() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const handleCallClick = () => {
    // For mobile devices, this will open the phone dialer
    window.location.href = 'tel:+254702320995';
  };

  const handleEmailClick = () => {
    // Open Gmail compose in a new tab
    const email = 'gathaiyalewis1122@gmail.com';
    const subject = 'Contact from Portfolio';
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <AnimatedSection animation="fadeIn" className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t('contact.title')}
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t('contact.subtitle')}
          </p>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <AnimatedSection animation="slideLeft" className="order-2 lg:order-1">
              <div className={`
                p-8 rounded-2xl shadow-lg backdrop-blur-sm
                ${theme === 'dark' 
                  ? 'bg-gray-800/50 border border-gray-700' 
                  : 'bg-white/80 border border-gray-200'
                }
              `}>
                <ContactForm />
              </div>
            </AnimatedSection>

            {/* Contact Information */}
            <AnimatedSection animation="slideRight" className="order-1 lg:order-2">
              <div className="space-y-8">
                {/* Contact Details */}
                <div className={`
                  p-8 rounded-2xl shadow-lg backdrop-blur-sm
                  ${theme === 'dark' 
                    ? 'bg-gray-800/50 border border-gray-700' 
                    : 'bg-white/80 border border-gray-200'
                  }
                `}>
                  <h3 className={`text-2xl font-bold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('about.personalInfo')}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {t('about.name')}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {t('about.location')}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=gathaiyalewis1122@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:text-primary transition-colors ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        gathaiyalewis1122@gmail.com
                      </a>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <a 
                        href="tel:+254702320995"
                        className={`hover:text-primary transition-colors ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        +254702320995
                      </a>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Call Button */}
                  <AnimatedButton
                    onClick={handleCallClick}
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{t('contact.callMe')}</span>
                  </AnimatedButton>

                  {/* Email Button */}
                  <AnimatedButton
                    onClick={handleEmailClick}
                    variant="outline"
                    size="lg"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{t('contact.emailMe')}</span>
                  </AnimatedButton>
                </div>

                {/* Additional Info */}
                <div className={`
                  p-6 rounded-xl
                  ${theme === 'dark' 
                    ? 'bg-gray-700/30 border border-gray-600' 
                    : 'bg-gray-50 border border-gray-200'
                  }
                `}>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    I typically respond to messages within 24 hours. For urgent matters, 
                    please feel free to call directly.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
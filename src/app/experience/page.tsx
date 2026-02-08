// Version: 2.0.3 - Added translation support
'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Experience() {
  const { t, language } = useLanguage();
  const [selectedView, setSelectedView] = useState<'vertical' | 'horizontal'>('vertical');

  const workExperience = [
    {
      id: 'ictIntern',
      titleKey: 'home.experience.roles.ictIntern.title',
      organizationKey: 'home.experience.roles.ictIntern.organization',
      periodKey: 'home.experience.roles.ictIntern.period',
      descriptionKey: 'home.experience.roles.ictIntern.description',
      type: 'work' as const
    },
    {
      id: 'callCenter',
      titleKey: 'home.experience.roles.callCenter.title',
      organizationKey: 'home.experience.roles.callCenter.organization',
      periodKey: 'home.experience.roles.callCenter.period',
      descriptionKey: 'home.experience.roles.callCenter.description',
      type: 'work' as const
    },
    {
      id: 'volunteerTeacher',
      titleKey: 'home.experience.roles.volunteerTeacher.title',
      organizationKey: 'home.experience.roles.volunteerTeacher.organization',
      periodKey: 'home.experience.roles.volunteerTeacher.period',
      descriptionKey: 'home.experience.roles.volunteerTeacher.description',
      type: 'work' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" suppressHydrationWarning>
      <div className="pt-20" suppressHydrationWarning>
        <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
          {/* Header Section */}
          <div className="text-center mb-12" suppressHydrationWarning>
            <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
              {t('experience.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('experience.description')}
            </p>
          </div>

          {/* Timeline View Toggle */}
          <div className="flex justify-center mb-8" suppressHydrationWarning>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg" suppressHydrationWarning>
              <button
                onClick={() => setSelectedView('vertical')}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  selectedView === 'vertical'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {t('experience.vertical')}
              </button>
              <button
                onClick={() => setSelectedView('horizontal')}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  selectedView === 'horizontal'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {t('experience.horizontal')}
              </button>
            </div>
          </div>

          {/* Work History Section */}
          <div className="mb-12" suppressHydrationWarning>
            <div className="text-center mb-8" suppressHydrationWarning>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('experience.workHistory')}
              </h2>
            </div>

            {/* Timeline Component */}
            <div className="max-w-4xl mx-auto" suppressHydrationWarning>
              {selectedView === 'vertical' ? (
                <div className="relative" suppressHydrationWarning>
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-red-600/30" suppressHydrationWarning />
                  
                  <div className="space-y-8" suppressHydrationWarning>
                    {workExperience.map((item) => (
                      <div key={item.id} className="relative flex items-start" suppressHydrationWarning>
                        <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full mr-6 relative z-10 shadow-lg" suppressHydrationWarning>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                          </svg>
                        </div>
                        
                        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-600" suppressHydrationWarning>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3" suppressHydrationWarning>
                            <div suppressHydrationWarning>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t(item.titleKey)}
                              </h3>
                              <p className="text-red-600 font-medium">
                                {t(item.organizationKey)}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                              {t(item.periodKey)}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">
                            {t(item.descriptionKey)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto pb-4" suppressHydrationWarning>
                  <div className="flex space-x-8 min-w-max" suppressHydrationWarning>
                    {workExperience.map((item, index) => (
                      <div key={item.id} className="flex-shrink-0 w-80" suppressHydrationWarning>
                        <div className="relative" suppressHydrationWarning>
                          {index < workExperience.length - 1 && (
                            <div className="absolute top-6 left-full w-8 h-0.5 bg-red-600/30 z-0" suppressHydrationWarning />
                          )}
                          
                          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-600" suppressHydrationWarning>
                            <div className="flex items-center mb-3" suppressHydrationWarning>
                              <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full mr-3" suppressHydrationWarning>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                                </svg>
                              </div>
                              <div suppressHydrationWarning>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {t(item.titleKey)}
                                </h3>
                                <p className="text-sm text-red-600 font-medium">
                                  {t(item.organizationKey)}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              {t(item.periodKey)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {t(item.descriptionKey)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Navigation Hint */}
          <div className="text-center" suppressHydrationWarning>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-md mx-auto" suppressHydrationWarning>
              <div className="flex items-center justify-center mb-3" suppressHydrationWarning>
                <svg className="w-6 h-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('experience.interactiveTimeline')}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('experience.switchViews')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

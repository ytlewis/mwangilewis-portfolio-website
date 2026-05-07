// Version: 3.0.0 - Full redesign with enriched content and improved UI
'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExperienceItem {
  id: string;
  titleKey: string;
  organizationKey: string;
  periodKey: string;
  descriptionKey: string;
  type: 'work';
  icon: React.ReactNode;
  tags: string[];
  achievements: string[];
}

const BriefcaseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
  </svg>
);

const HeadsetIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
  </svg>
);

const AcademicIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

export default function Experience() {
  const { t } = useLanguage();
  const [selectedView, setSelectedView] = useState<'vertical' | 'horizontal'>('vertical');
  const [expandedId, setExpandedId] = useState<string | null>('callCenter');

  const workExperience: ExperienceItem[] = [
    {
      id: 'callCenter',
      titleKey: 'home.experience.roles.callCenter.title',
      organizationKey: 'home.experience.roles.callCenter.organization',
      periodKey: 'home.experience.roles.callCenter.period',
      descriptionKey: 'home.experience.roles.callCenter.description',
      type: 'work',
      icon: <HeadsetIcon />,
      tags: ['Customer Service', 'Glovo', 'Multi-country', 'Escalation Management'],
      achievements: [
        'Handled high-volume inquiries across 6 African countries',
        'Resolved complex delivery issues with high customer satisfaction',
        'Managed escalations efficiently under pressure',
        'Demonstrated exceptional cross-cultural communication skills',
      ],
    },
    {
      id: 'ictIntern',
      titleKey: 'home.experience.roles.ictIntern.title',
      organizationKey: 'home.experience.roles.ictIntern.organization',
      periodKey: 'home.experience.roles.ictIntern.period',
      descriptionKey: 'home.experience.roles.ictIntern.description',
      type: 'work',
      icon: <BriefcaseIcon />,
      tags: ['Technical Support', 'Networking', 'Hardware', 'System Administration'],
      achievements: [
        'Supported 50+ staff members with hardware & software issues',
        'Maintained and upgraded network infrastructure',
        'Delivered end-user training sessions',
        'Improved overall system performance and uptime',
      ],
    },
    {
      id: 'volunteerTeacher',
      titleKey: 'home.experience.roles.volunteerTeacher.title',
      organizationKey: 'home.experience.roles.volunteerTeacher.organization',
      periodKey: 'home.experience.roles.volunteerTeacher.period',
      descriptionKey: 'home.experience.roles.volunteerTeacher.description',
      type: 'work',
      icon: <AcademicIcon />,
      tags: ['Teaching', 'Mathematics', 'Science', 'English', 'Community Service'],
      achievements: [
        'Taught Mathematics, Science, and English',
        'Designed engaging lesson plans for diverse learners',
        'Fostered a positive and inclusive classroom environment',
        'Strengthened communication and leadership skills',
      ],
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      suppressHydrationWarning
    >
      <div className="pt-20" suppressHydrationWarning>
        <div className="container mx-auto px-4 py-12" suppressHydrationWarning>

          {/* ── Header ── */}
          <div className="text-center mb-14" suppressHydrationWarning>
            <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
              Career Journey
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('experience.title')}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('experience.description')}
            </p>
          </div>

          {/* ── Stats Bar ── */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-14" suppressHydrationWarning>
            {[
              { value: '3+', label: 'Roles' },
              { value: '6', label: 'Countries Served' },
              { value: '50+', label: 'People Supported' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 text-center"
              >
                <p className="text-2xl font-bold text-red-600">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── View Toggle ── */}
          <div className="flex justify-center mb-10" suppressHydrationWarning>
            <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-md border border-gray-100 dark:border-gray-700">
              {(['vertical', 'horizontal'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedView === view
                      ? 'bg-red-600 text-white shadow'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {view === 'vertical' ? t('experience.vertical') : t('experience.horizontal')}
                </button>
              ))}
            </div>
          </div>

          {/* ── Work History ── */}
          <div className="mb-16" suppressHydrationWarning>
            <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white mb-10">
              {t('experience.workHistory')}
            </h2>

            {/* VERTICAL VIEW */}
            {selectedView === 'vertical' && (
              <div className="relative max-w-3xl mx-auto" suppressHydrationWarning>
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 via-red-400 to-transparent" />

                <div className="space-y-6" suppressHydrationWarning>
                  {workExperience.map((item, index) => {
                    const isExpanded = expandedId === item.id;
                    return (
                      <div key={item.id} className="relative flex items-start gap-6" suppressHydrationWarning>
                        {/* Timeline dot */}
                        <div
                          className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border-2 z-10 shadow-md transition-all duration-300 ${
                            isExpanded
                              ? 'bg-red-600 border-red-600 text-white scale-110'
                              : 'bg-white dark:bg-gray-800 border-red-300 dark:border-red-700 text-red-500'
                          }`}
                        >
                          {item.icon}
                        </div>

                        {/* Card */}
                        <div
                          className={`flex-1 rounded-2xl shadow-md border transition-all duration-300 cursor-pointer overflow-hidden ${
                            isExpanded
                              ? 'border-red-400 dark:border-red-600 bg-white dark:bg-gray-800'
                              : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-red-200 dark:hover:border-red-800'
                          }`}
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        >
                          {/* Card header */}
                          <div className="p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                  {t(item.titleKey)}
                                </h3>
                                <p className="text-red-600 dark:text-red-400 font-semibold text-sm mt-0.5">
                                  {t(item.organizationKey)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                  </svg>
                                  {t(item.periodKey)}
                                </span>
                                <svg
                                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                {t(item.descriptionKey)}
                              </p>
                              <ul className="space-y-2">
                                {item.achievements.map((achievement) => (
                                  <li key={achievement} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* HORIZONTAL VIEW */}
            {selectedView === 'horizontal' && (
              <div className="overflow-x-auto pb-6" suppressHydrationWarning>
                <div className="flex gap-6 min-w-max px-4">
                  {workExperience.map((item, index) => (
                    <div key={item.id} className="relative flex-shrink-0 w-80" suppressHydrationWarning>
                      {/* Connector line */}
                      {index < workExperience.length - 1 && (
                        <div className="absolute top-6 left-full w-6 h-0.5 bg-red-300 dark:bg-red-700 z-0" />
                      )}

                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-5 h-full flex flex-col hover:border-red-300 dark:hover:border-red-700 transition-colors duration-200">
                        {/* Icon + title */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-xl shadow">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                              {t(item.titleKey)}
                            </h3>
                            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                              {t(item.organizationKey)}
                            </p>
                          </div>
                        </div>

                        {/* Period */}
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full w-fit mb-3">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {t(item.periodKey)}
                        </span>

                        {/* Description */}
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4 flex-1">
                          {t(item.descriptionKey)}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Skills Gained ── */}
          <div className="max-w-3xl mx-auto mb-16" suppressHydrationWarning>
            <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Key Skills Gained
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'Customer Support',
                'Technical Troubleshooting',
                'Network Maintenance',
                'Cross-cultural Communication',
                'Escalation Handling',
                'End-user Training',
                'Lesson Planning',
                'Problem Solving',
                'Team Collaboration',
              ].map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tip card ── */}
          <div className="text-center" suppressHydrationWarning>
            <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-md border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('experience.switchViews')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t, language } = useLanguage();
  
  // Force re-render when language changes
  const skills = [
    { nameKey: 'home.about.skills.cybersecurity', percentage: 90, category: 'technical' },
    { nameKey: 'home.about.skills.ethicalHacking', percentage: 85, category: 'technical' },
    { nameKey: 'home.about.skills.networkSecurity', percentage: 85, category: 'technical' },
    { nameKey: 'home.about.skills.problemSolving', percentage: 95, category: 'soft' },
    { nameKey: 'about.criticalThinking', percentage: 90, category: 'soft' },
    { nameKey: 'about.digitalMarketing', percentage: 80, category: 'soft' },
    { nameKey: 'about.communicationSkills', percentage: 88, category: 'soft' },
    { nameKey: 'about.informationSystems', percentage: 85, category: 'technical' },
  ];

  const workExperience = [
    {
      id: 'ictIntern',
      titleKey: 'home.experience.roles.ictIntern.title',
      organizationKey: 'home.experience.roles.ictIntern.organization',
      periodKey: 'home.experience.roles.ictIntern.period',
      descriptionKey: 'about.workExperience.ictIntern',
      type: 'work' as const
    },
    {
      id: 'callCenter',
      titleKey: 'home.experience.roles.callCenter.title',
      organizationKey: 'home.experience.roles.callCenter.organization',
      periodKey: 'home.experience.roles.callCenter.period',
      descriptionKey: 'about.workExperience.callCenter',
      type: 'work' as const
    },
    {
      id: 'volunteerTeacher',
      titleKey: 'home.experience.roles.volunteerTeacher.title',
      organizationKey: 'home.experience.roles.volunteerTeacher.organization',
      periodKey: 'home.experience.roles.volunteerTeacher.period',
      descriptionKey: 'about.workExperience.volunteerTeacher',
      type: 'work' as const
    }
  ];

  const educationData = [
    {
      id: 'university',
      titleKey: 'about.education.university.title',
      organizationKey: 'about.education.university.organization',
      periodKey: 'about.education.university.period',
      descriptionKey: 'about.education.university.description',
      type: 'education' as const
    },
    {
      id: 'ethicalHacking',
      titleKey: 'about.education.ethicalHacking.title',
      organizationKey: 'about.education.ethicalHacking.organization',
      periodKey: 'about.education.ethicalHacking.period',
      descriptionKey: 'about.education.ethicalHacking.description',
      type: 'education' as const
    },
    {
      id: 'digitalMarketing',
      titleKey: 'about.education.digitalMarketing.title',
      organizationKey: 'about.education.digitalMarketing.organization',
      periodKey: 'about.education.digitalMarketing.period',
      descriptionKey: 'about.education.digitalMarketing.description',
      type: 'education' as const
    },
    {
      id: 'icdl',
      titleKey: 'about.education.icdl.title',
      organizationKey: 'about.education.icdl.organization',
      periodKey: 'about.education.icdl.period',
      descriptionKey: 'about.education.icdl.description',
      type: 'education' as const
    },
    {
      id: 'highSchool',
      titleKey: 'about.education.highSchool.title',
      organizationKey: 'about.education.highSchool.organization',
      periodKey: 'about.education.highSchool.period',
      descriptionKey: 'about.education.highSchool.description',
      type: 'education' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.title')}
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              {/* Professional Profile */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-12 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {t('about.professionalProfile')}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.professionalDescription')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Bio */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    {t('about.aboutMeTitle')}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {t('about.aboutMeParagraph1')}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {t('about.aboutMeParagraph2')}
                  </p>
                  
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{t('about.name')}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{t('about.location')}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{t('about.email')}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{t('about.phone')}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Image Placeholder */}
                <div className="flex justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                    <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white text-center mb-6">
                {t('about.coreCompetencies')}
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
                {t('about.coreCompetenciesDescription')}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">
                    {t('about.technicalSkills')}
                  </h3>
                  {skills.filter(skill => skill.category === 'technical').map((skill) => (
                    <div key={skill.nameKey} className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t(skill.nameKey)}
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          {skill.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-2.5 rounded-full bg-red-600"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">
                    {t('about.professionalSkills')}
                  </h3>
                  {skills.filter(skill => skill.category !== 'technical').map((skill) => (
                    <div key={skill.nameKey} className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t(skill.nameKey)}
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          {skill.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-2.5 rounded-full bg-red-600"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white text-center mb-6">
                {t('about.professionalExperience')}
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
                {t('about.professionalExperienceDescription')}
              </p>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-red-600/30" />
                
                <div className="space-y-8">
                  {workExperience.map((item) => (
                    <div key={item.id} className="relative flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full mr-6 relative z-10 shadow-lg">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                        </svg>
                      </div>
                      
                      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-600">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <div>
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
            </div>
          </div>

          {/* Education Timeline Section */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white text-center mb-6">
                {t('about.educationCertifications')}
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
                {t('about.educationCertificationsDescription')}
              </p>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-red-600/30" />
                
                <div className="space-y-8">
                  {educationData.map((item) => (
                    <div key={item.id} className="relative flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full mr-6 relative z-10 shadow-lg">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                        </svg>
                      </div>
                      
                      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-600">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

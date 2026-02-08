'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                  {t('home.hero.name')}
                </span>
              </h1>

              <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 mb-6">
                {t('home.hero.title')}
              </h2>
              <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
                {t('home.hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link href="#projects">
                  <button className="w-full sm:w-auto min-w-[200px] px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300">
                    {t('home.hero.viewWork')}
                  </button>
                </Link>
                <Link href="#contact">
                  <button className="w-full sm:w-auto min-w-[200px] px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-red-600 rounded-lg shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300">
                    {t('home.hero.getInTouch')}
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur-2xl opacity-30"></div>
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <Image
                    src="/HomeImage.jpeg"
                    alt="Lewis Gathaiya"
                    fill
                    className="object-cover scale-125"
                    style={{ objectPosition: '50% 20%' }}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.about.title')}
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-12 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('home.about.subtitle')}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('home.about.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('home.about.coreSkills')}
                </h3>
                {[
                  { key: 'cybersecurity', percentage: 90 },
                  { key: 'ethicalHacking', percentage: 85 },
                  { key: 'networkSecurity', percentage: 85 },
                  { key: 'problemSolving', percentage: 95 },
                ].map((skill) => (
                  <div key={skill.key} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t(`home.about.skills.${skill.key}`)}
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        {skill.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-red-600"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('home.about.contactInfo')}
                </h3>
                <div className="space-y-4">
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
                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${t('about.email')}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-red-600">
                      {t('about.email')}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <a href={`tel:${t('about.phone')}`} className="text-gray-700 dark:text-gray-300 hover:text-red-600">
                      {t('about.phone')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.experience.title')}
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('home.experience.subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-red-600/30" />
              
              <div className="space-y-8">
                {['ictIntern', 'callCenter', 'volunteerTeacher'].map((role, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full mr-6 relative z-10 shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                      </svg>
                    </div>
                    
                    <div className="flex-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 border-l-4 border-red-600">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t(`home.experience.roles.${role}.title`)}
                          </h3>
                          <p className="text-red-600 font-medium">
                            {t(`home.experience.roles.${role}.organization`)}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                          {t(`home.experience.roles.${role}.period`)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t(`home.experience.roles.${role}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.projects.title')}
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('home.projects.subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('home.projects.portfolio.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {t('home.projects.portfolio.description')}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Next.js', 'TypeScript', 'Tailwind CSS', 'MongoDB'].map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link href="/projects">
                  <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    {t('home.projects.portfolio.viewAll')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.contact.title')}
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('home.contact.subtitle')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href={`tel:${t('contact.phone')}`}>
                <button className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{t('home.contact.callMe')}</span>
                </button>
              </a>

              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${t('contact.email')}`} target="_blank" rel="noopener noreferrer">
                <button className="w-full sm:w-auto px-8 py-4 border-2 border-red-600 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{t('home.contact.emailMe')}</span>
                </button>
              </a>
            </div>

            <Link href="/contact">
              <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg shadow-lg transition-all">
                {t('home.contact.sendMessage')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-500">{t('home.footer.title')}</h3>
              <p className="text-gray-400">
                {t('home.footer.subtitle')}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">{t('home.footer.quickLinks')}</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-red-500 transition-colors">{t('navigation.about')}</a></li>
                <li><a href="#experience" className="text-gray-400 hover:text-red-500 transition-colors">{t('navigation.experience')}</a></li>
                <li><a href="#projects" className="text-gray-400 hover:text-red-500 transition-colors">{t('navigation.projects')}</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-red-500 transition-colors">{t('navigation.contact')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">{t('home.footer.connect')}</h4>
              <div className="space-y-2">
                <p className="text-gray-400">{t('home.footer.email')}: <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${t('about.email')}`} target="_blank" rel="noopener noreferrer" className="hover:text-red-500">{t('about.email')}</a></p>
                <p className="text-gray-400">{t('home.footer.phone')}: <a href={`tel:${t('about.phone')}`} className="hover:text-red-500">{t('about.phone')}</a></p>
                <p className="text-gray-400">{t('about.location')}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} {t('home.footer.title')}. {t('home.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

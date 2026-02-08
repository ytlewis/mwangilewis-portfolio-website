'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectCard from '@/components/ui/ProjectCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { FaSearch, FaFilter, FaGithub, FaSync } from 'react-icons/fa';

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  updated_at: string;
  topics?: string[];
  homepage?: string;
}

interface ProjectsResponse {
  success: boolean;
  repos: GitHubRepo[];
  cached: boolean;
  timestamp: string;
}

export default function Projects() {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Featured project names for highlighting
  const featuredProjects = ['pharmup', 'seculearn'];

  // Fetch projects from GitHub API
  const fetchProjects = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = forceRefresh ? '/api/github/refresh' : '/api/github/repos';
      const method = forceRefresh ? 'POST' : 'GET';

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProjectsResponse = await response.json();

      if (data.success) {
        setProjects(data.repos);
        setFilteredProjects(data.repos);
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
      
      // Set fallback data if available
      const fallbackProjects: GitHubRepo[] = [
        {
          id: 1,
          name: 'PHARMUP',
          description: 'A comprehensive pharmaceutical management system built with modern web technologies',
          html_url: 'https://github.com/lewisgathaiya/pharmup',
          language: 'JavaScript',
          stargazers_count: 0,
          updated_at: new Date().toISOString(),
          topics: ['pharmacy', 'management', 'healthcare'],
          homepage: ''
        },
        {
          id: 2,
          name: 'SECULEARN',
          description: 'An innovative security learning platform for cybersecurity education',
          html_url: 'https://github.com/lewisgathaiya/seculearn',
          language: 'Python',
          stargazers_count: 0,
          updated_at: new Date().toISOString(),
          topics: ['security', 'education', 'cybersecurity'],
          homepage: ''
        },
        {
          id: 3,
          name: 'lewis-portfolio-website',
          description: 'Modern portfolio website with animated backgrounds and multilingual support',
          html_url: 'https://github.com/lewisgathaiya/lewis-portfolio-website',
          language: 'TypeScript',
          stargazers_count: 0,
          updated_at: new Date().toISOString(),
          topics: ['portfolio', 'react', 'nextjs'],
          homepage: 'https://mwangilewis.com'
        }
      ];
      
      setProjects(fallbackProjects);
      setFilteredProjects(fallbackProjects);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProjects(true);
  };

  // Filter projects based on search term and language
  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.topics && project.topics.some(topic => 
          topic.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(project =>
        project.language?.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedLanguage]);

  // Get unique languages for filter
  const languages = Array.from(new Set(projects.map(p => p.language).filter(Boolean)));

  // Sort projects to show featured ones first
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aIsFeatured = featuredProjects.some(featured => 
      a.name.toLowerCase().includes(featured.toLowerCase())
    );
    const bIsFeatured = featuredProjects.some(featured => 
      b.name.toLowerCase().includes(featured.toLowerCase())
    );

    if (aIsFeatured && !bIsFeatured) return -1;
    if (!aIsFeatured && bIsFeatured) return 1;
    
    // Sort by stars, then by update date
    if (b.stargazers_count !== a.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }
    
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-white via-gray-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('projects.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore my latest projects and contributions, featuring live GitHub data and innovative solutions.
            </p>
            <div className="flex items-center justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <FaGithub className="mr-2" />
              <span>Live data from GitHub API</span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Refresh GitHub data"
              >
                <FaSync className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Search and Filter Section */}
        <AnimatedSection animation="slideUp" delay={0.4}>
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Language Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[150px]"
                >
                  <option value="all">All Languages</option>
                  {languages.map(language => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {sortedProjects.length} of {projects.length} projects
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedLanguage !== 'all' && ` in ${selectedLanguage}`}
            </div>
          </div>
        </AnimatedSection>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <span className="ml-4 text-lg text-gray-600 dark:text-gray-300">
              {t('common.loading')}
            </span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchProjects()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <AnimatedSection animation="fadeIn" delay={0.6}>
            {sortedProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  No projects found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLanguage('all');
                  }}
                  className="mt-4 text-red-600 hover:text-red-700 underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProjects.map((project, index) => {
                  const isFeatured = featuredProjects.some(featured => 
                    project.name.toLowerCase().includes(featured.toLowerCase())
                  );
                  
                  return (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      featured={isFeatured}
                      delay={index * 0.1}
                    />
                  );
                })}
              </div>
            )}
          </AnimatedSection>
        )}

        {/* GitHub Attribution */}
        <AnimatedSection animation="fadeIn" delay={0.8}>
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Project data is fetched live from{' '}
              <a
                href="https://github.com/lewisgathaiya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 underline"
              >
                GitHub API
              </a>
              {' '}and updated automatically.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
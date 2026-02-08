'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaExternalLinkAlt, FaStar, FaClock, FaTag } from 'react-icons/fa';
import AnimatedImage from './AnimatedImage';
import AnimatedButton from './AnimatedButton';
import { useImageHover } from '@/hooks/useAnimations';

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

interface ProjectCardProps {
  project: GitHubRepo;
  featured?: boolean;
  delay?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  featured = false, 
  delay = 0 
}) => {
  const { t } = useTranslation();
  const cardRef = useImageHover<HTMLDivElement>();

  // Format the last updated date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Get language color
  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      CSS: '#563d7c',
      HTML: '#e34c26',
      React: '#61dafb',
      Vue: '#4FC08D',
      PHP: '#4F5D95',
    };
    return colors[language] || '#6b7280';
  };

  // Generate project image placeholder
  const getProjectImage = (name: string) => {
    // For featured projects, use the home image as placeholder
    if (name.toLowerCase().includes('pharmup') || name.toLowerCase().includes('seculearn')) {
      return '/HomeImage.jpeg';
    }
    
    // Generate a gradient placeholder based on project name
    const colors = ['#E63946', '#F77F00', '#FCBF49', '#06D6A0', '#118AB2', '#073B4C'];
    const colorIndex = name.length % colors.length;
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors[colorIndex]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors[(colorIndex + 1) % colors.length]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#grad)" />
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
              text-anchor="middle" dominant-baseline="middle" fill="white" opacity="0.8">
          ${name.toUpperCase()}
        </text>
      </svg>
    `)}`;
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden
        transition-all duration-300 hover:shadow-2xl
        ${featured ? 'ring-2 ring-red-500 ring-opacity-50' : ''}
        transform-gpu
      `}
      style={{
        animationDelay: `${delay}s`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </span>
        </div>
      )}

      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <AnimatedImage
          src={getProjectImage(project.name)}
          alt={`${project.name} project screenshot`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Language Badge */}
        {project.language && (
          <div className="absolute bottom-4 left-4">
            <span 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: getLanguageColor(project.language) }}
            >
              <span 
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
              />
              {project.language}
            </span>
          </div>
        )}

        {/* Stars Badge */}
        {project.stargazers_count > 0 && (
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white">
              <FaStar className="w-3 h-3 mr-1 text-yellow-400" />
              {project.stargazers_count}
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Project Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {project.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h3>

        {/* Project Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 min-h-[3rem]">
          {project.description}
        </p>

        {/* Topics/Tags */}
        {project.topics && project.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <FaTag className="w-2 h-2 mr-1" />
                {topic}
              </span>
            ))}
            {project.topics.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{project.topics.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Last Updated */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <FaClock className="w-3 h-3 mr-1" />
          <span>Updated {formatDate(project.updated_at)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <AnimatedButton
            onClick={() => window.open(project.html_url, '_blank')}
            variant="primary"
            size="sm"
            className="flex-1 flex items-center justify-center"
          >
            <FaGithub className="w-4 h-4 mr-2" />
            {t('projects.viewCode')}
          </AnimatedButton>

          {project.homepage && (
            <AnimatedButton
              onClick={() => window.open(project.homepage, '_blank')}
              variant="outline"
              size="sm"
              className="flex-1 flex items-center justify-center"
            >
              <FaExternalLinkAlt className="w-3 h-3 mr-2" />
              {t('projects.viewProject')}
            </AnimatedButton>
          )}
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default ProjectCard;
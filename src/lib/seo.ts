/**
 * SEO Utilities
 * Provides structured data and SEO helpers for the portfolio website
 */

export interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  url: string;
  email: string;
  telephone?: string;
  address?: {
    '@type': 'PostalAddress';
    addressLocality: string;
    addressCountry: string;
  };
  sameAs: string[];
  knowsAbout: string[];
  alumniOf?: {
    '@type': 'EducationalOrganization';
    name: string;
  };
}

export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  inLanguage: string[];
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Generate Person structured data for Lewis Gathaiya
 */
export const generatePersonSchema = (): PersonSchema => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Lewis Gathaiya',
    jobTitle: 'Full-Stack Developer',
    url: 'https://mwangilewis.com',
    email: 'gathaiyalewis1122@gmail.com',
    telephone: '+254702320995',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: 'Kenya',
    },
    sameAs: [
      'https://github.com/lewisgathaiya',
      'https://linkedin.com/in/lewisgathaiya',
      'https://twitter.com/lewisgathaiya',
    ],
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL',
      'Python',
      'Django',
      'AWS',
      'Docker',
      'Full-Stack Development',
      'Web Development',
      'Software Engineering',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'University of Nairobi',
    },
  };
};

/**
 * Generate WebSite structured data
 */
export const generateWebSiteSchema = (): WebSiteSchema => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lewis Gathaiya Portfolio',
    url: 'https://mwangilewis.com',
    description: 'Full-stack developer portfolio showcasing modern web development skills, projects, and experience',
    author: {
      '@type': 'Person',
      name: 'Lewis Gathaiya',
    },
    inLanguage: ['en', 'sw', 'es'],
  };
};

/**
 * Generate Breadcrumb structured data for navigation
 */
export const generateBreadcrumbSchema = (
  path: string,
  pageName: string
): BreadcrumbSchema => {
  const items = [
    {
      '@type': 'ListItem' as const,
      position: 1,
      name: 'Home',
      item: 'https://mwangilewis.com',
    },
  ];

  if (path !== '/') {
    items.push({
      '@type': 'ListItem' as const,
      position: 2,
      name: pageName,
      item: `https://mwangilewis.com${path}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
};

/**
 * Generate JSON-LD script tag content
 */
export const generateJsonLd = (schema: any): string => {
  return JSON.stringify(schema);
};

/**
 * Page-specific metadata configurations
 */
export const pageMetadata = {
  home: {
    title: 'Lewis Gathaiya - Full-Stack Developer Portfolio',
    description: 'Full-stack developer specializing in React, Next.js, Node.js, and modern web technologies. View my projects, skills, and experience.',
    keywords: ['Lewis Gathaiya', 'Full-stack Developer', 'Web Development', 'React', 'Next.js', 'Node.js', 'Portfolio', 'Software Engineer'],
    ogImage: '/og-image-home.jpg',
  },
  about: {
    title: 'About Lewis Gathaiya - Skills & Education',
    description: 'Learn about Lewis Gathaiya\'s background, technical skills, education, and professional journey in software development.',
    keywords: ['About Lewis Gathaiya', 'Skills', 'Education', 'Computer Science', 'University of Nairobi', 'Developer Skills'],
    ogImage: '/og-image-about.jpg',
  },
  projects: {
    title: 'Projects - Lewis Gathaiya Portfolio',
    description: 'Explore Lewis Gathaiya\'s portfolio of web development projects including PHARMUP, SECULEARN, and other innovative solutions.',
    keywords: ['Projects', 'Portfolio', 'PHARMUP', 'SECULEARN', 'Web Applications', 'GitHub Projects', 'Open Source'],
    ogImage: '/og-image-projects.jpg',
  },
  experience: {
    title: 'Work Experience - Lewis Gathaiya',
    description: 'View Lewis Gathaiya\'s professional work experience including roles as ICT Intern, Call Center Agent, and Volunteer Teacher.',
    keywords: ['Work Experience', 'Professional History', 'ICT Intern', 'Career Timeline', 'Employment History'],
    ogImage: '/og-image-experience.jpg',
  },
  contact: {
    title: 'Contact Lewis Gathaiya - Get In Touch',
    description: 'Get in touch with Lewis Gathaiya for collaboration, job opportunities, or project inquiries. Available for freelance and full-time positions.',
    keywords: ['Contact', 'Get In Touch', 'Hire Developer', 'Freelance', 'Collaboration', 'Job Opportunities'],
    ogImage: '/og-image-contact.jpg',
  },
};

/**
 * Generate canonical URL for a page
 */
export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://mwangilewis.com';
  return `${baseUrl}${path}`;
};

/**
 * Generate Open Graph metadata
 */
export const generateOpenGraphMetadata = (
  title: string,
  description: string,
  image: string,
  url: string
) => {
  return {
    title,
    description,
    url,
    siteName: 'Lewis Gathaiya Portfolio',
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    locale: 'en_US',
    type: 'website' as const,
  };
};

/**
 * Generate Twitter Card metadata
 */
export const generateTwitterMetadata = (
  title: string,
  description: string,
  image: string
) => {
  return {
    card: 'summary_large_image' as const,
    title,
    description,
    images: [image],
    creator: '@lewisgathaiya',
  };
};

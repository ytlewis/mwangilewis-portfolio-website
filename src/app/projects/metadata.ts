import { Metadata } from 'next';
import { pageMetadata, generateCanonicalUrl, generateOpenGraphMetadata, generateTwitterMetadata } from '@/lib/seo';

const projectsMeta = pageMetadata.projects;

export const metadata: Metadata = {
  title: projectsMeta.title,
  description: projectsMeta.description,
  keywords: projectsMeta.keywords,
  alternates: {
    canonical: generateCanonicalUrl('/projects'),
  },
  openGraph: generateOpenGraphMetadata(
    projectsMeta.title,
    projectsMeta.description,
    projectsMeta.ogImage,
    generateCanonicalUrl('/projects')
  ),
  twitter: generateTwitterMetadata(
    projectsMeta.title,
    projectsMeta.description,
    projectsMeta.ogImage
  ),
};

import { Metadata } from 'next';
import { pageMetadata, generateCanonicalUrl, generateOpenGraphMetadata, generateTwitterMetadata } from '@/lib/seo';

const aboutMeta = pageMetadata.about;

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
  keywords: aboutMeta.keywords,
  alternates: {
    canonical: generateCanonicalUrl('/about'),
  },
  openGraph: generateOpenGraphMetadata(
    aboutMeta.title,
    aboutMeta.description,
    aboutMeta.ogImage,
    generateCanonicalUrl('/about')
  ),
  twitter: generateTwitterMetadata(
    aboutMeta.title,
    aboutMeta.description,
    aboutMeta.ogImage
  ),
};

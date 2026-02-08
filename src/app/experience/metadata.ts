import { Metadata } from 'next';
import { pageMetadata, generateCanonicalUrl, generateOpenGraphMetadata, generateTwitterMetadata } from '@/lib/seo';

const experienceMeta = pageMetadata.experience;

export const metadata: Metadata = {
  title: experienceMeta.title,
  description: experienceMeta.description,
  keywords: experienceMeta.keywords,
  alternates: {
    canonical: generateCanonicalUrl('/experience'),
  },
  openGraph: generateOpenGraphMetadata(
    experienceMeta.title,
    experienceMeta.description,
    experienceMeta.ogImage,
    generateCanonicalUrl('/experience')
  ),
  twitter: generateTwitterMetadata(
    experienceMeta.title,
    experienceMeta.description,
    experienceMeta.ogImage
  ),
};

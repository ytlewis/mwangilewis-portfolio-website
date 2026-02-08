import { Metadata } from 'next';
import { pageMetadata, generateCanonicalUrl, generateOpenGraphMetadata, generateTwitterMetadata } from '@/lib/seo';

const contactMeta = pageMetadata.contact;

export const metadata: Metadata = {
  title: contactMeta.title,
  description: contactMeta.description,
  keywords: contactMeta.keywords,
  alternates: {
    canonical: generateCanonicalUrl('/contact'),
  },
  openGraph: generateOpenGraphMetadata(
    contactMeta.title,
    contactMeta.description,
    contactMeta.ogImage,
    generateCanonicalUrl('/contact')
  ),
  twitter: generateTwitterMetadata(
    contactMeta.title,
    contactMeta.description,
    contactMeta.ogImage
  ),
};

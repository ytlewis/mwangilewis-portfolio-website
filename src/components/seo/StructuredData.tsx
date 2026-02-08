/**
 * Structured Data Component
 * Injects JSON-LD structured data into the page head
 */

import React from 'react';

interface StructuredDataProps {
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default StructuredData;

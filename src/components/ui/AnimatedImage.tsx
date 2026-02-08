'use client';

import React from 'react';
import Image from 'next/image';
import { useImageHover } from '@/hooks/useAnimations';

interface AnimatedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
}) => {
  const imageRef = useImageHover<HTMLDivElement>();

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ 
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className="object-cover"
        style={{
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
};

export default AnimatedImage;
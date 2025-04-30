'use client';

import React from 'react';
import Image from 'next/image';
import styles from './PlaceholderImage.module.css';

interface PlaceholderImageProps {
  width: number;
  height: number;
  className?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ width, height, className }) => {
  return (
    <div 
      className={`${styles.placeholderContainer} ${className || ''}`}
      style={{ width, height }}
    >
      <Image
        src="/placeholder-image.png"
        alt="Image not available"
        width={width}
        height={height}
        className={styles.placeholderImage}
        priority={true}
      />
      <div className={styles.placeholderText}>
        Image not available
      </div>
    </div>
  );
};

export default PlaceholderImage;
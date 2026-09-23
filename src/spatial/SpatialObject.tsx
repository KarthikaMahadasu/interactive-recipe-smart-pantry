import React from 'react';

interface SpatialObjectProps {
  children: React.ReactNode;
  depth?: number;
  rotationX?: number;
  rotationY?: number;
  scale?: number;
  float?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable 2.5D spatial container providing depth, 3D perspective transforms,
 * dynamic drop-shadows, and optional ambient floating animation.
 */
export const SpatialObject: React.FC<SpatialObjectProps> = ({
  children,
  depth = 12,
  rotationX = 10,
  rotationY = 0,
  scale = 1,
  float = false,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`spatial-object ${float ? 'spatial-float' : ''} ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) translateZ(${depth}px) scale(${scale})`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
        filter: `drop-shadow(0 ${depth * 1.5}px ${depth * 2}px rgba(0, 0, 0, 0.4))`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

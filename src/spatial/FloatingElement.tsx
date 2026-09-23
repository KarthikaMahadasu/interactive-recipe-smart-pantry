import React from 'react';

interface FloatingElementProps {
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  delay?: number;
  duration?: number;
}

/**
 * Reusable ambient energy particle node for spatial AI environments
 */
export const FloatingElement: React.FC<FloatingElementProps> = ({
  color = 'var(--primary-cyan)',
  size = 6,
  top = '50%',
  left = '50%',
  delay = 0,
  duration = 4
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`,
        animation: `spatialPulseFloat ${duration}s ease-in-out ${delay}s infinite alternate`,
        pointerEvents: 'none',
        zIndex: 2
      }}
    />
  );
};

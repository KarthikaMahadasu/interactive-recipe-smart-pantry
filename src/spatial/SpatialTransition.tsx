import React from 'react';

interface SpatialTransitionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  active?: boolean;
}

/**
 * Spatial connection conduit linking kitchen zones in 2D/2.5D space.
 * Renders an animated SVG path with glowing energy pulses.
 */
export const SpatialTransition: React.FC<SpatialTransitionProps> = ({
  startX,
  startY,
  endX,
  endY,
  color = 'var(--primary-cyan)',
  active = true
}) => {
  const dx = endX - startX;

  // Control points for a curved bezier path
  const cx1 = startX + dx * 0.5;
  const cy1 = startY;
  const cx2 = startX + dx * 0.5;
  const cy2 = endY;

  const pathD = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {/* Base subtle guide line */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth="2"
        strokeDasharray="4 4"
      />

      {/* Glowing energy path */}
      {active && (
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeOpacity="0.6"
          strokeDasharray="10 20"
          style={{
            animation: 'spatialPathPulse 3s linear infinite',
            filter: `drop-shadow(0 0 6px ${color})`
          }}
        />
      )}
    </svg>
  );
};

import React from 'react';
import type { SpatialVector3, SpatialAnchorId } from '../types/spatial';
import { resolveSpatialPosition } from '../hooks/useSpatialMotion';

interface SpatialMotionPathProps {
  start: SpatialVector3 | SpatialAnchorId;
  destination: SpatialVector3 | SpatialAnchorId;
  color?: string;
  active?: boolean;
  pulseSpeed?: number;
  label?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable motion path trajectory linking spatial anchors (e.g. PantryAnchor → AIAnchor, AIAnchor → CookingAnchor).
 * Does NOT execute business logic, provides SVG visualization of energy vectors.
 */
export const SpatialMotionPath: React.FC<SpatialMotionPathProps> = ({
  start,
  destination,
  color = 'var(--primary-cyan)',
  active = true,
  pulseSpeed = 3,
  label,
  style = {}
}) => {
  const p1 = resolveSpatialPosition(start);
  const p2 = resolveSpatialPosition(destination);

  // Calculate curve control points
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const cx = p1.x + dx * 0.5;
  const cy = p1.y + dy * 0.2; // slight upward arch

  const pathD = `M ${p1.x} ${p1.y} Q ${cx} ${cy}, ${p2.x} ${p2.y}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        ...style
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Base Path Guide Line */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="0.6"
        strokeDasharray="1 1"
      />

      {/* Active Flowing Energy Vector */}
      {active && (
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.75"
          strokeDasharray="2 4"
          style={{
            animation: `spatialPathPulse ${pulseSpeed}s linear infinite`,
            filter: `drop-shadow(0 0 3px ${color})`
          }}
        />
      )}

      {/* Optional Trajectory Label */}
      {label && (
        <text
          x={cx}
          y={cy - 2}
          fill="var(--text-dim)"
          fontSize="2.5"
          textAnchor="middle"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
};

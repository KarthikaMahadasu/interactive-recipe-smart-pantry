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
  pulseSpeed = 2,
  label,
  style = {}
}) => {
  const p1 = resolveSpatialPosition(start);
  const p2 = resolveSpatialPosition(destination);

  // Calculate curve control points for smooth trajectory
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const cx = p1.x + dx * 0.5;
  const cy = p1.y + dy * 0.2; // natural curve

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
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="0.6"
        strokeDasharray="1.5 2.5"
      />

      {/* Active Flowing Energy Vector */}
      {active && (
        <>
          {/* Broad Ambient Glow Layer */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeOpacity="0.35"
            strokeDasharray="4 8"
            style={{
              animation: `spatialPathFlow ${pulseSpeed * 1.5}s linear infinite`,
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />

          {/* Core Sharp Flowing Line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="0.9"
            strokeOpacity="0.95"
            strokeDasharray="2 4"
            style={{
              animation: `spatialPathPulse ${pulseSpeed}s linear infinite`,
              filter: `drop-shadow(0 0 4px ${color})`
            }}
          />

          {/* Traveling Energy Light Pulse Node */}
          <circle r="0.9" fill="#ffffff" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
            <animateMotion
              path={pathD}
              dur={`${pulseSpeed}s`}
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

      {/* Trajectory Label */}
      {label && (
        <text
          x={cx}
          y={cy - 2}
          fill="var(--text-dim)"
          fontSize="2.2"
          textAnchor="middle"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
};

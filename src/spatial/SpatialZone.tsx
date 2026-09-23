import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { KitchenZone, KitchenZoneId } from '../types/kitchen';
import { SpatialObject } from './SpatialObject';

interface SpatialZoneProps {
  zone: KitchenZone;
  children: React.ReactNode;
  active?: boolean;
  onHover?: (id: KitchenZoneId | null) => void;
  onClick?: (zone: KitchenZone) => void;
}

/**
 * Reusable spatial zone component wrapper providing hover depth transforms,
 * keyboard accessibility, focus rings, touch handling, and click navigation.
 */
export const SpatialZone: React.FC<SpatialZoneProps> = ({
  zone,
  children,
  active = false,
  onHover,
  onClick
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(zone);
    } else if (zone.route) {
      navigate(zone.route);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`${zone.name} - ${zone.tagline}`}
      onMouseEnter={() => onHover && onHover(zone.id)}
      onMouseLeave={() => onHover && onHover(null)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        outline: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`spatial-zone-node ${active ? 'spatial-zone-active' : ''}`}
    >
      <SpatialObject depth={active ? 20 : 10} float={active}>
        <div
          className="glass-panel"
          style={{
            padding: '20px 22px',
            borderRadius: '24px',
            background: active
              ? `radial-gradient(circle at 50% 0%, ${zone.colorHex}25 0%, rgba(15, 23, 42, 0.95) 100%)`
              : 'rgba(15, 23, 42, 0.8)',
            border: active
              ? `1.5px solid ${zone.colorHex}`
              : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: active
              ? `0 12px 32px ${zone.glowColor}, 0 0 20px ${zone.glowColor}`
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: '220px',
            minHeight: '180px',
            transition: 'all 0.3s ease'
          }}
        >
          {children}

          {/* Zone Header Tagline */}
          <div style={{ marginTop: 'auto' }}>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: zone.colorHex
              }}
            >
              {zone.tagline}
            </div>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginTop: '2px'
              }}
            >
              {zone.name}
            </h3>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                marginTop: '4px',
                lineHeight: '1.35'
              }}
            >
              {zone.description}
            </p>
          </div>
        </div>
      </SpatialObject>
    </div>
  );
};

import React from 'react';
import type { KitchenZone, KitchenZoneId } from '../types/kitchen';
import { KITCHEN_ZONES } from './SpatialKitchenScene';
import { Package, ThermometerSnowflake, Brain, UtensilsCrossed, Flame, Award } from 'lucide-react';

interface FallbackKitchen2DProps {
  activeZoneId: KitchenZoneId | null;
  onZoneHover: (id: KitchenZoneId | null) => void;
  onZoneClick: (zone: KitchenZone) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Package: <Package size={28} />,
  ThermometerSnowflake: <ThermometerSnowflake size={28} />,
  Brain: <Brain size={34} />,
  UtensilsCrossed: <UtensilsCrossed size={28} />,
  Flame: <Flame size={28} />,
  Award: <Award size={28} />
};

export const FallbackKitchen2D: React.FC<FallbackKitchen2DProps> = ({
  activeZoneId,
  onZoneHover,
  onZoneClick
}) => {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '440px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      {/* Isometric 2.5D Kitchen Deck Board */}
      <div
        style={{
          width: '100%',
          maxWidth: '850px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          zIndex: 2
        }}
      >
        {KITCHEN_ZONES.map((zone) => {
          const isHovered = activeZoneId === zone.id;
          const isAI = zone.id === 'ai_workspace';

          return (
            <div
              key={zone.id}
              onMouseEnter={() => onZoneHover(zone.id)}
              onMouseLeave={() => onZoneHover(null)}
              onClick={() => onZoneClick(zone)}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '20px',
                borderRadius: '20px',
                cursor: 'pointer',
                background: isHovered
                  ? 'rgba(255, 255, 255, 1)'
                  : isAI
                  ? 'rgba(255, 247, 237, 0.95)'
                  : 'rgba(255, 255, 255, 0.92)',
                borderColor: isHovered ? zone.colorHex : isAI ? '#ea580c' : '#e2e8f0',
                boxShadow: isHovered
                  ? `0 12px 30px ${zone.glowColor}`
                  : '0 4px 16px rgba(0,0,0,0.05)',
                transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'none',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '16px',
                    background: `${zone.colorHex}18`,
                    color: zone.colorHex,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${zone.colorHex}44`
                  }}
                >
                  {ICON_MAP[zone.icon] || <Brain size={28} />}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: zone.colorHex,
                    background: `${zone.colorHex}12`,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    border: `1px solid ${zone.colorHex}33`
                  }}
                >
                  {zone.itemCountLabel}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#ea580c', marginBottom: '4px' }}>
                  {zone.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {zone.tagline}
                </p>
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: isHovered ? zone.colorHex : 'var(--text-dim)',
                  fontWeight: 600,
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Click to Enter Zone</span> &rarr;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

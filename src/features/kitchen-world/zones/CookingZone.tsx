import React from 'react';
import { Flame } from 'lucide-react';
import { SpatialZone } from '../../../spatial/SpatialZone';
import type { KitchenZone, KitchenZoneId } from '../../../types/kitchen';

export const COOKING_ZONE_DATA: KitchenZone = {
  id: 'cooking',
  name: 'Induction Cooking Hub',
  tagline: 'Thermal Crafting & Stove',
  description: 'Smart induction stovetop visual foundation with heat coils, step timer, and pan placement.',
  route: '/cooking',
  icon: 'Flame',
  colorHex: '#f59e0b',
  glowColor: 'rgba(245, 158, 11, 0.4)',
  itemCountLabel: 'Thermal Hub',
  position3D: [3.2, 0.8, -1.2]
};

interface CookingZoneProps {
  active?: boolean;
  onHover?: (id: KitchenZoneId | null) => void;
  onClick?: (zone: KitchenZone) => void;
}

export const CookingZone: React.FC<CookingZoneProps> = ({ active, onHover, onClick }) => {
  return (
    <SpatialZone zone={COOKING_ZONE_DATA} active={active} onHover={onHover} onClick={onClick}>
      {/* Induction Cooktop & Thermal Coil Visual Representation */}
      <div
        style={{
          width: '100%',
          height: '90px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '10px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Left Coil */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '2px dashed #f59e0b',
            boxShadow: 'inset 0 0 12px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.3)' }} />
        </div>

        {/* Right Pan Silhouette */}
        <div
          style={{
            width: 48,
            height: 44,
            borderRadius: '50%',
            border: '2px solid #fbbf24',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(30, 41, 59, 0.8) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div style={{ width: 14, height: 2, background: '#f59e0b', position: 'absolute', right: -12 }} />
        </div>

        {/* Steam Flame Indicator */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 12,
            color: '#f59e0b',
            animation: active ? 'spatialPulse 1.5s ease-in-out infinite' : 'none'
          }}
        >
          <Flame size={18} />
        </div>
      </div>
    </SpatialZone>
  );
};

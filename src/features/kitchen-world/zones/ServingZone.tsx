import React from 'react';
import { Award } from 'lucide-react';
import { SpatialZone } from '../../../spatial/SpatialZone';
import type { KitchenZone, KitchenZoneId } from '../../../types/kitchen';

export const SERVING_ZONE_DATA: KitchenZone = {
  id: 'serving',
  name: 'Serving Counter',
  tagline: 'Plating & Presentation Deck',
  description: 'Final presentation counter for completed culinary creations, macros, and plating logs.',
  route: '/recipes',
  icon: 'Award',
  colorHex: '#c2410c',
  glowColor: 'rgba(194, 65, 12, 0.4)',
  itemCountLabel: 'Plating Counter',
  position3D: [0, 0.6, 1.5]
};

interface ServingZoneProps {
  active?: boolean;
  onHover?: (id: KitchenZoneId | null) => void;
  onClick?: (zone: KitchenZone) => void;
}

export const ServingZone: React.FC<ServingZoneProps> = ({ active, onHover, onClick }) => {
  return (
    <SpatialZone zone={SERVING_ZONE_DATA} active={active} onHover={onHover} onClick={onClick}>
      {/* Plating Surface & Plate Shape Visual Element */}
      <div
        style={{
          width: '100%',
          height: '90px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(194, 65, 12, 0.1) 0%, rgba(248, 250, 252, 0.95) 100%)',
          border: '1px solid rgba(194, 65, 12, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Outer Dish Ring */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '2px double #c2410c',
            background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, rgba(248, 250, 252, 0.9) 80%)',
            boxShadow: '0 0 16px rgba(194, 65, 12, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Inner Plate Rim */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '1px solid #ea580c',
              background: 'rgba(234, 88, 12, 0.1)'
            }}
          />
        </div>

        <div style={{ position: 'absolute', top: 8, right: 12, color: '#c2410c' }}>
          <Award size={18} />
        </div>
      </div>
    </SpatialZone>
  );
};

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
  colorHex: '#ec4899',
  glowColor: 'rgba(236, 72, 153, 0.4)',
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
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.35)',
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
            border: '2px double #ec4899',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(15, 23, 42, 0.9) 80%)',
            boxShadow: '0 0 16px rgba(236, 72, 153, 0.3)',
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
              border: '1px stroke #f472b6',
              background: 'rgba(244, 114, 182, 0.15)'
            }}
          />
        </div>

        <div style={{ position: 'absolute', top: 8, right: 12, color: '#ec4899' }}>
          <Award size={18} />
        </div>
      </div>
    </SpatialZone>
  );
};

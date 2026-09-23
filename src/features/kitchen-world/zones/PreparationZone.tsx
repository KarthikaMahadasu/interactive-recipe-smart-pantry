import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { SpatialZone } from '../../../spatial/SpatialZone';
import type { KitchenZone, KitchenZoneId } from '../../../types/kitchen';

export const PREPARATION_ZONE_DATA: KitchenZone = {
  id: 'prep',
  name: 'Preparation Deck',
  tagline: 'Chopping, Scaling & Prep',
  description: 'Precision prep area with cutting board, digital scale visual outlines, and portioning surface.',
  route: '/cooking',
  icon: 'UtensilsCrossed',
  colorHex: '#10b981',
  glowColor: 'rgba(16, 185, 129, 0.4)',
  itemCountLabel: 'Prep Surface',
  position3D: [1.8, 0.8, -2.5]
};

interface PreparationZoneProps {
  active?: boolean;
  onHover?: (id: KitchenZoneId | null) => void;
  onClick?: (zone: KitchenZone) => void;
}

export const PreparationZone: React.FC<PreparationZoneProps> = ({ active, onHover, onClick }) => {
  return (
    <SpatialZone zone={PREPARATION_ZONE_DATA} active={active} onHover={onHover} onClick={onClick}>
      {/* Preparation Board & Utensil Visual Element */}
      <div
        style={{
          width: '100%',
          height: '90px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          position: 'relative'
        }}
      >
        {/* Wooden-style Cutting Board shape */}
        <div
          style={{
            width: 70,
            height: 48,
            borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 95, 70, 0.4) 100%)',
            border: '1.5px dashed #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid #10b981' }} />
        </div>

        {/* Digital Scale Indicator Circle */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid #34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            color: '#34d399',
            fontWeight: 800
          }}
        >
          0.0g
        </div>

        <div style={{ position: 'absolute', top: 8, right: 12, color: '#10b981' }}>
          <UtensilsCrossed size={18} />
        </div>
      </div>
    </SpatialZone>
  );
};

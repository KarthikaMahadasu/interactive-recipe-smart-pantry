import React from 'react';
import { Package } from 'lucide-react';
import { SpatialZone } from '../../../spatial/SpatialZone';
import type { KitchenZone, KitchenZoneId } from '../../../types/kitchen';

export const PANTRY_ZONE_DATA: KitchenZone = {
  id: 'pantry',
  name: 'Pantry Storage',
  tagline: 'Dry Goods & Pantry Staples',
  description: 'Smart storage containers for grains, spices, canned goods, and long-term ingredients.',
  route: '/pantry',
  icon: 'Package',
  colorHex: '#f97316',
  glowColor: 'rgba(249, 115, 22, 0.4)',
  itemCountLabel: 'Dynamic Storage',
  position3D: [-3, 0.8, -1]
};

interface PantryZoneProps {
  active?: boolean;
  onHover?: (id: KitchenZoneId | null) => void;
  onClick?: (zone: KitchenZone) => void;
}

export const PantryZone: React.FC<PantryZoneProps> = ({ active, onHover, onClick }) => {
  return (
    <SpatialZone zone={PANTRY_ZONE_DATA} active={active} onHover={onHover} onClick={onClick}>
      {/* Pantry Shelves Visual Representation */}
      <div
        style={{
          width: '100%',
          height: '90px',
          borderRadius: '16px',
          background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.12) 0%, rgba(248, 250, 252, 0.95) 100%)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: '10px 14px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Shelf */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: 14, height: 20, borderRadius: 4, background: '#f97316', opacity: 0.8 }} />
          <div style={{ width: 18, height: 24, borderRadius: 4, background: '#ea580c', opacity: 0.9 }} />
          <div style={{ width: 12, height: 18, borderRadius: 4, background: '#fb923c', opacity: 0.7 }} />
        </div>

        {/* Shelf Line */}
        <div style={{ width: '100%', height: 2, background: 'rgba(249, 115, 22, 0.4)', borderRadius: 2 }} />

        {/* Bottom Shelf */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #f97316', opacity: 0.8 }} />
          <div style={{ width: 16, height: 20, borderRadius: 4, background: '#ea580c', opacity: 0.9 }} />
          <div style={{ width: 20, height: 16, borderRadius: 4, background: '#fdba74', opacity: 0.7 }} />
        </div>

        <div style={{ position: 'absolute', top: 8, right: 10, color: '#f97316' }}>
          <Package size={20} />
        </div>
      </div>
    </SpatialZone>
  );
};

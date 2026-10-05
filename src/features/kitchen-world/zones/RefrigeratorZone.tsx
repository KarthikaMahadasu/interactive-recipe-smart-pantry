import React from 'react';
import { ThermometerSnowflake } from 'lucide-react';
import { SpatialZone } from '../../../spatial/SpatialZone';
import type { KitchenZone, KitchenZoneId } from '../../../types/kitchen';

export const REFRIGERATOR_ZONE_DATA: KitchenZone = {
  id: 'refrigerator',
  name: 'Smart Refrigerator',
  tagline: 'Fresh Produce & Cold Vault',
  description: 'Your future smart ingredient storage with climate control and freshness tracking.',
  route: '/pantry',
  icon: 'ThermometerSnowflake',
  colorHex: '#ea580c',
  glowColor: 'rgba(234, 88, 12, 0.4)',
  itemCountLabel: 'Cold Vault',
  position3D: [-1.8, 1.2, -2.8]
};

interface RefrigeratorZoneProps {
  active?: boolean;
  onHover?: (id: KitchenZoneId | null) => void;
  onClick?: (zone: KitchenZone) => void;
}

export const RefrigeratorZone: React.FC<RefrigeratorZoneProps> = ({ active, onHover, onClick }) => {
  return (
    <SpatialZone zone={REFRIGERATOR_ZONE_DATA} active={active} onHover={onHover} onClick={onClick}>
      {/* Refrigerator Double Door Visual Element */}
      <div
        style={{
          width: '100%',
          height: '90px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(248, 250, 252, 0.95) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.35)',
          display: 'flex',
          gap: '4px',
          padding: '8px',
          position: 'relative'
        }}
      >
        {/* Left Door */}
        <div
          style={{
            flex: 1,
            borderRadius: '10px 4px 4px 10px',
            background: 'linear-gradient(180deg, rgba(234, 88, 12, 0.12) 0%, rgba(241, 245, 249, 0.9) 100%)',
            borderRight: '1px solid rgba(234, 88, 12, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '6px'
          }}
        >
          <div style={{ width: 3, height: 28, background: '#ea580c', borderRadius: 2 }} />
        </div>

        {/* Right Door */}
        <div
          style={{
            flex: 1,
            borderRadius: '4px 10px 10px 4px',
            background: 'linear-gradient(180deg, rgba(234, 88, 12, 0.12) 0%, rgba(241, 245, 249, 0.9) 100%)',
            borderLeft: '1px solid rgba(234, 88, 12, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '6px'
          }}
        >
          <div style={{ width: 3, height: 28, background: '#ea580c', borderRadius: 2 }} />
        </div>

        {/* Frost Indicator Node */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 12,
            color: '#ea580c',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <ThermometerSnowflake size={18} />
        </div>
      </div>
    </SpatialZone>
  );
};

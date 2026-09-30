import React from 'react';
import type { SpatialAnchorId, SpatialAnchor } from '../types/spatial';

export const SPATIAL_ANCHORS: Record<SpatialAnchorId, SpatialAnchor> = {
  PantryAnchor: {
    id: 'PantryAnchor',
    name: 'Pantry Storage Anchor',
    position: { x: 18, y: 22, z: 0 },
    zoneId: 'pantry',
    description: 'Spatial entry coordinate for pantry inventory'
  },
  AIAnchor: {
    id: 'AIAnchor',
    name: 'AI Brain Pedestal Anchor',
    position: { x: 50, y: 22, z: 15 },
    zoneId: 'ai_workspace',
    description: 'Central AI Neural Brain spatial destination'
  },
  FridgeAnchor: {
    id: 'FridgeAnchor',
    name: 'Smart Refrigerator Anchor',
    position: { x: 82, y: 22, z: 0 },
    zoneId: 'refrigerator',
    description: 'Fresh produce & cold storage coordinate'
  },
  PrepAnchor: {
    id: 'PrepAnchor',
    name: 'Preparation Deck Anchor',
    position: { x: 18, y: 72, z: 0 },
    zoneId: 'prep',
    description: 'Prep and portioning station coordinate'
  },
  CookingAnchor: {
    id: 'CookingAnchor',
    name: 'Induction Cooking Hub Anchor',
    position: { x: 50, y: 72, z: 0 },
    zoneId: 'cooking',
    description: 'Thermal stove & cooking coordinate'
  },
  ServingAnchor: {
    id: 'ServingAnchor',
    name: 'Serving Counter Anchor',
    position: { x: 82, y: 72, z: 0 },
    zoneId: 'serving',
    description: 'Plating and presentation deck coordinate'
  },
  GroceryAnchor: {
    id: 'GroceryAnchor',
    name: 'Grocery Logistics Anchor',
    position: { x: 18, y: 90, z: -10 },
    zoneId: 'grocery',
    description: 'Future destination anchor for missing ingredient procurement'
  }
};

interface SpatialAnchorProps {
  id: SpatialAnchorId;
  children?: React.ReactNode;
  showLabel?: boolean;
  style?: React.CSSProperties;
}

export const SpatialAnchorNode: React.FC<SpatialAnchorProps> = ({
  id,
  children,
  showLabel = false,
  style = {}
}) => {
  const anchor = SPATIAL_ANCHORS[id];
  if (!anchor) return null;

  return (
    <div
      data-spatial-anchor-id={id}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {children}

      {showLabel && (
        <div
          style={{
            position: 'absolute',
            bottom: -18,
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--text-dim)',
            background: 'rgba(15, 23, 42, 0.85)',
            padding: '2px 8px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          {anchor.name}
        </div>
      )}
    </div>
  );
};

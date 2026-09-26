import React from 'react';
import type { SpatialObjectData } from '../types/spatial';
import { SpatialObject } from './SpatialObject';
import { IngredientVisual } from './IngredientVisual';
import type { Ingredient } from '../types/ingredient';

interface SpatialObjectNodeProps {
  data: SpatialObjectData;
  onSelect?: (data: SpatialObjectData) => void;
  style?: React.CSSProperties;
}

/**
 * Reusable spatial object system component.
 * Dynamically renders objects based on generic `SpatialObjectData` (id, type, position, scale, rotation, visible, interactive).
 * Does NOT hardcode specific kitchen items or ingredients into the engine core.
 */
export const SpatialObjectNode: React.FC<SpatialObjectNodeProps> = ({
  data,
  onSelect,
  style = {}
}) => {
  if (data.visible === false) return null;

  const { position, scale = 1, rotation = 0, interactive = true, payload } = data;

  const handleClick = () => {
    if (interactive && onSelect) {
      onSelect(data);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.y}%`,
        left: `${position.x}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        zIndex: Math.round(10 + (position.z || 0)),
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        ...style
      }}
      onClick={handleClick}
    >
      <SpatialObject depth={12 + (position.z || 0)} scale={scale} float={interactive}>
        {data.type === 'ingredient' && payload ? (
          <IngredientVisual ingredient={payload as unknown as Ingredient} size="md" />
        ) : (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--primary-cyan)'
              }}
            />
            {data.id}
          </div>
        )}
      </SpatialObject>
    </div>
  );
};

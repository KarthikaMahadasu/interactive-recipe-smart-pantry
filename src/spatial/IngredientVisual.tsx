import React from 'react';
import type { Ingredient } from '../types/ingredient';

interface IngredientVisualProps {
  ingredient: Ingredient;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  onClick?: (ingredient: Ingredient) => void;
  style?: React.CSSProperties;
}

/**
 * Reusable dynamic spatial visual component for ANY ingredient object.
 * Does NOT hardcode ingredient names (supports Dragon Fruit, Ragi, Paneer, Avocado, Cashew, Tofu, etc. dynamically).
 */
export const IngredientVisual: React.FC<IngredientVisualProps> = ({
  ingredient,
  size = 'md',
  showBadge = true,
  onClick,
  style = {}
}) => {
  const color = ingredient.colorCode || '#06b6d4';

  const sizeDimensions = {
    sm: { width: 36, height: 36, fontSize: '0.7rem', iconSize: 14 },
    md: { width: 48, height: 48, fontSize: '0.8rem', iconSize: 18 },
    lg: { width: 64, height: 64, fontSize: '0.9rem', iconSize: 24 }
  }[size];

  const initialLetter = ingredient.name ? ingredient.name.charAt(0).toUpperCase() : '?';

  return (
    <div
      onClick={() => onClick && onClick(ingredient)}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(ingredient);
        }
      }}
      title={`${ingredient.name} (${ingredient.quantity} ${ingredient.unit})`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        ...style
      }}
    >
      <div
        style={{
          width: sizeDimensions.width,
          height: sizeDimensions.height,
          borderRadius: '16px',
          background: `radial-gradient(circle at 35% 35%, ${color} 0%, rgba(15, 23, 42, 0.9) 90%)`,
          border: `1.5px solid ${color}`,
          boxShadow: `0 4px 16px ${color}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: sizeDimensions.fontSize,
          position: 'relative',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
      >
        <span>{initialLetter}</span>

        {showBadge && (
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              background: 'rgba(15, 23, 42, 0.95)',
              border: `1px solid ${color}`,
              borderRadius: '8px',
              padding: '1px 5px',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--text-main)'
            }}
          >
            {ingredient.quantity}{ingredient.unit}
          </div>
        )}
      </div>

      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-main)',
          fontWeight: 600,
          textAlign: 'center',
          maxWidth: '80px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {ingredient.name}
      </span>
    </div>
  );
};

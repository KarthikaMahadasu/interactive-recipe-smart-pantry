import React from 'react';
import type { Ingredient } from '../types/ingredient';

interface IngredientVisualProps {
  ingredient: Ingredient;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  showCategory?: boolean;
  onClick?: (ingredient: Ingredient) => void;
  style?: React.CSSProperties;
}

/**
 * Reusable dynamic spatial visual component for ANY ingredient object.
 * Does NOT hardcode ingredient names (supports Dragon Fruit, Ragi, Paneer, Avocado, Cashew, Tofu, Mango, etc. dynamically).
 */
export const IngredientVisual: React.FC<IngredientVisualProps> = ({
  ingredient,
  size = 'md',
  showBadge = true,
  showCategory = false,
  onClick,
  style = {}
}) => {
  const color = ingredient.colorCode || '#06b6d4';

  const sizeDimensions = {
    sm: { width: 36, height: 36, fontSize: '0.7rem', iconSize: 14, textWidth: '70px' },
    md: { width: 52, height: 52, fontSize: '0.85rem', iconSize: 18, textWidth: '85px' },
    lg: { width: 68, height: 68, fontSize: '1.0rem', iconSize: 24, textWidth: '100px' }
  }[size];

  const initialLetter = ingredient.name ? ingredient.name.charAt(0).toUpperCase() : '?';

  return (
    <div
      role={onClick ? 'button' : 'region'}
      aria-label={`Ingredient: ${ingredient.name}, Quantity: ${ingredient.quantity} ${ingredient.unit}, Category: ${ingredient.category}`}
      onClick={() => onClick && onClick(ingredient)}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(ingredient);
        }
      }}
      title={`${ingredient.name} (${ingredient.quantity} ${ingredient.unit}) — ${ingredient.category}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style
      }}
    >
      <div
        style={{
          width: sizeDimensions.width,
          height: sizeDimensions.height,
          borderRadius: '18px',
          background: `radial-gradient(circle at 35% 35%, ${color} 0%, rgba(15, 23, 42, 0.95) 90%)`,
          border: `1.5px solid ${color}`,
          boxShadow: `0 6px 20px ${color}44`,
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
              color: 'var(--text-main)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
            }}
          >
            {ingredient.quantity}{ingredient.unit}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', maxWidth: sizeDimensions.textWidth }}>
        <span
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-main)',
            fontWeight: 600,
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {ingredient.name}
        </span>

        {showCategory && (
          <span
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'block'
            }}
          >
            {ingredient.category}
          </span>
        )}
      </div>
    </div>
  );
};

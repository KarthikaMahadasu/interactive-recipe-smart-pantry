import React from 'react';
import type { Ingredient } from '../../types/ingredient';

export const IngredientBadge: React.FC<{ ingredient: Ingredient; onClick?: () => void }> = ({
  ingredient,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '20px',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${ingredient.colorCode}66`,
        fontSize: '0.8rem',
        fontWeight: 500,
        color: 'var(--text-main)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, border-color 0.2s ease'
      }}
      className="glass-panel-hover"
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: ingredient.colorCode || 'var(--primary-cyan)',
          boxShadow: `0 0 6px ${ingredient.colorCode || 'var(--primary-cyan)'}`
        }}
      />
      <span>{ingredient.name}</span>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        ({ingredient.quantity}{ingredient.unit})
      </span>
    </div>
  );
};

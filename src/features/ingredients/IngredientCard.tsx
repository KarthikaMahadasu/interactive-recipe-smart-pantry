import React from 'react';
import type { Ingredient } from '../../types/ingredient';
import { Tag, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useKitchenState } from '../../state/KitchenContext';

interface IngredientCardProps {
  ingredient: Ingredient;
  onSelect?: (ingredient: Ingredient) => void;
  compact?: boolean;
}

const FRESHNESS_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  fresh: { label: 'Peak Freshness', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  expiring_soon: { label: 'Use Soon', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  critical: { label: 'Expiring Today', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  pantry_stable: { label: 'Pantry Stable', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' }
};

export const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  onSelect,
  compact = false
}) => {
  const { updateQuantity, removeIngredient, addGroceryItem } = useKitchenState();
  const badge = FRESHNESS_BADGES[ingredient.freshness] || FRESHNESS_BADGES.fresh;

  const handleAddGrocery = (e: React.MouseEvent) => {
    e.stopPropagation();
    addGroceryItem({
      id: `g_manual_${Date.now()}`,
      name: ingredient.name,
      quantity: ingredient.quantity > 0 ? ingredient.quantity : 1,
      unit: ingredient.unit,
      bought: false,
      category: ingredient.category
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeIngredient(ingredient.id);
  };

  const handleDelta = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    updateQuantity(ingredient.id, delta);
  };

  return (
    <div
      onClick={() => onSelect?.(ingredient)}
      className="glass-panel glass-panel-hover"
      style={{
        padding: compact ? '10px 14px' : '16px 20px',
        borderRadius: '16px',
        cursor: onSelect ? 'pointer' : 'default',
        borderLeft: `4px solid ${ingredient.colorCode || 'var(--primary-cyan)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Row: Name & Quantity controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: ingredient.colorCode || '#06b6d4',
              boxShadow: `0 0 10px ${ingredient.colorCode || '#06b6d4'}`
            }}
          />
          <span style={{ fontWeight: 600, fontSize: compact ? '0.9rem' : '1rem', color: 'var(--text-main)' }}>
            {ingredient.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={(e) => handleDelta(e, -1)}
            style={{
              width: 24,
              height: 24,
              borderRadius: '6px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: ingredient.quantity === 0 ? 'var(--accent-rose)' : 'var(--primary-cyan)',
              background: ingredient.quantity === 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(6, 182, 212, 0.12)',
              padding: '2px 8px',
              borderRadius: '10px',
              minWidth: '45px',
              textAlign: 'center'
            }}
          >
            {ingredient.quantity} {ingredient.unit}
          </span>
          <button
            onClick={(e) => handleDelta(e, 1)}
            style={{
              width: 24,
              height: 24,
              borderRadius: '6px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Increase quantity"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Freshness Badge & Category */}
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 10px',
                borderRadius: '12px',
                color: badge.color,
                background: badge.bg,
                border: `1px solid ${badge.color}44`
              }}
            >
              {badge.label}
            </span>

            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                textTransform: 'capitalize',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Tag size={12} /> {ingredient.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleAddGrocery}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
              title="Add to Grocery Restock List"
            >
              <ShoppingBag size={12} /> Restock
            </button>
            <button
              onClick={handleRemove}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
              title="Remove item"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Tags */}
      {!compact && ingredient.tags && ingredient.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {ingredient.tags.map((t, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-dim)',
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '1px 8px',
                borderRadius: '8px'
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

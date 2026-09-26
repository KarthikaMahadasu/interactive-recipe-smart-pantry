import React, { useState } from 'react';
import type { Ingredient } from '../../types/ingredient';
import { Tag, Plus, Minus, Trash2, Edit3, AlertTriangle, Calendar } from 'lucide-react';
import { usePantry } from '../../hooks/usePantry';

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit?: (ingredient: Ingredient) => void;
  compact?: boolean;
}

const FRESHNESS_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  fresh: { label: 'Fresh', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  expiring_soon: { label: 'Expiring Soon', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  critical: { label: 'Expired / Zero Stock', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  pantry_stable: { label: 'Pantry Stable', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' }
};

export const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  onEdit,
  compact = false
}) => {
  const { deleteIngredient, updateQuantity } = usePantry();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const badge = FRESHNESS_BADGES[ingredient.freshness] || FRESHNESS_BADGES.fresh;

  const handleConfirmRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteIngredient(ingredient.id);
    setShowConfirmDelete(false);
  };

  const handleDelta = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    updateQuantity(ingredient.id, delta);
  };

  return (
    <div
      className="glass-panel glass-panel-hover"
      style={{
        padding: compact ? '10px 14px' : '16px 20px',
        borderRadius: '18px',
        borderLeft: `4px solid ${ingredient.colorCode || 'var(--primary-cyan)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        background: 'rgba(15, 23, 42, 0.85)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Top Row: Color dot, Name & Quantity Adjuster */}
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
          <span style={{ fontWeight: 700, fontSize: compact ? '0.9rem' : '1.05rem', color: 'var(--text-main)' }}>
            {ingredient.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={(e) => handleDelta(e, -1)}
            style={{
              width: 26,
              height: 26,
              borderRadius: '8px',
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
            <Minus size={13} />
          </button>
          <span
            style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: ingredient.quantity === 0 ? 'var(--accent-rose)' : 'var(--primary-cyan)',
              background: ingredient.quantity === 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(6, 182, 212, 0.12)',
              padding: '2px 10px',
              borderRadius: '10px',
              minWidth: '50px',
              textAlign: 'center'
            }}
          >
            {ingredient.quantity} {ingredient.unit}
          </span>
          <button
            onClick={(e) => handleDelta(e, 1)}
            style={{
              width: 26,
              height: 26,
              borderRadius: '8px',
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
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Freshness Badge, Category & Actions */}
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
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
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(ingredient);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#c084fc',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
                title="Edit ingredient details"
              >
                <Edit3 size={13} /> Edit
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmDelete(true);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '10px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                fontSize: '0.74rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
              title="Delete ingredient"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Expiry Date Display */}
      {!compact && ingredient.expiresAt && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={12} color="var(--accent-amber)" /> Expiry Date: {ingredient.expiresAt}
        </div>
      )}

      {/* Delete Confirmation Warning overlay */}
      {showConfirmDelete && (
        <div
          style={{
            marginTop: '6px',
            padding: '10px 12px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.2)',
            border: '1px solid #f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '0.76rem', color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={14} color="#f43f5e" /> Remove {ingredient.name}?
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmDelete(false);
              }}
              style={{
                padding: '3px 8px',
                borderRadius: '8px',
                background: 'rgba(30, 41, 59, 0.8)',
                color: 'var(--text-main)',
                fontSize: '0.7rem'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRemove}
              style={{
                padding: '3px 8px',
                borderRadius: '8px',
                background: '#f43f5e',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.7rem'
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

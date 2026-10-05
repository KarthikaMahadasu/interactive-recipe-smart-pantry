import React, { useState } from 'react';
import type { Ingredient } from '../../types/ingredient';
import { Tag, Plus, Minus, Trash2, Edit3, AlertTriangle, Calendar, User } from 'lucide-react';
import { usePantry } from '../../hooks/usePantry';
import { getInventoryStatus, getStatusBadgeConfig } from '../inventory/utils/inventoryUtils';

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit?: (ingredient: Ingredient) => void;
  compact?: boolean;
}

export const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  onEdit,
  compact = false
}) => {
  const { deleteIngredient, updateQuantity } = usePantry();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const status = getInventoryStatus(ingredient);
  const badgeConfig = getStatusBadgeConfig(status);

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
        borderLeft: `4px solid ${ingredient.colorCode || '#ea580c'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
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
              background: ingredient.colorCode || '#ea580c',
              boxShadow: `0 0 10px ${ingredient.colorCode || '#ea580c'}`
            }}
          />
          <span style={{ fontWeight: 800, fontSize: compact ? '0.9rem' : '1.05rem', color: '#0f172a' }}>
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
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
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
              color: ingredient.quantity === 0 ? '#ef4444' : '#ea580c',
              background: ingredient.quantity === 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(234, 88, 12, 0.12)',
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
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
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

      {/* Real-time Status Badge, Category & Actions */}
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: '12px',
                color: badgeConfig.color,
                background: badgeConfig.bg,
                border: `1px solid ${badgeConfig.border}`
              }}
            >
              ● {badgeConfig.label}
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
                  background: 'rgba(234, 88, 12, 0.1)',
                  border: '1px solid rgba(234, 88, 12, 0.3)',
                  color: '#ea580c',
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
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#dc2626',
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

      {/* Expiry Date & Audit Information */}
      {!compact && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
          {ingredient.expiresAt && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} color="#d97706" /> Expiry Date: {ingredient.expiresAt}
            </div>
          )}

          {(ingredient.createdBy || ingredient.updatedBy) && (
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={10} color="#ea580c" />
              <span>
                {ingredient.updatedBy
                  ? `Updated by ${ingredient.updatedBy}`
                  : `Added by ${ingredient.createdBy}`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {showConfirmDelete && (
        <div
          style={{
            marginTop: '6px',
            padding: '10px 12px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '0.76rem', color: '#991b1b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={14} color="#ef4444" /> Remove {ingredient.name}?
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
                background: '#f1f5f9',
                color: '#334155',
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
                background: '#dc2626',
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

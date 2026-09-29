import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import type { Ingredient } from '../../../types/ingredient';
import { useKitchenState } from '../../../state/KitchenContext';

interface WasteTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
}

export const WasteTrackingModal: React.FC<WasteTrackingModalProps> = ({ isOpen, onClose, ingredient }) => {
  const { state, recordWaste } = useKitchenState();

  const [selectedItemId, setSelectedItemId] = useState<string>(ingredient?.id || '');
  const [quantity, setQuantity] = useState<string>('1');
  const [reason, setReason] = useState<string>('Expired');

  if (!isOpen) return null;

  const currentItem = state.pantry.find((p) => p.id === (selectedItemId || ingredient?.id));
  const numQty = parseFloat(quantity) || 0;
  const isExceeding = currentItem ? numQty > currentItem.quantity : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem || numQty <= 0 || isExceeding) return;

    recordWaste(currentItem.id, numQty, currentItem.unit, reason);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(8, 12, 20, 0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '28px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'rgba(244, 63, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fda4af'
              }}
            >
              <Trash2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Record Inventory Waste
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Log discarded, spoiled, or damaged stock
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer', border: 'none' }}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Select Item */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Select Ingredient *
            </label>
            <select
              value={selectedItemId || currentItem?.id || ''}
              onChange={(e) => setSelectedItemId(e.target.value)}
              style={{
                width: '100%',
                marginTop: '4px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="" disabled>-- Select Ingredient --</option>
              {state.pantry.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.quantity} {item.unit} in stock)
                </option>
              ))}
            </select>
          </div>

          {currentItem && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.82rem',
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--text-dim)'
              }}
            >
              <span>Current Stock: <strong style={{ color: '#fff' }}>{currentItem.quantity} {currentItem.unit}</strong></span>
              <span>After Waste: <strong style={{ color: isExceeding ? '#f43f5e' : '#fda4af' }}>{Math.max(0, currentItem.quantity - numQty)} {currentItem.unit}</strong></span>
            </div>
          )}

          {isExceeding && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#fda4af',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertTriangle size={16} /> Waste quantity exceeds available stock ({currentItem?.quantity} {currentItem?.unit}).
            </div>
          )}

          {/* Waste Quantity */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Waste Quantity ({currentItem?.unit || 'units'}) *
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                width: '100%',
                marginTop: '4px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Reason */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Waste Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                marginTop: '4px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="Expired">Expired</option>
              <option value="Damaged / Spilled">Damaged / Spilled</option>
              <option value="Preparation Waste">Preparation Waste</option>
              <option value="Quality Inspection Failure">Quality Inspection Failure</option>
              <option value="Other Waste">Other Waste</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '14px',
                background: 'rgba(30, 41, 59, 0.6)',
                color: '#94a3b8',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!currentItem || isExceeding || numQty <= 0}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '14px',
                background: isExceeding ? '#475569' : 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                cursor: isExceeding ? 'not-allowed' : 'pointer',
                boxShadow: isExceeding ? 'none' : '0 4px 16px rgba(244, 63, 94, 0.4)'
              }}
            >
              Confirm Waste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

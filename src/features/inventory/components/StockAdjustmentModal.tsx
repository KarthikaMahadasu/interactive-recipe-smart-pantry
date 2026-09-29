import React, { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { Ingredient } from '../../../types/ingredient';
import { useKitchenState } from '../../../state/KitchenContext';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({ isOpen, onClose, ingredient }) => {
  const { state, adjustStock } = useKitchenState();

  const [selectedItemId, setSelectedItemId] = useState<string>(ingredient?.id || '');
  const [actualQuantity, setActualQuantity] = useState<string>('0');
  const [reason, setReason] = useState<string>('Physical Stock Check');

  if (!isOpen) return null;

  const currentItem = state.pantry.find((p) => p.id === (selectedItemId || ingredient?.id));
  const numActual = parseFloat(actualQuantity) || 0;
  const systemQty = currentItem ? currentItem.quantity : 0;
  const diff = numActual - systemQty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem || numActual < 0) return;

    adjustStock(currentItem.id, numActual, reason);
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
                background: 'rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc'
              }}
            >
              <SlidersHorizontal size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Stock Reconciliation / Adjustment
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Reconcile physical stock count against system records
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
              onChange={(e) => {
                setSelectedItemId(e.target.value);
                const found = state.pantry.find((p) => p.id === e.target.value);
                if (found) setActualQuantity(found.quantity.toString());
              }}
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
                  {item.name} ({item.quantity} {item.unit} system count)
                </option>
              ))}
            </select>
          </div>

          {/* System Count vs Physical Count comparison */}
          {currentItem && (
            <div
              style={{
                padding: '14px 18px',
                borderRadius: '16px',
                background: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                textAlign: 'center',
                fontSize: '0.82rem'
              }}
            >
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>System Count</div>
                <div style={{ fontWeight: 800, color: '#fff' }}>{systemQty} {currentItem.unit}</div>
              </div>

              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Physical Count</div>
                <div style={{ fontWeight: 800, color: '#34d399' }}>{numActual} {currentItem.unit}</div>
              </div>

              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.25)' }}>
                <div style={{ color: '#c084fc', fontSize: '0.7rem' }}>Difference</div>
                <div style={{ fontWeight: 800, color: diff >= 0 ? '#34d399' : '#f43f5e' }}>
                  {diff > 0 ? `+${diff}` : diff} {currentItem.unit}
                </div>
              </div>
            </div>
          )}

          {/* Actual Physical Count Input */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Actual Physical Count ({currentItem?.unit || 'units'}) *
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={actualQuantity}
              onChange={(e) => setActualQuantity(e.target.value)}
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
              Adjustment Reason
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
              <option value="Physical Stock Check">Physical Stock Check</option>
              <option value="Monthly Inventory Audit">Monthly Inventory Audit</option>
              <option value="Supplier Delivery Correction">Supplier Delivery Correction</option>
              <option value="Unit Conversion Correction">Unit Conversion Correction</option>
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
              disabled={!currentItem || numActual < 0}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
              }}
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

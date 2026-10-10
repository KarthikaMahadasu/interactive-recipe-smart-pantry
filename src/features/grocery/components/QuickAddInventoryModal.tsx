import React, { useState } from 'react';
import { X, PackagePlus, ArrowRight, CheckCircle2, Box } from 'lucide-react';
import type { SmartGroceryItem } from '../types/groceryTypes';
import { useKitchenState } from '../../../state/KitchenContext';
import { IngredientUtils } from '../../../utils/ingredientUtils';

interface QuickAddInventoryModalProps {
  item: SmartGroceryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddInventoryModal: React.FC<QuickAddInventoryModalProps> = ({
  item,
  isOpen,
  onClose
}) => {
  const { state, receiveGroceryDelivery } = useKitchenState();

  const [receivedQty, setReceivedQty] = useState<string>(item ? String(item.quantity) : '1');
  const [receivedUnit, setReceivedUnit] = useState<string>(item ? item.unit : 'kg');

  // Update form fields when item changes
  React.useEffect(() => {
    if (item) {
      setReceivedQty(String(item.quantity));
      setReceivedUnit(item.unit);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  // Find current stock in pantry
  const pantryMatch = state.pantry.find((p) => IngredientUtils.areIngredientsMatching(item.name, p.name));
  const currentStockStr = pantryMatch ? `${pantryMatch.quantity} ${pantryMatch.unit}` : '0 (Not in inventory)';

  const parsedQty = parseFloat(receivedQty) || 0;
  const convertedReceivedInGroceryUnit = IngredientUtils.convertUnit(parsedQty, receivedUnit, item.unit);
  const isPartial = convertedReceivedInGroceryUnit < item.quantity;
  const remainingNeeded = Math.max(0, Math.round((item.quantity - convertedReceivedInGroceryUnit) * 100) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedQty <= 0) return;

    receiveGroceryDelivery(item.id, parsedQty, receivedUnit);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '480px',
          padding: '24px 28px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #fed7aa',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PackagePlus size={22} color="#ea580c" /> Quick-Add to Inventory
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#64748b', padding: 4, cursor: 'pointer', border: 'none' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ background: '#fff7ed', padding: '14px', borderRadius: '16px', border: '1px solid #ffedd5' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ea580c' }}>{item.name}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px', display: 'flex', gap: '12px' }}>
            <span>Grocery Requirement: <strong>{item.quantity} {item.unit}</strong></span>
            <span>Current Stock: <strong>{currentStockStr}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Actual Received Quantity & Unit
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                value={receivedQty}
                onChange={(e) => setReceivedQty(e.target.value)}
                style={{
                  flex: 2,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                placeholder="Quantity received"
              />

              <select
                value={receivedUnit}
                onChange={(e) => setReceivedUnit(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
                <option value="pcs">pcs</option>
                <option value="pack">pack</option>
                <option value="bottle">bottle</option>
              </select>
            </div>
          </div>

          {/* Impact summary banner */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: isPartial ? '#fefce8' : '#f0fdf4',
              border: `1px solid ${isPartial ? '#fef08a' : '#bbf7d0'}`,
              fontSize: '0.8rem',
              color: isPartial ? '#854d0e' : '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isPartial ? (
              <>
                <Box size={16} color="#d97706" />
                <span>
                  <strong>Partial Receipt:</strong> Adding {parsedQty} {receivedUnit}. <strong>{remainingNeeded} {item.unit}</strong> will remain on the grocery list as needed.
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>
                  <strong>Full Receipt:</strong> Adding {parsedQty} {receivedUnit} to shared inventory and marking grocery requirement as fulfilled!
                </span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '14px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(234, 88, 12, 0.25)'
              }}
            >
              Confirm & Add to Inventory <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { SmartGroceryItem } from '../types/groceryTypes';
import { useKitchenState } from '../../../state/KitchenContext';

interface BulkReceiveModalProps {
  items: SmartGroceryItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const BulkReceiveModal: React.FC<BulkReceiveModalProps> = ({
  items,
  isOpen,
  onClose
}) => {
  const { receiveGroceryDelivery } = useKitchenState();

  // Selected items map
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(items.map((i) => i.id)));
  // Received quantities map
  const [receivedQtyMap, setReceivedQtyMap] = useState<Record<string, { qty: number; unit: string }>>({});

  React.useEffect(() => {
    const initialMap: Record<string, { qty: number; unit: string }> = {};
    const initialSet = new Set<string>();
    items.forEach((i) => {
      if (i.status === 'NEEDED' || i.status === 'ORDERED' || i.status === 'PURCHASED') {
        initialMap[i.id] = { qty: i.quantity, unit: i.unit };
        initialSet.add(i.id);
      }
    });
    setReceivedQtyMap(initialMap);
    setSelectedIds(initialSet);
  }, [items]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleQtyChange = (id: string, qty: number, unit: string) => {
    setReceivedQtyMap((prev) => ({
      ...prev,
      [id]: { qty, unit }
    }));
  };

  const pendingItems = items.filter((i) => i.status === 'NEEDED' || i.status === 'ORDERED' || i.status === 'PURCHASED');

  const handleConfirmBulk = () => {
    selectedIds.forEach((id) => {
      const itemData = receivedQtyMap[id];
      if (itemData && itemData.qty > 0) {
        receiveGroceryDelivery(id, itemData.qty, itemData.unit);
      }
    });
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
          maxWidth: '600px',
          padding: '24px 28px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #fed7aa',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          maxHeight: '85vh'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={22} color="#ea580c" /> Bulk Receive Grocery Deliveries
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#64748b', padding: 4, cursor: 'pointer', border: 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
          Select delivered items, adjust actual received quantities, and confirm addition into shared restaurant inventory.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '340px', paddingRight: '4px' }}>
          {pendingItems.map((item) => {
            const isSelected = selectedIds.has(item.id);
            const currentData = receivedQtyMap[item.id] || { qty: item.quantity, unit: item.unit };

            return (
              <div
                key={item.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: isSelected ? '#fff7ed' : '#f8fafc',
                  border: `1px solid ${isSelected ? '#fed7aa' : '#e2e8f0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item.id)}
                    style={{ width: 18, height: 18, accentColor: '#ea580c', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Needed: {item.quantity} {item.unit}</div>
                  </div>
                </div>

                {isSelected && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={currentData.qty}
                      onChange={(e) => handleQtyChange(item.id, parseFloat(e.target.value) || 0, currentData.unit)}
                      style={{
                        width: '70px',
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem'
                      }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{currentData.unit}</span>
                  </div>
                )}
              </div>
            );
          })}

          {pendingItems.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
              No pending grocery items awaiting delivery receipt.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '8px' }}>
          <button
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
            onClick={handleConfirmBulk}
            disabled={selectedIds.size === 0}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: '14px',
              background: selectedIds.size > 0 ? 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' : '#cbd5e1',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: selectedIds.size > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            <CheckCircle2 size={16} /> Confirm & Receive Selected ({selectedIds.size}) <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

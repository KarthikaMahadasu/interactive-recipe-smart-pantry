import React, { useState } from 'react';
import { X, CheckCircle, Truck, ShoppingBag, Layers } from 'lucide-react';
import type { SmartGroceryItem } from '../types/groceryTypes';
import { useKitchenState } from '../../../state/KitchenContext';

interface GroceryItemDetailModalProps {
  item: SmartGroceryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GroceryItemDetailModal: React.FC<GroceryItemDetailModalProps> = ({ item, isOpen, onClose }) => {
  const { markGroceryPurchased, receiveGroceryDelivery, deleteGroceryItem } = useKitchenState();

  const [receivedQty, setReceivedQty] = useState<string>(item?.quantity ? item.quantity.toString() : '1');
  const [isReceivingMode, setIsReceivingMode] = useState(false);

  if (!isOpen || !item) return null;

  const handlePurchased = () => {
    markGroceryPurchased(item.id);
    onClose();
  };

  const handleReceiveDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(receivedQty) || item.quantity;
    if (num <= 0) return;

    receiveGroceryDelivery(item.id, num);
    setIsReceivingMode(false);
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
          maxWidth: '520px',
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
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}
            >
              <ShoppingBag size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {item.name}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Grocery Item Details & Delivery Receiving
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-dim)', border: 'none', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Breakdown Card */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              Quantity Needed
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>
              {item.quantity} {item.unit}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '10px',
                background: item.priority === 'HIGH' ? 'rgba(244, 63, 94, 0.2)' : item.priority === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: item.priority === 'HIGH' ? '#fda4af' : item.priority === 'MEDIUM' ? '#fcd34d' : '#6ee7b7',
                border: `1px solid ${item.priority === 'HIGH' ? '#f43f5e' : item.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'}`
              }}
            >
              Priority: {item.priority}
            </span>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '10px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#c084fc'
              }}
            >
              Source: {item.source}
            </span>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8'
              }}
            >
              Status: {item.status}
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="var(--primary-cyan)" />
            <span>Reason: {item.reason}</span>
          </div>
        </div>

        {/* Receiving Mode Form */}
        {isReceivingMode ? (
          <form onSubmit={handleReceiveDelivery} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#6ee7b7',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Truck size={18} /> Enter the actual delivered quantity to add to shared restaurant inventory.
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Delivered Quantity ({item.unit}) *
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                required
                value={receivedQty}
                onChange={(e) => setReceivedQty(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
              {parseFloat(receivedQty) < item.quantity && (
                <div style={{ fontSize: '0.75rem', color: '#fcd34d', marginTop: '4px' }}>
                  Partial Delivery: {item.quantity - parseFloat(receivedQty)} {item.unit} will remain in grocery list as needed.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsReceivingMode(false)}
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
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                }}
              >
                <CheckCircle size={18} /> RECEIVE INTO INVENTORY
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {item.status === 'NEEDED' && (
              <button
                onClick={handlePurchased}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'rgba(56, 189, 248, 0.18)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <CheckCircle size={18} /> Mark as Purchased
              </button>
            )}

            <button
              onClick={() => {
                setReceivedQty(item.quantity.toString());
                setIsReceivingMode(true);
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Truck size={18} /> Receive Delivery Into Inventory
            </button>

            <button
              onClick={() => {
                deleteGroceryItem(item.id);
                onClose();
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Remove Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

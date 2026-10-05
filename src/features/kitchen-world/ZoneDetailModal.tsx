import React from 'react';
import type { KitchenZone } from '../../types/kitchen';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ZoneDetailModalProps {
  zone: KitchenZone | null;
  onClose: () => void;
}

export const ZoneDetailModal: React.FC<ZoneDetailModalProps> = ({ zone, onClose }) => {
  const navigate = useNavigate();

  if (!zone) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '28px',
          borderRadius: '24px',
          background: '#ffffff',
          border: `1px solid ${zone.colorHex}`,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#f1f5f9',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Zone Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: zone.colorHex,
              boxShadow: `0 0 14px ${zone.colorHex}`
            }}
          />
          <h2 style={{ fontSize: '1.3rem', color: '#ea580c' }}>{zone.name}</h2>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {zone.description}
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ color: 'var(--text-dim)' }}>Status & Active Items:</span>
          <span style={{ fontWeight: 600, color: zone.colorHex }}>{zone.itemCountLabel}</span>
        </div>

        <div
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={14} color="#ea580c" /> Module 1 Placeholder: Clicking enter loads module route shell.
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            navigate(zone.route);
          }}
          style={{
            marginTop: '8px',
            padding: '12px',
            borderRadius: '16px',
            background: zone.colorHex,
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: `0 4px 18px ${zone.colorHex}44`
          }}
        >
          <span>Enter {zone.name}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

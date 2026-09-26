import React from 'react';
import { AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';
import type { AgentAction } from '../types/agentTypes';

interface AgentConfirmationModalProps {
  pendingAction: AgentAction | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AgentConfirmationModal: React.FC<AgentConfirmationModalProps> = ({
  pendingAction,
  onConfirm,
  onCancel
}) => {
  if (!pendingAction) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          borderRadius: '24px',
          padding: '24px 28px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid rgba(244, 63, 94, 0.4)',
          boxShadow: '0 20px 50px rgba(244, 63, 94, 0.25), 0 0 30px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f43f5e'
            }}
          >
            <ShieldAlert size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Confirm AI Kitchen Action
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Action Intent: {pendingAction.intent}
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '14px 16px',
            borderRadius: '16px',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.9rem',
            color: 'var(--text-main)',
            lineHeight: 1.5
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 600, marginBottom: '6px', fontSize: '0.82rem' }}>
            <AlertTriangle size={16} /> Attention Required
          </div>
          <p style={{ margin: 0 }}>
            {pendingAction.confirmationMessage ||
              `Are you sure you want to execute: "${pendingAction.rawCommand}"?`}
          </p>
          {pendingAction.parameters.name && (
            <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', gap: '12px' }}>
              <span>Item: <strong style={{ color: 'var(--primary-cyan)' }}>{pendingAction.parameters.name}</strong></span>
              {pendingAction.parameters.quantity && (
                <span>Quantity: <strong style={{ color: 'var(--accent-amber)' }}>{pendingAction.parameters.quantity} {pendingAction.parameters.unit || ''}</strong></span>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              background: 'rgba(51, 65, 85, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={16} /> Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: '10px 22px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(244, 63, 94, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            <Check size={16} /> Confirm Action
          </button>
        </div>
      </div>
    </div>
  );
};

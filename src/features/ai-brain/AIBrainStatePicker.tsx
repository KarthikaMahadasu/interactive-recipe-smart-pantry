import React from 'react';
import type { AIBrainState } from '../../types/ai';

interface AIBrainStatePickerProps {
  currentState: AIBrainState;
  onStateChange: (state: AIBrainState) => void;
}

const STATES: { key: AIBrainState; label: string; badgeColor: string }[] = [
  { key: 'idle', label: 'Idle', badgeColor: '#06b6d4' },
  { key: 'listening', label: 'Listening', badgeColor: '#10b981' },
  { key: 'thinking', label: 'Thinking', badgeColor: '#f59e0b' },
  { key: 'working', label: 'Working', badgeColor: '#8b5cf6' },
  { key: 'success', label: 'Success', badgeColor: '#10b981' },
  { key: 'error', label: 'Error', badgeColor: '#f43f5e' }
];

export const AIBrainStatePicker: React.FC<AIBrainStatePickerProps> = ({
  currentState,
  onStateChange
}) => {
  return (
    <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '16px' }}>
      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '8px'
        }}
      >
        AI Brain State Controls (Module 1 Testbed)
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {STATES.map((s) => {
          const isActive = currentState === s.key;
          return (
            <button
              key={s.key}
              onClick={() => onStateChange(s.key)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: isActive ? s.badgeColor : 'rgba(30, 41, 59, 0.6)',
                color: isActive ? '#000000' : 'var(--text-main)',
                border: `1px solid ${isActive ? s.badgeColor : 'rgba(255, 255, 255, 0.1)'}`,
                boxShadow: isActive ? `0 0 14px ${s.badgeColor}66` : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isActive ? '#000' : s.badgeColor,
                  display: 'inline-block'
                }}
              />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

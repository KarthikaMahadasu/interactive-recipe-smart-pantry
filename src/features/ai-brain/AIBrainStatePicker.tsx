import React, { useState } from 'react';
import type { AIBrainState } from '../../types/ai';
import { FlaskConical, ChevronDown, ChevronUp, Play } from 'lucide-react';

interface AIBrainStatePickerProps {
  currentState: AIBrainState;
  onStateChange: (state: AIBrainState) => void;
}

const STATES: { key: AIBrainState; label: string; badgeColor: string; description: string }[] = [
  { key: 'idle', label: 'Idle', badgeColor: '#06b6d4', description: 'Calm breathing pulse (Waiting)' },
  { key: 'listening', label: 'Listening', badgeColor: '#10b981', description: 'Soundwave ripples (Receiving input)' },
  { key: 'thinking', label: 'Thinking', badgeColor: '#f59e0b', description: 'Inward swirling energy (Processing)' },
  { key: 'working', label: 'Working', badgeColor: '#8b5cf6', description: 'Directional orbital motion (Executing)' },
  { key: 'success', label: 'Success', badgeColor: '#10b981', description: 'Stable glowing pulse (Completed)' },
  { key: 'error', label: 'Error', badgeColor: '#f43f5e', description: 'Warning pulse (Encountered error)' }
];

export const AIBrainStatePicker: React.FC<AIBrainStatePickerProps> = ({
  currentState,
  onStateChange
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isRunningDemo, setIsRunningDemo] = useState<boolean>(false);

  const handleRunDemoSequence = async () => {
    if (isRunningDemo) return;
    setIsRunningDemo(true);

    const sequence: AIBrainState[] = ['idle', 'listening', 'thinking', 'working', 'success', 'idle'];
    for (const step of sequence) {
      onStateChange(step);
      await new Promise((res) => setTimeout(res, 1400));
    }
    setIsRunningDemo(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'relative'
      }}
    >
      {/* Dev Toggle Pill Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '6px 14px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          color: '#c084fc',
          fontSize: '0.78rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
          transition: 'all 0.2s ease'
        }}
        title="Toggle Development AI State Simulator"
      >
        <FlaskConical size={14} />
        <span>Dev State Testbed</span>
        <span
          style={{
            fontSize: '0.68rem',
            padding: '1px 6px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.2)',
            color: '#a78bfa',
            textTransform: 'uppercase'
          }}
        >
          {currentState}
        </span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Expanded Dev Panel */}
      {isExpanded && (
        <div
          className="glass-panel"
          style={{
            marginTop: '10px',
            padding: '16px 20px',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
            maxWidth: '380px',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: 700, fontSize: '0.8rem' }}>
              <FlaskConical size={14} /> Development AI State Simulator
            </div>

            <button
              onClick={handleRunDemoSequence}
              disabled={isRunningDemo}
              style={{
                padding: '4px 10px',
                borderRadius: '10px',
                background: isRunningDemo ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: isRunningDemo ? 'wait' : 'pointer'
              }}
            >
              <Play size={12} />
              {isRunningDemo ? 'Running...' : 'Auto Demo'}
            </button>
          </div>

          <p style={{ fontSize: '0.73rem', color: 'var(--text-dim)', lineHeight: 1.35 }}>
            Development testbed for inspecting AI Brain states in Module 1. Does NOT trigger external AI APIs.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {STATES.map((s) => {
              const isActive = currentState === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => onStateChange(s.key)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: isActive ? s.badgeColor : 'rgba(30, 41, 59, 0.6)',
                    color: isActive ? '#000000' : 'var(--text-main)',
                    border: `1px solid ${isActive ? s.badgeColor : 'rgba(255, 255, 255, 0.1)'}`,
                    boxShadow: isActive ? `0 0 12px ${s.badgeColor}66` : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                  title={s.description}
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
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Send, Bot, X, Loader2, Info, CheckCircle, AlertTriangle, HelpCircle, ShieldAlert } from 'lucide-react';
import { useAIAgent } from '../ai-agent/hooks/useAIAgent';
import { useKitchenState } from '../../state/KitchenContext';
import { AgentConfirmationModal } from '../ai-agent/components/AgentConfirmationModal';
import { AgentCommandHelper } from '../ai-agent/components/AgentCommandHelper';

interface AICommandBarProps {
  style?: React.CSSProperties;
}

export const AICommandBar: React.FC<AICommandBarProps> = ({ style = {} }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [showArchNote, setShowArchNote] = useState(false);
  const { state } = useKitchenState();

  const {
    processCommand,
    pendingAction,
    confirmPendingAction,
    cancelPendingAction,
    isProcessing,
    lastResponse,
    recentResponse
  } = useAIAgent();

  const isSubmitting = isProcessing || state.aiState === 'listening' || state.aiState === 'thinking' || state.aiState === 'working';
  const isError = state.aiState === 'error';
  const isEmpty = !inputQuery.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || isSubmitting) return;

    const query = inputQuery.trim();
    setInputQuery('');
    await processCommand(query);
  };

  const handleClear = () => {
    setInputQuery('');
  };

  const handleSelectCommand = async (command: string) => {
    if (isSubmitting) return;
    setInputQuery(command);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'success':
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: CheckCircle, label: 'Success' };
      case 'warning':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: AlertTriangle, label: 'Warning' };
      case 'error':
        return { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', icon: AlertTriangle, label: 'Error' };
      case 'confirmation_required':
        return { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', icon: ShieldAlert, label: 'Confirmation Required' };
      default:
        return { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', icon: HelpCircle, label: 'Info' };
    }
  };

  const currentRespMessage = lastResponse?.message || recentResponse?.message;
  const currentRespTimestamp = lastResponse?.timestamp || recentResponse?.timestamp;

  return (
    <div style={{ width: '100%', maxWidth: '740px', margin: '0 auto', ...style }}>
      {/* Action Confirmation Modal for Destructive/Large changes */}
      <AgentConfirmationModal
        pendingAction={pendingAction}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />

      {/* Controlled Input Command Form */}
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="AI Kitchen Operating System Command Bar"
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          borderRadius: '24px',
          background: 'rgba(15, 23, 42, 0.92)',
          border: isError
            ? '1.5px solid #f43f5e'
            : isSubmitting
            ? '1.5px solid var(--accent-violet)'
            : !isEmpty
            ? '1.5px solid var(--primary-cyan)'
            : '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: !isEmpty
            ? '0 8px 24px rgba(6, 182, 212, 0.25)'
            : '0 8px 24px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', color: isError ? '#f43f5e' : 'var(--primary-cyan)' }}>
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={22} color="var(--accent-violet)" />
          ) : (
            <Sparkles size={22} />
          )}
        </div>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder='Try "Add 2 kg rice", "What can I cook?", "Do I have milk?", "What is expiring?"...'
          disabled={isSubmitting}
          aria-label="Ask your kitchen OS anything"
          inputMode="text"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            fontFamily: 'inherit'
          }}
        />

        {/* Clear Button */}
        {!isEmpty && !isSubmitting && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear input"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Submit Send Button */}
        <button
          type="submit"
          disabled={isEmpty || isSubmitting}
          aria-label="Send AI command"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 42,
            height: 42,
            borderRadius: '50%',
            border: 'none',
            background: isEmpty || isSubmitting
              ? 'rgba(30, 41, 59, 0.6)'
              : 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            color: isEmpty || isSubmitting ? 'var(--text-dim)' : '#ffffff',
            cursor: isEmpty || isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isEmpty || isSubmitting ? 0.5 : 1,
            boxShadow: isEmpty || isSubmitting ? 'none' : '0 4px 14px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </form>

      {/* Development/Testing Command Helper Chips */}
      <AgentCommandHelper onSelectCommand={handleSelectCommand} disabled={isSubmitting} />

      {/* Real Structured AI Response Card */}
      {currentRespMessage && (
        <div
          className="glass-panel"
          style={{
            marginTop: '16px',
            padding: '16px 20px',
            borderRadius: '18px',
            background: 'rgba(15, 23, 42, 0.94)',
            borderLeft: `4px solid ${getStatusBadge(lastResponse?.status || 'info').color}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontWeight: 700, fontSize: '0.88rem' }}>
              <Bot size={18} /> Kitchen AI Agent Response
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {currentRespTimestamp}
            </span>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5, margin: '6px 0', whiteSpace: 'pre-line' }}>
            {currentRespMessage}
          </p>

          <div
            style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={14} color="var(--primary-cyan)" /> Module 5 NLP Agent Engine (Validated Action)
            </span>
            <button
              onClick={() => setShowArchNote(!showArchNote)}
              style={{
                fontSize: '0.73rem',
                color: 'var(--primary-cyan)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {showArchNote ? 'Hide NLP Debug Telemetry' : 'View Development Debug Panel'}
            </button>
          </div>

          {/* Development Debug Panel View (Requirement 24) */}
          {showArchNote && (
            <div
              style={{
                marginTop: '12px',
                padding: '14px 16px',
                background: 'rgba(8, 12, 20, 0.95)',
                borderRadius: '12px',
                fontSize: '0.8rem',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                lineHeight: 1.6,
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ color: 'var(--accent-violet)', fontWeight: 700, marginBottom: '4px' }}>
                === DEVELOPMENT NLP DEBUG PANEL ===
              </div>
              <div><strong>User Input:</strong> {lastResponse?.debugInfo?.userInput || 'N/A'}</div>
              <div><strong>Intent:</strong> <span style={{ color: 'var(--primary-cyan)' }}>{lastResponse?.intent || 'UNKNOWN'}</span></div>
              <div>
                <strong>Entities:</strong>{' '}
                <span style={{ color: 'var(--accent-amber)' }}>
                  {JSON.stringify(lastResponse?.debugInfo?.entities || {})}
                </span>
              </div>
              <div><strong>Validation:</strong> <span style={{ color: lastResponse?.debugInfo?.validation.passed ? '#10b981' : '#f43f5e' }}>{lastResponse?.debugInfo?.validation.passed ? 'PASS' : `FAIL (${lastResponse?.debugInfo?.validation.reason})`}</span></div>
              <div><strong>Action:</strong> {lastResponse?.intent || 'NONE'}</div>
              <div><strong>Result:</strong> <span style={{ color: '#10b981' }}>{lastResponse?.status?.toUpperCase() || 'SUCCESS'}</span></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

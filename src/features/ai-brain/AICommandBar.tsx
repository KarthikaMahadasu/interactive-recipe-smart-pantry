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
      {recentResponse && (
        <div
          className="glass-panel"
          style={{
            marginTop: '16px',
            padding: '16px 20px',
            borderRadius: '18px',
            background: 'rgba(15, 23, 42, 0.94)',
            borderLeft: `4px solid ${getStatusBadge(recentResponse.actionRequired ? 'success' : 'info').color}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontWeight: 700, fontSize: '0.88rem' }}>
              <Bot size={18} /> Kitchen AI Agent Response
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {recentResponse.timestamp}
            </span>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5, margin: '6px 0' }}>
            {recentResponse.message}
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
              <Info size={14} color="var(--primary-cyan)" /> Module 5 NLP Agent Engine (Validated Structured Action)
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
              {showArchNote ? 'Hide NLP Spec' : 'View NLP Pipeline Spec'}
            </button>
          </div>

          {showArchNote && (
            <div
              style={{
                marginTop: '8px',
                padding: '10px 12px',
                background: 'rgba(8, 12, 20, 0.8)',
                borderRadius: '10px',
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                lineHeight: 1.45,
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}
            >
              ⚡ <strong>5-Layer Architecture Active:</strong> User Input &rarr; Intent Detection &rarr; Entity Extraction &rarr; Unit Normalization &rarr; Validation & Confirmation &rarr; State Mutation. Zero fake AI responses.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

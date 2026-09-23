import React, { useState } from 'react';
import { Sparkles, Send, Bot, Info } from 'lucide-react';
import { useAIBrain } from '../../hooks/useAIBrain';

export const AICommandBar: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const { aiState, queryAI, recentResponse } = useAIBrain();
  const [showDevNotice, setShowDevNotice] = useState(false);

  const isBusy = aiState === 'thinking' || aiState === 'working' || aiState === 'listening';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isBusy) return;

    const query = inputQuery;
    setInputQuery('');
    await queryAI(query);
  };

  const handleSuggestionClick = (sampleQuery: string) => {
    setInputQuery(sampleQuery);
  };

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto' }}>
      {/* Floating Main Bar */}
      <form
        onSubmit={handleSubmit}
        className="glass-panel glass-panel-hover"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          borderRadius: '24px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-cyan)' }}>
          <Sparkles className="animate-pulse-glow" size={22} />
        </div>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask your kitchen anything... (e.g. 'What can I cook with Dragon Fruit and Paneer?')"
          disabled={isBusy}
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

        <button
          type="submit"
          disabled={!inputQuery.trim() || isBusy}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: inputQuery.trim() && !isBusy
              ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
              : 'rgba(30, 41, 59, 0.5)',
            color: '#fff',
            opacity: inputQuery.trim() && !isBusy ? 1 : 0.4,
            transition: 'all 0.2s ease'
          }}
        >
          <Send size={18} />
        </button>
      </form>

      {/* Suggested Quick Prompts */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '10px',
          justifyContent: 'center'
        }}
      >
        {['What can I cook?', 'Analyze my pantry freshness', 'Suggest substitutes for milk'].map(
          (prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(prompt)}
              disabled={isBusy}
              style={{
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: '16px',
                background: 'rgba(30, 41, 59, 0.4)',
                color: 'var(--text-muted)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-cyan)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              "{prompt}"
            </button>
          )
        )}
      </div>

      {/* AI Response Card Modal/Callout */}
      {recentResponse && (
        <div
          className="glass-panel"
          style={{
            marginTop: '16px',
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            borderLeft: '4px solid var(--primary-cyan)',
            animation: 'float 6s ease-in-out infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontWeight: 600, fontSize: '0.9rem' }}>
              <Bot size={18} /> AI Kitchen Assistant
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
              {recentResponse.timestamp}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {recentResponse.message}
          </p>

          <div
            style={{
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={14} color="var(--primary-cyan)" /> Module 1 AI Service Foundation
            </span>
            <button
              onClick={() => setShowDevNotice(!showDevNotice)}
              style={{
                fontSize: '0.75rem',
                color: 'var(--primary-cyan)',
                background: 'transparent',
                textDecoration: 'underline'
              }}
            >
              {showDevNotice ? 'Hide Architecture Note' : 'View AI Architecture Note'}
            </button>
          </div>

          {showDevNotice && (
            <div
              style={{
                marginTop: '8px',
                padding: '10px',
                background: 'rgba(8, 12, 20, 0.7)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4
              }}
            >
              💡 <strong>AI Foundation Architecture:</strong> The prompt was routed through 
              <code>AIService.processKitchenRequest()</code> using 
              <code>PromptBuilder</code> context injectors. Live API integration (Gemini / LLM backend) will hook directly into this service layer in future modules without altering UI components.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

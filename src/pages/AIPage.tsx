import React from 'react';
import { ArrowLeft, Sparkles, Bot, Clock, Utensils, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIBrainOrb } from '../features/ai-brain/AIBrainOrb';
import { useKitchenState } from '../state/KitchenContext';
import { AICommandBar } from '../features/ai-brain/AICommandBar';
import { AIBrainStatePicker } from '../features/ai-brain/AIBrainStatePicker';
import { useAIBrain } from '../hooks/useAIBrain';

export const AIPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useKitchenState();
  const { aiState, changeState, queryAI } = useAIBrain();

  const handleQuickPrompt = (prompt: string) => {
    queryAI(prompt);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(30, 41, 59, 0.6)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-violet)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Module 5 &bull; Agentic AI Core
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Central AI Workspace & Chat</h1>
          </div>
        </div>

        <AIBrainStatePicker currentState={aiState} onStateChange={changeState} />
      </div>

      {/* AI Workspace Hero Center */}
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          borderRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.18) 0%, rgba(15, 23, 42, 0.95) 75%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)'
        }}
      >
        <AIBrainOrb state={aiState} size={200} />

        <div style={{ textAlign: 'center', maxWidth: '520px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
            Neural Kitchen Intelligence Core
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Connected to your active pantry ({state.pantry.length} items) and recipe collection. Ask any question or request meal plans.
          </p>
        </div>

        <AICommandBar />
      </div>

      {/* Quick Action Prompt Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <button
          onClick={() => handleQuickPrompt('Suggest a quick 15-minute dinner using my active pantry items')}
          className="glass-panel glass-panel-hover"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          <Utensils size={24} color="var(--primary-cyan)" />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Quick Dinner Idea</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Using current pantry items</div>
          </div>
        </button>

        <button
          onClick={() => handleQuickPrompt('Which of my pantry ingredients expire soon and how can I save them?')}
          className="glass-panel glass-panel-hover"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          <AlertTriangle size={24} color="var(--accent-amber)" />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Zero-Waste Scan</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Check expiring stock</div>
          </div>
        </button>

        <button
          onClick={() => handleQuickPrompt('Create a 3-day high-protein vegetarian meal plan')}
          className="glass-panel glass-panel-hover"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={24} color="var(--accent-violet)" />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>3-Day Meal Plan</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High protein focus</div>
          </div>
        </button>
      </div>

      {/* AI History Conversation Log */}
      {state.aiHistory.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--primary-cyan)" /> AI Conversation History
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {state.aiHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 18px',
                  borderRadius: '16px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderLeft: '4px solid var(--accent-violet)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bot size={16} /> Kitchen AI Response
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{item.timestamp}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

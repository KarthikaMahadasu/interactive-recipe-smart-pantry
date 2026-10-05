import React from 'react';
import { ArrowLeft, Sparkles, Bot, Clock, Utensils, AlertTriangle, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIBrainOrb } from '../features/ai-brain/AIBrainOrb';
import { useKitchenState } from '../state/KitchenContext';
import { useAuth } from '../contexts/AuthContext';
import { AICommandBar } from '../features/ai-brain/AICommandBar';
import { AIBrainStatePicker } from '../features/ai-brain/AIBrainStatePicker';
import { useAIAgent } from '../features/ai-agent/hooks/useAIAgent';

export const AIPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setAIState } = useKitchenState();
  const { restaurant } = useAuth();
  const { processCommand } = useAIAgent();

  const handleQuickPrompt = (prompt: string) => {
    processCommand(prompt);
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
              background: '#f1f5f9',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid #e2e8f0'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={14} /> {restaurant?.name} &bull; Restaurant AI Agent
            </div>
            <h1 style={{ fontSize: '1.6rem', color: '#ea580c', fontWeight: 800 }}>Central AI Workspace & Kitchen OS Agent</h1>
          </div>
        </div>

        <AIBrainStatePicker currentState={state.aiState} onStateChange={setAIState} />
      </div>

      {/* AI Workspace Hero Center */}
      <div
        className="glass-panel"
        style={{
          padding: '36px 24px',
          borderRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          background: 'radial-gradient(circle at center, rgba(234, 88, 12, 0.06) 0%, #ffffff 80%)',
          border: '1px solid #ffedd5',
          boxShadow: '0 8px 30px rgba(234, 88, 12, 0.06)'
        }}
      >
        <AIBrainOrb state={state.aiState} size={200} />

        <div style={{ textAlign: 'center', maxWidth: '560px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#ea580c', fontWeight: 800 }}>
            {restaurant?.name} Neural Kitchen Agent
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            Connected to shared restaurant inventory for <strong style={{ color: '#0f172a' }}>{restaurant?.name}</strong>. Speak or type commands below.
          </p>
        </div>

        <AICommandBar />
      </div>

      {/* Quick Action Prompt Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <button
          onClick={() => handleQuickPrompt('What can we cook with what we have?')}
          className="glass-panel glass-panel-hover"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
            cursor: 'pointer',
            background: '#ffffff',
            border: '1px solid #e2e8f0'
          }}
        >
          <Utensils size={24} color="#ea580c" />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Discover Cookable Recipes</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Check current restaurant stock matches</div>
          </div>
        </button>

        <button
          onClick={() => handleQuickPrompt('What is expiring soon?')}
          className="glass-panel glass-panel-hover"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
            cursor: 'pointer',
            background: '#ffffff',
            border: '1px solid #e2e8f0'
          }}
        >
          <AlertTriangle size={24} color="#f59e0b" />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Zero-Waste Scan</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Check expiring stock items</div>
          </div>
        </button>

        <button
          onClick={() => handleQuickPrompt('What can I use instead of milk?')}
          className="glass-panel glass-panel-hover"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
            cursor: 'pointer',
            background: '#ffffff',
            border: '1px solid #e2e8f0'
          }}
        >
          <Sparkles size={24} color="#ea580c" />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Ingredient Substitutions</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Smart culinary alternatives</div>
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
            gap: '16px',
            background: '#ffffff',
            border: '1px solid #e2e8f0'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', color: '#ea580c', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#ea580c" /> AI Agent Conversation History ({restaurant?.name})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {state.aiHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 18px',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  borderLeft: '4px solid #ea580c',
                  borderTop: '1px solid #e2e8f0',
                  borderRight: '1px solid #e2e8f0',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bot size={16} /> Kitchen OS Response
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.timestamp}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
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

import React from 'react';
import { Package, Utensils, Sparkles, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WelcomeBannerProps {
  onAskAIClick: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onAskAIClick }) => {
  const navigate = useNavigate();

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px 30px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.75) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div>
        <div
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--primary-cyan)',
            marginBottom: '4px'
          }}
        >
          AI Kitchen World &bull; Module 1 Foundation
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '6px'
          }}
        >
          Welcome to your <span className="gradient-text">AI Kitchen</span>
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '640px' }}>
          What would you like to do? Interact with your spatial kitchen environment or trigger AI assistant tasks below.
        </p>
      </div>

      {/* Quick Actions Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => navigate('/pantry')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.88rem',
            boxShadow: '0 4px 14px rgba(6, 182, 212, 0.4)',
            transition: 'transform 0.2s ease, boxShadow 0.2s ease'
          }}
          className="glass-panel-hover"
        >
          <Package size={18} /> Explore My Pantry
        </button>

        <button
          onClick={() => navigate('/recipes')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '16px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: '0.88rem',
            transition: 'all 0.2s ease'
          }}
          className="glass-panel-hover"
        >
          <Utensils size={18} color="var(--accent-amber)" /> Discover Recipes
        </button>

        <button
          onClick={onAskAIClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '16px',
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            color: '#c084fc',
            fontWeight: 600,
            fontSize: '0.88rem',
            transition: 'all 0.2s ease'
          }}
          className="glass-panel-hover"
        >
          <Sparkles size={18} /> Ask Pantry AI
        </button>

        <button
          onClick={() => navigate('/grocery')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '16px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: '0.88rem',
            transition: 'all 0.2s ease'
          }}
          className="glass-panel-hover"
        >
          <ShoppingBag size={18} color="var(--accent-emerald)" /> Open Grocery
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Utensils, Sparkles, ShoppingBag } from 'lucide-react';

interface QuickActionsBarProps {
  style?: React.CSSProperties;
}

/**
 * Integrated quick actions control bar for fast spatial navigation
 */
export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ style = {} }) => {
  const navigate = useNavigate();

  const ACTIONS = [
    { label: 'Explore My Pantry', route: '/pantry', icon: Package, color: 'var(--primary-cyan)', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)' },
    { label: 'Discover Recipes', route: '/recipes', icon: Utensils, color: 'var(--accent-amber)', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' },
    { label: 'Ask Pantry AI', route: '/ai', icon: Sparkles, color: '#a78bfa', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)' },
    { label: 'Open Grocery', route: '/grocery', icon: ShoppingBag, color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)' }
  ];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '14px 20px',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        ...style
      }}
    >
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>
        Quick Access:
      </div>

      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => navigate(action.route)}
            style={{
              padding: '8px 16px',
              borderRadius: '14px',
              background: action.bg,
              border: `1px solid ${action.border}`,
              color: action.color,
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, background 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Icon size={16} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
};

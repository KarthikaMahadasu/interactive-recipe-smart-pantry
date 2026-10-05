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
    { label: 'Explore My Pantry', route: '/pantry', icon: Package, color: '#ea580c', bg: 'rgba(234, 88, 12, 0.1)', border: 'rgba(234, 88, 12, 0.3)' },
    { label: 'Discover Recipes', route: '/recipes', icon: Utensils, color: '#d97706', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' },
    { label: 'Ask Pantry AI', route: '/ai', icon: Sparkles, color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)' },
    { label: 'Open Grocery', route: '/grocery', icon: ShoppingBag, color: '#059669', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' }
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
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
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

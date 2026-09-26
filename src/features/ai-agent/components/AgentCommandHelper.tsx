import React, { useState } from 'react';
import { Package, Utensils, CheckCircle2, Clock, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface AgentCommandHelperProps {
  onSelectCommand: (command: string) => void;
  disabled?: boolean;
}

export const AgentCommandHelper: React.FC<AgentCommandHelperProps> = ({
  onSelectCommand,
  disabled = false
}) => {
  const [activeCategory, setActiveCategory] = useState<'pantry' | 'recipes' | 'availability' | 'expiry' | 'substitution'>('pantry');
  const [isExpanded, setIsExpanded] = useState(false);

  const commandCategories = [
    {
      id: 'pantry',
      label: 'Pantry Commands',
      icon: Package,
      commands: [
        'Add 2 kg rice',
        'Add 5 apples',
        'Remove 500 g rice',
        'How much rice do I have?',
        'Show my pantry',
        'Add 3 dragon fruits'
      ]
    },
    {
      id: 'recipes',
      label: 'Recipe Discovery',
      icon: Utensils,
      commands: [
        'What can I cook?',
        'Find recipes using paneer',
        'What recipes can I make with my pantry?'
      ]
    },
    {
      id: 'availability',
      label: 'Availability & Missing',
      icon: CheckCircle2,
      commands: [
        'Do I have enough rice?',
        'What am I missing for paneer curry?'
      ]
    },
    {
      id: 'expiry',
      label: 'Expiry Scans',
      icon: Clock,
      commands: [
        'What is expiring soon?',
        'Which ingredients should I use first?'
      ]
    },
    {
      id: 'substitution',
      label: 'Substitutions',
      icon: RefreshCw,
      commands: [
        'What can I use instead of milk?',
        'Can I substitute butter?'
      ]
    }
  ] as const;

  const currentCategory = commandCategories.find((c) => c.id === activeCategory) || commandCategories[0];

  return (
    <div style={{ marginTop: '12px', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}
      >
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-violet)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          AI Test Commands & Shortcuts ({commandCategories.length} Categories)
        </button>
      </div>

      {isExpanded && (
        <div
          className="glass-panel"
          style={{
            padding: '12px 16px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Category Selector Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {commandCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.74rem',
                    padding: '5px 11px',
                    borderRadius: '12px',
                    background: isActive ? 'var(--accent-violet)' : 'rgba(30, 41, 59, 0.6)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={12} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Chips grid for current category */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {currentCategory.commands.map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectCommand(cmd)}
                disabled={disabled}
                style={{
                  fontSize: '0.78rem',
                  padding: '6px 12px',
                  borderRadius: '14px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: 'var(--primary-cyan)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                "{cmd}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

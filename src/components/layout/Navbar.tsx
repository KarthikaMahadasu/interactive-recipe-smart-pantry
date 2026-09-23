import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Utensils, Flame, Sparkles, ShoppingBag, Settings, Menu, X } from 'lucide-react';
import { useKitchenState } from '../../state/KitchenContext';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/pantry', label: 'Pantry', icon: Package },
  { path: '/recipes', label: 'Recipes', icon: Utensils },
  { path: '/cooking', label: 'Cooking', icon: Flame },
  { path: '/ai', label: 'AI Core', icon: Sparkles },
  { path: '/grocery', label: 'Grocery', icon: ShoppingBag },
  { path: '/settings', label: 'Settings', icon: Settings }
];

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state } = useKitchenState();

  return (
    <header
      style={{
        position: 'sticky',
        top: 16,
        zIndex: 50,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px'
      }}
    >
      <nav
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderRadius: '24px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Brand Logo */}
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--text-main)'
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.5)'
            }}
          >
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.1 }}>
              Digital Kitchen <span style={{ color: 'var(--primary-cyan)', fontSize: '0.75rem' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
              SMART PANTRY MANAGER
            </div>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '6px' }} className="desktop-nav-links">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => (isActive ? 'active-nav-item' : 'nav-item')}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary-cyan)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(6, 182, 212, 0.3)' : 'transparent'}`,
                  transition: 'all 0.2s ease'
                })}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* AI State Pill Indicator */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <div
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: state.aiState === 'idle' ? '#06b6d4' : state.aiState === 'thinking' ? '#f59e0b' : '#10b981',
                boxShadow: '0 0 8px currentColor'
              }}
            />
            <span style={{ textTransform: 'capitalize' }}>AI: {state.aiState}</span>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-nav-toggle"
            style={{
              background: 'transparent',
              color: 'var(--text-main)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div
          className="glass-panel"
          style={{
            marginTop: '8px',
            padding: '16px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.95)'
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary-cyan)' : 'var(--text-main)',
                  background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.4)'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* Responsive Inline CSS for Navbar */}
      <style>{`
        @media (min-width: 840px) {
          .desktop-nav-links { display: flex !important; }
          .mobile-nav-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

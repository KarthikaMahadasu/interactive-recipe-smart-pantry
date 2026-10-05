import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Utensils, Flame, Sparkles, ShoppingBag, Settings, Menu, X, Users, LogOut, Building2 } from 'lucide-react';
import { useKitchenState } from '../../state/KitchenContext';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleBadgeConfig } from '../../utils/permissions';

const NAV_ITEMS = [
  { path: '/', label: 'Workspace', icon: Home },
  { path: '/pantry', label: 'Inventory', icon: Package },
  { path: '/recipes', label: 'Recipes', icon: Utensils },
  { path: '/cooking', label: 'Cooking', icon: Flame },
  { path: '/ai', label: 'AI Core', icon: Sparkles },
  { path: '/staff', label: 'Staff', icon: Users },
  { path: '/grocery', label: 'Grocery', icon: ShoppingBag },
  { path: '/settings', label: 'Settings', icon: Settings }
];

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state } = useKitchenState();
  const { user, restaurant, signOut } = useAuth();

  const roleConfig = user ? getRoleBadgeConfig(user.role) : null;

  return (
    <header
      style={{
        position: 'sticky',
        top: 16,
        zIndex: 50,
        width: '100%',
        maxWidth: '1240px',
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
          padding: '12px 24px',
          borderRadius: '24px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)'
        }}
      >
        {/* Brand Logo & Restaurant Workspace Badge */}
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'var(--text-main)'
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(234, 88, 12, 0.35)'
            }}
          >
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c' }}>
              <span>{restaurant?.name || 'Intelligent Kitchen'}</span>
              <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '8px', background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.3)' }}>
                {restaurant?.type || 'Workspace'}
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Building2 size={10} /> ID: {restaurant?.id || 'rest_default'}
            </div>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '4px' }} className="desktop-nav-links">
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
                  padding: '8px 12px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#ea580c' : '#334155',
                  background: isActive ? 'rgba(234, 88, 12, 0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(234, 88, 12, 0.3)' : 'transparent'}`,
                  transition: 'all 0.2s ease'
                })}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Info & AI Pill Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* User Profile Badge */}
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div style={{ textAlign: 'right', display: 'none' }} className="user-text-info">
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
                  {user.name}
                </div>
                {roleConfig && (
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: roleConfig.color }}>
                    {roleConfig.label}
                  </div>
                )}
              </div>

              {roleConfig && (
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: roleConfig.color,
                    background: roleConfig.bg,
                    border: `1px solid ${roleConfig.border}`
                  }}
                >
                  {roleConfig.label}
                </span>
              )}

              <button
                onClick={signOut}
                title="Sign out of workspace"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={16} color="#ef4444" />
              </button>
            </div>
          )}

          {/* AI State Pill */}
          <div
            style={{
              padding: '4px 10px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              fontSize: '0.72rem',
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
                background: state.aiState === 'idle' ? '#ea580c' : state.aiState === 'thinking' ? '#f59e0b' : '#10b981',
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
              color: '#ea580c',
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
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          {user && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{user.email}</div>
              </div>
              <button
                onClick={signOut}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#dc2626',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          )}

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
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ea580c' : '#334155',
                  background: isActive ? 'rgba(234, 88, 12, 0.12)' : 'rgba(241, 245, 249, 0.6)'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Mobile Quick Navigation Bar */}
      <nav
        className="mobile-bottom-bar"
        style={{
          position: 'fixed',
          bottom: 12,
          left: 12,
          right: 12,
          zIndex: 90,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #cbd5e1',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 6px'
        }}
      >
        {NAV_ITEMS.slice(0, 6).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '6px 8px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '0.68rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ea580c' : '#64748b',
                background: isActive ? 'rgba(234, 88, 12, 0.12)' : 'transparent',
                transition: 'all 0.2s ease'
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Responsive Inline CSS for Navbar */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-links { display: flex !important; }
          .mobile-nav-toggle { display: none !important; }
          .user-text-info { display: block !important; }
          .mobile-bottom-bar { display: none !important; }
        }
        @media (max-width: 899px) {
          .mobile-bottom-bar { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

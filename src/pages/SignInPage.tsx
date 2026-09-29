import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, LogIn, UserCheck, Shield, ChefHat, PackageCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      await signIn(demoEmail, 'password123');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: '#090d16'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px 32px',
          borderRadius: '28px',
          background: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Back Link to Welcome */}
        <div style={{ marginBottom: '16px' }}>
          <Link
            to="/welcome"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> Back to Welcome Home
          </Link>
        </div>

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(56, 189, 248, 0.4)',
              marginBottom: '12px'
            }}
          >
            <Sparkles size={28} color="#fff" />
          </div>
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#f9fafb',
              letterSpacing: '-0.02em'
            }}
          >
            Sign In to Workspace
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#9ca3af', marginTop: '4px' }}>
            Access your shared Intelligent Kitchen Management System
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.18)',
              border: '1.5px solid #ef4444',
              color: '#fca5a5',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={20} color="#ef4444" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#f9fafb', marginBottom: '6px' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@spicegarden.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                background: '#1f2937',
                border: '1.5px solid #374151',
                color: '#f9fafb',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#f9fafb', marginBottom: '6px' }}>
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                background: '#1f2937',
                border: '1.5px solid #374151',
                color: '#f9fafb',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              fontFamily: 'var(--font-heading)',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(56, 189, 248, 0.35)'
            }}
          >
            <LogIn size={20} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', textAlign: 'center', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Demo Workspace Logins:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner@spicegarden.com')}
              style={{
                padding: '10px 12px',
                borderRadius: '14px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#fda4af',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <UserCheck size={16} /> Owner (Tejaswi)
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('manager@spicegarden.com')}
              style={{
                padding: '10px 12px',
                borderRadius: '14px',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#e9d5ff',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Shield size={16} /> Manager (Rahul)
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('chef@spicegarden.com')}
              style={{
                padding: '10px 12px',
                borderRadius: '14px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fef08a',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <ChefHat size={16} /> Chef (Priya)
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('inventory@spicegarden.com')}
              style={{
                padding: '10px 12px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#a7f3d0',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <PackageCheck size={16} /> Staff (Arun)
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.88rem', color: '#9ca3af' }}>
          Don't have a workspace?{' '}
          <Link to="/signup" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'underline' }}>
            Register Restaurant
          </Link>
        </div>
      </div>
    </div>
  );
};

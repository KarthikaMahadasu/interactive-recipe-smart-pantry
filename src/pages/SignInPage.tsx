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
        background: '#f8fafc'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px 32px',
          borderRadius: '28px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.06)'
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
              color: '#ea580c',
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
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(234, 88, 12, 0.35)',
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
              color: '#ea580c',
              letterSpacing: '-0.02em'
            }}
          >
            Sign In to Workspace
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Access your shared Intelligent Kitchen Management System
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1.5px solid #ef4444',
              color: '#dc2626',
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
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
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
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
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
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                color: '#0f172a',
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
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
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
              boxShadow: '0 6px 20px rgba(234, 88, 12, 0.3)'
            }}
          >
            <LogIn size={20} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ea580c', textAlign: 'center', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Demo Workspace Logins:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner@spicegarden.com')}
              style={{
                padding: '10px 12px',
                borderRadius: '14px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#dc2626',
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
                background: 'rgba(234, 88, 12, 0.1)',
                border: '1px solid rgba(234, 88, 12, 0.3)',
                color: '#ea580c',
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
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#d97706',
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
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#059669',
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
        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.88rem', color: '#64748b' }}>
          Don't have a workspace?{' '}
          <Link to="/signup" style={{ color: '#ea580c', fontWeight: 700, textDecoration: 'underline' }}>
            Register Restaurant
          </Link>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, User, Mail, Phone, Lock, MapPin, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const RESTAURANT_TYPES = [
  'Restaurant',
  'Cafe',
  'Bakery',
  'Hotel',
  'Cloud Kitchen',
  'Catering',
  'Other'
];

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    restaurantType: 'Restaurant',
    customType: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check form details.');
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
        padding: '36px 16px',
        background: '#f8fafc'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '40px 36px',
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

        {/* Title Header */}
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
              boxShadow: '0 0 24px rgba(234, 88, 12, 0.3)',
              marginBottom: '12px'
            }}
          >
            <Building2 size={28} color="#fff" />
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
            Register Restaurant Workspace
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Transform your business into an AI-Powered Intelligent Kitchen
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '16px',
              background: '#fef2f2',
              border: '1.5px solid #ef4444',
              color: '#991b1b',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px'
            }}
          >
            <AlertCircle size={20} color="#ef4444" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Two-Column Form Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* Restaurant Name */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                <Building2 size={15} color="#ea580c" /> Restaurant / Business Name *
              </label>
              <input
                type="text"
                name="restaurantName"
                required
                value={formData.restaurantName}
                onChange={handleChange}
                placeholder="e.g. Royal Spice Bistro"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Restaurant Type */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                Restaurant Type *
              </label>
              <select
                name="restaurantType"
                value={formData.restaurantType}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              >
                {RESTAURANT_TYPES.map((type) => (
                  <option key={type} value={type} style={{ background: '#ffffff', color: '#0f172a' }}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Type field if 'Other' selected */}
          {formData.restaurantType === 'Other' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                Specify Custom Restaurant Type *
              </label>
              <input
                type="text"
                name="customType"
                required
                value={formData.customType}
                onChange={handleChange}
                placeholder="e.g. Food Truck, Microbrewery..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* Two-Column Form Layout: Owner & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                <User size={15} color="#ea580c" /> Owner / Manager Full Name *
              </label>
              <input
                type="text"
                name="ownerName"
                required
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="e.g. Alexander Vance"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                <Mail size={15} color="#ea580c" /> Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="owner@restaurant.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Phone & Address */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                <Phone size={15} color="#ea580c" /> Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 987-6543"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                <MapPin size={15} color="#ea580c" /> Restaurant Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Gourmet St, City, State"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                <Lock size={15} color="#ef4444" /> Password *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                <Lock size={15} color="#ef4444" /> Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '12px',
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
            <span>{loading ? 'Creating Workspace...' : 'Create Restaurant Workspace'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.88rem', color: '#64748b' }}>
          Already registered?{' '}
          <Link to="/signin" style={{ color: '#ea580c', fontWeight: 700, textDecoration: 'underline' }}>
            Sign In to Workspace
          </Link>
        </div>
      </div>
    </div>
  );
};




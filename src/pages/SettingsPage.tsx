import React from 'react';
import { ArrowLeft, Sliders, Volume2, ShieldCheck, Layers, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKitchenState } from '../state/KitchenContext';

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Keto',
  'Low-Carb',
  'Halal'
];

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updatePreferences, dispatch } = useKitchenState();

  const toggleDiet = (diet: string) => {
    const current = state.userPreferences.dietaryRestrictions;
    const exists = current.includes(diet);
    const updated = exists ? current.filter((d) => d !== diet) : [...current, diet];
    updatePreferences({ dietaryRestrictions: updated });
  };

  const toggle3D = () => {
    dispatch({ type: 'TOGGLE_SPATIAL_3D', payload: !state.userPreferences.spatial3dEnabled });
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
          gap: '16px'
        }}
      >
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
          <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Module 7 &bull; Personalization
          </div>
          <h1 style={{ fontSize: '1.6rem', color: '#ea580c', fontWeight: 800 }}>Kitchen Settings & Preferences</h1>
        </div>
      </div>

      {/* Dietary Restrictions Card */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: 800, fontSize: '0.95rem' }}>
          <ShieldCheck size={20} color="#ea580c" /> Household Dietary Restrictions
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Selected restrictions will automatically filter recipe recommendations and AI recipe synthesis.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {DIETARY_OPTIONS.map((diet) => {
            const active = state.userPreferences.dietaryRestrictions.includes(diet);
            return (
              <button
                key={diet}
                onClick={() => toggleDiet(diet)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '14px',
                  border: active ? '1.5px solid #ea580c' : '1px solid #cbd5e1',
                  background: active ? '#fff7ed' : '#ffffff',
                  color: active ? '#ea580c' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {active ? '✓ ' : '+ '} {diet}
              </button>
            );
          })}
        </div>
      </div>

      {/* Viewport & Audio Settings */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: '#ffffff',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: 800, fontSize: '0.95rem' }}>
          <Sliders size={20} color="#ea580c" /> System & Viewport Preferences
        </div>

        {/* 3D Canvas Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Layers size={22} color="#ea580c" />
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                3D Spatial Kitchen Viewport
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                Enable WebGL 3D spatial viewport or use lightweight 2.5D deck mode.
              </div>
            </div>
          </div>
          <button
            onClick={toggle3D}
            style={{
              padding: '8px 18px',
              borderRadius: '14px',
              background: state.userPreferences.spatial3dEnabled ? 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' : '#ffffff',
              border: state.userPreferences.spatial3dEnabled ? 'none' : '1px solid #cbd5e1',
              color: state.userPreferences.spatial3dEnabled ? '#ffffff' : '#0f172a',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {state.userPreferences.spatial3dEnabled ? '3D Active' : '2.5D Active'}
          </button>
        </div>

        {/* Unit System Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={22} color="#ea580c" />
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                Unit System
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                Display ingredient weights in Metric (grams/kg) or Imperial (oz/lb).
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => updatePreferences({ unitSystem: 'metric' })}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: state.userPreferences.unitSystem === 'metric' ? '#ea580c' : 'transparent',
                color: state.userPreferences.unitSystem === 'metric' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Metric (g/kg)
            </button>
            <button
              onClick={() => updatePreferences({ unitSystem: 'imperial' })}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: state.userPreferences.unitSystem === 'imperial' ? '#ea580c' : 'transparent',
                color: state.userPreferences.unitSystem === 'imperial' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Imperial (oz/lb)
            </button>
          </div>
        </div>

        {/* Voice Guidance Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Volume2 size={22} color="#ea580c" />
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                Voice Guidance & Timer Audio
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                Read cooking steps aloud and play audio chimes upon timer completion.
              </div>
            </div>
          </div>
          <button
            onClick={() => updatePreferences({ voiceGuidanceEnabled: !state.userPreferences.voiceGuidanceEnabled })}
            style={{
              padding: '8px 18px',
              borderRadius: '14px',
              background: state.userPreferences.voiceGuidanceEnabled ? 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' : '#ffffff',
              border: state.userPreferences.voiceGuidanceEnabled ? 'none' : '1px solid #cbd5e1',
              color: state.userPreferences.voiceGuidanceEnabled ? '#ffffff' : '#0f172a',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {state.userPreferences.voiceGuidanceEnabled ? 'Voice ON' : 'Voice OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};

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
            background: 'rgba(30, 41, 59, 0.6)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Module 7 &bull; Personalization
          </div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Kitchen Settings & Preferences</h1>
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
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.95rem' }}>
          <ShieldCheck size={20} /> Household Dietary Restrictions
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
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
                  border: active ? '1px solid var(--accent-emerald)' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: active ? 'rgba(16, 185, 129, 0.18)' : 'rgba(30, 41, 59, 0.5)',
                  color: active ? '#34d399' : 'var(--text-muted)',
                  fontWeight: 600,
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
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontWeight: 700, fontSize: '0.95rem' }}>
          <Sliders size={20} /> System & Viewport Preferences
        </div>

        {/* 3D Canvas Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Layers size={22} color="var(--primary-cyan)" />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                3D Spatial Kitchen Viewport
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Enable WebGL 3D spatial viewport or use lightweight 2.5D deck mode.
              </div>
            </div>
          </div>
          <button
            onClick={toggle3D}
            style={{
              padding: '8px 18px',
              borderRadius: '14px',
              background: state.userPreferences.spatial3dEnabled ? 'var(--primary-cyan)' : 'rgba(30, 41, 59, 0.8)',
              color: state.userPreferences.spatial3dEnabled ? '#000' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {state.userPreferences.spatial3dEnabled ? '3D Active' : '2.5D Active'}
          </button>
        </div>

        {/* Unit System Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={22} color="var(--accent-amber)" />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                Unit System
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Display ingredient weights in Metric (grams/kg) or Imperial (oz/lb).
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(30, 41, 59, 0.8)', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => updatePreferences({ unitSystem: 'metric' })}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: state.userPreferences.unitSystem === 'metric' ? 'var(--accent-amber)' : 'transparent',
                color: state.userPreferences.unitSystem === 'metric' ? '#000' : 'var(--text-muted)',
                fontWeight: 600,
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
                background: state.userPreferences.unitSystem === 'imperial' ? 'var(--accent-amber)' : 'transparent',
                color: state.userPreferences.unitSystem === 'imperial' ? '#000' : 'var(--text-muted)',
                fontWeight: 600,
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
            <Volume2 size={22} color="var(--accent-rose)" />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                Voice Guidance & Timer Audio
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Read cooking steps aloud and play audio chimes upon timer completion.
              </div>
            </div>
          </div>
          <button
            onClick={() => updatePreferences({ voiceGuidanceEnabled: !state.userPreferences.voiceGuidanceEnabled })}
            style={{
              padding: '8px 18px',
              borderRadius: '14px',
              background: state.userPreferences.voiceGuidanceEnabled ? 'var(--accent-rose)' : 'rgba(30, 41, 59, 0.8)',
              color: state.userPreferences.voiceGuidanceEnabled ? '#fff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
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

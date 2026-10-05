import React, { useState } from 'react';
import { Compass, Play, ChevronDown, ChevronUp, Layers, MapPin } from 'lucide-react';
import type { SpatialAnchorId } from '../types/spatial';
import { SPATIAL_ANCHORS } from './SpatialAnchor';
import { useSpatialMotion } from '../hooks/useSpatialMotion';
import { IngredientVisual } from './IngredientVisual';
import type { Ingredient } from '../types/ingredient';

// Isolated developer demo test ingredients
const DEMO_TEST_INGREDIENTS: Ingredient[] = [
  {
    id: 'demo_ing_dragonfruit',
    name: 'Dragon Fruit',
    category: 'produce',
    quantity: 2,
    unit: 'pcs',
    freshness: 'fresh',
    colorCode: '#ec4899',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo_ing_paneer',
    name: 'Artisanal Paneer',
    category: 'dairy',
    quantity: 400,
    unit: 'g',
    freshness: 'fresh',
    colorCode: '#38bdf8',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo_ing_avocado',
    name: 'Hass Avocado',
    category: 'produce',
    quantity: 3,
    unit: 'pcs',
    freshness: 'expiring_soon',
    colorCode: '#84cc16',
    createdAt: new Date().toISOString()
  }
];

export const DevSpatialTestbed: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAnchor, setSelectedAnchor] = useState<SpatialAnchorId>('AIAnchor');
  const [activeTestPath, setActiveTestPath] = useState<string | null>(null);

  const { motionState, startMotion } = useSpatialMotion();

  const handleTestMotion = (start: SpatialAnchorId, dest: SpatialAnchorId) => {
    setActiveTestPath(`${start} → ${dest}`);
    startMotion({
      start,
      destination: dest,
      duration: 1600,
      onComplete: () => {
        setTimeout(() => setActiveTestPath(null), 1000);
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'relative',
        zIndex: 30
      }}
    >
      {/* Dev Spatial Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '6px 14px',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          color: '#ea580c',
          fontSize: '0.78rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease'
        }}
        title="Toggle Spatial Engine Developer Testbed"
      >
        <Compass size={14} color="#ea580c" />
        <span>Spatial Engine Testbed</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Expanded Dev Panel */}
      {isExpanded && (
        <div
          className="glass-panel"
          style={{
            marginTop: '10px',
            padding: '18px 22px',
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
            width: '380px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontWeight: 700, fontSize: '0.82rem' }}>
              <Compass size={16} /> Spatial Anchors & Motion Foundation
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                padding: '2px 8px',
                borderRadius: '8px',
                background: 'rgba(234, 88, 12, 0.12)',
                color: '#ea580c',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              Dev Test Mode
            </span>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', lineHeight: 1.35 }}>
            Isolated development testbed for inspecting spatial anchors and simulating trajectory paths.
          </p>

          {/* Spatial Anchor Picker */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} color="#ea580c" /> Spatial Anchors
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {Object.keys(SPATIAL_ANCHORS).map((key) => {
                const anchorId = key as SpatialAnchorId;
                const isSel = selectedAnchor === anchorId;
                return (
                  <button
                    key={anchorId}
                    onClick={() => setSelectedAnchor(anchorId)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '10px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      background: isSel ? 'rgba(234, 88, 12, 0.15)' : '#f8fafc',
                      color: isSel ? '#ea580c' : '#475569',
                      border: `1px solid ${isSel ? '#ea580c' : '#e2e8f0'}`,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {anchorId}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Motion Trajectory Buttons */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Play size={12} color="#10b981" /> Motion Path Trajectories
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={() => handleTestMotion('PantryAnchor', 'AIAnchor')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  background: '#f8fafc',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>PantryAnchor &rarr; AIAnchor</span>
                <span style={{ fontSize: '0.65rem', color: '#ea580c' }}>Simulate</span>
              </button>

              <button
                onClick={() => handleTestMotion('AIAnchor', 'CookingAnchor')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  background: '#f8fafc',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>AIAnchor &rarr; CookingAnchor</span>
                <span style={{ fontSize: '0.65rem', color: '#ea580c' }}>Simulate</span>
              </button>

              <button
                onClick={() => handleTestMotion('AIAnchor', 'GroceryAnchor')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  background: '#f8fafc',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>AIAnchor &rarr; GroceryAnchor</span>
                <span style={{ fontSize: '0.65rem', color: '#d97706' }}>Future Anchor</span>
              </button>
            </div>

            {motionState.isAnimating && activeTestPath && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: 'rgba(234, 88, 12, 0.12)',
                  border: '1px solid rgba(234, 88, 12, 0.3)',
                  fontSize: '0.7rem',
                  color: '#ea580c',
                  fontWeight: 600
                }}
              >
                Animating {activeTestPath}: {Math.round(motionState.progress * 100)}%
              </div>
            )}
          </div>

          {/* Dynamic Ingredient Test visuals */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={12} color="#ea580c" /> Dynamic Test Ingredients
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {DEMO_TEST_INGREDIENTS.map((ing) => (
                <IngredientVisual key={ing.id} ingredient={ing} size="sm" showBadge={false} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

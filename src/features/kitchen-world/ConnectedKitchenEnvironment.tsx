import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, Box } from 'lucide-react';
import type { KitchenZone } from '../../types/kitchen';
import { PantryZone } from './zones/PantryZone';
import { RefrigeratorZone } from './zones/RefrigeratorZone';
import { CookingZone } from './zones/CookingZone';
import { PreparationZone } from './zones/PreparationZone';
import { ServingZone } from './zones/ServingZone';
import { AIWorkspaceZone } from './zones/AIWorkspaceZone';
import { QuickActionsBar } from './QuickActionsBar';
import { SpatialCanvas } from '../../spatial/SpatialCanvas';
import { ZoneDetailModal } from './ZoneDetailModal';

interface ConnectedKitchenEnvironmentProps {
  onZoneClick?: (zone: KitchenZone) => void;
}

export const ConnectedKitchenEnvironment: React.FC<ConnectedKitchenEnvironmentProps> = ({ onZoneClick }) => {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<KitchenZone | null>(null);
  const [renderMode, setRenderMode] = useState<'spatial2d' | 'spatial3d'>('spatial2d');

  // Entrance sequence state
  const [entranceStep, setEntranceStep] = useState<number>(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setEntranceStep(1), 100);
    const timer2 = setTimeout(() => setEntranceStep(2), 400);
    const timer3 = setTimeout(() => setEntranceStep(3), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleZoneSelect = (zone: KitchenZone) => {
    setSelectedZone(zone);
    if (onZoneClick) onZoneClick(zone);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        opacity: entranceStep >= 1 ? 1 : 0,
        transform: entranceStep >= 1 ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}
    >
      {/* 1. Header Entrance & Visual Identity Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--primary-cyan)',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}
          >
            <Sparkles size={16} /> Intelligent Digital Kitchen World
          </div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginTop: '4px' }}>
            {entranceStep < 3 ? 'Welcome to your AI Kitchen' : 'What would you like to do?'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Connected spatial environment linking storage, AI intelligence, prep, cooking, and serving.
          </p>
        </div>

        {/* View Mode Switcher (2.5D Connected Deck vs 3D Canvas) */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '4px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <button
            onClick={() => setRenderMode('spatial2d')}
            style={{
              padding: '6px 14px',
              borderRadius: '12px',
              border: 'none',
              background: renderMode === 'spatial2d' ? 'var(--primary-cyan)' : 'transparent',
              color: renderMode === 'spatial2d' ? '#000' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Layers size={14} /> 2.5D Deck
          </button>
          <button
            onClick={() => setRenderMode('spatial3d')}
            style={{
              padding: '6px 14px',
              borderRadius: '12px',
              border: 'none',
              background: renderMode === 'spatial3d' ? 'var(--primary-cyan)' : 'transparent',
              color: renderMode === 'spatial3d' ? '#000' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Box size={14} /> Interactive 3D
          </button>
        </div>
      </div>

      {/* 2. Integrated Quick Actions Control Bar */}
      <QuickActionsBar />

      {/* 3. Main Connected Kitchen Spatial Composition */}
      {renderMode === 'spatial3d' ? (
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '28px',
            background: 'rgba(15, 23, 42, 0.85)',
            minHeight: '480px'
          }}
        >
          <SpatialCanvas
            activeZoneId={activeZoneId}
            onZoneHover={setActiveZoneId}
            onZoneClick={handleZoneSelect}
          />
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: '32px 24px',
            borderRadius: '28px',
            background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            position: 'relative',
            opacity: entranceStep >= 2 ? 1 : 0,
            transition: 'opacity 0.6s ease'
          }}
        >
          {/* Spatial Upper Deck: Pantry ── AI Workspace ── Refrigerator */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              alignItems: 'stretch'
            }}
          >
            <PantryZone
              active={activeZoneId === 'pantry'}
              onHover={setActiveZoneId}
              onClick={handleZoneSelect}
            />
            <AIWorkspaceZone
              active={activeZoneId === 'ai_workspace'}
              onHover={setActiveZoneId}
              onClick={handleZoneSelect}
            />
            <RefrigeratorZone
              active={activeZoneId === 'refrigerator'}
              onHover={setActiveZoneId}
              onClick={handleZoneSelect}
            />
          </div>

          {/* Spatial Lower Deck: Preparation ── Cooking ── Serving */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              alignItems: 'stretch'
            }}
          >
            <PreparationZone
              active={activeZoneId === 'prep'}
              onHover={setActiveZoneId}
              onClick={handleZoneSelect}
            />
            <CookingZone
              active={activeZoneId === 'cooking'}
              onHover={setActiveZoneId}
              onClick={handleZoneSelect}
            />
            <ServingZone
              active={activeZoneId === 'serving'}
              onHover={setActiveZoneId}
              onClick={handleZoneSelect}
            />
          </div>
        </div>
      )}

      {/* Zone Details Modal Overlay */}
      <ZoneDetailModal zone={selectedZone} onClose={() => setSelectedZone(null)} />
    </div>
  );
};

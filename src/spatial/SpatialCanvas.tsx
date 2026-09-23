import React, { useState, useEffect } from 'react';
import { SpatialKitchenScene } from './SpatialKitchenScene';
import { FallbackKitchen2D } from './FallbackKitchen2D';
import type { KitchenZone, KitchenZoneId } from '../types/kitchen';
import { useKitchenState } from '../state/KitchenContext';
import { Layers, Box } from 'lucide-react';

interface SpatialCanvasProps {
  activeZoneId: KitchenZoneId | null;
  onZoneHover: (id: KitchenZoneId | null) => void;
  onZoneClick: (zone: KitchenZone) => void;
}

export const SpatialCanvas: React.FC<SpatialCanvasProps> = ({
  activeZoneId,
  onZoneHover,
  onZoneClick
}) => {
  const { state, dispatch } = useKitchenState();
  const [hasWebGLError, setHasWebGLError] = useState(false);

  const is3DEnabled = state.userPreferences.spatial3dEnabled && !hasWebGLError;

  useEffect(() => {
    // Check WebGL availability safely
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGLError(true);
      }
    } catch (e) {
      setHasWebGLError(true);
    }
  }, []);

  const toggle3DMode = () => {
    dispatch({ type: 'TOGGLE_SPATIAL_3D', payload: !state.userPreferences.spatial3dEnabled });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '480px',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'rgba(8, 12, 20, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* View Mode Toggle Pill Button */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10
        }}
      >
        <button
          onClick={toggle3DMode}
          className="glass-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Toggle between 3D Spatial Canvas and 2.5D Card Layout"
        >
          {is3DEnabled ? <Box size={16} color="var(--primary-cyan)" /> : <Layers size={16} color="var(--accent-violet)" />}
          <span>{is3DEnabled ? 'Mode: 3D Spatial' : 'Mode: 2.5D Overview'}</span>
        </button>
      </div>

      {/* Render 3D Canvas or Fallback */}
      {is3DEnabled ? (
        <SpatialKitchenScene
          activeZoneId={activeZoneId}
          onZoneHover={onZoneHover}
          onZoneClick={onZoneClick}
        />
      ) : (
        <FallbackKitchen2D
          activeZoneId={activeZoneId}
          onZoneHover={onZoneHover}
          onZoneClick={onZoneClick}
        />
      )}
    </div>
  );
};
